import unittest

import pandas as pd

from colorfact.database import filter_database_by_outfit_type

# Constants for column names and outfit names
COL_CAT_PRODUIT = "Catégorie produit"
COL_OTHER = "other"
OUTFIT_CASUAL_ETE = "Casual été"
OUTFIT_PROFESSIONNEL = "Professionnel"
OUTFIT_SPORT = "Sport"


class TestFilterDatabaseByOutfitType(unittest.TestCase):
    def setUp(self):
        # Real columns: Photo produit 1,Photo produit 2,Nom produit,Lien achat,Catégorie produit,Genre,cielab_colors
        self.database = pd.DataFrame(
            {
                COL_CAT_PRODUIT: ["t-shirt", "jean", "chemise", "T-SHIRT"],
                COL_OTHER: [1, 2, 3, 4],
            }
        )
        self.outfits_descriptions = {
            OUTFIT_CASUAL_ETE: ["T-SHIRT", "Jean"],
            OUTFIT_PROFESSIONNEL: ["Chemise", "Pantalon"],
        }

    def test_valid_outfit_type(self):
        filtered = filter_database_by_outfit_type(
            self.database, self.outfits_descriptions, OUTFIT_CASUAL_ETE
        )
        self.assertFalse(filtered.empty)
        self.assertTrue(
            all(filtered[COL_CAT_PRODUIT].str.lower().isin(["t-shirt", "jean"]))
        )

    def test_outfit_type_not_found(self):
        with self.assertRaises(KeyError):
            filter_database_by_outfit_type(
                self.database, self.outfits_descriptions, OUTFIT_SPORT
            )

    def test_no_products_found(self):
        # Remove all "chemise" from database
        db = self.database[self.database[COL_CAT_PRODUIT].str.lower() != "chemise"]
        with self.assertRaises(ValueError):
            filter_database_by_outfit_type(
                db, self.outfits_descriptions, OUTFIT_PROFESSIONNEL
            )

    def test_case_insensitive_matching(self):
        filtered = filter_database_by_outfit_type(
            self.database, self.outfits_descriptions, OUTFIT_CASUAL_ETE
        )
        self.assertIn("T-SHIRT", filtered[COL_CAT_PRODUIT].values)
        self.assertIn("t-shirt", filtered[COL_CAT_PRODUIT].values)


if __name__ == "__main__":
    unittest.main()
