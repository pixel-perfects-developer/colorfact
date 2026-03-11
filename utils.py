import ast
import base64
import json
import logging
import os
import warnings
from collections import Counter
from io import BytesIO

import cv2
import faiss
import numpy as np
import pandas as pd
import requests
import yaml
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from PIL import Image, UnidentifiedImageError
from pyprojroot import here
from sklearn.cluster import KMeans

from colorfact.colors import (
    cielab_from_hex,
    convert_opencv_lab_to_cielab,
    hex_from_cielab,
)

warnings.filterwarnings("ignore")
load_dotenv()


class LoadToolsConfig:

    def __init__(self) -> None:
        with open(here("colorfact/configs/config.yaml")) as cfg:
            app_config = yaml.load(cfg, Loader=yaml.FullLoader)

        # Set environment variables
        os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

        # Faiss Index
        self.faiss_index = app_config["faiss_index"]["path"]

class extract_colors_url:
    def __init__(self, image_url):
        self.image_url = image_url
        self.colors = self.extract_dominant_color_from_segmented()

    def read_image_from_url(self):
        """
        Downloads an image from a URL and returns it as a NumPy array in BGR format.
        """

        try:
            headers = {"User-Agent": "Mozilla/5.0"}  # Mimic a browser request
            response = requests.get(self.image_url, headers=headers, timeout=10)
            response.raise_for_status()  # Raise an error if request fails

            try:
                image = Image.open(BytesIO(response.content))
                image_data = np.asarray(bytearray(response.content), dtype=np.uint8)
                image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
                if image is None:
                    raise ValueError("Failed to decode image")
                return image

            except UnidentifiedImageError:
                print(f"Error: Cannot identify image from {self.image_url}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def remove_background_grabcut(self, rect=None, iter_count=5):
        """
        Uses GrabCut to segment the foreground (product) from the background.
        Downloads the image from a URL. If rect is not provided, a default rectangle is used.

        Returns the foreground mask where pixels belonging to the product are 1.
        """
        image = self.read_image_from_url()

        # If no rectangle is provided, use a rectangle covering most of the image
        height, width = image.shape[:2]
        if rect is None:
            rect = (
                int(0.05 * width),
                int(0.05 * height),
                int(0.9 * width),
                int(0.9 * height),
            )

        mask = np.zeros(image.shape[:2], np.uint8)
        bgdModel = np.zeros((1, 65), np.float64)
        fgdModel = np.zeros((1, 65), np.float64)

        cv2.grabCut(
            image, mask, rect, bgdModel, fgdModel, iter_count, cv2.GC_INIT_WITH_RECT
        )
        # Define foreground as either sure or probable foreground
        mask2 = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1, 0).astype(
            "uint8"
        )
        return mask2

    def process_floats(
        self, color_list: list, prop_list: list[float]
    ) -> float | list[float]:
        """
        Processes a list of three floats according to the specified conditions.

        Args:
            float_list: A list of three floats.

        Returns:
            The first item if it's greater than 85, the sum of the first two items if
            their sum is greater than 90, or the original list if neither condition is met.
        """

        if (
            not isinstance(prop_list, list)
            or len(prop_list) != 3
            or not all(isinstance(x, (int, float)) for x in prop_list)
        ):
            raise ValueError("Input must be a list of three numbers.")

        first_item = float(prop_list[0])
        second_item = float(prop_list[1])

        if first_item > 0.8:  # Changed condition to use 0.85 instead of 85
            return [color_list[0]]
        elif (
            first_item + second_item > 0.8
        ):  # Changed condition to use 0.9 instead of 90
            return [color_list[0], color_list[1]]
        else:
            return color_list

    def extract_dominant_color_from_segmented(self, k=3, resize_dim=(100, 100)):
        """
        Downloads the image from a URL, resizes it, applies the provided mask
        to extract foreground pixels, runs k-means clustering on these pixels,
        and returns a list of dominant colors (in standard CIELAB space) along with their proportions.
        """
        mask = self.remove_background_grabcut()
        image = self.read_image_from_url()
        image = cv2.resize(image, resize_dim)
        mask = cv2.resize(mask, resize_dim)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Use only pixels where mask == 1
        pixels = image_rgb.reshape(-1, 3)
        mask = mask.flatten().astype(bool)
        pixels_fg = pixels[mask]

        # Run k-means clustering on foreground pixels
        kmeans = KMeans(n_clusters=k, random_state=42).fit(pixels_fg)
        labels = kmeans.labels_
        counts = Counter(labels)

        # Sort clusters by frequency (most common first)
        sorted_idx = sorted(counts, key=counts.get, reverse=True)

        sorted_lab_colors = []
        proportions = []
        for idx in sorted_idx:
            centroid_rgb = kmeans.cluster_centers_[idx]
            centroid_rgb_uint8 = np.uint8([[centroid_rgb]])
            # Convert from RGB to LAB using OpenCV's conversion
            lab = cv2.cvtColor(centroid_rgb_uint8, cv2.COLOR_RGB2LAB)[0][0]

            lab_std = convert_opencv_lab_to_cielab(lab)

            sorted_lab_colors.append(lab_std)
            proportions.append(counts[idx] / len(pixels_fg))

        sorted_lab_colors = [item.tolist() for item in sorted_lab_colors]

        color = self.process_floats(sorted_lab_colors, proportions)
        return color


