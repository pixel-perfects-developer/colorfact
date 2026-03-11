import logging
import os
import tempfile
from pathlib import Path

import pandas as pd
import yaml
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from . import colors, database, outfit, utils
from io import BytesIO
from fastapi.responses import StreamingResponse
from fastapi import Response

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
RECOGNIZED_GENDERS = {"H", "F", "H/F"}

app = FastAPI()

from uuid import uuid4
from datetime import datetime
from threading import Lock

UPDATE_JOBS: dict[str, dict] = {}
UPDATE_JOBS_LOCK = Lock()
DB_UPDATE_LOCK = Lock()

# Define Custom Colored Formatter
class ColoredFormatter(logging.Formatter):
    grey = "\x1b[38;20m"
    blue = "\x1b[34;20m"
    green = "\x1b[32;20m"
    yellow = "\x1b[33;20m"
    red = "\x1b[31;20m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"

    # Format: LEVEL:LOGGER:MESSAGE
    format_str = "%(levelname)s:%(name)s: %(message)s"

    FORMATS = {
        logging.DEBUG: blue + "%(levelname)s:%(name)s:" + reset + " %(message)s",
        logging.INFO: green + "%(levelname)s:%(name)s:" + reset + " %(message)s",
        logging.WARNING: yellow + "%(levelname)s:%(name)s:" + reset + " %(message)s",
        logging.ERROR: red + "%(levelname)s:%(name)s:" + reset + " %(message)s",
        logging.CRITICAL: bold_red + "%(levelname)s:%(name)s:" + reset + " %(message)s",
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)

# Setup Logger
logger = logging.getLogger("colorfact")
logger.setLevel(logging.DEBUG)

# Check if handler already exists to avoid duplicates
if not logger.handlers:
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    ch.setFormatter(ColoredFormatter())
    logger.addHandler(ch)
    logger.propagate = False

# Also ensure backend_api logger uses the parent 'colorfact' logger settings or has same handler if needed
# But getting 'colorfact.backend_api' will inherit from 'colorfact'
logger = logging.getLogger("colorfact.backend_api")

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends, HTTPException, status
from datetime import timedelta
from . import auth
from pathlib import Path
import re
import unicodedata
import pandas as pd
import math
import numpy as np
from fastapi import Request

# Auth Models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str

