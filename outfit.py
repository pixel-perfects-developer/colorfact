import ast
from pathlib import Path

import faiss
import numpy as np
import pandas as pd
import yaml

from colorfact import database, utils

from difflib import get_close_matches

OUTFIT_KEY = "Outfit"

BASE_DIR = Path(__file__).resolve().parent
OUTFIT_CONFIG_PATH = BASE_DIR / "configs" / "outfit.yaml"
OUTFITS_DESCRIPTIONS_PATH = BASE_DIR / "configs" / "outfits_descriptions.yaml"


def get_outfit_descriptions() -> dict:
    """Returns a dictionary {outfit_type: set of clothing items}
    and saves it to a YAML file."""

    with open(OUTFIT_CONFIG_PATH, "r", encoding="utf-8") as f:
        outfit_config = yaml.safe_load(f)
    outfits = outfit_config[OUTFIT_KEY]

    # The outfits are organized around a clothing type, we need to iterate through them
    outfits_descriptions = {}  # Dict of {outfit_type: {set of clothing items}}
    for clothing_type, outfit_completion in outfits.items():
        print(f"Processing clothing type: {clothing_type}")
        for outfit_type, clothing_items in outfit_completion.items():
            print(f"  Outfit type: {outfit_type}, Clothing items: {clothing_items}")
            if outfit_type not in outfits_descriptions:
                outfits_descriptions[outfit_type] = {clothing_type}
            # Add the clothing items to the set for this clothing type
            outfits_descriptions[outfit_type].update(clothing_items)

    # Convert sets to lists for a cleaner YAML output
    for outfit_type, clothing_items in outfits_descriptions.items():
        outfits_descriptions[outfit_type] = list(clothing_items)
    # Write the outfits descriptions to a YAML file
    with open(OUTFITS_DESCRIPTIONS_PATH, "w", encoding="utf-8") as f:
        yaml.dump(outfits_descriptions, f, allow_unicode=True, default_flow_style=False)
    return outfits_descriptions

def filter_clothes_by_clothing_type(clothes: pd.DataFrame, clothing_type: str) -> pd.DataFrame:
    """
    Filters clothes by exact clothing type (t-shirt, jean, pull, etc.)
    """
    clothes = clothes.copy()
    clothes["category"] = clothes["category"].astype(str).str.lower()
    clothing_type = clothing_type.lower()

    return clothes[clothes["category"] == clothing_type].reset_index(drop=True)

def filter_clothes_by_prices(clothes: pd.DataFrame, min_price: float, max_price: float) -> pd.DataFrame:
    """
    Filter clothes DataFrame by price.
    
    Args:
        clothes (pd.DataFrame): DataFrame with at least 'price'
    """
    # Si la colonne Prix n'existe pas, on ne filtre pas (ou on retourne tout)
    # Si la colonne price n'existe pas, on ne filtre pas (ou on retourne tout)
    if "price" not in clothes.columns:
        print("Warning: 'price' column missing. Skipping price filter.")
        return clothes

    # Si les prix contiennent des virgules (ex: "12,99"), on les remplace par des points
    clothes["price"] = clothes["price"].astype(str).str.replace(",", ".", regex=False)
    # Conversion en float (valeurs numériques)
    clothes["price"] = clothes["price"].astype(float)

    # Filtrage selon min_price et max_price
    return clothes[(clothes["price"] >= min_price) & (clothes["price"] <= max_price)]

def safe_literal_eval(val):
    # None / NaN
    if val is None:
        return None

    # Pandas NaN (scalar only)
    if isinstance(val, float) and pd.isna(val):
        return None

    # Already a list / tuple / numpy array (Postgres JSONB case)
    if isinstance(val, (list, tuple, np.ndarray)):
        return list(val)

    # String → literal eval (CSV legacy)
    if isinstance(val, str):
        val = val.strip()
        if not val:
            return None
        try:
            return ast.literal_eval(val)
        except Exception:
            return None

    return None