class extract_colors_image:
    def __init__(self, image_path):
        self.image_path = image_path
        self.colors = self.extract_dominant_color_from_segmented()

    def read_image_from_local(self):
        """
        Reads an image from a local path and returns it as a NumPy array in BGR format.
        """
        try:
            image = cv2.imread(self.image_path)
            if image is None:
                raise ValueError(f"Failed to read image from {self.image_path}")
            return image
        except Exception as e:
            print(f"Error reading image: {e}")
            return None

    def remove_background_grabcut(self, rect=None, iter_count=5):
        """
        Uses GrabCut to segment the foreground (product) from the background.
        If rect is not provided, a default rectangle is used.

        Returns the foreground mask where pixels belonging to the product are 1.
        """
        # If no rectangle is provided, use a rectangle covering most of the image
        height, width = self.image_resized.shape[:2]
        if rect is None:
            rect = (
                int(0.05 * width),
                int(0.05 * height),
                int(0.9 * width),
                int(0.9 * height),
            )

        mask = np.zeros(self.image_resized.shape[:2], np.uint8)
        bgdModel = np.zeros((1, 65), np.float64)
        fgdModel = np.zeros((1, 65), np.float64)

        cv2.grabCut(
            self.image_resized, mask, rect, bgdModel, fgdModel, iter_count, cv2.GC_INIT_WITH_RECT
        )
        # Define foreground as either sure or probable foreground
        mask2 = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 1, 0).astype(
            "uint8"
        )
        # Debug mask:
        # img = self.image_resized*mask2[:,:,np.newaxis]
        # cv2.imwrite('savedImage.jpg', img)
        return mask2

    def process_floats(
        self, color_list: list, prop_list: list[float]
    ) -> float | list[float]:
        """
        Processes a list of three floats according to the specified conditions.

        Args:
            float_list: A list of three floats.

        Returns:
            The first item if it's greater than 85, the sum of the first two items if
            their sum is greater than 90, or the original list if neither condition is met.
        """
        if (
            not isinstance(prop_list, list)
            or len(prop_list) != 3
            or not all(isinstance(x, (int, float)) for x in prop_list)
        ):
            raise ValueError("Input must be a list of three numbers.")

        first_item = float(prop_list[0])
        second_item = float(prop_list[1])

        if first_item > 0.7:  # Changed condition to use 0.85 instead of 85
            return [color_list[0]]
        elif (
            first_item + second_item > 0.8
        ):  # Changed condition to use 0.9 instead of 90
            return [color_list[0], color_list[1]]
        else:
            return color_list

    def extract_dominant_color_from_segmented(self, k=3):
        """
        Reads the image from a local path, resizes it, applies the provided mask
        to extract foreground pixels, runs k-means clustering on these pixels,
        and returns a list of dominant colors (in standard CIELAB space) along with their proportions.
        """
        self.image = self.read_image_from_local()
        target_width = 200

        # resize image depends on target width, keeping image ratio
        (h, w) = self.image.shape[:2]
        ratio = target_width / float(w)
        dim = (target_width, int(h*ratio))
        self.image_resized = cv2.resize(self.image, dim)

        # Get mask
        mask = self.remove_background_grabcut()

        image_rgb = cv2.cvtColor(self.image_resized, cv2.COLOR_BGR2RGB)

        # Use only pixels where mask == 1
        pixels = image_rgb.reshape(-1, 3)
        mask = mask.flatten().astype(bool)
        pixels_fg = pixels[mask]

        # Run k-means clustering on foreground pixels
        kmeans = KMeans(n_clusters=k, random_state=42).fit(pixels_fg)
        labels = kmeans.labels_
        counts = Counter(labels)

        # Sort clusters by frequency (most common first)
        sorted_idx = sorted(counts, key=counts.get, reverse=True)

        sorted_lab_colors = []
        proportions = []
        for idx in sorted_idx:
            centroid_rgb = kmeans.cluster_centers_[idx]
            # If we don't round, the conversion to uint8 will round to the lowest integer
            # which can lead to incorrect LAB values.
            centroid_rgb_uint8 = np.uint8([[np.round(centroid_rgb)]])

            # Convert from RGB to LAB using OpenCV's conversion
            lab = cv2.cvtColor(centroid_rgb_uint8, cv2.COLOR_RGB2LAB)[0][0]
            # Convert OpenCV LAB to standard CIELAB
            # OpenCV LAB is in the range [0, 255] for L and centered at 128 for a and b
            # Standard CIELAB is in the range [0, 100] for L and [-128, 128] for a and b
            lab_std = convert_opencv_lab_to_cielab(lab)

            sorted_lab_colors.append(lab_std)
            proportions.append(counts[idx] / len(pixels_fg))

        sorted_lab_colors = [item.tolist() for item in sorted_lab_colors]

        color = self.process_floats(sorted_lab_colors, proportions)
        return color


