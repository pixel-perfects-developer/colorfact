import unittest

from fastapi import HTTPException

from colorfact.backend_api import outfit_by_color


class TestOutfitByColorEndpoint(unittest.TestCase):
    def test_outfit_by_color_success(self):
        # Call the endpoint function directly
        response = outfit_by_color(color="#740000", clothing_type="T-shirt", gender="H")

        # Check if the response is a dictionary
        self.assertIsInstance(response, dict)
        # Check if the response contains expected keys
        self.assertIn("Casual été", response)
        self.assertIn("Casual hiver", response)
        self.assertIn("Sportswear", response)
        # Check if the response contains clothing items
        self.assertIn("Jean", response["Casual été"])
        self.assertIn("Hoodie", response["Sportswear"])
        # Check if the response contains product IDs
        self.assertTrue(
            all("product_id" in item for item in response["Casual été"]["Jean"])
        )

    def test_outfit_by_color_invalid_clothing_type(self):
        # Should raise an exception due to invalid clothing type
        with self.assertRaises(HTTPException):
            outfit_by_color(color="#FFFFFF", clothing_type="not_a_type", gender="H")

    def test_outfit_by_color_missing_color(self):
        # Should raise an exception due to missing parameters
        with self.assertRaises(AttributeError):
            outfit_by_color(clothing_type="T-shirt", gender="H")

    def test_outfit_by_color_invalid_color(self):
        # Should raise an exception due to invalid color format
        with self.assertRaises(HTTPException):
            outfit_by_color(color="not_a_color", clothing_type="T-shirt", gender="H")

    def test_outfit_by_color_missing_clothing_type(self):
        # Should raise an exception due to missing clothing type
        with self.assertRaises(HTTPException):
            outfit_by_color(color="#FFFFFF", gender="H")

    def test_outfit_by_color_missing_gender(self):
        # Should raise an exception due to missing gender
        with self.assertRaises(AttributeError):
            outfit_by_color(color="#FFFFFF", clothing_type="T-shirt")

    def test_outfit_by_color_invalid_gender(self):
        # Should return empty response due to invalid gender
        response = outfit_by_color(color="#FFFFFF", clothing_type="T-shirt", gender="X")
        # Check if the response is a dictionary
        self.assertIsInstance(response, dict)
        outfits = ["Casual été", "Casual hiver", "Sportswear"]
        # Check that each outfit category exists but has no items
        for outfit in outfits:
            self.assertIn(outfit, response)
            self.assertEqual(response[outfit], {})


if __name__ == "__main__":
    unittest.main()
