import unittest
from unittest.mock import patch

import pandas as pd

from colorfact.outfit import filter_clothes_by_brands


class TestFilterClothesByBrands(unittest.TestCase):
    def setUp(self):
        self.test_data = pd.DataFrame(
            {
                "Lien achat": [
                    "https://www2.hm.com/product1",
                    "https://www.zara.com/product2",
                    "https://www.uniqlo.com/product3",
                    "https://www2.hm.com/product4",
                    "https://www.zara.com/product5",
                ]
            }
        )

    def test_filter_by_wanted_brands(self):
        """Test filtering by wanted brands"""
        wanted_brands = ["hm"]

        result = filter_clothes_by_brands(
            clothes=self.test_data, wanted_brands=wanted_brands, removed_brands=[]
        )

        self.assertEqual(len(result), 2)
        self.assertTrue(all("hm.com" in url for url in result["Lien achat"]))

    def test_filter_by_removed_brands(self):
        """Test filtering by removed brands"""
        removed_brands = ["hm"]

        result = filter_clothes_by_brands(
            clothes=self.test_data, wanted_brands=[], removed_brands=removed_brands
        )

        self.assertEqual(len(result), 3)
        self.assertTrue(all("hm.com" not in url for url in result["Lien achat"]))

    def test_both_lists_specified(self):
        """Test that providing both wanted and removed brands raises ValueError"""
        with self.assertRaises(ValueError):
            filter_clothes_by_brands(
                clothes=self.test_data, wanted_brands=["hm"], removed_brands=["zara"]
            )

    def test_empty_lists(self):
        """Test with empty lists returns original dataset"""

        result = filter_clothes_by_brands(
            clothes=self.test_data, wanted_brands=[], removed_brands=[]
        )

        self.assertEqual(len(result), len(self.test_data))

    def test_brand_not_in_database(self):
        """Test filtering with brand that doesn't exist in database"""
        wanted_brands = ["NonExistentBrand"]

        result = filter_clothes_by_brands(
            clothes=self.test_data, wanted_brands=wanted_brands, removed_brands=[]
        )

        self.assertEqual(len(result), 0)
        self.assertTrue(result.empty)