origins = [
    "https://colorfact.fr",
    "https://www.colorfact.fr",
    "https://app.colorfact.fr",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "https://admin-panel-sable-five.vercel.app",
    "https://portal.colorfact.fr",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

def get_current_user_from_cookie(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    payload = auth.decode_access_token(token)
    username = payload.get("sub")

    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = auth.get_user(username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
# -----------------------------
# Category Maps
# -----------------------------
CLOTHING_TYPE_MAP = {
    "T-shirt": "Tops",
    "Polo": "Tops",
    "Chemise": "Tops",
    "Col roulé": "Tops",
    "Sweatshirt": "Tops",
    "Hoodie": "Tops",
    "Pull": "Tops",
    "Cardigan": "Tops",
    "Veste": "Tops",
    "Blouson": "Tops",
    "Manteau": "Tops",
    "Parka": "Tops",
    "Trench": "Tops",

    "Pantalon": "Pants",
    "Jean": "Pants",
    "Short": "Pants",
    "Jogging": "Pants",
    "Chinos": "Pants",
    "Jupe": "Pants",
    "Robe": "Pants",
    "Combinaison": "Pants",

    "Costume": "Formal",
    "Tailleur": "Formal",
    "Pantalon habillé": "Formal",
    "Blazer": "Formal",
    "Robe de soirée": "Formal",

    "Sneakers": "Shoes",
    "Bottes": "Shoes",
    "Chaussures de ville": "Shoes",
    "Escarpins": "Shoes",
    "Talons": "Shoes",
    "Sandales": "Shoes",

    "Sac à main": "Accessories",
    "Sac à dos": "Accessories",
    "Lunettes": "Accessories",
    "Bonnet": "Accessories",
    "Casquettes": "Accessories",
    "Ceinture": "Accessories",
    "Montre": "Accessories",
}

GENDER_MAP = {
    "Homme": "H",
    "Femme": "F",
    "Mixte": "H/F",
}

@app.post("/signup", response_model=dict)
def signup(user: UserCreate):
    auth.create_user(user.username, user.email, user.password)
    return {"message": "User created successfully"}


@app.post("/token")
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = auth.get_user(form_data.username)
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")

    access_token = auth.create_access_token(data={"sub": user["username"]})

    response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    samesite="lax",   # 🔥 REQUIRED
    secure=False,      # True ONLY on HTTPS
    )

    return {"message": "Login successful"}

@app.put("/update_profile", response_model=dict)
def update_profile(user_update: UserUpdate, current_user: dict = Depends(get_current_user_from_cookie)):
    updated_user = auth.update_user(
        current_username=current_user["username"],
        new_username=user_update.username,
        new_email=user_update.email,
        new_password=user_update.password
    )
    return {"message": "Profile updated successfully", "user": updated_user}
    
# -----------------------------
# Text normalization
# -----------------------------
def normalize_text(value: str) -> str:
    if not isinstance(value, str):
        return ""
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("utf-8")
    value = value.lower()
    value = re.sub(r"[^a-z0-9\s]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value

# -----------------------------
# Matcher loader
# -----------------------------
def get_outfit_matcher():
    base_dir = Path(__file__).resolve().parent

    outfit_path = base_dir / "configs" / "outfit.yaml"

    # 1️⃣ Charger ontologie
    with open(outfit_path, encoding="utf-8") as f:
        outfit_config = yaml.safe_load(f)

    # 2️⃣ Charger données depuis Postgres
    data = database.load_database()

    if data is None or data.empty:
        raise RuntimeError("Postgres database is empty — matcher cannot start")

    # Normalisations MINIMALES attendues par matching_products
    data = data.copy()
    data["gender"] = data["gender"].fillna("H/F")

    matcher = utils.matching_products(
        data=data,
        ontologie=outfit_config,
    )

    return matcher
# -----------------------------
# Dataset fallback (GUARANTEED)
# -----------------------------
def dataset_fallback_outfits(dataset, clothing_type, top_k=5):
    outfits = {"Fallback": {}}
    clothing_norm = normalize_text(clothing_type)
    seen_ids = set()

    for row in dataset:
        if not isinstance(row, dict):
            continue

        category = (
        row.get("category")
        or row.get("Catégorie produit")
        or row.get("Categorie produit")
        or ""
        )


        if clothing_norm in normalize_text(category):
            product_id = row.get("image_url_1") or row.get("Photo produit 1") or row.get("product_id") or row.get("id")
            
            # 🔥 Fix: Filter out NaN/float keys that evaluate to True but break JSON
            if product_id is None or pd.isna(product_id) or str(product_id).lower() == "nan" or str(product_id).strip() == "":
                continue

            # Deduplication
            if product_id in seen_ids:
                continue
            seen_ids.add(product_id)

            # Metadata extraction
            # Metadata extraction
            price = row.get("price") or (row.get("Prix ") if "Prix " in row else row.get("Prix"))
            brand = row.get("brand") or row.get("Marque")
            
            outfits["Fallback"].setdefault(category, []).append(
              normalize_product(row)
            )


            if len(outfits["Fallback"][category]) >= top_k:
                break

    return outfits if outfits["Fallback"] else {}

# -----------------------------
# API: Outfit by color
# -----------------------------
@app.get("/outfit_by_color/")
def outfit_by_color(
    color: str = Query(...),
    clothing_type: str = Query(...),
    gender: str = Query(...),
) -> dict:
    logger.info(f"Request: outfit_by_color | color={color}, type={clothing_type}, gender={gender}")

    try:
        matcher = get_outfit_matcher()
        logger.debug("Matcher initialized successfully")
    except Exception as e:
        logger.exception(f"Matcher init failed: {e}")
        return {"outfits": {}, "color": color, "gender": gender, "clothing_type": clothing_type}

    input_cielab_color = None
    try:
        input_cielab_color = colors.cielab_from_hex(color)
        logger.debug(f"Color conversion success: {color} -> {input_cielab_color}")
    except Exception as e:
        logger.warning(f"Color conversion failed for '{color}': {e}")

    normalized_clothing_type = clothing_type.strip()
    normalized_gender = GENDER_MAP.get(gender, gender)

    if normalized_gender not in RECOGNIZED_GENDERS:
        logger.error(f"Invalid gender '{gender}'. Expected one of {RECOGNIZED_GENDERS} or {list(GENDER_MAP.keys())}")
        return {"error": f"Invalid gender. Must be one of {RECOGNIZED_GENDERS}"}

    # 🔥 Fix: Access 'Outfit' keys, not root keys which include 'Ontologie'
    outfit_rules = getattr(matcher, "ontologie", {}).get("Outfit", {})
    valid_categories = list(outfit_rules.keys())
    
    input_category = normalized_clothing_type if normalized_clothing_type in valid_categories else (valid_categories[0] if valid_categories else normalized_clothing_type)
    logger.debug(f"Input normalized: type='{normalized_clothing_type}' -> category='{input_category}', gender='{gender}' -> '{normalized_gender}'")

    total_items = 0
    ontology_outfits = {}
    try:
        logger.debug("Calling matcher.recommend_outfit...")
        ontology_outfits = matcher.recommend_outfit(
            input_category=input_category,
            input_colors=[input_cielab_color] if input_cielab_color else None,
            gender=normalized_gender,
            top_k=5,
        )
        # Count total items found
        total_items = sum(len(items) for cat in ontology_outfits.values() for items in cat.values())
        logger.info(f"Matcher returned {total_items} items across {len(ontology_outfits)} styles")
    except Exception as e:
        logger.exception(f"Error in matcher.recommend_outfit: {e}")
        ontology_outfits = {}

    # 🔥 FALLBACK THAT FINALLY WORKS
    if not ontology_outfits or total_items == 0:
        logger.info("No items found via ontology. Triggering fallback.")
        # Fallback expects a list of dicts
        fallback_data = matcher.data.to_dict(orient="records") if hasattr(matcher.data, "to_dict") else matcher.data
        
        ontology_outfits = dataset_fallback_outfits(
            fallback_data,
            normalized_clothing_type,
            top_k=5,
        )
        logger.debug(f"Fallback returned {sum(len(v) for v in ontology_outfits.values())} items")

    try:
        # Build product index for normalization
        product_index = build_product_index(matcher.data)
        normalized_outfits = normalize_outfits(ontology_outfits, product_index)
    except Exception as e:
        logger.error(f"Error normalizing outfits: {e}")
        normalized_outfits = {}

    logger.info("Request completed successfully")
    return {
        "outfits": normalized_outfits,
    }
    

def clean_nan(obj):
    """
    Recursively clean NaN / Inf values from dicts, lists,
    numpy, pandas, and floats so JSON never crashes.
    """
    if obj is None:
        return None

    # Python float
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj

    # NumPy values
    if isinstance(obj, (np.floating,)):
        if np.isnan(obj) or np.isinf(obj):
            return None
        return float(obj)

    # Dict
    if isinstance(obj, dict):
        return {k: clean_nan(v) for k, v in obj.items()}

    # List / Tuple
    if isinstance(obj, (list, tuple)):
        return [clean_nan(v) for v in obj]

    return obj

@app.get("/debug/dataset-preview/")
def debug_dataset_preview():
    try:
        matcher = get_outfit_matcher()
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "stage": "get_outfit_matcher_failed",
            "error": str(e),
        }

    try:
        data = matcher.data
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "stage": "access_matcher_data_failed",
            "error": str(e),
            "matcher_type": str(type(matcher)),
        }

    try:
        if isinstance(data, list):
            preview = data[:5]
        elif isinstance(data, dict):
            preview = list(data.items())[:5]
        else:
            preview = str(data)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "stage": "preview_failed",
            "error": str(e),
            "data_type": str(type(data)),
        }

    return {
        "data_type": str(type(data)),
        "data_length": len(data) if hasattr(data, "__len__") else None,
        "preview": preview,
    }


