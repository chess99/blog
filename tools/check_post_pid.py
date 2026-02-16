#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "source" / "_posts"

PID_PATTERN = re.compile(r"^pid:\s*(\d+)\s*$", re.MULTILINE)
PERMALINK_PATTERN = re.compile(r"^permalink:\s*(.+?)\s*$", re.MULTILINE)


def load_permalink() -> str:
    config = REPO_ROOT / "_config.yml"
    if not config.exists():
        return ""
    text = config.read_text(encoding="utf-8")
    match = PERMALINK_PATTERN.search(text)
    return match.group(1).strip() if match else ""


def main() -> int:
    permalink = load_permalink()
    require_pid = ":pid" in permalink

    if not require_pid:
        print("Current permalink does not use :pid. No pid check needed.")
        return 0

    missing = []
    duplicates: dict[int, list[str]] = {}

    for post_file in sorted(POSTS_DIR.glob("*.md")):
        content = post_file.read_text(encoding="utf-8")
        match = PID_PATTERN.search(content)
        if not match:
            missing.append(post_file.name)
            continue

        pid = int(match.group(1))
        duplicates.setdefault(pid, []).append(post_file.name)

    duplicate_items = {pid: names for pid, names in duplicates.items() if len(names) > 1}

    if not missing and not duplicate_items:
        print("OK: all posts have unique pid values.")
        return 0

    if missing:
        print(f"Missing pid in {len(missing)} post(s):")
        for name in missing:
            print(f"- {name}")

    if duplicate_items:
        print(f"Duplicate pid detected: {len(duplicate_items)} value(s)")
        for pid, names in sorted(duplicate_items.items()):
            joined = ", ".join(names)
            print(f"- pid {pid}: {joined}")

    return 1


if __name__ == "__main__":
    sys.exit(main())
