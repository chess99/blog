'use strict';

const escape = value => String(value).replace(/[&<>"'{}]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;' }[char]));
const supported = new Set(['flow', 'bars', 'decay']);

function parseBlock(kind, body) {
  const rows = [];
  const fields = {};
  for (const line of body.split('\n').map(line => line.trim()).filter(Boolean)) {
    if (line.startsWith('note:')) fields.note = line.slice(5).trim();
    else if (kind === 'decay') {
      const field = line.match(/^(halfLifeHours|windowHours):\s*(\d+(?:\.\d+)?)$/);
      if (!field) throw new Error(`decay 字段无效：${line}`);
      fields[field[1]] = Number(field[2]);
    } else rows.push(line.split('|').map(part => part.trim()));
  }
  if (kind === 'decay') {
    if (!(fields.halfLifeHours > 0 && fields.windowHours > 0 && fields.windowHours <= 168)) throw new Error('decay 需要正数 halfLifeHours 和至多168小时的 windowHours');
  } else {
    const limit = kind === 'flow' ? 5 : 8;
    if (!rows.length || rows.length > limit) throw new Error(`${kind} 需要1–${limit}行数据`);
    if (rows.some(row => row.length !== 2 || !row[0] || !row[1])) throw new Error(`${kind} 每行需要两个非空字段`);
    if (kind === 'bars' && rows.some(row => !/^\d+(?:\.\d+)?$/.test(row[1]))) throw new Error('bars 数值必须是非负数');
    if (kind === 'bars' && rows.reduce((sum, row) => sum + Number(row[1]), 0) === 0) throw new Error('bars 总数必须大于0');
  }
  return { rows, fields };
}

function frame(kind, title, content, note) {
  return `<figure class="article-viz article-viz-${kind}"><figcaption class="article-viz-title">${escape(title)}</figcaption>${content}${note ? `<p class="article-viz-note">${escape(note)}</p>` : ''}</figure>`;
}

function renderFlow(title, { rows, fields }) {
  return frame('flow', title, `<ol class="article-flow" style="--flow-count:${rows.length}">${rows.map(([label, detail], index) => `<li><span class="article-flow-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><strong>${escape(label)}</strong><span>${escape(detail)}</span></li>`).join('')}</ol>`, fields.note);
}

function renderBars(title, { rows, fields }) {
  const total = rows.reduce((sum, row) => sum + Number(row[1]), 0);
  return frame('bars', title, `<dl class="article-bars">${rows.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd><span class="article-bar-track" aria-hidden="true"><span style="width:${Number(value) / total * 100}%"></span></span><span class="article-bar-value">${escape(value)}<small> / ${total}</small></span></dd></div>`).join('')}</dl>`, fields.note);
}

function decayWeight(age, halfLife, windowHours) {
  return age >= windowHours ? 0 : 0.5 ** (age / halfLife);
}

function decaySvg(halfLife, windowHours, compact) {
  const width = compact ? 360 : 720;
  const height = compact ? 260 : 290;
  const left = 58;
  const right = width - 22;
  const top = 24;
  const bottom = height - 38;
  const x = age => left + age / windowHours * (right - left);
  const y = value => bottom - value * (bottom - top);
  const grid = [0, .5, 1].map(value => `<path class="viz-grid-line" d="M${left} ${y(value)}H${right}"/><text x="${left - 9}" y="${y(value) + 5}" text-anchor="end">${value * 100}%</text>`).join('');
  const ticks = (compact ? [0, .5, 1] : [0, .25, .5, .75, 1]).map(part => `<text x="${x(part * windowHours)}" y="${bottom + 27}" text-anchor="middle">${part * windowHours}h</text>`).join('');
  const path = Array.from({ length: 97 }, (_, index) => {
    const age = index / 96 * windowHours;
    return `${index ? 'L' : 'M'}${x(age).toFixed(2)} ${y(.5 ** (age / halfLife)).toFixed(2)}`;
  }).join(' ');
  const age = Math.min(halfLife, windowHours);
  const cx = x(age), cy = y(decayWeight(age, halfLife, windowHours));
  return `<svg class="decay-chart ${compact ? 'decay-chart-compact' : 'decay-chart-wide'}" viewBox="0 0 ${width} ${height}" role="img" aria-label="单个参与方的理论贡献：${halfLife}小时减半，${windowHours}小时移出窗口" data-left="${left}" data-right="${right}" data-top="${top}" data-bottom="${bottom}">${grid}${ticks}<path class="decay-line" d="${path}"/><path class="decay-cutoff" d="M${right} ${y(.5 ** (windowHours / halfLife))}V${bottom}"/><circle class="decay-end-open" cx="${right}" cy="${y(.5 ** (windowHours / halfLife))}" r="4"/><circle class="decay-end" cx="${right}" cy="${bottom}" r="4"/><path class="decay-guide" data-decay-guide d="M${cx} ${top}V${bottom}"/><circle class="decay-point" data-decay-point cx="${cx}" cy="${cy}" r="5"/></svg>`;
}

function renderDecay(title, { fields }, id) {
  const { halfLifeHours: halfLife, windowHours } = fields;
  const samples = [0, halfLife / 2, halfLife, windowHours].filter((value, i, list) => value <= windowHours && list.indexOf(value) === i);
  const summary = `<dl class="decay-samples">${samples.map(age => `<div><dt>${age} 小时</dt><dd>${Number((decayWeight(age, halfLife, windowHours) * 100).toFixed(1))}%</dd></div>`).join('')}</dl>`;
  const interactive = `<form class="decay-control" data-decay-form hidden><label for="${id}-age">信号年龄</label><input id="${id}-age" name="age" type="range" min="0" max="${windowHours}" step="1" value="${Math.min(halfLife, windowHours)}" aria-describedby="${id}-result"><output id="${id}-result" role="status" aria-live="polite" aria-atomic="true"></output></form>`;
  return frame('decay', title, `<div data-decay data-half-life="${halfLife}" data-window="${windowHours}">${decaySvg(halfLife, windowHours, false)}${decaySvg(halfLife, windowHours, true)}${summary}${interactive}</div>`, fields.note);
}

/** 只处理白名单模块；保留代码围栏中的示例，拼写错误和数据错误在构建时报出。 */
function compileArticleBlocks(markdown) {
  const lines = markdown.split('\n');
  const output = [];
  let fence = null;
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const boundary = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
    if (boundary) {
      if (!fence) fence = { char: boundary[1][0], length: boundary[1].length };
      else if (boundary[1][0] === fence.char && boundary[1].length >= fence.length && !boundary[2].trim()) fence = null;
      output.push(line); continue;
    }
    const start = !fence && line.match(/^:::(flow|bars|decay)\[([^\]]+)\]\s*$/);
    if (!start) { output.push(line); continue; }
    const kind = start[1];
    if (!supported.has(kind)) throw new Error(`未知模块：${kind}`);
    let end = i + 1;
    while (end < lines.length && lines[end].trim() !== ':::') end++;
    if (end === lines.length) throw new Error(`${kind} 模块未闭合`);
    const data = parseBlock(kind, lines.slice(i + 1, end).join('\n'));
    const title = start[2];
    const html = kind === 'flow' ? renderFlow(title, data) : kind === 'bars' ? renderBars(title, data) : renderDecay(title, data, `article-decay-${count}`);
    output.push(`\n{% raw %}${html}{% endraw %}\n`);
    count++;
    i = end;
  }
  return { markdown: output.join('\n'), count };
}

module.exports = { compileArticleBlocks, decayWeight };
