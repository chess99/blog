(() => {
  'use strict';

  let active = null;
  let repositionQueued = false;

  function closeCitation(restoreFocus = false) {
    if (!active) return;
    const { wrapper, button } = active;
    wrapper.removeAttribute('data-citation-open');
    button.setAttribute('aria-expanded', 'false');
    active = null;
    if (restoreFocus) button.focus();
  }

  function positionCitation() {
    if (!active) return;
    const { wrapper, button, popup } = active;
    const edge = 12;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = window.innerHeight;
    const mobile = viewportWidth <= 600;
    const article = wrapper.closest('.post-body');
    const column = article && article.getBoundingClientRect();
    const columnLeft = column && column.width ? Math.max(edge, column.left) : edge;
    const columnRight = column && column.width ? Math.min(viewportWidth - edge, column.right) : viewportWidth - edge;
    const available = Math.max(0, columnRight - columnLeft);
    const width = mobile ? viewportWidth - edge * 2 : Math.min(320, available);
    popup.style.width = `${Math.max(0, width)}px`;
    popup.style.maxHeight = `${Math.max(0, viewportHeight - edge * 2)}px`;
    const trigger = button.getBoundingClientRect();
    const box = popup.getBoundingClientRect();
    const left = mobile ? edge : Math.max(columnLeft, Math.min(trigger.left, columnRight - width));
    let top;
    if (mobile) top = Math.max(edge, viewportHeight - box.height - 16);
    else {
      const below = trigger.bottom + 8;
      top = below + box.height <= viewportHeight - edge ? below : trigger.top - box.height - 8;
      top = Math.max(edge, Math.min(top, viewportHeight - box.height - edge));
    }
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.right = 'auto';
    popup.style.bottom = 'auto';
  }

  function initializeCitations() {
    document.querySelectorAll('.article-citation').forEach((wrapper, index) => {
      if (wrapper.hasAttribute('data-citation-enhanced')) return;
      const button = wrapper.querySelector('button.article-citation-label');
      const popup = wrapper.querySelector('.article-citation-popup');
      if (!button || !popup) return;
      if (!popup.id) {
        let suffix = index;
        while (document.getElementById(`article-citation-popup-${suffix}`)) suffix++;
        popup.id = `article-citation-popup-${suffix}`;
      }
      wrapper.setAttribute('data-citation-enhanced', '');
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', popup.id);
      popup.setAttribute('role', 'group');
      popup.setAttribute('aria-label', '引用来源');
      button.addEventListener('click', () => {
        if (active && active.wrapper === wrapper) {
          closeCitation();
          return;
        }
        closeCitation();
        active = { wrapper, button, popup };
        wrapper.setAttribute('data-citation-open', '');
        button.setAttribute('aria-expanded', 'true');
        positionCitation();
      });
      wrapper.addEventListener('focusout', event => {
        if (active && active.wrapper === wrapper && event.relatedTarget && !wrapper.contains(event.relatedTarget)) closeCitation();
      });
    });
  }

  document.addEventListener('click', event => {
    if (active && !active.wrapper.contains(event.target)) closeCitation();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) {
      event.preventDefault();
      closeCitation(true);
    }
  });
  const schedulePosition = () => {
    if (!active || repositionQueued) return;
    repositionQueued = true;
    requestAnimationFrame(() => {
      repositionQueued = false;
      positionCitation();
    });
  };
  window.addEventListener('resize', schedulePosition);
  window.addEventListener('scroll', schedulePosition, true);
  initializeCitations();
  document.addEventListener('page:loaded', initializeCitations);
})();