@app.post("/extract_colors/")
async def extract_colors(file: UploadFile = File(...)):
    """
    Extract dominant HEX colors from an uploaded image.
    FRONTEND-CONTRACT SAFE VERSION ✅
    """

    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # ✅ Validate extension
    suffix = os.path.splitext(file.filename)[-1].lower()
    if suffix not in {".jpg", ".jpeg", ".png"}:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPG and PNG are allowed."
        )

    # ✅ Read file content once
    contents = await file.read()

    # ✅ Backend size safety (5MB)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the maximum limit of 5MB"
        )

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        tmp.write(contents)

    try:
        logger.info(f"Extracting colors from {file.filename}")

        extracted_colors = utils.hex_image_colors(image_path=tmp_path)

        # ✅ FRONTEND EXPECTS ARRAY
        if not extracted_colors:
            return {"colors": []}

        # ✅ Normalize output (list of HEX strings)
        return {
            "colors": extracted_colors
        }

    except ValueError as e:
        logger.error(f"Color extraction error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.exception("Unexpected error during color extraction")
        raise HTTPException(
            status_code=500,
            detail="Failed to extract colors from image"
        )

    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass
def build_product_index(df: pd.DataFrame) -> dict:
    """
    Build index: image_url_1 -> full product row
    """
    index = {}
    for row in df.to_dict(orient="records"):
        key = row.get("image_url_1")
        if key:
            index[key] = row
    return index
        
def normalize_product(item: dict) -> dict:
    return clean_nan({
        "id": item.get("id") or item.get("ID"),

        "image_url_1": (
            item.get("image_url_1")
            or item.get("Photo produit 1")
            or item.get("image")
        ),

        "image_url_2": (
            item.get("image_url_2")
            or item.get("Photo produit 2")
        ),

        "name": (
            item.get("name")
            or item.get("Nom produit")
            or item.get("product_name")
        ),

        "buy_url": (
            item.get("buy_url")
            or item.get("URL produit")
            or item.get("Product URL")
        ),

        "price": (
            item.get("price")
            or item.get("Prix")
            or item.get("Prix ")
        ),

        "brand": (
            item.get("brand")
            or item.get("Marque")
        ),

        "category": (
            item.get("category")
            or item.get("Catégorie produit")
            or item.get("Categorie produit")
        ),

        "gender": (
            item.get("gender")
            or item.get("Genre")
        ),

        "cielab_colors": (
            item.get("cielab_colors")
            or item.get("CIELAB")
        ),
    })

def normalize_outfits(outfits: dict, product_index: dict) -> dict:
    normalized = {}

    for style, categories in outfits.items():
        if not isinstance(categories, dict):
            continue

        normalized[style] = {}

        for category, items in categories.items():
            normalized[style][category] = []

            for item in items:
                if not isinstance(item, dict):
                    continue

                full_item = product_index.get(
                    item.get("image_url_1"),
                    item
                )

                normalized[style][category].append(
                    normalize_product(full_item)
                )

        if not normalized[style]:
            del normalized[style]

    return normalized

@app.post("/outfit_by_image/")
async def outfit_by_image(
    file: UploadFile = File(...),
    clothing_type: str = Query(...),
    gender: str = Query(...),
) -> dict:
    """
    BACKEND-ONLY FIX
    Compatible with ALL existing frontend logic
    """

    suffix = os.path.splitext(file.filename)[-1].lower()
    contents = await file.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        tmp.write(contents)

    try:
        matcher = get_outfit_matcher()
        product_index = build_product_index(matcher.data)
        
        raw_outfits = outfit.get_outfit_by_image(
            file=Path(tmp_path),
            clothing_type=clothing_type,
            gender=gender,
        )

        # ---------------------------
        # Normalize to frontend format
        # ---------------------------
        normalized = {}
        
        # Note: raw_outfits is expected to be {Style: {Category: [Item, Item]}}
        if isinstance(raw_outfits, dict):
            for style, categories in raw_outfits.items():
                if not isinstance(categories, dict):
                    continue

                normalized[style] = {}

                for category, items in categories.items():
                    fixed_items = []

                    if isinstance(items, list):
                        for item in items:
                            if isinstance(item, dict):
                                # Lookup full item details
                                full_item = product_index.get(item.get("image_url_1"), item)
                                fixed_items.append(normalize_product(full_item))

                    normalized[style][category] = fixed_items

                # remove empty styles
                if not normalized[style]:
                    del normalized[style]

            normalized[style][category] = fixed_items

        # remove empty styles
        if not normalized[style]:
            del normalized[style]


        # 🔥 RETURN BOTH ROOT + outfits
        return {
            "outfits": normalized,
        }

    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass

from fastapi import BackgroundTasks

def run_update_job(job_id: str, file_bytes: bytes):
    # Séquentiel: 1 update DB à la fois
    with DB_UPDATE_LOCK:
        with UPDATE_JOBS_LOCK:
            UPDATE_JOBS[job_id]["status"] = "running"
            UPDATE_JOBS[job_id]["error"] = None

        try:
            # Lecture direct depuis la mémoire (plus de /tmp)
            new_data = pd.read_excel(BytesIO(file_bytes), engine="openpyxl")

            total = len(new_data)
            if total == 0:
                raise ValueError("Excel vide : 0 ligne")

            database.update(
                new_data,
                progress_callback=lambda processed, total: update_job_progress(
                    job_id, processed, total
                )
            )

            with UPDATE_JOBS_LOCK:
                UPDATE_JOBS[job_id]["status"] = "done"
                UPDATE_JOBS[job_id]["progress"] = 100
                UPDATE_JOBS[job_id]["finished_at"] = datetime.utcnow().isoformat()

        except Exception as e:
            logger.exception("Update job failed")
            with UPDATE_JOBS_LOCK:
                UPDATE_JOBS[job_id]["status"] = "error"
                UPDATE_JOBS[job_id]["progress"] = 100
                UPDATE_JOBS[job_id]["error"] = str(e)
                UPDATE_JOBS[job_id]["finished_at"] = datetime.utcnow().isoformat()


def update_job_progress(job_id: str, processed: int, total: int):
    if not total:
        percent = 0
    else:
        percent = int((processed / total) * 100)
    with UPDATE_JOBS_LOCK:
        UPDATE_JOBS[job_id]["progress"] = max(0, min(100, percent))

@app.post("/update/")
async def update_data_async(
    background_tasks: BackgroundTasks,
    content: UploadFile = File(...),
):
    if not content.filename.endswith(".xlsx"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .xlsx files are allowed."
        )

    job_id = str(uuid4())

    # Lire le fichier en mémoire (robuste, pas de /tmp)
    file_bytes = await content.read()

    with UPDATE_JOBS_LOCK:
        UPDATE_JOBS[job_id] = {
            "job_id": job_id,
            "status": "pending",
            "progress": 0,
            "error": None,
            "started_at": datetime.utcnow().isoformat(),
            "finished_at": None,
        }

    background_tasks.add_task(run_update_job, job_id, file_bytes)

    return {
        "job_id": job_id,
        "status": "pending"
    }


@app.get("/update/status/")
def list_update_jobs():
    return list(UPDATE_JOBS.values())

@app.get("/update/status/{job_id}")
def get_update_status(job_id: str):
    job = UPDATE_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return job

@app.get("/database/")
def get_database():
    """
    Export the current database as an XLSX file (works with CSV or Postgres behind load_database()).
    """
    try:
        df = database.load_database()
    except Exception:
        logger.exception("Failed to load database")
        raise HTTPException(status_code=500, detail="Failed to load database")

    if df is None:
        raise HTTPException(status_code=404, detail="Database is empty or not found")

    # If load_database() ever returns non-DataFrame, normalize it
    if not isinstance(df, pd.DataFrame):
        df = pd.DataFrame(df)

    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="products")
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="database.xlsx"'},
    )

