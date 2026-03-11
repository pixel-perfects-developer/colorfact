import argparse
import concurrent.futures
from typing import Optional, Callable

import pandas as pd
from tqdm import tqdm

from colorfact.utils import extract_colors_url


# -------------------------------------------------
# IMAGE PROCESSING
# -------------------------------------------------

def process_image(image_url: str) -> Optional[list]:
    """
    Extract dominant CIELAB colors from an image URL.
    Always returns a JSON-safe list[float] or None.
    """
    if not image_url or not isinstance(image_url, str):
        return None

    try:
        extractor = extract_colors_url(image_url)
        colors = extractor.colors

        if not colors:
            return None

        # 🔒 FORCE JSON ARRAY (NO tuple, NO numpy, NO {})
        first = colors[0]
        return [float(v) for v in first]

    except Exception as e:
        print(f"[WARN] Error processing image: {image_url} → {e}")
        return None


# -------------------------------------------------
# DATASET PROCESSING
# -------------------------------------------------

def process_dataset(
    df: pd.DataFrame,
    num_workers: int = 8,
    progress_callback: Optional[Callable[[int, int], None]] = None,
) -> pd.DataFrame:
    """
    Add a `cielab_colors` column to the dataset.

    progress_callback(processed, total) is optional.
    """

    if "Photo produit 1" not in df.columns:
        raise ValueError("Missing column: 'Photo produit 1'")

    image_urls = df["Photo produit 1"].tolist()
    total = len(image_urls)

    results = [None] * total

    with concurrent.futures.ThreadPoolExecutor(max_workers=num_workers) as executor:
        futures = {
            executor.submit(process_image, url): idx
            for idx, url in enumerate(image_urls)
        }

        for i, future in enumerate(
            concurrent.futures.as_completed(futures),
            start=1,
        ):
            idx = futures[future]
            results[idx] = future.result()

            if progress_callback:
                progress_callback(i, total)

    df["cielab_colors"] = results

    return df


# -------------------------------------------------
# CLI MODE (OPTIONAL)
# -------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update dataset with CIELAB colors")
    parser.add_argument(
        "-O",
        "--output",
        required=True,
        help="Path to the input XLSX dataset",
    )
    args = parser.parse_args()

    # --- Load input
    data = pd.read_excel(args.output)

    # --- Cleanup
    data = data.drop(columns=["Unnamed: 0"], errors="ignore")

    # --- Process
    data_processed = process_dataset(data, num_workers=8)

    # 🔥 IMPORTANT: NO explode(), NO literal_eval()
    # Each row keeps its OWN cielab_colors list

    # --- Optional merge with existing dataset
    try:
        existing = pd.read_excel("data/output.xlsx")
        dataset = pd.concat([existing, data_processed], ignore_index=True)
    except FileNotFoundError:
        dataset = data_processed

    # --- Deduplicate safely (image is best unique key)
    if "Photo produit 1" in dataset.columns:
        dataset = dataset.drop_duplicates(subset=["Photo produit 1"])

    # --- Save
    dataset.to_excel("data/new_output.xlsx", index=False)

    print("✅ Dataset updated successfully")
