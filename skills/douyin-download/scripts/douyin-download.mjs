#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_PARSER_URL = 'https://blog.aitoolwang.com/dy/';
const DEFAULT_PROXY = 'http://localhost:3456';
const DEFAULT_TIMEOUT_MS = 45_000;
const DEFAULT_CHUNK_SIZE = 1_048_576;

function usage() {
  console.log(`Usage:
  node skills/douyin-download/scripts/douyin-download.mjs <douyin-url> [options]

Options:
  --out-dir <dir>          Output directory. Default: ./douyin-download
  --filename <name>        Video filename. Default: video.mp4
  --parser-url <url>       Parser page. Default: ${DEFAULT_PARSER_URL}
  --proxy <url>            CDP proxy. Default: ${DEFAULT_PROXY}
  --timeout-ms <ms>        Parse timeout. Default: ${DEFAULT_TIMEOUT_MS}
  --chunk-size <bytes>     Browser fetch chunk size. Default: ${DEFAULT_CHUNK_SIZE}
  --media-url <url>        Skip parsing and download an already parsed media URL
  --keep-tab               Keep parser tab open
  --metadata-only          Parse metadata and media URLs without downloading
  --help                   Show this help
`);
}

function parseArgs(argv) {
  const opts = {
    outDir: path.resolve('douyin-download'),
    filename: 'video.mp4',
    parserUrl: DEFAULT_PARSER_URL,
    proxy: DEFAULT_PROXY,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    chunkSize: DEFAULT_CHUNK_SIZE,
    keepTab: false,
    metadataOnly: false,
  };

  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else if (arg === '--out-dir') {
      opts.outDir = path.resolve(readValue(argv, ++i, arg));
    } else if (arg === '--filename') {
      opts.filename = readValue(argv, ++i, arg);
    } else if (arg === '--parser-url') {
      opts.parserUrl = readValue(argv, ++i, arg);
    } else if (arg === '--proxy') {
      opts.proxy = readValue(argv, ++i, arg).replace(/\/$/, '');
    } else if (arg === '--timeout-ms') {
      opts.timeoutMs = parsePositiveInt(readValue(argv, ++i, arg), arg);
    } else if (arg === '--chunk-size') {
      opts.chunkSize = parsePositiveInt(readValue(argv, ++i, arg), arg);
    } else if (arg === '--media-url') {
      opts.mediaUrl = readValue(argv, ++i, arg);
    } else if (arg === '--keep-tab') {
      opts.keepTab = true;
    } else if (arg === '--metadata-only') {
      opts.metadataOnly = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  opts.inputUrl = positional[0];
  if (positional.length > 1) {
    throw new Error(`Unexpected extra arguments: ${positional.slice(1).join(' ')}`);
  }
  return opts;
}

function readValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function parsePositiveInt(value, flag) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

async function proxyGet(proxy, route, params = {}) {
  const url = new URL(route, `${proxy}/`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`CDP proxy ${route} failed: HTTP ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function proxyEval(proxy, target, code) {
  const url = new URL('/eval', `${proxy}/`);
  url.searchParams.set('target', target);
  const res = await fetch(url, {
    method: 'POST',
    body: code,
  });
  if (!res.ok) {
    throw new Error(`CDP eval failed: HTTP ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  if (json.exceptionDetails || json.error) {
    throw new Error(`CDP eval error: ${JSON.stringify(json.exceptionDetails || json.error)}`);
  }
  return json.value;
}

async function closeTab(proxy, target) {
  try {
    await proxyGet(proxy, '/close', { target });
  } catch (err) {
    console.warn(`Warning: failed to close parser tab ${target}: ${err.message}`);
  }
}

async function openParser(proxy, parserUrl) {
  const json = await proxyGet(proxy, '/new', { url: parserUrl });
  if (!json.targetId) {
    throw new Error(`Unexpected /new response: ${JSON.stringify(json)}`);
  }
  return json.targetId;
}

async function submitLink(proxy, target, inputUrl) {
  return proxyEval(
    proxy,
    target,
    `(() => {
      const input = document.querySelector('textarea.url-input');
      const button = document.querySelector('#startParse');
      if (!input || !button) {
        return { ok: false, reason: 'Parser input or start button not found', title: document.title, url: location.href };
      }
      input.value = ${JSON.stringify(inputUrl)};
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      button.click();
      return { ok: true, title: document.title, url: location.href };
    })()`,
  );
}

async function readParseState(proxy, target) {
  return proxyEval(
    proxy,
    target,
    `(() => {
      const video = document.querySelector('#videoPlayer') || document.querySelector('video');
      const title = document.querySelector('#videoTitle')?.textContent?.trim() || '';
      const imgList = [...document.querySelectorAll('#imgList img, .img-list img')]
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean)
        .filter((src, index, arr) => arr.indexOf(src) === index);
      const bodyText = document.body?.innerText || '';
      return {
        pageTitle: document.title,
        title,
        videoSrc: video?.currentSrc || video?.src || '',
        videoReadyState: video?.readyState ?? null,
        videoNetworkState: video?.networkState ?? null,
        videoError: video?.error ? { code: video.error.code, message: video.error.message } : null,
        imgList,
        visibleText: bodyText.slice(0, 1200),
      };
    })()`,
  );
}

async function waitForParse(proxy, target, timeoutMs) {
  const started = Date.now();
  let lastState = null;
  while (Date.now() - started < timeoutMs) {
    lastState = await readParseState(proxy, target);
    if (lastState.videoSrc || lastState.imgList.length > 0) {
      return lastState;
    }
    const visibleText = lastState.visibleText || '';
    if (visibleText.includes('今日解析次数已达上限')) {
      throw new Error('Parser quota reached: 今日解析次数已达上限. Retry after quota reset or use --media-url with a previously parsed media URL.');
    }
    if (visibleText.includes('请下载快抖下载器客户端使用')) {
      throw new Error('Parser requested the desktop client instead of returning a web result. Retry later or use --media-url with a previously parsed media URL.');
    }
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for parser result. Last state: ${JSON.stringify(lastState)}`);
}

async function getRemoteInfo(proxy, target, mediaUrl) {
  const result = await proxyEval(
    proxy,
    target,
    `(async () => {
      const res = await fetch(${JSON.stringify(mediaUrl)}, { headers: { Range: 'bytes=0-0' } });
      const buf = await res.arrayBuffer();
      return {
        ok: res.ok,
        status: res.status,
        contentType: res.headers.get('content-type'),
        contentRange: res.headers.get('content-range'),
        contentLength: res.headers.get('content-length'),
        bytesRead: buf.byteLength,
      };
    })()`,
  );
  if (!result.ok && result.status !== 206) {
    throw new Error(`Browser fetch could not read media: ${JSON.stringify(result)}`);
  }
  const rangeMatch = String(result.contentRange || '').match(/\/(\d+)$/);
  if (rangeMatch) {
    return {
      total: Number.parseInt(rangeMatch[1], 10),
      supportsRange: true,
      contentType: result.contentType,
    };
  }
  if (result.contentLength) {
    return {
      total: Number.parseInt(result.contentLength, 10),
      supportsRange: false,
      contentType: result.contentType,
    };
  }
  throw new Error(`Could not determine media size: ${JSON.stringify(result)}`);
}

async function fetchChunkBase64(proxy, target, mediaUrl, start, end) {
  return proxyEval(
    proxy,
    target,
    `(async () => {
      const res = await fetch(${JSON.stringify(mediaUrl)}, { headers: { Range: ${JSON.stringify(`bytes=${start}-${end}`)} } });
      if (!res.ok && res.status !== 206) {
        return { ok: false, status: res.status, text: (await res.text()).slice(0, 500) };
      }
      const bytes = new Uint8Array(await res.arrayBuffer());
      let binary = '';
      const step = 0x8000;
      for (let i = 0; i < bytes.length; i += step) {
        binary += String.fromCharCode(...bytes.subarray(i, i + step));
      }
      return {
        ok: true,
        status: res.status,
        contentRange: res.headers.get('content-range'),
        contentType: res.headers.get('content-type'),
        data: btoa(binary),
      };
    })()`,
  );
}

async function downloadViaBrowser(proxy, target, mediaUrl, outputPath, chunkSize) {
  const remote = await getRemoteInfo(proxy, target, mediaUrl);
  const total = remote.total;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const tmpPath = `${outputPath}.part`;
  const fd = fs.openSync(tmpPath, 'w');
  let written = 0;
  try {
    const ranges = remote.supportsRange
      ? rangePlan(total, chunkSize)
      : [{ start: 0, end: total - 1 }];
    for (const { start, end } of ranges) {
      const chunk = await fetchChunkBase64(proxy, target, mediaUrl, start, end);
      if (!chunk.ok) {
        throw new Error(`Chunk ${start}-${end} failed: ${JSON.stringify(chunk)}`);
      }
      const buf = Buffer.from(chunk.data, 'base64');
      fs.writeSync(fd, buf, 0, buf.length, start);
      written += buf.length;
      process.stderr.write(`Downloaded ${Math.min(end + 1, total)}/${total} bytes\\r`);
    }
  } finally {
    fs.closeSync(fd);
  }
  process.stderr.write('\\n');
  if (written !== total) {
    throw new Error(`Downloaded size mismatch: wrote ${written}, expected ${total}`);
  }
  fs.renameSync(tmpPath, outputPath);
  return { outputPath, bytes: total, contentType: remote.contentType };
}

function rangePlan(total, chunkSize) {
  const ranges = [];
  for (let start = 0; start < total; start += chunkSize) {
    ranges.push({ start, end: Math.min(start + chunkSize - 1, total - 1) });
  }
  return ranges;
}

async function downloadImages(proxy, target, imgList, outDir, chunkSize) {
  const outputs = [];
  for (let i = 0; i < imgList.length; i += 1) {
    const url = imgList[i];
    const ext = imageExtension(url);
    const outputPath = path.join(outDir, `image-${String(i + 1).padStart(3, '0')}${ext}`);
    outputs.push(await downloadViaBrowser(proxy, target, url, outputPath, chunkSize));
  }
  return outputs;
}

function imageExtension(url) {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const ext = path.extname(pathname);
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) return ext;
  } catch {}
  return '.jpg';
}

function writeMetadata(outDir, metadata) {
  fs.mkdirSync(outDir, { recursive: true });
  const metadataPath = path.join(outDir, 'metadata.json');
  fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
  return metadataPath;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    usage();
    return;
  }
  if (!opts.inputUrl) {
    if (!opts.mediaUrl) {
      usage();
      throw new Error('Missing Douyin URL');
    }
    opts.inputUrl = opts.mediaUrl;
  }

  let target = null;
  const metadata = {
    sourceUrl: opts.inputUrl,
    parserUrl: opts.parserUrl,
    parsedAt: new Date().toISOString(),
  };

  try {
    target = await openParser(opts.proxy, opts.parserUrl);
    metadata.targetId = target;
    const parsed = opts.mediaUrl
      ? {
          title: '',
          videoSrc: opts.mediaUrl,
          imgList: [],
          videoReadyState: null,
          videoNetworkState: null,
          videoError: null,
        }
      : await (async () => {
          const submitResult = await submitLink(opts.proxy, target, opts.inputUrl);
          if (!submitResult.ok) {
            throw new Error(`Parser page was not ready: ${JSON.stringify(submitResult)}`);
          }
          return waitForParse(opts.proxy, target, opts.timeoutMs);
        })();
    metadata.title = parsed.title;
    metadata.videoSrc = parsed.videoSrc;
    metadata.imgList = parsed.imgList;
    metadata.videoState = {
      readyState: parsed.videoReadyState,
      networkState: parsed.videoNetworkState,
      error: parsed.videoError,
    };

    const outputs = [];
    if (!opts.metadataOnly) {
      fs.mkdirSync(opts.outDir, { recursive: true });
      if (parsed.videoSrc) {
        const outputPath = path.join(opts.outDir, opts.filename);
        outputs.push(await downloadViaBrowser(opts.proxy, target, parsed.videoSrc, outputPath, opts.chunkSize));
      }
      if (parsed.imgList.length > 0) {
        outputs.push(...await downloadImages(opts.proxy, target, parsed.imgList, opts.outDir, opts.chunkSize));
      }
    }
    metadata.outputs = outputs;
    metadata.metadataPath = writeMetadata(opts.outDir, metadata);
    console.log(JSON.stringify(metadata, null, 2));
  } finally {
    if (target && !opts.keepTab) {
      await closeTab(opts.proxy, target);
    }
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