def filter_clothes_by_color(
    clothes: pd.DataFrame, colors: list, top_k=1
) -> pd.DataFrame:
    """
    Filters the clothes DataFrame to return the top_k closest matches for each input color.
    Uses CIELAB color similarity (L2 distance, normalized) with FAISS.

    Args:
        clothes (pd.DataFrame): DataFrame with at least 'cielab_colors' and 'Photo produit 1' columns.
        colors (list): List of CIELAB colors, e.g. [[50.0, 0.0, 0.0], ...]

    Returns:
        pd.DataFrame: DataFrame of the top_k matches per color, with original columns.
    """
    # Ensure cielab_colors is a tuple/list of floats
    filtered_data = clothes.copy()
    # TODO DO NOT USE ast.literal_eval, use json.loads instead
    filtered_data["cielab_colors"] = filtered_data["cielab_colors"].apply(
        safe_literal_eval
    )
    filtered_data.dropna(subset=["cielab_colors"], inplace=True)
    filtered_data["cielab_colors"] = filtered_data["cielab_colors"].apply(tuple)
    filtered_data.drop_duplicates(inplace=True)
    print("filtered data", filtered_data)
    # Convert to NumPy array
    vectors = np.array(
        [list(t) for t in filtered_data["cielab_colors"]], dtype="float32"
    )
    if vectors.shape[0] == 0:
        return pd.DataFrame()  # No data

    # Normalize and create FAISS index
    faiss.normalize_L2(vectors)
    query_colors = np.array(colors, dtype="float32")
    faiss.normalize_L2(query_colors)
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)

    top_k = min(50, len(filtered_data))

    # Search for closest matches
    distances, indices = index.search(query_colors, top_k)

    matched_indices = set()
    for i in range(indices.shape[0]):
        for j in range(indices.shape[1]):
            idx = indices[i][j]
            if 0 <= idx < len(filtered_data):
                matched_indices.add(idx)

    # Return the filtered DataFrame with only the matched rows
    result_df = filtered_data.iloc[list(matched_indices)].reset_index(drop=True)
    return result_df


def filter_clothes_by_brands(
    clothes: pd.DataFrame, wanted_brands: list, removed_brands: list
) -> pd.DataFrame:
    """
    Filters the clothes DataFrame based on wanted and removed brands.

    Args:
        clothes (pd.DataFrame): DataFrame containing clothing items with a 'Lien achat' column.
        wanted_brands (list): List of brands to include.
        removed_brands (list): List of brands to exclude.
    Raises:
        ValueError: If both wanted_brands and removed_brands are specified.
    Returns:
        pd.DataFrame: Filtered DataFrame with only the desired brands.
    """
    if wanted_brands and removed_brands:
        raise ValueError("You cannot specify both wanted_brands and removed_brands.")

    # clothes["Marque"] = clothes["Lien achat"].apply(database.extract_brand)

    if wanted_brands:
        clothes = clothes[clothes["brand"].isin(wanted_brands)]
    elif removed_brands:
        clothes = clothes[~clothes["brand"].isin(removed_brands)]

    return clothes # .drop(columns=["Marque"])


def filter_clothes_by_type(clothes: pd.DataFrame, outfit_type: str) -> pd.DataFrame:
    """
    Filters the clothes DataFrame based on outfit type.

    Args:
        clothes (pd.DataFrame): DataFrame containing clothing items with a 'Lien achat' column.
        Type of outfit (e.g. 'Casual été', 'Professionnel')
    Returns:
        pd.DataFrame: Filtered DataFrame with only the desired type.
    """
    # Charger les descriptions depuis le fichier YAML
    with open(OUTFITS_DESCRIPTIONS_PATH, "r", encoding="utf-8") as f:
        outfit_descriptions = yaml.safe_load(f)

    # Correspondance exacte ou approchée
    if outfit_type not in outfit_descriptions:
        suggestions = get_close_matches(outfit_type, outfit_descriptions.keys(), n=1, cutoff=0.5)
        if suggestions:
            outfit_type = suggestions[0]
            print(f"Type d'outfit inconnu : '{outfit_type}'. Suggestion utilisée : '{outfit_type}'")
        else:
            print(f"Aucun outfit correspondant à '{outfit_type}'. Aucune suggestion trouvée.")
            return pd.DataFrame(columns=clothes.columns)

    # Catégories à filtrer
    categories_to_keep = [c.lower() for c in outfit_descriptions[outfit_type]]
    clothes = clothes.copy()
    clothes["category"] = clothes["category"].astype(str).str.lower()

    # Filtrage
    filtered = clothes[clothes["category"].isin(categories_to_keep)]

    return filtered.reset_index(drop=True)

"""" TODO Ajouter un filter cloth by image """

def get_outfit_by_image(file: Path, clothing_type: str, gender: str) -> dict:
    """
    Outfit by image — Postgres ONLY (no CSV, no cache)
    """

    # 1️⃣ Extraire les couleurs de l'image
    extracted_colors = utils.extract_colors_image(image_path=file)
    input_img_cielab_colors = getattr(extracted_colors, "colors", None)

    if not input_img_cielab_colors:
        return {}

    # 2️⃣ Charger l'ontologie outfit
    with open(OUTFIT_CONFIG_PATH, "r", encoding="utf-8") as f:
        outfit_config = yaml.safe_load(f)

    # 3️⃣ Charger les données depuis Postgres
    data = database.load_database()

    if data is None or data.empty:
        raise RuntimeError("Postgres database is empty — cannot recommend outfits")

    data = data.copy()
    data["gender"] = data["gender"].fillna("H/F")

    # 4️⃣ Initialiser le matcher
    matcher = utils.matching_products(
        data=data,
        ontologie=outfit_config,
    )

    # 5️⃣ Recommander
    recommendations = matcher.recommend_outfit(
        input_category=clothing_type,
        input_colors=input_img_cielab_colors,
        gender=gender,
        top_k=5,
    )

    return recommendations