def hex_image_colors(image_path):
    """
    Extracts dominant colors from a local image file using extract_colors_image.
    Returns a list of hex color strings.
    :param image_path: Path to the local image file.
    """
    color_extractor = extract_colors_image(image_path)
    # Convert the CIELAB colors to hex format
    if not color_extractor.colors:
        raise ValueError("No colors extracted from the image.")
    hex_colors = [hex_from_cielab(color) for color in color_extractor.colors]
    return hex_colors


class get_category:
    def __init__(self, image_path):
        self.image_path = image_path
        self.llm = ChatOpenAI(model="gpt-4o")
        self.prompt = """ 
 
            You are an AI model specializing in image recognition for fashion products. Your task is to analyze an image of a clothing or accessory item and classify it into a specific category from a predefined list. Additionally, determine whether the item is intended for men (H), women (F). 

            Use the following list of standard product categories for classification:
            - T-shirt
            - Polo
            - Chemise
            - Col-roulés
            - Sweatshirt
            - Hoodie
            - Pull
            - Cardigan
            - Veste
            - Blouson
            - Manteau
            - Parka
            - Trench
            - Pantalons
            - Jean
            - Short
            - Jogging
            - Chinos
            - Jupes
            - Robes
            - Combinaisons
            - Costumes
            - Tailleurs
            - Pantalon habillé
            - Blazer
            - Robe de soirée
            - Sneakers
            - Bottes
            - Chaussures de ville
            - Escarpins
            - Talons
            - Sandales
            - Sac à main
            - Sac à dos
            - Lunettes
            - Bonnet
            - Casquettes
            - Ceinture
            - Montre

            ### **Rules for Classification**
            1. **Category Matching:**  
            - Assign the item to the closest matching category from the list above.
            - If multiple categories apply, choose the most specific one.

            2. **Gender Classification (`genre` field):**  
            - "H" if the item is primarily for men.  
            - "F" if the item is primarily for women.  
           
            ### **Output Format (JSON)**
            Return the result as a structured JSON object like this:
            
            {
                "genre": "H",
                "category": "T-shirt"
            }

        """
        self.base64_image = self.encode_image()
        # self.genre=self.get_category_gender().get("genre")
        # self.category=self.get_category_gender().get("category")

    def encode_image(
        self,
    ):
        with open(self.image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode("utf-8")

    def get_category_gender(self):

        result = self.llm.invoke(
            [
                HumanMessage(
                    content=[
                        {"type": "text", "text": self.prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{self.base64_image}"
                            },
                        },
                    ]
                )
            ]
        )

        # Clean the string by removing unwanted characters
        cleaned_output = result.content.strip("```json\n").strip("```")

        # Load it into a JSON object
        json_data = json.loads(cleaned_output)

        return json_data


