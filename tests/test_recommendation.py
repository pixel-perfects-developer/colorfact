import json
import unittest

import pandas as pd

from colorfact import utils
from colorfact.outfit import filter_clothes_by_color


class TestMatchingProducts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        load = utils.load_data_outfit_mapping(
            data_path="data/data_preview_exploded.xlsx",
            outfit_path="configs/outfit.yaml",
        )
        outfit_config = load.load_outfit()
        data = load.load_dataset()

        cls.matcher = utils.matching_products(data=data, ontologie=outfit_config)

    def test_recommend_outfit_valid(self):
        # Input: category, colors (as LAB), gender
        input_category = "T-shirt"
        input_colors = [[50.0, 0.0, 0.0]]  # LAB color
        gender = "H"
        recommendations = self.matcher.recommend_outfit(
            input_category, input_colors, gender, top_k=1
        )
        self.assertIsInstance(recommendations, dict)
        # Should return at least one product for each item
        for style in ["Casual été", "Casual hiver"]:
            self.assertIn(style, recommendations)
            self.assertIn("Jean", recommendations[style])
            # Checking that these contain a list of dictionaries with product_id
            for item in recommendations[style]["Jean"]:
                self.assertIsInstance(item, dict)
                self.assertIn("product_id", item)

    def test_recommend_outfit_invalid_category(self):
        input_category = "Nonexistent"
        input_colors = [[50.0, 0.0, 0.0]]
        gender = "H"
        with self.assertRaises(ValueError):
            self.matcher.recommend_outfit(input_category, input_colors, gender)

    def test_recommend_outfit_empty_colors(self):
        input_category = "T-shirt"
        input_colors = []
        gender = "H"
        # Raises IndexError if no colors are provided
        with self.assertRaises(IndexError):
            self.matcher.recommend_outfit(input_category, input_colors, gender)

    def test_recommend_outfit_gender_filter(self):
        input_category = "Jean"
        input_colors = [[60.0, 10.0, 10.0]]
        gender = "F"
        recommendations = self.matcher.recommend_outfit(
            input_category, input_colors, gender, top_k=1
        )
        # Verify that we have at least one recommendation
        self.assertIsInstance(recommendations, dict)
        self.assertIn("Casual été", recommendations)
        self.assertIn("T-shirt", recommendations["Casual été"])
        self.assertGreater(len(recommendations["Casual été"]["T-shirt"]), 0)


class TestFilterClothes(unittest.TestCase):
    def setUp(self):
        # Create a small DataFrame with fake CIELAB color data
        self.df = pd.DataFrame(
            {
                "Photo produit 1": ["img1.jpg", "img2.jpg", "img3.jpg"],
                "cielab_colors": [
                    json.dumps([50.0, 0.0, 0.0]),
                    json.dumps([60.0, 10.0, 10.0]),
                    json.dumps([30.0, 20.0, 20.0]),
                ],
            }
        )

    def test_single_color(self):
        # Query with a color close to the first row
        query_colors = [[51.0, 1.0, 1.0]]
        result = filter_clothes_by_color(self.df, query_colors, top_k=1)
        self.assertEqual(len(result), 1)
        self.assertEqual(result.iloc[0]["Photo produit 1"], "img1.jpg")

    def test_multiple_colors(self):
        # Query with two colors, should return two closest matches
        query_colors = [[51.0, 1.0, 1.0], [61.0, 11.0, 11.0]]
        result = filter_clothes_by_color(self.df, query_colors, top_k=1)
        self.assertEqual(len(result), 2)
        self.assertIn("img1.jpg", result["Photo produit 1"].values)
        self.assertIn("img2.jpg", result["Photo produit 1"].values)

    def test_top_k(self):
        # Query with one color, top_k=2 should return two closest matches
        query_colors = [[51.0, 1.0, 1.0]]
        result = filter_clothes_by_color(self.df, query_colors, top_k=2)
        self.assertEqual(len(result), 2)
        self.assertIn("img1.jpg", result["Photo produit 1"].values)

    def test_empty_dataframe(self):
        # Empty DataFrame should return empty result
        empty_df = pd.DataFrame(columns=["Photo produit 1", "cielab_colors"])
        query_colors = [[51.0, 1.0, 1.0]]
        result = filter_clothes_by_color(empty_df, query_colors, top_k=1)
        self.assertTrue(result.empty)

    def test_no_matches(self):
        # Query with a color far from all entries, but function should still return closest
        query_colors = [[200.0, 200.0, 200.0]]
        result = filter_clothes_by_color(self.df, query_colors, top_k=1)
        self.assertEqual(len(result), 1)
