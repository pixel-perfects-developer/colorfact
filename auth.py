import os
import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# --------------------------------------------------
# Setup
# --------------------------------------------------

logger = logging.getLogger("colorfact.auth")

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}?sslmode=require"
)

engine = create_engine(DATABASE_URL)

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --------------------------------------------------
# Utils DB
# --------------------------------------------------

def get_user(identifier: str):
    """
    Retrieve user by username OR email
    """
    query = text("""
        SELECT username, email, hashed_password, created_at
        FROM users
        WHERE username = :identifier OR email = :identifier
        LIMIT 1
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {"identifier": identifier}).mappings().first()

    return dict(result) if result else None


def create_user(username: str, email: str, password: str):
    """
    Create new user
    """
    existing = get_user(username) or get_user(email)
    if existing:
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_pwd = get_password_hash(password)

    query = text("""
        INSERT INTO users (username, email, hashed_password, created_at)
        VALUES (:username, :email, :hashed_password, :created_at)
    """)

    with engine.begin() as conn:
        conn.execute(query, {
            "username": username,
            "email": email,
            "hashed_password": hashed_pwd,
            "created_at": datetime.utcnow()
        })

    return {
        "username": username,
        "email": email,
        "created_at": datetime.utcnow().isoformat()
    }


def update_user(
    current_username: str,
    new_username: Optional[str] = None,
    new_email: Optional[str] = None,
    new_password: Optional[str] = None,
):
    user = get_user(current_username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    fields = {}
    if new_username:
        fields["username"] = new_username
    if new_email:
        fields["email"] = new_email
    if new_password:
        fields["hashed_password"] = get_password_hash(new_password)

    if not fields:
        return user

    set_clause = ", ".join([f"{k} = :{k}" for k in fields.keys()])
    fields["current_username"] = current_username

    query = text(f"""
        UPDATE users
        SET {set_clause}
        WHERE username = :current_username
    """)

    with engine.begin() as conn:
        conn.execute(query, fields)

    return get_user(new_username or current_username)

# --------------------------------------------------
# Password & JWT
# --------------------------------------------------

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user(username)
    if not user:
        raise credentials_exception

    return user
def decode_access_token(token: str) -> dict:
    """
    Decode JWT token from HttpOnly cookie.
    Used by cookie-based authentication.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