class load_data_outfit_mapping:
    def __init__(self, data_path, outfit_path):
        self.data_path = data_path
        self.outfit_path = outfit_path
        self.llm = None  # ChatOpenAI(model="gpt-4o")
        self.category_cache = {}

    def load_dataset(self):

        with open(self.outfit_path, encoding="utf-8") as cfg:
            outfit = yaml.load(cfg, Loader=yaml.FullLoader)

        data = pd.read_csv(self.data_path)
        prod = list(outfit["Outfit"].keys())
        # data['Catégorie produit'] = data['Catégorie produit'].apply(lambda x : self.get_level(prod,x))
        data["gender"] = data["gender"].fillna("H/F")
        data["gender"] = data["gender"].apply(lambda x: x.strip() if isinstance(x, str) else x)
        return data

    def load_outfit(self):
        with open(self.outfit_path, encoding="utf-8") as cfg:
            outfit = yaml.load(cfg, Loader=yaml.FullLoader)

        return outfit


#     def get_level(self, prod, input_str):
#         if input_str in prod:
#             return input_str

#         if input_str in self.category_cache:
#             return self.category_cache[input_str]

#         prompt = f"""
#             Instructions :

#             Vous êtes un expert en matching des textes. Votre tâche est matcher l'input avec une catégorie dans la liste donné. Output que un seul catégorie
#             Si l'input ne correspond à aucune catégorie dans la liste donnée envoie l'input ou la catégorie que tu estime la plus proche !
#             listes des catégories :
#             -------------------------
#             {prod}
#             -------------------------

#             input : {input_str}
#             Réponse :
#         """
#         messages = [("system", prompt)]


#         try:
#             ai_msg = self.llm.invoke(messages)
#             result = ai_msg.content
#             self.category_cache[input_str] = result
#             return result
#         except Exception as e:
#             print(f"Error processing '{input_str}': {e}")
#             return "Error: Could not determine category" #or other default value.

# -------------------------------------------------
# SAFE JSON → LIST PARSER (cielab_colors)
# -------------------------------------------------
def ensure_cielab_list(x):
    """
    Ensure cielab_colors is always a Python list or None.
    Accepts:
    - list (already OK)
    - JSON string
    - None / NaN
    """
    if isinstance(x, list):
        return x

    if isinstance(x, str):
        try:
            return json.loads(x)
        except Exception:
            return None

    return None

