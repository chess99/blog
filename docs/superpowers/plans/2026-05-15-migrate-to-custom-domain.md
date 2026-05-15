# Custom Domain Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update all configuration and content to reflect the new deployment URL change from `https://cearl.cc/blog` to `https://blog.cearl.cc`.

**Architecture:** Hexo static blog deployed to GitHub Pages with a custom domain (`blog.cearl.cc`). Previously served at `cearl.cc/blog` (subpath), now at `blog.cearl.cc` (subdomain root). This requires: (1) removing the `/blog/` root path from Hexo config, (2) adding a `CNAME` file so GitHub Pages knows the custom domain, and (3) updating hardcoded `cearl.cc/blog/...` URLs in post content to `blog.cearl.cc/...`.

**Tech Stack:** Hexo, GitHub Pages, YAML config, Markdown posts

---

## Affected Files

| File | Change |
|------|--------|
| `_config.yml` | `url` and `root` — remove `/blog` subpath |
| `source/CNAME` | Create — tells GitHub Pages the custom domain |
| `source/_posts/2026/04/20260418-qcon-2026-guide.md` | 18 hardcoded `cearl.cc/blog/posts/...` URLs → `blog.cearl.cc/posts/...` |

---

### Task 1: Update Hexo URL and root config

**Files:**
- Modify: `_config.yml:16-17`

**Background:** In Hexo, `url` is the full site URL and `root` is the path prefix for all generated asset/page links. When the site was at `cearl.cc/blog`, root had to be `/blog/`. Now that it's at the domain root, root must be `/`.

- [ ] **Step 1: Edit `_config.yml`**

Change lines 16–17 from:
```yaml
url: https://cearl.cc/blog
root: /blog/
```
to:
```yaml
url: https://blog.cearl.cc
root: /
```

- [ ] **Step 2: Verify the change**

```bash
grep -n "^url:\|^root:" _config.yml
```
Expected output:
```
16:url: https://blog.cearl.cc
17:root: /
```

- [ ] **Step 3: Commit**

```bash
git add _config.yml
git commit -m "feat: update site URL to blog.cearl.cc custom domain"
```

---

### Task 2: Add CNAME file for GitHub Pages

**Files:**
- Create: `source/CNAME`

**Background:** GitHub Pages reads a `CNAME` file from the root of the deployed site to know which custom domain to serve. Hexo copies everything from `source/` verbatim into `public/`, so placing `CNAME` in `source/` ensures it's always included in every deploy. Without this file, the custom domain setting in GitHub repository settings gets wiped on each deploy.

- [ ] **Step 1: Create `source/CNAME`**

```bash
echo "blog.cearl.cc" > source/CNAME
```

- [ ] **Step 2: Verify file content**

```bash
cat source/CNAME
```
Expected output:
```
blog.cearl.cc
```

- [ ] **Step 3: Commit**

```bash
git add source/CNAME
git commit -m "feat: add CNAME file for blog.cearl.cc custom domain"
```

---

### Task 3: Update hardcoded old URLs in post content

**Files:**
- Modify: `source/_posts/2026/04/20260418-qcon-2026-guide.md`

**Background:** This guide post contains 18 internal links using the old `https://cearl.cc/blog/posts/...` format. After the domain change, those links will 404 or redirect incorrectly. All must be updated to `https://blog.cearl.cc/posts/...`.

- [ ] **Step 1: Preview the replacements**

```bash
grep -n "cearl\.cc/blog" source/_posts/2026/04/20260418-qcon-2026-guide.md
```
Expected: 18 lines, all matching `https://cearl.cc/blog/posts/...`

- [ ] **Step 2: Perform the replacement**

```bash
sed -i '' 's|https://cearl\.cc/blog/|https://blog.cearl.cc/|g' \
  source/_posts/2026/04/20260418-qcon-2026-guide.md
```

- [ ] **Step 3: Verify no old URLs remain**

```bash
grep -c "cearl\.cc/blog" source/_posts/2026/04/20260418-qcon-2026-guide.md
```
Expected output: `0`

- [ ] **Step 4: Spot-check a few lines look correct**

```bash
grep -n "blog\.cearl\.cc/posts" source/_posts/2026/04/20260418-qcon-2026-guide.md | head -5
```
Expected: lines like `https://blog.cearl.cc/posts/qcon-2026-aiops-agentops/`

- [ ] **Step 5: Commit**

```bash
git add source/_posts/2026/04/20260418-qcon-2026-guide.md
git commit -m "fix: update internal links to new blog.cearl.cc domain"
```

---

### Task 4: Final verification

**Files:** None modified — read-only checks

- [ ] **Step 1: Confirm no remaining old-domain references in config or source**

```bash
grep -rn "cearl\.cc/blog" _config.yml _config.next.yml source/ 2>/dev/null | grep -v "Binary"
```
Expected output: empty (no matches)

- [ ] **Step 2: Confirm CNAME exists and is correct**

```bash
cat source/CNAME
```
Expected: `blog.cearl.cc`

- [ ] **Step 3: Confirm Hexo config looks right**

```bash
grep -n "^url:\|^root:" _config.yml
```
Expected:
```
16:url: https://blog.cearl.cc
17:root: /
```

- [ ] **Step 4: Run a local build to catch any generation errors**

```bash
hexo generate 2>&1 | tail -20
```
Expected: completes without errors, ends with `INFO  Files loaded in ...` and `INFO  Generated: ...`
