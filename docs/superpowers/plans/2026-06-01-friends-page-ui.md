# Friends Page UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh `/friends/` from a fixed-width card into an editorial-style friend link list that matches the existing NexT Gemini blog theme.

**Architecture:** Keep the page as a static Hexo page. Move presentation rules out of `source/friends/index.md` and into the existing site override stylesheet at `source/_data/styles.styl`, using the blog's Stylus variables and NexT CSS custom properties.

**Tech Stack:** Hexo 7.3, NexT 8.27/Gemini, Stylus overrides in `source/_data/styles.styl`, static HTML inside Markdown.

---

## File Structure

- Modify `source/friends/index.md`: keep front matter, remove inline `<style>`, add concise intro copy, and replace the card wrapper with a semantic list-like HTML structure.
- Modify `source/_data/styles.styl`: add a dedicated "Friends" section near the other page-level customizations, using existing theme variables for spacing, color, hover, focus, mobile, and dark mode.
- No new dependencies, templates, scripts, or data files.

## Task 1: Replace Inline Friend Page Markup

**Files:**
- Modify: `source/friends/index.md`

- [x] **Step 1: Replace the full file content**

Set `source/friends/index.md` to:

```markdown
---
title: 友情链接
comments: false
---

<p class="friends-intro">这里放一些我长期关注、也愿意推荐的技术博客。</p>

<div class="friend-list" aria-label="友情链接列表">
  <a class="friend-item" href="https://blog.xuewen.me/" target="_blank" rel="noopener">
    <img class="friend-avatar" src="https://blog.xuewen.me/img/avatar.jpg" alt="阿文">
    <span class="friend-content">
      <span class="friend-name">阿文</span>
      <span class="friend-desc">底层技术探索，HTTP、Linux、Nginx 等工程实践记录</span>
    </span>
    <span class="friend-arrow" aria-hidden="true">→</span>
  </a>
</div>
```

- [x] **Step 2: Confirm the removed inline style is gone**

Run:

```bash
rg -n "<style>|friend-cards|friend-card" source/friends/index.md
```

Expected: no matches and command exits with status `1`.

## Task 2: Add Theme-Level Friend Page Styles

**Files:**
- Modify: `source/_data/styles.styl`

- [x] **Step 1: Add the Friends style section**

Append this section after the existing Overview block and before the Waline Comment block in `source/_data/styles.styl`:

```stylus
/************************* Friends *************************/

.friends-intro {
  margin: 0 auto 24px;
  max-width: 34em;
  color: var(--blockquote-color);
  line-height: 1.8;
  text-align: left;
}

.friend-list {
  display: grid;
  margin: 0 auto;
  max-width: 680px;
}

.friend-item {
  position: relative;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  min-height: 82px;
  padding: 18px 2px;
  border-top: 1px solid rgba(0, 0, 0, .08);
  color: var(--text-color);
  text-decoration: none;
  transition: background .2s ease, border-color .2s ease, transform .2s ease;

  &:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, .08);
  }

  &:hover,
  &:focus {
    color: var(--text-color);
    border-bottom-color: transparent;
    outline: none;
    text-decoration: none;
    transform: translateX(3px);

    .friend-name,
    .friend-arrow {
      color: var(--link-hover-color);
    }

    .friend-arrow {
      transform: translateX(4px);
    }
  }

  &:focus-visible {
    border-radius: $myradius;
    box-shadow: 0 0 0 3px rgba(4, 119, 171, .2);
  }
}

.friend-avatar {
  width: 58px;
  height: 58px;
  border-radius: $myradius + 7px;
  object-fit: cover;
  background: var(--content-bg-color);
  box-shadow: 0 8px 20px rgba(0, 0, 0, .12);
  flex-shrink: 0;
}

.friend-content {
  display: grid;
  min-width: 0;
  gap: 5px;
}

.friend-name {
  color: var(--text-color);
  font-size: 1.05em;
  font-weight: 700;
  line-height: 1.35;
  transition: color .2s ease;
}

.friend-desc {
  color: var(--blockquote-color);
  font-size: .88em;
  line-height: 1.65;
}

.friend-arrow {
  color: var(--blockquote-color);
  font-size: 1.2em;
  line-height: 1;
  transition: color .2s ease, transform .2s ease;
}

+mobile() {
  .friends-intro {
    margin-bottom: 18px;
    max-width: none;
  }

  .friend-list {
    max-width: none;
  }

  .friend-item {
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 12px;
    min-height: 74px;
    padding: 15px 0;
    transform: none;

    &:hover,
    &:focus {
      transform: none;
    }
  }

  .friend-avatar {
    width: 48px;
    height: 48px;
    border-radius: $myradius + 4px;
  }

  .friend-arrow {
    display: none;
  }
}

@media (prefers-color-scheme: dark) {
  .friend-item {
    border-top-color: rgba(255, 255, 255, .1);

    &:last-child {
      border-bottom-color: rgba(255, 255, 255, .1);
    }

    &:focus-visible {
      box-shadow: 0 0 0 3px rgba(100, 154, 182, .28);
    }
  }

  .friend-avatar {
    box-shadow: 0 8px 18px rgba(0, 0, 0, .28);
  }
}
```

- [x] **Step 2: Check selector uniqueness**

Run:

```bash
rg -n "friend-list|friend-item|friends-intro" source/_data/styles.styl source/friends/index.md
```

Expected: matches appear only in `source/_data/styles.styl` and `source/friends/index.md`.

## Task 3: Build and Browser Verify

**Files:**
- Verify generated output under `public/`

- [x] **Step 1: Build the site**

Run:

```bash
npm run build
```

Expected: Hexo completes without errors.

- [x] **Step 2: Start local preview**

Run:

```bash
npm run server -- --port 4000
```

Expected: server reports `Hexo is running at http://localhost:4000/`.

- [x] **Step 3: Verify desktop layout**

Open `http://localhost:4000/friends/` in the browser at a desktop viewport.

Expected:

- Page title remains `友情链接`.
- Intro text is `这里放一些我长期关注、也愿意推荐的技术博客。`
- The friend link renders as a full-width editorial row rather than a fixed `320px` card.
- Avatar is rounded-square, name and description are vertically aligned, and the right arrow is visible.
- Hover changes name/arrow color and moves the row slightly without shifting surrounding layout.

- [x] **Step 4: Verify mobile layout**

Set the browser viewport to a mobile width such as `390x844`.

Expected:

- The row stays single-column within the page content.
- The arrow is hidden.
- Avatar is `48px` square.
- Text wraps without overlapping the avatar or page edge.

- [x] **Step 5: Verify dark mode styling**

Emulate `prefers-color-scheme: dark` in the browser.

Expected:

- Divider lines are visible but subtle.
- Text remains readable.
- Avatar shadow is not too heavy.
- Focus ring remains visible.

- [x] **Step 6: Commit the implementation**

Run:

```bash
git add source/friends/index.md source/_data/styles.styl
git commit -m "Refresh friends page UI"
```

Expected: pre-commit permalink and image checks pass, then the commit succeeds.
