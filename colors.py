import cv2
import numpy as np
import skimage.color


def hex_from_cielab(color: tuple) -> str:
    L, a, b = color
    # Convert CIELAB to RGB
    lab_color = np.array([[L, a, b]], dtype=np.float32)
    rgb_color = (
        skimage.color.lab2rgb(lab_color)[0] * 255
    )  # Convert to RGB and scale to [0, 255]
    # Round values to nearest integers
    rgb_color = np.clip(
        np.round(rgb_color).astype(int), 0, 255
    )  # Ensure values are in [0, 255]
    # Convert RGB to hex
    hex_color = "#{:02x}{:02x}{:02x}".format(rgb_color[0], rgb_color[1], rgb_color[2])
    # Ensure hex color is in uppercase
    hex_color = hex_color.upper()
    return hex_color


def cielab_from_hex(hex_color: str) -> tuple:
    hex_color = hex_color.lstrip("#")
    if len(hex_color) != 6:
        raise ValueError("Hex color must be in the format #RRGGBB")
    # Convert hex to RGB
    rgb_color = np.array(
        [int(hex_color[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32
    )
    rgb_color /= 255.0  # Scale to [0, 1]
    # Convert RGB to CIELAB
    lab_color = skimage.color.rgb2lab(rgb_color.reshape(1, 1, 3))[
        0, 0
    ]  # Convert to CIELAB
    return tuple(lab_color)  # Return as a tuple (L, a, b)


def convert_opencv_lab_to_cielab(lab_pixel: np.ndarray) -> np.ndarray:
    """Convert an OpenCV LAB pixel to standard CIELAB color space.

    Args:
        lab_pixel (np.ndarray): OpenCV LAB color values
            L: 0-255, a: 0-255 (centered at 128), b: 0-255 (centered at 128)

    Returns:
        np.ndarray: Standard CIELAB values
            L: 0-100, a: -128 to +128, b: -128 to +128
    """
    L_opencv, a_opencv, b_opencv = lab_pixel
    L_std = (float(L_opencv) / 255) * 100
    # We receive uint8,  so we need to convert to float to avoid overflow
    a_std = float(a_opencv) - 128
    b_std = float(b_opencv) - 128
    return np.array([L_std, a_std, b_std])
