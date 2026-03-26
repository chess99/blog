#!/usr/bin/env python3
"""Check that all blog posts have a unique slug field in front matter."""
from __future__ import annotations

import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "source" / "_posts"

SLUG_PATTERN = re.compile(r"^slug:\s*(\S+)\s*$", re.MULTILINE)


def main() -> int:
    missing = []
    duplicates: dict[str, list[str]] = {}

    for post_file in sorted(POSTS_DIR.glob("*.md")):
        content = post_file.read_text(encoding="utf-8")
        match = SLUG_PATTERN.search(content)
        if not match:
            missing.append(post_file.name)
            continue
        slug = match.group(1)
        duplicates.setdefault(slug, []).append(post_file.name)

    duplicate_items = {s: names for s, names in duplicates.items() if len(names) > 1}

    ok = True

    if duplicate_items:
        print(f"Error: Duplicate slug in {len(duplicate_items)} value(s):")
        for slug, names in sorted(duplicate_items.items()):
            print(f"  - '{slug}': {', '.join(names)}")
        ok = False

    if missing:
        print(f"Error: {len(missing)} post(s) missing slug:")
        for name in missing:
            print(f"  - {name}")
        print("Please add 'slug: your-slug' to the front matter manually.")
        ok = False

    if ok:
        print("OK: all posts have unique slug values.")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
