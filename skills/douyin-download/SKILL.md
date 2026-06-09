---
name: douyin-download
description: Download and extract public Douyin videos or image posts from user-provided douyin.com / v.douyin.com links. Use this skill whenever the user asks for 抖音下载, 抖音去水印, 抖音解析, 下载抖音视频, 保存抖音图集, or provides a Douyin video/share URL and wants local media files or media URLs.
---

# Douyin Download Skill

Use this skill to turn a user-provided public Douyin link into local media files and useful metadata.

## Scope

This skill supports:

- Single public Douyin video posts.
- Single public Douyin image/text posts.
- Long desktop URLs such as `https://www.douyin.com/video/...`.
- Mobile share links such as `https://v.douyin.com/...`.

This skill does not support:

- Batch downloads from a user homepage, favorites, likes, collections, topics, or search result pages.
- Background music extraction.
- Private, login-only, deleted, or otherwise inaccessible content.
- Bypassing access controls or platform restrictions.

Only download content the user provided and is allowed to use. If the content is for a blog draft, save raw media under `drafts/<slug>/` unless the user specifies another location. Do not commit downloaded videos/images unless the user explicitly asks to version them.

## Required Tooling

This workflow uses the `web-access` skill's Chrome CDP proxy. Before running the script, load and follow `web-access`, then run its dependency check:

```bash
node "$CLAUDE_SKILL_DIR/scripts/check-deps.mjs"
```

The proxy should be available at `http://localhost:3456`.

## Recommended Command

From the blog repository root:

```bash
node skills/douyin-download/scripts/douyin-download.mjs \
  "https://www.douyin.com/video/7631971197437201715?previous_page=app_code_link" \
  --out-dir drafts/context-rot/douyin
```

Outputs:

- `metadata.json` with title, source link, parsed media URLs, and output file paths.
- `video.mp4` for video posts.
- `image-001.jpg`, `image-002.jpg`, ... for image posts.

Optional flags:

```bash
--out-dir <dir>          Output directory. Default: ./douyin-download
--filename <name>        Video filename. Default: video.mp4
--parser-url <url>       Parser page. Default: https://blog.aitoolwang.com/dy/
--proxy <url>            CDP proxy. Default: http://localhost:3456
--timeout-ms <ms>        Parse timeout. Default: 45000
--chunk-size <bytes>     Browser fetch download chunk size. Default: 1048576
--media-url <url>        Skip parsing and download an already parsed media URL
--keep-tab               Keep the parser tab open for debugging
--metadata-only          Parse metadata and media URLs without downloading
```

## How It Works

Direct `curl` requests to Douyin pages often hit anti-bot JavaScript or CDN 403s. The parser page at `https://blog.aitoolwang.com/dy/` successfully handles single public links, but its API signing logic is obfuscated. The stable path is to operate the parser page inside the user's Chrome:

1. Open the parser page in a new background tab.
2. Fill `textarea.url-input` with the Douyin URL.
3. Click `#startParse`.
4. Poll the DOM for `#videoTitle`, `#videoPlayer.src`, and `#imgList img`.
5. Download promptly because returned media URLs are time-limited.

For some `douyinvod.com` media URLs, local `curl` can return 403 while browser `fetch` succeeds. The bundled script therefore downloads through the parser tab using Range requests and writes chunks to disk locally.

## Manual Fallback

If the script fails but the parser page shows a playable video:

1. Use CDP `/eval` to read `document.querySelector('#videoPlayer').src`.
2. Test browser-side access:

```js
fetch(videoUrl, { headers: { Range: 'bytes=0-1023' } })
```

3. If browser fetch succeeds and local curl fails, keep the browser-chunk download path or run the script with `--media-url`.
4. If the parser page reports an error, retry once with the original mobile share URL if available. If it still fails, tell the user the web parser cannot parse this item.

If the parser page says `今日解析次数已达上限`, stop retrying the parser. Reuse a media URL already captured in a previous successful parse, ask the user for another parser/source, or tell the user to wait for the parser quota to reset.

## Notes From Verification

Verified on 2026-06-09 with:

`https://www.douyin.com/video/7631971197437201715?previous_page=app_code_link`

The parser returned:

- Title beginning with `上下文腐烂 (Context rot) 其实是两种病`.
- A `douyinvod.com` `video/mp4` URL.
- No image list.

Local `curl` against the media URL returned 403, while browser-side Range `fetch` returned `206 video/mp4`, so browser-chunk downloading is required for this class of URLs.