from fastapi import Query, HTTPException

@app.get("/outfit_recommendation/")
def outfit_recommendation(
    input_colors: list[str] = Query(...),
    clothing_type: str | None = Query(None),
    maxPrice: float = Query(1000.0),
    minPrice: float = Query(0.0),
    wanted_brands: list[str] = Query([]),
    removed_brands: list[str] = Query([]),
):

    # ------------------ Helpers ------------------

    def normalize_hex(c: str) -> str:
        c = c.strip().upper()
        return c if c.startswith("#") else f"#{c}"

    def sanitize_value(v):
        """Make value JSON-safe"""
        if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
            return None
        return v

    # ------------------ Colors ------------------

    try:
        cielab_colors = [
            colors.cielab_from_hex(normalize_hex(c))
            for c in input_colors
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid color format: {e}")

    # ------------------ Load DB ------------------

    data = database.load_database()
    print("➡️ DB rows:", len(data))
    print("➡️ DB columns:", data.columns.tolist())

    # ------------------ Filters ------------------

    filtered_db = outfit.filter_clothes_by_brands(
        clothes=data,
        wanted_brands=wanted_brands,
        removed_brands=removed_brands,
    )
    print("➡️ After brand filter:", len(filtered_db))

    filtered_db = outfit.filter_clothes_by_prices(
        filtered_db, minPrice, maxPrice
    )
    print("➡️ After price filter:", len(filtered_db))

    filtered_db = outfit.filter_clothes_by_color(
        filtered_db, cielab_colors, top_k=50
    )
    print("➡️ After color filter:", len(filtered_db))

    if clothing_type:
        filtered_db = outfit.filter_clothes_by_clothing_type(filtered_db, clothing_type)
        print("➡️ After clothing type filter:", len(filtered_db))

    # ------------------ 🔥 CRITICAL FIX 🔥 ------------------

    # Replace NaN → None (JSON-safe)
    filtered_db = filtered_db.replace({np.nan: None})

    # Convert safely
    records = [
        {k: sanitize_value(v) for k, v in row.items()}
        for row in filtered_db.to_dict(orient="records")
    ]

    # ------------------ Response ------------------

    return {
        "recommendations": records
    }
@app.get("/articles/")
def get_all_articles(current_user: dict = Depends(get_current_user_from_cookie)):
    """
    Returns ALL articles/products from the dataset (Excel).
    No filters, no recommendations — raw data.
    """

    try:
        data = database.load_database()
    except Exception as e:
        logger.exception("Failed to load database")
        raise HTTPException(status_code=500, detail="Failed to load database")

    if data is None or len(data) == 0:
        return {
            "count": 0,
            "articles": []
        }

    # Replace NaN → None (JSON safe)
    data = data.replace({np.nan: None})

    articles = [
        clean_nan(record)
        for record in data.to_dict(orient="records")
    ]

    return {
        "count": len(articles),
        "articles": articles
    }
from fastapi import Body
from uuid import uuid4

@app.post("/articles/")
def create_article(article: dict = Body(...), current_user: dict = Depends(get_current_user_from_cookie)):
    """
    Create a new article/product and store it in the CSV database.
    """

    # ------------------ Load DB ------------------
    try:
        df = database.load_database()
    except Exception:
        logger.exception("Failed to load database")
        raise HTTPException(status_code=500, detail="Failed to load database")

    if df is None:
        raise HTTPException(status_code=500, detail="Database is empty or corrupted")

    # ------------------ Validate ------------------
    # We require brand/price/name/etc?
    # User said payload has: name, brand, category, price, buy_url, image_url_1, image_url_2, gender, cielab_colors
    required_fields = ["name", "price", "buy_url"] 

    for field in required_fields:
        if field not in article:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required field: {field}"
            )

    # ------------------ Auto-Increment ID ------------------
    # Extract existing numeric IDs
    existing_ids = []
    if "id" in df.columns:
        for x in df["id"]:
            try:
                # Handle string "694", or floats
                if pd.notna(x):
                    existing_ids.append(int(float(x)))
            except (ValueError, TypeError):
                pass
    
    new_id = max(existing_ids) + 1 if existing_ids else 1
    
    # ------------------ Prepare Article ------------------
    clean_article = {
        k: clean_nan(v)
        for k, v in article.items()
    }
    
    clean_article["id"] = str(new_id)

    # ------------------ Append ------------------
    # Ensure all columns exist in the new row
    # (Pandas concat will handle missing columns by filling NaN, 
    # but we want to make sure we don't lose data if we are adding new columns)
    
    new_row_df = pd.DataFrame([clean_article])
    
    # Concat
    df = pd.concat([df, new_row_df], ignore_index=True)

    # ------------------ Save ------------------
    try:
        # Use simple save to CSV to avoid corruption
        database.save_database(df)
    except Exception:
        logger.exception("Failed to save database")
        raise HTTPException(status_code=500, detail="Failed to save database")

    return {
        "status": "OK",
        "message": "Article created successfully",
        "article": clean_article
    }

