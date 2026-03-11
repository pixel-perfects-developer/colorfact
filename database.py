import ast
import logging
import math
import os
import re
from pathlib import Path

import pandas as pd
import tldextract
import yaml
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.types import JSON
from sqlalchemy import text

from colorfact import update_data

# Charger les variables d’environnement
load_dotenv()

# Informations de connexion à la base de données
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"
)

engine = create_engine(DATABASE_URL)


# ---------------------------------------------------------------------
# LOAD / SAVE
# ---------------------------------------------------------------------
def load_database() -> pd.DataFrame:
    """
    Charger la base de données produits depuis Postgres dans un DataFrame.
    """
    try:
        database = pd.read_sql("SELECT * FROM products", engine)
        return database
    except Exception as e:
        print(f"Erreur lors du chargement de la base de données : {e}")
        return pd.DataFrame()


def insert_products(rows: pd.DataFrame):
    """
    Insert rows into Postgres (append only these rows).
    Expects final schema columns (image_url_1, brand, price, cielab_colors, etc.)
    """
    if rows is None or rows.empty:
        return 0

    rows = rows.copy()

    # JSON-safe
    rows = rows.replace({pd.NA: None})
    rows = rows.replace({math.nan: None})

    rows.to_sql(
        "products",
        engine,
        if_exists="append",
        index=False,
        dtype={
            "cielab_colors": JSON,  # works with Python list/dict
        },
    )
    return len(rows)


def load_database_and_outfits():
    database = load_database()
    with open("configs/outfits_descriptions.yaml", "r", encoding="utf-8") as f:
        outfits_descriptions = yaml.safe_load(f)

    return database, outfits_descriptions


# ---------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------
def extract_brand(url: str) -> str:
    """
    Extract the brand from a URL using tldextract.
    """
    return tldextract.extract(url).domain


def clean_price(price):
    if pd.isna(price):
        return None
    if isinstance(price, (int, float)):
        return float(price)
    if not isinstance(price, str):
        return None

    price = price.strip().replace(",", ".")
    match = re.search(r"\d+(\.\d+)?", price)
    if match:
        try:
            return float(match.group())
        except ValueError:
            return None
    return None


# ---------------------------------------------------------------------
# UPDATE PIPELINE (FIXED)
# ---------------------------------------------------------------------

def log_rejected_images(df: pd.DataFrame, logfile="rejected_images.log"):
    """
    Log rows where cielab_colors is None with useful debug info.
    """
    rejected = df[df["cielab_colors"].isna()]

    if rejected.empty:
        return

    with open(logfile, "a", encoding="utf-8") as f:
        for _, row in rejected.iterrows():
            f.write(
                f"[NO_CIELAB] "
                f"image={row.get('image_url_1') or row.get('Photo produit 1')} | "
                f"name={row.get('name') or row.get('Nom produit')} | "
                f"brand={row.get('brand')} | "
                f"reason=no_colors_extracted\n"
            )

def update(new_db: pd.DataFrame, progress_callback=None) -> pd.DataFrame:
    # --- Normalize column names
    new_db.columns = (
        new_db.columns.astype(str).str.strip().str.replace("\u00a0", "", regex=False)
    )

    excel_db = new_db.copy()

    # 🔒 CRITICAL FIX #1 — remove duplicated columns EARLY
    excel_db = excel_db.loc[:, ~excel_db.columns.duplicated()]

    # --- Price
    PRICE_COLUMNS = ["Prix", "price", "Price"]
    price_col = next((c for c in PRICE_COLUMNS if c in excel_db.columns), None)
    if not price_col:
        raise ValueError(f"Colonne prix introuvable : {list(excel_db.columns)}")

    excel_db["Prix"] = excel_db[price_col].apply(clean_price)

    # --- Buy URL
    if "Lien achat" not in excel_db.columns:
        raise ValueError(f"Colonne 'Lien achat' manquante : {list(excel_db.columns)}")

    # --- Brand (force SINGLE column)
    excel_db = excel_db.drop(columns=["brand"], errors="ignore")
    excel_db["brand"] = excel_db["Lien achat"].apply(extract_brand)

    # 🔒 CRITICAL FIX #2 — enforce again after recomputation
    excel_db = excel_db.loc[:, ~excel_db.columns.duplicated()]

    # --- Color extraction
    excel_db = update_data.process_dataset(
        excel_db,
        progress_callback=progress_callback,
    )

    def to_single_cielab(x):
        # x peut être:
        # - [L,a,b]
        # - [[L,a,b], [..], ..]
        if isinstance(x, list) and x:
            if isinstance(x[0], (list, tuple)) and len(x[0]) == 3:
                return [float(v) for v in x[0]]  # prend le 1er triplet
            if len(x) == 3 and all(isinstance(v, (int, float)) for v in x):
                return [float(v) for v in x]
        return None

    excel_db["cielab_colors"] = excel_db["cielab_colors"].apply(to_single_cielab)

    # --- Column mapping
    COLUMN_MAP = {
        "Photo produit 1": "image_url_1",
        "Photo produit 2": "image_url_2",
        "Nom produit": "name",
        "Lien achat": "buy_url",
        "Prix": "price",
        "Catégorie produit": "category",
        "Sexe": "gender",
        "Brand": "brand",
    }

    excel_db = excel_db.rename(columns=COLUMN_MAP)

    # 🔥 CRITICAL FIX — COLUMN_MAP creates duplicated "brand"
    excel_db = excel_db.loc[:, ~excel_db.columns.duplicated()]

    # 🔥 SAFETY — ensure brand is a Series
    if isinstance(excel_db.get("brand"), pd.DataFrame):
        excel_db["brand"] = excel_db["brand"].iloc[:, 0]

    # 🔒 CRITICAL FIX #3 — guarantee brand is a Series (not DataFrame)
    if "brand" in excel_db.columns and isinstance(excel_db["brand"], pd.DataFrame):
        excel_db["brand"] = excel_db["brand"].iloc[:, 0]

        # --- Load existing to dedupe
    existing_db = load_database()
    if existing_db is None:
        existing_db = pd.DataFrame()

    # --- Dedup key: image_url_1 (best practical unique key)
    if "image_url_1" not in excel_db.columns:
        raise ValueError("Column 'image_url_1' missing after mapping/rename")

    if not existing_db.empty and "image_url_1" in existing_db.columns:
        existing_keys = set(existing_db["image_url_1"].dropna().astype(str))
    else:
        existing_keys = set()

    excel_db["image_url_1"] = excel_db["image_url_1"].astype(str)

    # Keep only NEW rows
    new_rows = excel_db[~excel_db["image_url_1"].isin(existing_keys)].copy()

    # Drop rows without colors (optional, but consistent with your pipeline)
    before = len(new_rows)
    log_rejected_images(new_rows)  # optional
    new_rows = new_rows[new_rows["cielab_colors"].notna()]
    after = len(new_rows)

    print(f"🧠 NEW rows kept (with CIELAB): {after}/{before}")

    # Insert only new rows
    inserted = insert_products(new_rows)
    print(f"✅ Inserted {inserted} new rows into Postgres")

    return new_rows
