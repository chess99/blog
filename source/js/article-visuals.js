/* 文章模块的渐进增强；数据和领域文案由文章声明。 */
(() => {
  'use strict';
  function compareScores(first, second, threshold) {
    const sum = first + second;
    return { sum, mean: sum / 2, floored: Math.floor(sum / 2), required: threshold * 2, passes: sum >= threshold * 2 };
  }
  function scoreResult(first, second, threshold) {
    const result = compareScores(first, second, threshold);
    return `${result.passes ? '达到门槛' : '未达到门槛'} · ${first} + ${second} ${result.passes ? '≥' : '<'} ${result.required}；平均 ${result.mean}，向下取整 ${result.floored} 分。`;
  }
  function decayWeight(age, halfLife, windowHours) {
    return age >= windowHours ? 0 : 0.5 ** (age / halfLife);
  }
  // 构建器与浏览器共用相同算法，静态结果与交互结果保持一致。
  if (typeof module !== 'undefined' && module.exports) module.exports = { compareScores, scoreResult, decayWeight };
  if (typeof document === 'undefined') return;
  document.querySelectorAll('[data-score]:not([data-ready])').forEach(root => {
    root.dataset.ready = 'true';
    const form = root.querySelector('[data-score-form]');
    const update = () => {
      const first = Number(form.elements.first.value);
      const second = Number(form.elements.second.value);
      const threshold = Number(form.elements.tier.value);
      root.querySelector('[data-first-value]').textContent = first;
      root.querySelector('[data-second-value]').textContent = second;
      root.querySelector('[role="status"]').textContent = scoreResult(first, second, threshold);
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', event => event.preventDefault());
    update();
    form.hidden = false;
  });
  document.querySelectorAll('[data-decay]').forEach(root => {
    const halfLife = Number(root.dataset.halfLife);
    const windowHours = Number(root.dataset.window);
    const form = root.querySelector('[data-decay-form]');
    const update = () => {
      const age = Number(form.elements.age.value);
      const value = decayWeight(age, halfLife, windowHours);
      const percent = Number((value * 100).toFixed(1));
      form.querySelector('output').textContent = age >= windowHours
        ? `${age} 小时：已移出统计窗口，贡献为 0%。`
        : `${age} 小时：保留 ${percent}% 的贡献；到 ${windowHours} 小时时移出窗口。`;
      form.elements.age.setAttribute('aria-valuetext', `${age} 小时，贡献 ${percent}%`);
      root.querySelectorAll('svg').forEach(svg => {
        const left = Number(svg.dataset.left), right = Number(svg.dataset.right);
        const top = Number(svg.dataset.top), bottom = Number(svg.dataset.bottom);
        const x = left + age / windowHours * (right - left);
        root.dataset.age = age;
        svg.querySelector('[data-decay-point]').setAttribute('cx', x);
        svg.querySelector('[data-decay-point]').setAttribute('cy', bottom - value * (bottom - top));
        svg.querySelector('[data-decay-guide]').setAttribute('d', `M${x} ${top}V${bottom}`);
      });
    };
    form.addEventListener('input', update);
    form.addEventListener('submit', event => event.preventDefault());
    update();
    form.hidden = false;
  });
})();
