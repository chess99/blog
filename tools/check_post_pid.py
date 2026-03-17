#!/usr/bin/env python3
"""Check and auto-assign pid for blog posts.

If a post is missing pid, automatically assign the next available pid.
URL format is controlled by _config.yml: permalink: posts/:pid/
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "source" / "_posts"

PID_PATTERN = re.compile(r"^pid:\s*(\d+)\s*$", re.MULTILINE)
EMPTY_PID_PATTERN = re.compile(r"^pid:\s*$", re.MULTILINE)
PERMALINK_PATTERN = re.compile(r"^permalink:\s*(.+?)\s*$", re.MULTILINE)
TITLE_PATTERN = re.compile(r"^(title:\s*.+)$", re.MULTILINE)


def load_permalink() -> str:
    config = REPO_ROOT / "_config.yml"
    if not config.exists():
        return ""
    text = config.read_text(encoding="utf-8")
    match = PERMALINK_PATTERN.search(text)
    return match.group(1).strip() if match else ""


def get_existing_pids() -> set[int]:
    """Get all existing pid values."""
    pids = set()
    for post_file in POSTS_DIR.glob("*.md"):
        content = post_file.read_text(encoding="utf-8")
        match = PID_PATTERN.search(content)
        if match:
            pids.add(int(match.group(1)))
    return pids


def get_next_pid(existing_pids: set[int]) -> int:
    """Get the next available pid (max + 1)."""
    if not existing_pids:
        return 1
    return max(existing_pids) + 1


def add_pid_to_file(post_file: Path, pid: int) -> bool:
    """Add pid to a post file. Returns True if modified."""
    content = post_file.read_text(encoding="utf-8")

    # Check if pid already exists with a value
    if PID_PATTERN.search(content):
        return False

    # Replace empty pid: field if present
    if EMPTY_PID_PATTERN.search(content):
        new_content = EMPTY_PID_PATTERN.sub(f"pid: {pid}", content, count=1)
        post_file.write_text(new_content, encoding="utf-8")
        return True

    # Insert pid after title line
    match = TITLE_PATTERN.search(content)
    if not match:
        print(f"Warning: No title found in {post_file.name}")
        return False

    end_pos = match.end()
    new_content = content[:end_pos] + f"\npid: {pid}" + content[end_pos:]

    post_file.write_text(new_content, encoding="utf-8")
    return True


def git_add_files(files: list[Path]) -> None:
    """Git add the modified files."""
    if not files:
        return
    file_paths = [str(f) for f in files]
    subprocess.run(["git", "add"] + file_paths, check=True)


def main() -> int:
    permalink = load_permalink()
    require_pid = ":pid" in permalink

    if not require_pid:
        print("Current permalink does not use :pid. No pid check needed.")
        return 0

    existing_pids = get_existing_pids()
    missing_files = []
    duplicates: dict[int, list[str]] = {}

    # Collect posts with and without pid
    for post_file in sorted(POSTS_DIR.glob("*.md")):
        content = post_file.read_text(encoding="utf-8")
        match = PID_PATTERN.search(content)
        if not match:
            # Treat empty pid: field same as missing pid
            missing_files.append(post_file)
            continue

        pid = int(match.group(1))
        duplicates.setdefault(pid, []).append(post_file.name)

    duplicate_items = {pid: names for pid, names in duplicates.items() if len(names) > 1}

    # Check for duplicates first (this is an error we can't auto-fix)
    if duplicate_items:
        print(f"Error: Duplicate pid detected in {len(duplicate_items)} value(s):")
        for pid, names in sorted(duplicate_items.items()):
            joined = ", ".join(names)
            print(f"  - pid {pid}: {joined}")
        print("Please fix duplicate pid values manually.")
        return 1

    # Auto-assign pid for missing files
    if missing_files:
        next_pid = get_next_pid(existing_pids)
        modified_files = []

        print(f"Auto-assigning pid to {len(missing_files)} post(s):")
        for post_file in missing_files:
            if add_pid_to_file(post_file, next_pid):
                print(f"  - {post_file.name}: pid {next_pid}")
                modified_files.append(post_file)
                existing_pids.add(next_pid)
                next_pid += 1

        # Git add modified files
        if modified_files:
            git_add_files(modified_files)
            print(f"Added {len(modified_files)} file(s) to git staging.")

    # Final check
    if not missing_files:
        print("OK: all posts have unique pid values.")

    return 0


if __name__ == "__main__":
    sys.exit(main())