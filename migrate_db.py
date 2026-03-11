import pandas as pd
from sqlalchemy import create_engine
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Configuration de l’engine
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"
engine = create_engine(DATABASE_URL)

# Chargement du CSV existant
csv_path = "data/products.csv"
print(f"Chargement des données depuis {csv_path}...")
df = pd.read_csv(csv_path)

# Correction éventuelle des noms de colonnes pour être compatibles SQL
# (optionnel mais recommandé)
# df.columns = [c.lower().replace(' ', '_') for c in df.columns]

# Import vers Postgres
print("Importation vers Postgres...")
df.to_sql("products", engine, if_exists="replace", index=False)
print("Terminé !")