@app.put("/articles/{article_id}")
def update_article(
    article_id: str,
    updates: dict = Body(...),
    current_user: dict = Depends(get_current_user_from_cookie)
):
    """
    Update an existing article/product by ID.
    """

    # ------------------ Load DB ------------------
    try:
        df = database.load_database()
    except Exception:
        logger.exception("Failed to load database")
        raise HTTPException(status_code=500, detail="Failed to load database")

    if df is None or df.empty:
        raise HTTPException(status_code=500, detail="Database is empty or corrupted")

    # ------------------ Validate ID ------------------
    if "id" not in df.columns:
        raise HTTPException(status_code=500, detail="Database missing ID column")

    # Convert IDs to string for safe comparison
    df["id"] = df["id"].astype(str)

    if article_id not in df["id"].values:
        raise HTTPException(status_code=404, detail="Article not found")

    # ------------------ Clean Update Payload ------------------
    clean_updates = {
        k: clean_nan(v)
        for k, v in updates.items()
        if k != "id"  # prevent ID overwrite
    }

    if not clean_updates:
        raise HTTPException(
            status_code=400,
            detail="No valid fields provided for update"
        )

    # ------------------ Apply Updates ------------------
    row_index = df.index[df["id"] == article_id][0]

    for key, value in clean_updates.items():
        # If column doesn't exist, create it
        if key not in df.columns:
            df[key] = None

        df.at[row_index, key] = value

    # ------------------ Save ------------------
    try:
        database.save_database(df)
    except Exception:
        logger.exception("Failed to save database")
        raise HTTPException(status_code=500, detail="Failed to save database")

    # ------------------ Response ------------------
    updated_article = df.loc[row_index].to_dict()

    return {
        "status": "OK",
        "message": "Article updated successfully",
        "article": updated_article
    }
