import unittest

import numpy as np

import colorfact.utils as utils

RED_TSHIRT = "tests/data/red tshirt.jpg"
BLUE_JEANS = "tests/data/blue jean.jpeg"
ORANGE_BLUE_SWEAT = "tests/data/orange blue sweat.jpg"
PINK_HAT = "tests/data/pink hat.jpeg"


class TestExtractColorsImage(unittest.TestCase):
    def test_color_extraction_red_tshirt(self):
        extractor = utils.extract_colors_image(RED_TSHIRT)
        colors = extractor.colors
        print(f"Extracted colors from {RED_TSHIRT}: {colors}")
        # Check that colors is a list and not empty
        self.assertIsInstance(colors, list)
        self.assertTrue(len(colors) > 0)
        # Check that each color is a list or tuple of 3 numbers (L, a, b)
        for color in colors:
            self.assertTrue(isinstance(color, list))
            self.assertEqual(len(color), 3)
            for value in color:
                self.assertIsInstance(value, float)
        # Check that at least one color is almost equal to lab(41.69, 60.02, 39.42) (red)
        expected_color = [41.69, 60.02, 39.42]
        found_expected = False
        for color in colors:
            if np.isclose(color, expected_color, atol=5).all():
                found_expected = True
        self.assertTrue(
            found_expected, "Expected red color not found in extracted colors."
        )

    def test_color_extraction_blue_jeans(self):
        extractor = utils.extract_colors_image(BLUE_JEANS)
        colors = extractor.colors
        self.assertIsInstance(colors, list)
        self.assertTrue(len(colors) > 0)

        # These jeans go from lab(36.24, 1.17, -18.07) to lab(6.66, 0.9, -10.09)
        # The algorithm finds:
        # - circa (16, 1, -12), dark blue
        # - circa (30, 1, -15), another dark/grey blue
        # Search for the two colors in the image
        expected_colors = [
            [16, 1, -12],  # Dark blue
            [30, 1, -15],  # Another dark/grey blue
        ]
        found_colors = [False for _ in expected_colors]
        for color in colors:
            self.assertTrue(isinstance(color, list))
            self.assertEqual(len(color), 3)
            for i, expected_color in enumerate(expected_colors):
                if np.isclose(color, expected_color, atol=1.0).all():
                    found_colors[i] = True

        # Check if all expected colors were found
        for i, found in enumerate(found_colors):
            self.assertTrue(
                found,
                f"Expected color number {i} ({expected_colors[i]}) not found in extracted colors.",
            )

    def test_color_extraction_orange_blue_sweat(self):
        extractor = utils.extract_colors_image(ORANGE_BLUE_SWEAT)
        colors = extractor.colors
        self.assertIsInstance(colors, list)
        self.assertTrue(len(colors) > 0)

        # Search for the two colors in the image
        expected_colors = [
            [67, 37, 50],  # Orange
            [11.5, -1, -15],  # Blue
        ]
        found_colors = [False for _ in expected_colors]
        for color in colors:
            self.assertTrue(isinstance(color, list))
            self.assertEqual(len(color), 3)
            for i, expected_color in enumerate(expected_colors):
                if np.isclose(color, expected_color, atol=1.0).all():
                    found_colors[i] = True

        # Check if all expected colors were found
        for i, found in enumerate(found_colors):
            self.assertTrue(
                found,
                f"Expected color number {i} ({expected_colors[i]}) not found in extracted colors.",
            )

    def test_color_extraction_pink_hat(self):
        extractor = utils.extract_colors_image(PINK_HAT)
        colors = extractor.colors
        self.assertIsInstance(colors, list)
        self.assertTrue(len(colors) > 0)
        # The algorithm finds:
        # - circa (70, 24, 10) (light pink)
        # - circa (78, 18, 8) (another light pink)
        # Let's expect the middle:
        expected_pink = [74, 21, 9]  # A light pink color in CIELAB space

        found_pink = False
        for color in colors:
            self.assertTrue(isinstance(color, list))
            self.assertEqual(len(color), 3)
            if np.isclose(color, expected_pink, atol=5.0).all():
                found_pink = True
            self.assertTrue(
                found_pink, "Expected pink color not found in extracted colors."
            )


class TestExtractHexColorsImage(unittest.TestCase):
    def test_color_extraction_red(self):
        colors = utils.hex_image_colors(RED_TSHIRT)

        # Check that colors is a list and not empty
        self.assertIsInstance(colors, list)
        self.assertTrue(len(colors) > 0)
        # Check that each color is a hex string
        for color in colors:
            self.assertIsInstance(color, str)
            self.assertRegex(color, r"^#[0-9a-fA-F]{6}$")


if __name__ == "__main__":
    unittest.main()
