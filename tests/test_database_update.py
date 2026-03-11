"""
This module contains tests for the database update functionality
"""

import unittest
from unittest.mock import Mock, patch

import pandas as pd

from colorfact.database import update


class TestDatabaseUpdate(unittest.TestCase):
    def setUp(self):
        """Set up a sample database for testing"""
        self.existing_db = pd.DataFrame(
            {
                "ID": [1, 2, 3],
                "Photo produit 1": [
                    "http://a.com/a.jpg",
                    "http://a.com/b.jpg",
                    "http://b.com/c.jpg",
                ],
                "Lien achat": [
                    "http://a.com/a",
                    "http://a.com/b",
                    "http://b.com/c",
                ],
            }
        )

        self.new_db = pd.DataFrame(
            {
                "ID": [4, 5],
                "Photo produit 1": ["http://a.com/d.jpg", "http://e.com/e.jpg"],
                "Lien achat": ["http://a.com/d", "http://e.com/e"],
                "Prix ": "€200EUR"
            }
        )

    # Mock pandas to_excel and read_excel methods to avoid file I/O
    @patch("pandas.DataFrame.to_excel")
    @patch("pandas.read_excel")
    # Mock the process_image function to avoid actual image processing and HTTP requests
    @patch("colorfact.update_data.process_image")
    def test_update_database(self, mock_process_image, mock_read_excel, mock_to_excel):
        """Test updating the database with new data"""
        mock_process_image = Mock()
        mock_process_image.return_value = [[50, 2.6772, 0.0028]]
        mock_read_excel.return_value = self.existing_db
        mock_to_excel.return_value = None

        updated_db = update(self.new_db)

        self.assertIsInstance(updated_db, pd.DataFrame)
        self.assertEqual(len(updated_db), 3)

        expected_ids = {3, 4, 5}
        self.assertEqual(set(updated_db["ID"]), expected_ids)
