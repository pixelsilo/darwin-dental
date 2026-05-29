// Populate Rich Text repeat blocks from structured headings
document.addEventListener('DOMContentLoaded', function () {
  function parseRichTextEntries(richText) {
    const entries = [];
    let current = null;

    Array.from(richText.children).forEach(function (node) {
      if (/^H[1-6]$/i.test(node.tagName)) {
        if (current) entries.push(current);
        current = {
          heading: node.textContent.trim(),
          bodyHTML: ''
        };
      } else if (current && node.nodeType === 1) {
        current.bodyHTML += node.outerHTML;
      }
    });

    if (current) entries.push(current);
    return entries;
  }

  function findContainer(element, itemSelector) {
    let node = element.parentElement;
    while (node) {
      if (node.querySelector(itemSelector)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function fillItem(item, entry, config, index) {
    const headingEl = item.querySelector(config.headingSelector);
    const bodyEl = item.querySelector(config.bodySelector);
    const numberEl = config.numberSelector ? item.querySelector(config.numberSelector) : null;

    if (headingEl) {
      headingEl.textContent = entry.heading || '';
    }

    if (bodyEl) {
      bodyEl.innerHTML = entry.bodyHTML || '';
    }

    if (numberEl) {
      numberEl.textContent = String(index != null ? index : '');
    }
  }

  function repeatRichTextBlock(config) {
    document.querySelectorAll(config.contentSelector).forEach(function (richText) {
      const container = findContainer(richText, config.itemSelector);
      const templateItem = container ? container.querySelector(config.itemSelector) : null;

      if (!container || !templateItem) return;

      const entries = parseRichTextEntries(richText);
      if (!entries.length) return;

      fillItem(templateItem, entries[0], config, 1);
      const parent = templateItem.parentNode;

      for (let i = 1; i < entries.length; i++) {
        const clone = templateItem.cloneNode(true);
        fillItem(clone, entries[i], config, i + 1);
        parent.appendChild(clone);
      }

      richText.style.display = 'none';
    });
  }

  repeatRichTextBlock({
    contentSelector: '[faq="content"]',
    itemSelector: '.accordion_item',
    headingSelector: '[faq="question"]',
    bodySelector: '.fs_accordion-2_body'
  });

  repeatRichTextBlock({
    contentSelector: '[journey="content"]',
    itemSelector: '[journey="item"], [journey="target"]',
    headingSelector: '[journey="heading"], [journey="title"], [journey="question"]',
    bodySelector: '[journey="text"], [journey="body"], [journey="answer"]',
    numberSelector: '[item="number"]'
  });

  repeatRichTextBlock({
    contentSelector: '[why="content"]',
    itemSelector: '[why="item"], [why="target"]',
    headingSelector: '[why="heading"], [why="title"], [why="question"]',
    bodySelector: '[why="text"], [why="body"], [why="answer"]',
    numberSelector: '[item="number"]'
  });

  function syncCheckboxLabelValues() {
    document.querySelectorAll('input[type="checkbox"][data-name="checkbox-name"]').forEach(function (input, index) {
      const label = input.closest('label');
      const labelTextEl = label ? label.querySelector('.w-form-label') : null;
      const text = labelTextEl ? labelTextEl.textContent.trim() : '';

      if (text) {
        input.value = text;
      }

      const baseName = input.getAttribute('name') || 'checkbox-name';
      const uniqueId = baseName.replace(/\s+/g, '-') + '-' + (index + 1);
      input.id = uniqueId;
      if (labelTextEl) {
        labelTextEl.setAttribute('for', uniqueId);
      }
    });
  }

  syncCheckboxLabelValues();
});