@app.delete("/articles/")
def delete_articles(payload: dict = Body(...)):
    """
    Bulk delete by id (payload key: 'product_ids')
    """

    # User sends {"product_ids": [123, 456]}
    product_ids = payload.get("product_ids")

    if not product_ids or not isinstance(product_ids, list):
        raise HTTPException(
            status_code=400,
            detail="product_ids must be a non-empty list"
        )

    try:
        df = database.load_database()
    except Exception:
        logger.exception("Failed to load database")
        raise HTTPException(status_code=500, detail="Failed to load database")

    # Column name validation
    target_col = "id"
    if target_col not in df.columns:
        # Fallback if the DB schema is different
        if "product_id" in df.columns:
            target_col = "product_id"
        else:
            raise HTTPException(
                status_code=500,
                detail="ID column not found in database"
            )

    existing = set(df[target_col].dropna().astype(str))
    to_delete = set(map(str, product_ids))

    found = existing.intersection(to_delete)
    missing = list(to_delete - existing)

    if not found:
        raise HTTPException(
            status_code=404,
            detail="No matching articles found"
        )

    # Filter out the deleted IDs
    df = df[~df[target_col].astype(str).isin(found)]

    try:
        # Use simple save to CSV to avoid corruption
        database.save_database(df)
    except Exception:
        logger.exception("Failed to save database")
        raise HTTPException(status_code=500, detail="Failed to save database")

    return {
        "status": "OK",
        "deleted_count": len(found),
        "deleted_ids": list(found),
        "missing_ids": missing
    }