class matching_products:

    def __init__(self, data, ontologie):
        self.data = data
        self.ontologie = ontologie

    def lab_to_lch(self, lab):
        L, a, b = lab
        C = np.sqrt(a**2 + b**2)
        H = np.degrees(np.arctan2(b, a)) % 360  # Normalisation correcte
        return [L, C, H]

    def lch_to_lab(self, lch):
        L, C, H = lch
        a = C * np.cos(np.radians(H))
        b = C * np.sin(np.radians(H))
        return [L, a, b]

    def generate_harmonic_colors(self, input_colors_lab: list):

        input_colors_lch = [self.lab_to_lch(color) for color in input_colors_lab]
        num_colors = len(input_colors_lab)

        if num_colors == 1:
            L, C, H = input_colors_lch[0]
            triad1 = self.lch_to_lab([L, C, (H + 120) % 360])
            triad2 = self.lch_to_lab([L, C, (H + 240) % 360])
            return input_colors_lab + [triad1, triad2]

        elif num_colors == 2:
            chosen_idx = np.random.choice([0, 1])
            L, C, H = input_colors_lch[chosen_idx]
            complementary = self.lch_to_lab([L, C, (H + 180) % 360])
            return input_colors_lab + [complementary]

        elif num_colors == 3:
            chosen_indices = np.random.choice([0, 1, 2], size=2, replace=False)
            selected_colors = [input_colors_lab[i] for i in chosen_indices]
            return selected_colors

        return input_colors_lab

    def recommend_outfit(
        self, input_category: str, input_colors: list, gender: str, top_k=1
    ):
        """
        Parameters:
        - input_category (str): "T-shirt", "Jean", etc.
        - input_colors (list): List of colors in CIELAB format, e.g. [[50.0, 0.0, 0.0], [60.0, 10.0, 10.0]]
        - gender (str): "H" for homme, "F" for femme, or "H/F" for unisex
        - top_k (int, optional): Number of top recommendations to return for each item type
        """
        logger.debug(f"recommend_outfit called with: category={input_category}, gender={gender}, top_k={top_k}")
        try:
            outfit_types = self.ontologie["Outfit"][input_category]
        except KeyError as e:
            logger.error(f"Invalid category in outfit configuration: {e}")
            raise ValueError(f"Invalid category: {str(e)}")

        recommendations = {}
        similarity_threshold = 0.5  # 90% similarity

        # Generate harmonized colors for input
        input_colors = self.generate_harmonic_colors(input_colors)
        logger.debug(f"Generated {len(input_colors)} harmonic colors")
        query_colors = np.array(input_colors, dtype="float32")
        faiss.normalize_L2(query_colors)

        # This method will iterate multiple times over the clothing types
        # TODO Optimization: do not recompute for each clothing type, reuse computations
        for outfit_type, required_items in outfit_types.items():
            outfit_recommendations = {}
            corrected_gender = []
            if gender.lower() == "h" or "homme" in outfit_type.lower():
                corrected_gender.extend(["H/F", "H"])
            elif gender.lower() == "f" or "femme" in outfit_type.lower():
                corrected_gender.extend(["H/F", "F"])
            elif gender.lower() == "h/f" or gender.lower() == "mixte":
                corrected_gender.extend(["H/F"])
            else:
                 # Should be caught by validation, but default to safe "H/F" only if unknown
                 corrected_gender.extend(["H/F"])
            
            logger.debug(f"Style: '{outfit_type}' -> target genders: {corrected_gender}")

            for item_category in required_items:
                # item_category will be like "T-shirt", "Jean", etc.
                # Filter data for the given category
                
                # Pre-filter checks
                cat_filter = (self.data["category"] == item_category)
                gender_filter = (self.data["gender"].isin(corrected_gender))
                
                filtered_data = self.data[cat_filter & gender_filter].copy()

                if filtered_data.empty:
                    logger.debug(f"  Category '{item_category}': No items found after filter")
                    continue

                # Ensure cielab_colors is correctly formatted
                # Ensure cielab_colors is correctly formatted (JSON-safe)
                filtered_data["cielab_colors"] = filtered_data["cielab_colors"].apply(
                    ensure_cielab_list
                )

                filtered_data.dropna(subset=["cielab_colors"], inplace=True)
                
                # Check for empty sequences after eval
                filtered_data = filtered_data[filtered_data["cielab_colors"].map(lambda d: len(d) if isinstance(d, (list, tuple)) else 0) > 0]
                
                try:
                    filtered_data["cielab_colors"] = filtered_data["cielab_colors"].apply(
                        tuple
                    )
                except Exception as e:
                    continue
                    
                filtered_data.drop_duplicates(inplace=True)
                filtered_data = filtered_data.reset_index()

                # Convert to NumPy array
                try:
                    vectors = np.array(
                        [list(t) for t in filtered_data["cielab_colors"]], dtype="float32"
                    )
                except Exception as e:
                     logger.error(f"  Category '{item_category}': Error converting vectors: {e}")
                     continue
                
                if vectors.shape[0] == 0:
                     continue  # Skip if no data available

                # Normalize and create FAISS index
                faiss.normalize_L2(vectors)
                index = faiss.IndexFlatL2(vectors.shape[1])
                index.add(vectors)

                # Search for closest matches
                distances, indices = index.search(query_colors, top_k)

                seen_ids = set()
                matches = []
                for i in range(indices.shape[0]):
                    for j in range(indices.shape[1]):
                        idx = indices[i][j]
                        
                        if idx >= len(filtered_data):
                            continue
                        
                        row = filtered_data.iloc[idx]
                        product_id = row.get("Photo produit 1") or row.get("image_url_1")
                        
                        if not product_id:
                            continue

                        if product_id not in seen_ids:
                            seen_ids.add(product_id)
                            
                            # Extract metadata (Price, Brand)
                            # Handle "Prix " (with space) or "Prix"
                            price = row.get("price") if "price" in row else row.get("prix")
                            brand = row.get("brand")
                            
                            matches.append(
                                {
                                    "image_url_1": product_id,
                                    "price": price,
                                    "brand": brand
                                }
                            )

                        if len(matches) >= top_k:
                            break
                
                outfit_recommendations[item_category] = matches
                logger.debug(f"  Category '{item_category}': Found {len(matches)} matches")

            recommendations[outfit_type] = outfit_recommendations

        return recommendations
