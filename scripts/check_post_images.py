#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote


REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = REPO_ROOT / "source"
POSTS_DIR = SOURCE_DIR / "_posts"

# These posts intentionally contain sample paths in docs text.
IGNORED_POSTS = {
    "005-Hexo博客插入图片.md",
}

IMAGE_LINK_PATTERN = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")


def normalize_markdown_target(raw_target: str) -> str:
    target = raw_target.strip().strip('"').strip("'").strip("<>")
    # Keep backward compatibility with links that append a title after URL.
    if " " in target and not target.startswith("<"):
        target = target.split(" ")[0]
    return unquote(target)


def is_remote_link(target: str) -> bool:
    return target.startswith(("http://", "https://", "data:"))


def resolve_candidates(post_file: Path, target: str) -> list[Path]:
    # Hexo post asset folder, e.g. foo.md -> foo/<asset>
    post_asset_dir = post_file.with_suffix("")

    if target.startswith("/"):
        return [SOURCE_DIR / target.lstrip("/")]

    return [
        post_file.parent / target,
        post_asset_dir / target,
    ]


def main() -> int:
    missing: list[tuple[str, str, list[str]]] = []
    checked = 0

    for post_file in sorted(POSTS_DIR.glob("*.md")):
        if post_file.name in IGNORED_POSTS:
            continue

        content = post_file.read_text(encoding="utf-8")
        for match in IMAGE_LINK_PATTERN.finditer(content):
            raw_target = match.group(1)
            target = normalize_markdown_target(raw_target)
            if is_remote_link(target):
                continue

            checked += 1
            candidates = resolve_candidates(post_file, target)
            if not any(candidate.exists() for candidate in candidates):
                missing.append(
                    (
                        post_file.name,
                        raw_target,
                        [str(path.relative_to(REPO_ROOT)) for path in candidates],
                    )
                )

    print(f"Checked image links: {checked}")
    if not missing:
        print("OK: no missing local image links found.")
        return 0

    print(f"Missing image links: {len(missing)}")
    for post, raw_target, candidates in missing:
        joined = " | ".join(candidates)
        print(f"- {post}: {raw_target} -> {joined}")

    return 1


if __name__ == "__main__":
    sys.exit(main())
