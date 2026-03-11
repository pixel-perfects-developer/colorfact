import unittest

from fastapi.testclient import TestClient

from colorfact.backend_api import app


class TestOutfitByImageAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_outfit_by_image_success(self):
        with open("tests/data/red tshirt.jpg", "rb") as file:
            response = self.client.post(
                "/outfit_by_image/",
                files={"file": ("red_tshirt.jpg", file, "image/jpeg")},
                params={"clothing_type": "T-shirt", "gender": "H"},
            )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, dict)
        self.assertIn("Casual été", data)
