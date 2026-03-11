import os
from pathlib import Path

from colormath.color_conversions import convert_color
from colormath.color_objects import LabColor, sRGBColor
from PIL import Image, ImageDraw
from utils import (
    extract_colors_image,
    get_category,
    load_data_outfit_mapping,
    matching_products,
)

load = load_data_outfit_mapping(
    data_path="data/output.xlsx", outfit_path="configs/outfit.yaml"
)

# Load outfit recommendations
outfit_config = load.load_outfit()
data = load.load_dataset()


# data=pd.read_excel("data/final_output.xlsx",index_col=0)
# data['Genre']=data["Genre"].apply(lambda x : x.strip())
# outfit_path="configs/outfit.yaml"
# with open(outfit_path,encoding="utf-8") as cfg:
#             outfit_config = yaml.load(cfg, Loader=yaml.FullLoader)
class ImageAnalysis:
    def __init__(self):
        pass

    def lab_to_rgb(self, lab_values):
        rgb_colors = []
        for lab in lab_values:
            lab_color = LabColor(lab[0], lab[1], lab[2])
            rgb_color = convert_color(lab_color, sRGBColor)
            # Ensure RGB values are within the valid range
            rgb_clamped = [
                max(0, min(255, int(c * 255)))
                for c in (
                    rgb_color.clamped_rgb_r,
                    rgb_color.clamped_rgb_g,
                    rgb_color.clamped_rgb_b,
                )
            ]
            rgb_colors.append(rgb_clamped)
        return rgb_colors

    def create_color_swatch(self, rgb_colors, swatch_size=(100, 100)):
        swatch_width, swatch_height = swatch_size
        num_colors = len(rgb_colors)
        # Create an image large enough to hold all swatches horizontally
        swatch_image = Image.new("RGB", (swatch_width * num_colors, swatch_height))
        draw = ImageDraw.Draw(swatch_image)
        for i, rgb in enumerate(rgb_colors):
            # Define the position of each swatch
            top_left = (i * swatch_width, 0)
            bottom_right = ((i + 1) * swatch_width, swatch_height)
            draw.rectangle([top_left, bottom_right], fill=tuple(rgb))
        return swatch_image

    # def display_color_swatches(self,lab_values):
    #     rgb_colors = self.lab_to_rgb(lab_values)
    #     swatches = [create_color_swatch(rgb) for rgb in rgb_colors]
    #     return swatches

    def display_analysis(self, file_path):
        """
        Analyzes an image and returns the LLM's response.
        :param file_path: Path to the image file
        :return: LLM's response
        """
        ## Colors

        colors = extract_colors_image(image_path=file_path)
        self.input_colors = colors.colors
        rgb_colors = self.lab_to_rgb(self.input_colors)
        # Create a swatch image
        swatch_image = self.create_color_swatch(rgb_colors)

        ## Gender & Category
        cat = get_category(file_path)
        self.gender = cat.get_category_gender().get("genre")
        self.product = cat.get_category_gender().get("category")

        image_path = os.path.join(file_path)
        image_path = Path(image_path)

        # Retourne les données analysées et le chemin de l'image
        return (
            dict(
                extractedPictureElements=dict(
                    Gender=self.gender,
                    Product=self.product,
                )
            ),
            image_path,
            swatch_image,
        )

    def get_recommendation(self):
        match = matching_products(data=data, ontologie=outfit_config)
        recommendations = match.recommend_outfit(
            self.product, self.input_colors, self.gender, top_k=1
        )

        return recommendations
