(() => {
  'use strict';

  function initializeCodeBlocks() {
    document.querySelectorAll('.post-body figure.highlight, .post-body pre').forEach(block => {
      // 排除高亮块内部的 pre，以及由 Mermaid 接管的图表。
      if (block.parentElement.closest('figure.highlight, .code-block') ||
          block.matches('.mermaid') || block.querySelector('.mermaid')) return;

      const container = document.createElement('div');
      container.className = 'code-block';
      block.before(container);
      container.append(block);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-block-copy';
      button.textContent = '复制';
      button.setAttribute('aria-label', '复制代码');
      button.setAttribute('aria-live', 'polite');
      container.append(button);

      let resetTimer;
      button.addEventListener('click', async () => {
        // 只复制代码内容，排除标题、行号和按钮文字。
        const code = block.querySelector('.code pre, code') || block;
        const text = code.innerText;
        clearTimeout(resetTimer);
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = '已复制';
          button.setAttribute('aria-label', '代码已复制');
        } catch {
          button.textContent = '复制失败';
          button.setAttribute('aria-label', '复制失败，请选择代码后手动复制');
        }
        resetTimer = setTimeout(() => {
          button.textContent = '复制';
          button.setAttribute('aria-label', '复制代码');
        }, 2000);
      });
    });
  }

  initializeCodeBlocks();
  document.addEventListener('page:loaded', initializeCodeBlocks);
})();
