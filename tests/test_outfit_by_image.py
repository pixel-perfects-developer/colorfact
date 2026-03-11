import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from colorfact.backend_api import get_outfit_by_image


class TestGetOutfitByImage(unittest.TestCase):
    def setUp(self):
        """Set up test data and mocks"""
        self.test_image_path = Path("tests/data/red tshirt.jpg")
        self.valid_clothing_type = "T-shirt"
        self.invalid_clothing_type = "DOES NOT EXIST"
        self.valid_gender = "H"
        self.invalid_gender = "DOES NOT EXIST"

        # Mock file object
        self.mock_file = Mock()
        self.mock_file.filename = "test_image.jpg"

        # Sample CIELAB colors for mocking
        self.test_colors = [[50, 2.6772, 0.0028]]

        # Sample recommendations data
        self.sample_recommendations = {
            "Casual été": {
                "Pantalon": [{"url": "test_url", "color": [50, 2.6772, 0.0028]}]
            }
        }

    @patch("colorfact.utils.extract_colors_image")
    def test_successful_outfit_recommendation(self, mock_extract_colors):
        """Test successful outfit recommendation generation"""
        # Setup mocks
        mock_colors = Mock()
        mock_colors.colors = self.test_colors
        mock_extract_colors.return_value = mock_colors

        result = get_outfit_by_image(
            file=self.mock_file,
            clothing_type=self.valid_clothing_type,
            gender=self.valid_gender,
        )

        # Assertions
        self.assertIsInstance(result, dict)
        self.assertIn("Casual été", result)
        mock_extract_colors.assert_called_once()

    @patch("colorfact.utils.extract_colors_image")
    def test_no_colors_extracted(self, mock_extract_colors):
        """Test behavior when no colors are extracted from image"""
        # Setup mock to return no colors
        mock_colors = Mock()
        mock_colors.colors = None
        mock_extract_colors.return_value = mock_colors

        with self.assertRaises(Exception) as context:
            get_outfit_by_image(
                file=self.mock_file,
                clothing_type=self.valid_clothing_type,
                gender=self.valid_gender,
            )

        self.assertIn("No colors extracted from image", str(context.exception.detail))

    @patch("colorfact.utils.extract_colors_image")
    def test_unknown_clothing_type(self, mock_extract_colors):
        # Setup mocks
        mock_colors = Mock()
        mock_colors.colors = self.test_colors
        mock_extract_colors.return_value = mock_colors

        with self.assertRaises(Exception) as context:
            get_outfit_by_image(
                file=self.mock_file,
                clothing_type=self.invalid_clothing_type,
                gender=self.valid_gender,
            )

    @patch("colorfact.utils.extract_colors_image")
    def test_unknown_gender(self, mock_extract_colors):
        # Setup mocks
        mock_colors = Mock()
        mock_colors.colors = self.test_colors
        mock_extract_colors.return_value = mock_colors

        response = get_outfit_by_image(
            file=self.mock_file,
            clothing_type=self.valid_clothing_type,
            gender=self.invalid_gender,
        )
        self.assertIsInstance(response, dict)
        # Check that every item in the response is empty
        for outfit_type, items in response.items():
            self.assertEqual(items, {})
