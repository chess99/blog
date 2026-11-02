'use strict';

const escape = value => String(value).replace(/[&<>"'{}]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '{': '&#123;', '}': '&#125;' }[char]));
const { scoreResult, decayWeight } = require('../../source/js/article-visuals');

function parseBlock(kind, body) {
  const rows = [];
  const fields = {};
  for (const line of body.split('\n').map(line => line.trim()).filter(Boolean)) {
    if (line.startsWith('note:')) fields.note = line.slice(5).trim();
    else if (kind === 'score' && !line.includes('|')) {
      const field = line.match(/^(first|second|selected|groupLabel|intro):\s*(.+)$/);
      if (!field) throw new Error(`score 字段无效：${line}`);
      fields[field[1]] = field[2];
    } else if (kind === 'decay') {
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
    if (kind === 'score') {
      fields.first = fields.first === undefined ? 0 : Number(fields.first);
      fields.second = fields.second === undefined ? 0 : Number(fields.second);
      fields.selected = fields.selected === undefined ? 0 : Number(fields.selected);
      if ([fields.first, fields.second].some(value => !Number.isInteger(value) || value < 0 || value > 100)) throw new Error('score 初始评分必须为0–100整数');
      if (!Number.isInteger(fields.selected) || fields.selected < 0 || fields.selected >= rows.length) throw new Error('score selected 超出等级列表');
      if (rows.some(row => !/^\d+$/.test(row[1]) || Number(row[1]) > 100)) throw new Error('score 门槛必须为0–100整数');
    }
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
  return `<svg class="decay-chart ${compact ? 'decay-chart-compact' : 'decay-chart-wide'}" viewBox="0 0 ${width} ${height}" role="img" aria-label="指数衰减：${halfLife}小时减半，${windowHours}小时后归零" data-left="${left}" data-right="${right}" data-top="${top}" data-bottom="${bottom}">${grid}${ticks}<path class="decay-line" d="${path}"/><path class="decay-cutoff" d="M${right} ${y(.5 ** (windowHours / halfLife))}V${bottom}"/><circle class="decay-end-open" cx="${right}" cy="${y(.5 ** (windowHours / halfLife))}" r="4"/><circle class="decay-end" cx="${right}" cy="${bottom}" r="4"/><path class="decay-guide" data-decay-guide d="M${cx} ${top}V${bottom}"/><circle class="decay-point" data-decay-point cx="${cx}" cy="${cy}" r="5"/></svg>`;
}

function renderScore(title, { rows, fields }, id) {
  const { first, second, selected } = fields;
  const options = rows.map(([label, value], index) => `<option value="${Number(value)}"${index === selected ? ' selected' : ''}>${escape(label)} · ${Number(value)}</option>`).join('');
  return `<section data-score aria-label="${escape(title)}"><h3>${escape(title)}</h3>${fields.intro ? `<p class="score-intro">${escape(fields.intro)}</p>` : ''}<form data-score-form hidden aria-label="评分参数"><div class="score-inputs"><div class="score-field"><label for="${id}-first">第一次评分 <output data-first-value>${first}</output></label><input id="${id}-first" name="first" type="range" min="0" max="100" step="1" value="${first}"></div><div class="score-field"><label for="${id}-second">第二次评分 <output data-second-value>${second}</output></label><input id="${id}-second" name="second" type="range" min="0" max="100" step="1" value="${second}"></div></div><label class="score-tier-label" for="${id}-tier">${escape(fields.groupLabel || '门槛等级')}</label><select id="${id}-tier" name="tier">${options}</select></form><p class="score-result" role="status" aria-live="polite" aria-atomic="true">${escape(scoreResult(first, second, Number(rows[selected][1])))}</p>${fields.note ? `<p class="score-note">${escape(fields.note)}</p>` : ''}</section>`;
}

function renderDecay(title, { fields }, id) {
  const { halfLifeHours: halfLife, windowHours } = fields;
  const samples = [0, halfLife / 2, halfLife, windowHours].filter((value, i, list) => value <= windowHours && list.indexOf(value) === i);
  const summary = `<dl class="decay-samples">${samples.map(age => `<div><dt>${age} 小时</dt><dd>${Number((decayWeight(age, halfLife, windowHours) * 100).toFixed(1))}%</dd></div>`).join('')}</dl>`;
  const interactive = `<form class="decay-control" data-decay-form hidden><label for="${id}-age">信号年龄</label><input id="${id}-age" name="age" type="range" min="0" max="${windowHours}" step="1" value="${Math.min(halfLife, windowHours)}" aria-describedby="${id}-result"><output id="${id}-result" role="status" aria-live="polite" aria-atomic="true"></output></form>`;
  return frame('decay', title, `<div data-decay data-half-life="${halfLife}" data-window="${windowHours}">${decaySvg(halfLife, windowHours, false)}${decaySvg(halfLife, windowHours, true)}${summary}${interactive}</div>`, fields.note);
}

/** 只处理白名单模块；保留代码围栏中的示例，数据错误在构建时报出。 */
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
    const start = !fence && line.match(/^:::(flow|bars|decay|score)\[([^\]]+)\]\s*$/);
    if (!start) { output.push(line); continue; }
    const kind = start[1];
    let end = i + 1;
    while (end < lines.length && lines[end].trim() !== ':::') end++;
    if (end === lines.length) throw new Error(`${kind} 模块未闭合`);
    const data = parseBlock(kind, lines.slice(i + 1, end).join('\n'));
    const title = start[2];
    const html = kind === 'flow' ? renderFlow(title, data) : kind === 'bars' ? renderBars(title, data) : kind === 'score' ? renderScore(title, data, `article-score-${count}`) : renderDecay(title, data, `article-decay-${count}`);
    output.push(`\n{% raw %}${html}{% endraw %}\n`);
    count++;
    i = end;
  }
  return { markdown: output.join('\n'), count };
}

module.exports = { compileArticleBlocks, decayWeight };
