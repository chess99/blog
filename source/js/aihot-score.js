/* 源码口径：AIHOT b3998dc / industry/selection.ts 与 editorial/analyze.ts。 */
(() => {
  'use strict';
  const thresholds = { T1: 60, T1_5: 65, T2: 76 };
  document.querySelectorAll('[data-aihot-score]:not([data-ready])').forEach((root, index) => {
    root.dataset.ready = 'true';
    const id = `aihot-score-${index}`;
    root.innerHTML = `<h3>两次评分如何通过门槛</h3>
      <p>调整两个独立评分，比较同一材料在各信源等级的结果。</p>
      <form aria-label="评分参数">
        <label for="${id}-first">第一次评分 <output data-first-value>68</output></label>
        <input id="${id}-first" name="first" type="range" min="0" max="100" step="1" value="68">
        <label for="${id}-second">第二次评分 <output data-second-value>72</output></label>
        <input id="${id}-second" name="second" type="range" min="0" max="100" step="1" value="72">
        <label for="${id}-tier">信源等级</label>
        <select id="${id}-tier" name="tier"><option value="T1">T1 · 官方一手 · 60</option><option value="T1_5">T1.5 · 官方账号、准官方 · 65</option><option value="T2" selected>T2 · 媒体与个人 · 76</option></select>
        <p class="score-result" role="status" aria-live="polite" aria-atomic="true"></p>
      </form><p class="score-note">达到分数门槛后，仍需相关性、材料完整性、事实归组与新增价值检查。两次模型评分不会因改变此处的信源等级而重新生成。</p>`;
    const form = root.querySelector('form');
    const update = () => {
      const a = Number(form.elements.first.value);
      const b = Number(form.elements.second.value);
      const threshold = thresholds[form.elements.tier.value];
      root.querySelector('[data-first-value]').textContent = a;
      root.querySelector('[data-second-value]').textContent = b;
      const sum = a + b;
      root.querySelector('[role="status"]').textContent =
        `${sum >= 2 * threshold ? '达到分数门槛' : '未达到分数门槛'} · ${a} + ${b} ${sum >= 2 * threshold ? '≥' : '<'} ${2 * threshold}；平均 ${sum / 2}，页面显示 ${Math.floor(sum / 2)} 分。`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', event => event.preventDefault());
    update();
    root.hidden = false;
  });
})();
