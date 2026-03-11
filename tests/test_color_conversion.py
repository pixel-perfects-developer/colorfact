"""Unit tests for color conversion functionality.

This module contains test cases for:
- Hex to CIELAB color conversion
- CIELAB to Hex color conversion
- OpenCV LAB to CIELAB color conversion
"""

import unittest
import unittest.mock as mock

import numpy as np

import colorfact.colors as colors
from colorfact.utils import extract_colors_url


class TestHexLabConversion(unittest.TestCase):
    """Test suite for hex color to CIELAB conversions and vice versa."""

    def setUp(self) -> None:
        """Set up test cases with known color values."""
        self.test_colors = {
            "red": {"hex": "#FF0000", "lab": (53.24, 80.09, 67.20)},
            "white": {"hex": "#FFFFFF", "lab": (100.0, 0.0, 0.0)},
            "black": {"hex": "#000000", "lab": (0.0, 0.0, 0.0)},
        }

    def test_hex_to_cielab_conversion(self) -> None:
        """Test conversion from hex color codes to CIELAB color space."""
        for color_name, values in self.test_colors.items():
            with self.subTest(color=color_name):
                converted_lab = colors.cielab_from_hex(values["hex"])
                expected_lab = values["lab"]
                np.testing.assert_array_almost_equal(
                    converted_lab,
                    expected_lab,
                    decimal=2,
                    err_msg=f"Failed to convert {color_name} from hex to CIELAB",
                )

    def test_cielab_to_hex_conversion(self) -> None:
        """Test conversion from CIELAB color space to hex color codes."""
        for color_name, values in self.test_colors.items():
            with self.subTest(color=color_name):
                converted_hex = colors.hex_from_cielab(values["lab"])
                self.assertEqual(
                    converted_hex.upper(),
                    values["hex"],
                    f"Failed to convert {color_name} from CIELAB to hex",
                )


class TestOpenCVLabConversion(unittest.TestCase):
    """Test suite for OpenCV LAB to CIELAB color space conversion."""

    @classmethod
    def setUpClass(cls) -> None:
        """Set up test fixtures that can be reused across all tests."""
        cls.test_cases = {
            "black": {
                "opencv_lab": np.uint8([0, 128, 128]),
                "cielab": np.array([0, 0, 0]),
            },
            "white": {
                "opencv_lab": np.uint8([255, 128, 128]),
                "cielab": np.array([100, 0, 0]),
            },
            "red": {
                "opencv_lab": np.uint8([128, 200, 128]),
                "cielab": np.array([50.196, 72, 0]),
            },
            "dark blue": {
                "opencv_lab": np.uint8([31, 127, 112]),
                "cielab": np.array([11.55, -0.74, -15.74]),
            },
        }

    def test_color_conversions(self) -> None:
        """Test conversion of various colors from OpenCV LAB to CIELAB."""
        for color_name, values in self.test_cases.items():
            with self.subTest(color=color_name):
                result = colors.convert_opencv_lab_to_cielab(values["opencv_lab"])
                np.testing.assert_array_almost_equal(
                    result,
                    values["cielab"],
                    decimal=0,
                    err_msg=f"Failed to convert {color_name}",
                )

    def test_output_type_validation(self) -> None:
        """Verify output type and data type of conversion results."""
        test_input = np.array([128, 128, 128])
        result = colors.convert_opencv_lab_to_cielab(test_input)

        self.assertIsInstance(result, np.ndarray, "Output should be a numpy array")
        self.assertEqual(
            result.dtype.kind, "f", "Output array should contain floating-point values"
        )

    def test_input_validation(self) -> None:
        """Test handling of invalid inputs."""
        invalid_inputs = [
            ("string input", "invalid input", ValueError),
            ("incomplete array", np.array([128, 128]), ValueError),
            ("array too big", np.array([128, 128, 128, 128]), ValueError),
            ("wrong type", 42, TypeError),
            ("none", None, TypeError),
        ]

        for desc, invalid_input, err in invalid_inputs:
            with self.subTest(input_type=desc):
                with self.assertRaises(
                    err, msg=f"Should raise {err.__name__} for {desc}"
                ):
                    colors.convert_opencv_lab_to_cielab(invalid_input)


if __name__ == "__main__":
    unittest.main(verbosity=2)
