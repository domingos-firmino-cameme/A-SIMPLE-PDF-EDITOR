// Builder.js v1.0.0 

// Heading
const selectHeadingInput = document.getElementById('headingInput');
const selectSheet = document.getElementById('documentSheet');
const selectAddHeading = document.getElementById('btnAddHeading');
const livePreviews = new WeakMap();

function bindLivePreview(form, createPreview, updatePreview, hasContent) {
    const update = () => {
        if (!hasContent()) {
            livePreviews.get(form)?.element.remove();
            livePreviews.delete(form);
            return;
        }

        let preview = livePreviews.get(form);
        if (!preview) {
            const element = createPreview();
            selectSheet.appendChild(element);
            preview = { element, update: updatePreview };
            livePreviews.set(form, preview);
        }
        preview.update(preview.element);
    };

    form.addEventListener('input', update);
    form.addEventListener('change', update);
}

function commitLivePreview(form) {
    const preview = livePreviews.get(form);
    if (!preview) return false;

    preview.update(preview.element);
    preview.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    livePreviews.delete(form);
    return true;
}

function cancelLivePreview(form) {
    livePreviews.get(form)?.element.remove();
    livePreviews.delete(form);
}

function isHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function createMetadataPreview() {
    const section = document.createElement('section');
    section.classList.add('metadata-section');
    section.setAttribute('aria-label', 'Document Metadata');
    section.appendChild(document.createElement('dl'));
    section.querySelector('dl').classList.add('metadata-list');
    return section;
}

function renderMetadataPreview(section, fields) {
    const list = section.querySelector('dl');
    list.replaceChildren();
    fields.forEach(({ label, value }) => {
        if (!value) return;
        const term = document.createElement('dt');
        term.textContent = label;
        const description = document.createElement('dd');
        description.textContent = value;
        list.append(term, description);
    });
}

function metadataInputFields() {
    return [
        { label: 'Course:', value: document.getElementById('metadataCourse').value },
        { label: 'Institution:', value: document.getElementById('metadataInstitution').value },
        { label: 'Academic Year:', value: document.getElementById('metadataAcademicYear').value },
        { label: 'Module:', value: document.getElementById('metadataModule').value },
        { label: 'Document ID', value: document.getElementById('metadataDocumentID').value },
        { label: 'Issued By:', value: document.getElementById('metadataIssuedBy').value },
        { label: 'Date', value: document.getElementById('metadataDate').value },
        { label: 'Program:', value: document.getElementById('metadataProgram').value },
        { label: 'Status:', value: document.getElementById('metadataStatus').value }
    ];
}

const createHeaderBlock = () => {
    const headerBlock = document.createElement('div');
    headerBlock.classList.add('document-header-block');

    const newHeading = document.createElement('h2');
    newHeading.classList.add('document-heading');
    newHeading.textContent = selectHeadingInput?.value || '';
    headerBlock.hidden = !newHeading.textContent.trim();

    headerBlock.appendChild(newHeading);
    return { headerBlock, newHeading };
};

const headingBlock = createHeaderBlock();
const updateDocumentHeading = (value) => {
    headingBlock.newHeading.textContent = value;
    headingBlock.headerBlock.hidden = !value.trim();
};

if (selectSheet) {
    selectSheet.appendChild(headingBlock.headerBlock);
}

if (selectHeadingInput) {
    selectHeadingInput.addEventListener('input', function () {
        updateDocumentHeading(selectHeadingInput.value);
    });
}


const triggerModal = (selector) => {
    const target = document.querySelector(selector);
    if (!target) return;
    target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

const headerActionButtons = document.querySelectorAll('[data-header-action]');
headerActionButtons.forEach(button => {
    button.addEventListener('click', function () {
        const action = this.dataset.headerAction;

        if (action === 'document') {
            const modal = document.getElementById('modalDocumentSettings');
            if (modal) {
                document.querySelectorAll('.tool-modal').forEach(m => m.hidden = true);
                const toolEmptyState = document.getElementById('toolEmptyState');
                if (toolEmptyState) toolEmptyState.hidden = true;
                modal.hidden = false;
                modal.querySelector('input, select')?.focus();
            }
        }

        if (action === 'layout') {
            const modal = document.getElementById('modalLayoutSettings');
            if (modal) {
                document.querySelectorAll('.tool-modal').forEach(m => m.hidden = true);
                const toolEmptyState = document.getElementById('toolEmptyState');
                if (toolEmptyState) toolEmptyState.hidden = true;
                modal.hidden = false;
                modal.querySelector('input, select')?.focus();
            }
        }

        if (action === 'tools') {
            const modal = document.getElementById('modalQuickActions');
            if (modal) {
                document.querySelectorAll('.tool-modal').forEach(m => m.hidden = true);
                const toolEmptyState = document.getElementById('toolEmptyState');
                if (toolEmptyState) toolEmptyState.hidden = true;
                modal.hidden = false;
                modal.querySelector('select')?.focus();
            }
        }

        if (action === 'export') {
            const modal = document.getElementById('modalExportOptions');
            if (modal) {
                document.querySelectorAll('.tool-modal').forEach(m => m.hidden = true);
                const toolEmptyState = document.getElementById('toolEmptyState');
                if (toolEmptyState) toolEmptyState.hidden = true;
                modal.hidden = false;
                modal.querySelector('select')?.focus();
            }
        }

        if (action === 'save') {
            const modal = document.getElementById('modalSaveOptions');
            if (modal) {
                document.querySelectorAll('.tool-modal').forEach(m => m.hidden = true);
                const toolEmptyState = document.getElementById('toolEmptyState');
                if (toolEmptyState) toolEmptyState.hidden = true;
                modal.hidden = false;
                modal.querySelector('select')?.focus();
            }
        }
    });
});

// Subtitle
const selectSubtitleInput = document.getElementById('subtitleInput');
const selectAddSubtitle = document.getElementById('btnAddSubtitle');

const newSubtitle = document.createElement('h3');
newSubtitle.classList.add('document-subtitle');
newSubtitle.textContent = selectSubtitleInput.value;

selectSheet.appendChild(newSubtitle);

selectSubtitleInput.addEventListener('input', function () {
    newSubtitle.textContent = selectSubtitleInput.value;
});

const documentSettingsModal = document.getElementById('modalDocumentSettings');
if (documentSettingsModal) {
    const titleInput = document.getElementById('documentTitleInput');
    const authorInput = document.getElementById('documentAuthorInput');
    const typeInput = document.getElementById('documentTypeInput');
    const settingsMetadata = [
        { label: 'Author:', input: authorInput },
        { label: 'Document type:', input: typeInput }
    ];

    titleInput?.addEventListener('input', function () {
        updateDocumentHeading(titleInput.value || selectHeadingInput.value);
    });
    bindLivePreview(
        documentSettingsModal,
        createMetadataPreview,
        section => renderMetadataPreview(section, settingsMetadata.map(({ label, input }) => ({ label, value: input.value }))),
        () => settingsMetadata.some(({ input }) => input.value)
    );

    documentSettingsModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) {
            if (titleInput && titleInput.value.trim()) {
                selectHeadingInput.value = titleInput.value.trim();
                updateDocumentHeading(selectHeadingInput.value);
            }
            if (authorInput && authorInput.value.trim()) {
                document.getElementById('metadataIssuedBy').value = authorInput.value.trim();
            }
            if (typeInput && typeInput.value) {
                document.getElementById('metadataProgram').value = typeInput.value;
            }
            return;
        }

        if (titleInput && titleInput.value.trim()) {
            const headingInput = document.getElementById('headingInput');
            if (headingInput) {
                headingInput.value = titleInput.value.trim();
                updateDocumentHeading(headingInput.value);
            }
        }

        if (authorInput && authorInput.value.trim()) {
            const metadataIssuedBy = document.getElementById('metadataIssuedBy');
            if (metadataIssuedBy) metadataIssuedBy.value = authorInput.value.trim();
        }

        if (typeInput && typeInput.value) {
            const metadataProgram = document.getElementById('metadataProgram');
            if (metadataProgram) metadataProgram.value = typeInput.value;
        }

        document.querySelectorAll('.tool-modal').forEach(modal => modal.hidden = true);
        const toolEmptyState = document.getElementById('toolEmptyState');
        if (toolEmptyState) toolEmptyState.hidden = false;
    });
}

const layoutSettingsModal = document.getElementById('modalLayoutSettings');
if (layoutSettingsModal) {
    layoutSettingsModal.addEventListener('submit', function (e) {
        e.preventDefault();
        const preset = document.getElementById('layoutPresetInput')?.value || 'standard';
        const margin = document.getElementById('layoutMarginInput')?.value || '20';

        if (selectSheet) {
            selectSheet.setAttribute('data-layout-preset', preset);
            selectSheet.style.padding = `${margin}px`;
        }

        document.querySelectorAll('.tool-modal').forEach(modal => modal.hidden = true);
        const toolEmptyState = document.getElementById('toolEmptyState');
        if (toolEmptyState) toolEmptyState.hidden = false;
    });
}

const quickActionsModal = document.getElementById('modalQuickActions');
if (quickActionsModal) {
    quickActionsModal.addEventListener('submit', function (e) {
        e.preventDefault();
        const action = document.getElementById('quickActionSelect')?.value;

        const actionMap = {
            paragraph: 'modalParagraph',
            spacing: 'modalVerticalSpacing',
            subtitle: 'modalSubtitle',
            subheading: 'modalSubheading',
            image: 'modalImage',
            resizeImage: 'modalResizeImage',
            textSize: 'modalTextSize',
            table: 'modalTable',
            code: 'modalCode',
            italic: 'modalItalic',
            bold: 'modalBold',
            highlight: 'modalHighlight',
            list: 'modalList',
            link: 'modalLink',
            metadata: 'modalMetadata'
        };

        if (action === 'select') {
            setSelectionEditMode(true);
            document.querySelectorAll('.tool-modal').forEach(modal => modal.hidden = true);
            const toolEmptyState = document.getElementById('toolEmptyState');
            if (toolEmptyState) toolEmptyState.hidden = false;
            return;
        }

        const targetId = actionMap[action];
        if (targetId) {
            const modal = document.getElementById(targetId);
            if (modal) {
                document.querySelectorAll('.tool-modal').forEach(m => m.hidden = true);
                const toolEmptyState = document.getElementById('toolEmptyState');
                if (toolEmptyState) toolEmptyState.hidden = true;
                modal.hidden = false;
                modal.querySelector('input, textarea, select')?.focus();
            }
        }
    });
}

const resizeImageModal = document.getElementById('modalResizeImage');
if (resizeImageModal) {
    const imageChoices = document.getElementById('resizeImageChoices');
    const widthInput = document.getElementById('resizeImageWidth');
    const widthValue = document.getElementById('resizeImageWidthValue');
    const emptyMessage = document.getElementById('resizeImageEmptyMessage');
    const applyButton = document.getElementById('applyImageResize');
    const deleteButton = document.getElementById('deleteSelectedImage');
    const originalDimensions = new Map();
    let images = [];

    const rememberOriginalDimensions = image => {
        if (!originalDimensions.has(image)) {
            originalDimensions.set(image, {
                width: image.style.width,
                height: image.style.height
            });
        }
    };

    const restoreOriginalDimensions = () => {
        originalDimensions.forEach((dimensions, image) => {
            image.style.width = dimensions.width;
            image.style.height = dimensions.height;
        });
        originalDimensions.clear();
    };

    const selectedIndex = () => {
        const selected = imageChoices.querySelector('input:checked');
        return selected ? Number(selected.value) : -1;
    };
    const selectedImage = () => images[selectedIndex()] || null;

    const getImageWidth = image => {
        if (image.style.width.endsWith('%')) return Number.parseFloat(image.style.width);
        const sheetWidth = selectSheet.getBoundingClientRect().width;
        return sheetWidth ? image.getBoundingClientRect().width / sheetWidth * 100 : 100;
    };

    const showSelectedImageWidth = () => {
        const image = selectedImage();
        const width = image ? Math.max(10, Math.min(100, Math.round(getImageWidth(image)))) : 100;
        widthInput.value = String(width);
        widthValue.value = `${width}%`;
        widthValue.textContent = `${width}%`;
    };

    const setImageWidth = () => {
        const image = selectedImage();
        const width = Number(widthInput.value);
        widthValue.value = `${width}%`;
        widthValue.textContent = `${width}%`;
        if (!image) return;
        rememberOriginalDimensions(image);
        image.style.width = `${width}%`;
        image.style.height = 'auto';
    };

    const updateImageOptions = () => {
        const previousIndex = selectedIndex();
        images = [...selectSheet.querySelectorAll(':scope > img')];
        imageChoices.replaceChildren();

        images.forEach((image, index) => {
            const label = document.createElement('label');
            label.className = 'resize-image-choice';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'resizeImageChoice';
            radio.value = String(index);
            radio.checked = index === Math.min(Math.max(previousIndex, 0), images.length - 1);

            const thumbnail = document.createElement('img');
            thumbnail.className = 'resize-image-thumbnail';
            thumbnail.src = image.currentSrc || image.src;
            thumbnail.alt = '';

            const details = document.createElement('span');
            details.className = 'resize-image-details';
            const description = image.alt.trim();
            const title = document.createElement('strong');
            title.textContent = description && description !== 'Inserted image'
                ? `Image ${index + 1} - ${description}`
                : `Image ${index + 1}`;
            const dimensions = document.createElement('small');
            dimensions.textContent = image.naturalWidth && image.naturalHeight
                ? `${image.naturalWidth} x ${image.naturalHeight} px`
                : image.src.split('/').pop()?.split(/[?#]/)[0] || 'Uploaded image';
            details.append(title, dimensions);
            label.append(radio, thumbnail, details);
            imageChoices.appendChild(label);
        });

        const hasImages = images.length > 0;
        imageChoices.setAttribute('aria-disabled', String(!hasImages));
        widthInput.disabled = !hasImages;
        applyButton.disabled = !hasImages;
        deleteButton.disabled = !hasImages;
        emptyMessage.hidden = hasImages;
        showSelectedImageWidth();
    };

    imageChoices.addEventListener('change', event => {
        if (event.target instanceof HTMLInputElement && event.target.name === 'resizeImageChoice') {
            showSelectedImageWidth();
        }
    });
    widthInput.addEventListener('input', setImageWidth);
    deleteButton.addEventListener('click', () => {
        const image = selectedImage();
        if (!image) return;
        originalDimensions.delete(image);
        image.remove();
        updateImageOptions();
    });
    window.addEventListener('toolroutechange', event => {
        if (event.detail.slug === 'resize-image') updateImageOptions();
    });

    resizeImageModal.addEventListener('submit', function (event) {
        event.preventDefault();
        originalDimensions.clear();
        selectedImage()?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    resizeImageModal.querySelector('[data-action="cancel"]')?.addEventListener('click', restoreOriginalDimensions);

    if (window.location.hash.toLowerCase() === '#tool/resize-image') updateImageOptions();
}

const verticalSpacingModal = document.getElementById('modalVerticalSpacing');
if (verticalSpacingModal) {
    const spacingInput = document.getElementById('verticalSpacingInput');
    const spacingValue = document.getElementById('verticalSpacingValue');
    const renderSpacing = preview => {
        const height = Number(spacingInput.value);
        preview.classList.add('document-spacer');
        preview.style.height = `${height}px`;
        preview.setAttribute('aria-label', `Vertical spacing, ${height} pixels`);
        spacingValue.value = `${height} px`;
        spacingValue.textContent = `${height} px`;
    };
    bindLivePreview(
        verticalSpacingModal,
        () => document.createElement('div'),
        renderSpacing,
        () => Number(spacingInput.value) > 0
    );
    verticalSpacingModal.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!commitLivePreview(this)) {
            const spacer = document.createElement('div');
            renderSpacing(spacer);
            selectSheet.appendChild(spacer);
            spacer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

const subheadingModal = document.getElementById('modalSubheading');
if (subheadingModal) {
    bindLivePreview(subheadingModal, () => document.createElement('h4'), preview => {
        preview.classList.add('document-subheading');
        preview.textContent = document.getElementById('subheadingInput').value.trim();
    }, () => Boolean(document.getElementById('subheadingInput').value.trim()));
}

const paragraphModal = document.getElementById('modalParagraph');
if (paragraphModal) {
    bindLivePreview(paragraphModal, () => {
        const paragraph = document.createElement('p');
        paragraph.classList.add('document-paragraph');
        return paragraph;
    }, preview => {
        preview.textContent = document.getElementById('paragraphInput').value.trim();
    }, () => Boolean(document.getElementById('paragraphInput').value.trim()));
}

const imageModal = document.getElementById('modalImage');
if (imageModal) {
    bindLivePreview(imageModal, () => {
        const image = document.createElement('img');
        image.classList.add('document-image');
        image.alt = 'Inserted image';
        image.style.maxWidth = '100%';
        image.style.height = 'auto';
        return image;
    }, preview => {
        const url = document.getElementById('imageInput').value.trim();
        preview.hidden = !isHttpUrl(url);
        if (preview.hidden) preview.removeAttribute('src');
        else preview.src = url;
    }, () => Boolean(document.getElementById('imageInput').value.trim()));
}

const codeModal = document.getElementById('modalCode');
if (codeModal) {
    bindLivePreview(codeModal, () => {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        pre.classList.add('document-code');
        pre.appendChild(code);
        return pre;
    }, preview => {
        preview.querySelector('code').textContent = document.getElementById('codeInput').value.trim();
    }, () => Boolean(document.getElementById('codeInput').value.trim()));
}

const italicModal = document.getElementById('modalItalic');
if (italicModal) {
    bindLivePreview(italicModal, () => {
        const paragraph = document.createElement('p');
        const emphasis = document.createElement('em');
        paragraph.classList.add('document-italic');
        paragraph.appendChild(emphasis);
        return paragraph;
    }, preview => {
        preview.querySelector('em').textContent = document.getElementById('italicInput').value.trim();
    }, () => Boolean(document.getElementById('italicInput').value.trim()));
}

const listModal = document.getElementById('modalList');
if (listModal) {
    bindLivePreview(listModal, () => {
        const list = document.createElement('ul');
        list.classList.add('document-list');
        return list;
    }, preview => {
        const lines = document.getElementById('listInput').value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        preview.replaceChildren(...lines.map(line => {
            const item = document.createElement('li');
            item.textContent = line;
            return item;
        }));
    }, () => Boolean(document.getElementById('listInput').value.trim()));
}

const textSizeModal = document.getElementById('modalTextSize');
if (textSizeModal) {
    const textSizeButton = document.querySelector('[data-modal-target="modalTextSize"]');
    const sizeInput = document.getElementById('textSizeInput');
    const sizeValue = document.getElementById('textSizeValue');
    const status = document.getElementById('textSizeStatus');
    const applyButton = document.getElementById('applyTextSize');
    let savedRange = null;
    let resizedText = null;
    let originalFragment = null;

    const isValidTextRange = range =>
        !range.collapsed
        && selectSheet.contains(range.commonAncestorContainer)
        && Boolean(range.toString().trim());

    const rememberTextSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        if (isValidTextRange(range)) savedRange = range.cloneRange();
    };

    const nearestTextBlock = node => {
        const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        return element?.closest('#documentSheet h1, #documentSheet h2, #documentSheet h3, #documentSheet h4, #documentSheet p, #documentSheet li, #documentSheet td, #documentSheet th, #documentSheet a, #documentSheet pre') || null;
    };

    const restoreResizedText = () => {
        if (resizedText?.parentNode && originalFragment) {
            resizedText.replaceWith(originalFragment);
        }
        resizedText = null;
        originalFragment = null;
    };

    const updateTextSize = () => {
        const size = Number(sizeInput.value);
        sizeValue.value = `${size} px`;
        sizeValue.textContent = `${size} px`;
        if (resizedText) resizedText.style.fontSize = `${size}px`;
    };

    const prepareTextSelection = range => {
        restoreResizedText();
        savedRange = isValidTextRange(range) ? range.cloneRange() : null;

        if (!savedRange) {
            sizeInput.disabled = true;
            applyButton.disabled = true;
            status.textContent = 'Select text in the preview, then open this tool.';
            return;
        }

        const startBlock = nearestTextBlock(savedRange.startContainer);
        const endBlock = nearestTextBlock(savedRange.endContainer);
        if (!startBlock || startBlock !== endBlock) {
            savedRange = null;
            sizeInput.disabled = true;
            applyButton.disabled = true;
            status.textContent = 'Select text within a single paragraph, heading, list item, or table cell.';
            return;
        }

        const computedSize = Number.parseFloat(getComputedStyle(savedRange.startContainer.parentElement || startBlock).fontSize);
        const fontSize = Math.max(8, Math.min(48, Math.round(computedSize || 16)));
        sizeInput.value = String(fontSize);
        sizeInput.disabled = false;
        applyButton.disabled = false;
        status.textContent = `Selected: "${savedRange.toString().trim().slice(0, 60)}${savedRange.toString().trim().length > 60 ? '…' : ''}"`;

        const wrapper = document.createElement('span');
        wrapper.classList.add('document-text-size');
        try {
            savedRange.surroundContents(wrapper);
        } catch {
            const fragment = savedRange.extractContents();
            wrapper.appendChild(fragment);
            savedRange.insertNode(wrapper);
        }
        resizedText = wrapper;
        originalFragment = document.createDocumentFragment();
        while (wrapper.firstChild) originalFragment.appendChild(wrapper.firstChild);
        wrapper.appendChild(originalFragment.cloneNode(true));
        updateTextSize();
    };

    document.addEventListener('selectionchange', () => {
        rememberTextSelection();
    });
    textSizeButton?.addEventListener('pointerdown', rememberTextSelection, true);
    textSizeButton?.addEventListener('mousedown', rememberTextSelection, true);
    textSizeButton?.addEventListener('click', rememberTextSelection, true);

    window.addEventListener('toolroutechange', event => {
        if (event.detail.slug !== 'text-size') return;
        const range = savedRange && isValidTextRange(savedRange) ? savedRange : null;
        prepareTextSelection(range || document.createRange());
    });

    sizeInput.addEventListener('input', updateTextSize);

    textSizeModal.addEventListener('submit', event => {
        event.preventDefault();
        if (!resizedText) return;
        resizedText = null;
        originalFragment = null;
        savedRange = null;
        status.textContent = 'Text size applied.';
    });

    textSizeModal.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
        restoreResizedText();
        savedRange = null;
    });
}

const linkModal = document.getElementById('modalLink');
if (linkModal) {
    bindLivePreview(linkModal, () => {
        const link = document.createElement('a');
        link.classList.add('document-link');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        return link;
    }, preview => {
        const text = document.getElementById('linkText').value.trim();
        const url = document.getElementById('linkUrl').value.trim();
        preview.textContent = text || url;
        if (isHttpUrl(url)) preview.href = url;
        else preview.removeAttribute('href');
    }, () => Boolean(document.getElementById('linkText').value.trim() || document.getElementById('linkUrl').value.trim()));
}

const metadataModal = document.getElementById('modalMetadata');
if (metadataModal) {
    bindLivePreview(metadataModal, createMetadataPreview, section => {
        renderMetadataPreview(section, metadataInputFields());
    }, () => metadataInputFields().some(field => field.value));
}

const exportOptionsModal = document.getElementById('modalExportOptions');
if (exportOptionsModal) {
    exportOptionsModal.addEventListener('submit', function (e) {
        e.preventDefault();
        const format = document.getElementById('exportFormatInput')?.value || 'pdf';
        if (format === 'html') {
            const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeExportText(document.title)}</title></head><body>${selectSheet.outerHTML}</body></html>`;
            downloadExport(new Blob([html], { type: 'text/html;charset=utf-8' }), 'document.html');
        } else if (format === 'json') {
            const content = {
                title: document.getElementById('headingInput')?.value || document.title,
                subtitle: document.getElementById('subtitleInput')?.value || '',
                html: selectSheet.innerHTML
            };
            downloadExport(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json;charset=utf-8' }), 'document.json');
        } else {
            exportDocumentPdf().catch((error) => {
                console.error('PDF export failed:', error);
                window.alert(error instanceof Error && error.message === 'PDFMake is not available'
                    ? 'PDF export is unavailable. Restore the local PDFMake files and reload the app.'
                    : 'PDF export failed. Please check that the document images are accessible and try again.');
            });
        }
        document.querySelectorAll('.tool-modal').forEach(modal => modal.hidden = true);
        const toolEmptyState = document.getElementById('toolEmptyState');
        if (toolEmptyState) toolEmptyState.hidden = false;
    });
}

function escapeExportText(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function downloadExport(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportDocumentPdf() {
    if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
        throw new Error('PDFMake is not available');
    }

    const richText = (node) => {
        if (node.nodeType === Node.TEXT_NODE) return node.nodeValue;
        if (node.nodeType !== Node.ELEMENT_NODE) return '';
        const content = [...node.childNodes].flatMap(richText);
        if (node.matches('br')) return '\n';
        if (node.matches('strong, b')) return { text: content, bold: true };
        if (node.matches('em, i')) return { text: content, italics: true };
        if (node.matches('mark')) return { text: content, background: '#fff29a' };
        if (node.matches('a[href]')) return { text: content, link: node.href, color: '#2563eb', underline: true };
        if (node.matches('span.document-text-size')) {
            return { text: content, fontSize: Number.parseFloat(node.style.fontSize) * 0.75 };
        }
        return content;
    };

    const toDataUrl = async (image) => {
        if (/^data:/i.test(image.src)) return image.src;
        const response = await fetch(image.src);
        if (!response.ok) throw new Error(`Image could not be loaded: ${image.src}`);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const content = [];
    for (const element of selectSheet.children) {
        if (element.matches('.document-header-block')) {
            const title = element.querySelector('.document-heading')?.innerText.trim();
            if (title) content.push({ text: title, style: 'title', margin: [0, 0, 0, 10] });
        } else if (element.matches('.document-subtitle')) {
            content.push({ text: element.innerText.trim(), style: 'subtitle' });
        } else if (element.matches('h4, .document-subheading')) {
            content.push({ text: [...element.childNodes].flatMap(richText), style: 'heading' });
        } else if (element.matches('p, .document-italic')) {
            content.push({ text: [...element.childNodes].flatMap(richText), style: 'paragraph' });
        } else if (element.matches('ul, ol')) {
            const items = [...element.querySelectorAll(':scope > li')].map(item => [...item.childNodes].flatMap(richText));
            if (items.length) content.push(element.matches('ol') ? { ol: items, margin: [0, 0, 0, 10] } : { ul: items, margin: [0, 0, 0, 10] });
        } else if (element.matches('table')) {
            const body = [...element.rows].map(row =>
                [...row.cells].map(cell => ({ text: [...cell.childNodes].flatMap(richText), style: row.rowIndex === 0 ? 'tableHeader' : 'tableCell' }))
            );
            if (body.length) content.push({ table: { headerRows: 1, widths: Array(body[0].length).fill('*'), body }, layout: 'lightHorizontalLines', margin: [0, 4, 0, 12] });
        } else if (element.matches('pre, .document-code')) {
            content.push({ text: element.innerText, style: 'code' });
        } else if (element.matches('.document-spacer')) {
            content.push({ text: ' ', margin: [0, 0, 0, Number.parseFloat(element.style.height) * 0.75] });
        } else if (element.matches('img')) {
            const data = await toDataUrl(element);
            const widthPercentage = element.style.width.endsWith('%')
                ? Number.parseFloat(element.style.width)
                : null;
            content.push({
                image: data,
                ...(widthPercentage ? { width: 499.28 * widthPercentage / 100 } : { fit: [500, 650] }),
                alignment: 'center',
                margin: [0, 4, 0, 12]
            });
        } else if (element.matches('a[href]')) {
            content.push({ text: [...element.childNodes].flatMap(richText), margin: [0, 0, 0, 10] });
        } else if (element.matches('section.metadata-section')) {
            const metadataRows = [...element.querySelectorAll('dt')].map(label => [
                { text: label.innerText.trim(), bold: true },
                label.nextElementSibling?.innerText.trim() || ''
            ]);
            if (metadataRows.length) content.push({ table: { widths: ['auto', '*'], body: metadataRows }, layout: 'lightHorizontalLines', margin: [0, 6, 0, 12] });
        }
    }

    const title = (document.getElementById('headingInput')?.value || document.title).trim() || 'document';
    const filename = `${title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').slice(0, 100) || 'document'}.pdf`;
    const metadata = {
        title,
        author: document.getElementById('documentAuthorInput')?.value || document.getElementById('metadataIssuedBy')?.value || '',
        subject: document.getElementById('documentTypeInput')?.value || ''
    };
    window.pdfMake.createPdf({
        info: metadata,
        pageSize: 'A4',
        pageMargins: [48, 54, 48, 54],
        content,
        defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.35 },
        styles: {
            eyebrow: { fontSize: 8, color: '#526274', bold: true },
            title: { fontSize: 22, bold: true, color: '#172033' },
            subtitle: { fontSize: 14, color: '#526274', margin: [0, 0, 0, 14] },
            heading: { fontSize: 13, bold: true, margin: [0, 12, 0, 5] },
            paragraph: { margin: [0, 0, 0, 9] },
            code: { font: 'Roboto', fontSize: 9, color: '#263244', fillColor: '#f2f4f7', margin: [0, 4, 0, 10] },
            tableHeader: { bold: true, fillColor: '#eef2f7' },
            tableCell: { margin: [3, 2, 3, 2] }
        }
    }).download(filename);
}

const saveOptionsModal = document.getElementById('modalSaveOptions');
if (saveOptionsModal) {
    saveOptionsModal.querySelector('#printDocument')?.addEventListener('click', () => {
        window.print();
    });

    saveOptionsModal.addEventListener('submit', function (e) {
        e.preventDefault();
        const profile = document.getElementById('saveProfileInput')?.value || 'draft';
        const status = document.getElementById('metadataStatus');
        if (status) status.value = profile === 'final' ? 'Approved' : profile === 'review' ? 'In Review' : 'Draft';
        document.querySelectorAll('.tool-modal').forEach(modal => modal.hidden = true);
        const toolEmptyState = document.getElementById('toolEmptyState');
        if (toolEmptyState) toolEmptyState.hidden = false;
    });
}

// Metadata Modal Handler
if (metadataModal) {
    metadataModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;

        const course = document.getElementById('metadataCourse').value;
        const institution = document.getElementById('metadataInstitution').value;
        const academicYear = document.getElementById('metadataAcademicYear').value;
        const module = document.getElementById('metadataModule').value;
        const documentID = document.getElementById('metadataDocumentID').value;
        const issuedBy = document.getElementById('metadataIssuedBy').value;
        const date = document.getElementById('metadataDate').value;
        const program = document.getElementById('metadataProgram').value;
        const status = document.getElementById('metadataStatus').value;

        // Create metadata section
        const metadataSection = document.createElement('section');
        metadataSection.classList.add('metadata-section');
        metadataSection.setAttribute('aria-label', 'Document Metadata');

        const metadataList = document.createElement('dl');
        metadataList.classList.add('metadata-list');

        const metadataFields = [
            { label: 'Course:', value: course },
            { label: 'Institution:', value: institution },
            { label: 'Academic Year:', value: academicYear },
            { label: 'Module:', value: module },
            { label: 'Document ID', value: documentID },
            { label: 'Issued By:', value: issuedBy },
            { label: 'Date', value: date },
            { label: 'Program:', value: program },
            { label: 'Status:', value: status }
        ];

        metadataFields.forEach(field => {
            if (field.value) {
                const dt = document.createElement('dt');
                dt.textContent = field.label;
                const dd = document.createElement('dd');
                dd.textContent = field.value;
                metadataList.appendChild(dt);
                metadataList.appendChild(dd);
            }
        });

        if (metadataList.children.length > 0) {
            metadataSection.appendChild(metadataList);
            selectSheet.appendChild(metadataSection);
        }
    });
}

// Cancel button handler
document.querySelectorAll('[data-action="cancel"]').forEach(button => {
    button.addEventListener('click', function () {
        const form = this.closest('form');
        if (form) {
            cancelLivePreview(form);
            form.hidden = true;
            const toolEmptyState = document.getElementById('toolEmptyState');
            if (toolEmptyState) {
                toolEmptyState.hidden = false;
            }
        }
    });
});

// H4 subheading
if (subheadingModal) {
    subheadingModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;
        const text = document.getElementById('subheadingInput').value.trim();
        if (text) {
            const subheading = document.createElement('h4');
            subheading.classList.add('document-subheading');
            subheading.textContent = text;
            selectSheet.appendChild(subheading);
            subheading.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Paragraph
if (paragraphModal) {
    paragraphModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;
        const text = document.getElementById('paragraphInput').value;
        if (text && text.trim()) {
            const p = document.createElement('p');
            p.classList.add('document-paragraph');
            p.textContent = text.trim();
            selectSheet.appendChild(p);
            p.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Image
if (imageModal) {
    const urlInput = document.getElementById('imageInput');
    const fileInput = document.getElementById('imageFileInput');
    const fileName = document.getElementById('imageFileName');
    const chooseImageFile = document.getElementById('chooseImageFile');

    chooseImageFile.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        fileName.textContent = fileInput.files[0]?.name || 'No image selected';
    });

    imageModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;

        const file = fileInput && fileInput.files ? fileInput.files[0] : null;
        const url = urlInput ? urlInput.value.trim() : '';

        const clearImageInputs = () => {
            if (urlInput) urlInput.value = '';
            if (fileInput) fileInput.value = '';
            fileName.textContent = 'No image selected';
        };

        const addImage = (src) => {
            const img = document.createElement('img');
            img.classList.add('document-image');
            img.src = src;
            img.alt = 'Inserted image';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            selectSheet.appendChild(img);
            img.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        if (url) {
            addImage(url);
            clearImageInputs();
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                addImage(event.target.result);
                clearImageInputs();
            };
            reader.readAsDataURL(file);
            return;
        }
    });
}

// Table
const tableModal = document.getElementById('modalTable');
if (tableModal) {
    tableModal.addEventListener('submit', function (e) {
        e.preventDefault();
        const cols = parseInt(document.getElementById('tableColumns').value, 10) || 1;
        const rows = parseInt(document.getElementById('tableRows').value, 10) || 1;
        const table = document.createElement('table');
        table.classList.add('document-table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        const createEditableCell = () => {
            const cell = document.createElement('td');
            cell.contentEditable = true;
            cell.setAttribute('role', 'textbox');
            cell.setAttribute('aria-label', 'Table cell');
            cell.tabIndex = 0;
            cell.spellcheck = true;
            cell.style.border = '1px solid #e6e9ee';
            cell.style.padding = '0.5rem';
            cell.style.minHeight = '2.5rem';
            cell.style.verticalAlign = 'top';
            cell.style.outline = 'none';

            cell.addEventListener('keydown', function (event) {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    const currentCell = this;
                    const currentRow = currentCell.parentElement;
                    const rowCells = [...currentRow.children];
                    const currentIndex = rowCells.indexOf(currentCell);
                    const nextCell = rowCells[currentIndex + 1] || currentRow.nextElementSibling?.children[0];

                    if (nextCell) {
                        nextCell.focus();
                        const range = document.createRange();
                        const selection = window.getSelection();
                        range.selectNodeContents(nextCell);
                        range.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            });

            return cell;
        };

        for (let r = 0; r < rows; r++) {
            const tr = document.createElement('tr');
            if (r === 0) {
                tr.classList.add('table-top-row');
            } else if (r === 1) {
                tr.classList.add('table-second-row');
            }
            for (let c = 0; c < cols; c++) {
                tr.appendChild(createEditableCell());
            }
            table.appendChild(tr);
        }

        selectSheet.appendChild(table);
        table.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const firstCell = table.querySelector('td');
        if (firstCell) {
            firstCell.focus();
        }
    });
}

// Code
if (codeModal) {
    codeModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;
        const code = document.getElementById('codeInput').value;
        if (code && code.trim()) {
            const pre = document.createElement('pre');
            const codeEl = document.createElement('code');
            codeEl.textContent = code.trim();
            pre.appendChild(codeEl);
            pre.classList.add('document-code');
            selectSheet.appendChild(pre);
            pre.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Italic
if (italicModal) {
    italicModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;
        const txt = document.getElementById('italicInput').value;
        if (txt && txt.trim()) {
            const p = document.createElement('p');
            const em = document.createElement('em');
            em.textContent = txt.trim();
            p.appendChild(em);
            p.classList.add('document-italic');
            selectSheet.appendChild(p);
            p.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Selection formatting for existing text
const selectBoldButton = document.getElementById('btnBoldSelection');
const selectHighlightButton = document.getElementById('btnHighlightSelection');
const selectToEditButton = document.getElementById('btnSelectToEdit');
const selectionEditHint = document.getElementById('selectionEditHint');
const exitSelectionEditModeButton = document.getElementById('exitSelectionEditMode');
const editableBlockSelector = [
    '.document-heading', '.document-subtitle', '.document-subheading', '.document-paragraph',
    '.document-italic', '.document-code', '.document-list', 'li', '.document-link',
    '.metadata-section'
].join(', ');
let selectionEditMode = false;
let activeEditableBlock = null;
let previousEditableState = null;

function restoreEditableBlock() {
    if (!activeEditableBlock) return;
    if (previousEditableState.contentEditable === null) {
        activeEditableBlock.removeAttribute('contenteditable');
    } else {
        activeEditableBlock.setAttribute('contenteditable', previousEditableState.contentEditable);
    }
    if (previousEditableState.tabIndex === null) {
        activeEditableBlock.removeAttribute('tabindex');
    } else {
        activeEditableBlock.setAttribute('tabindex', previousEditableState.tabIndex);
    }
    activeEditableBlock.removeAttribute('data-selection-editing');
    activeEditableBlock = null;
    previousEditableState = null;
}

function setSelectionEditMode(enabled) {
    selectionEditMode = enabled;
    restoreEditableBlock();
    selectSheet.classList.toggle('is-select-edit-mode', enabled);
    if (selectionEditHint) selectionEditHint.hidden = !enabled;
    if (selectToEditButton) selectToEditButton.setAttribute('aria-pressed', String(enabled));
}

window.addEventListener('toolroutechange', event => {
    setSelectionEditMode(event.detail.slug === 'select-to-edit');
});

if (selectToEditButton) {
    selectToEditButton.addEventListener('click', function () {
        setSelectionEditMode(!selectionEditMode);
        document.querySelectorAll('.tool-modal').forEach(modal => modal.hidden = true);
        const toolEmptyState = document.getElementById('toolEmptyState');
        if (toolEmptyState) toolEmptyState.hidden = false;
    });
}

exitSelectionEditModeButton?.addEventListener('click', () => {
    setSelectionEditMode(false);
});

selectSheet.addEventListener('click', function (event) {
    if (!selectionEditMode || !(event.target instanceof Element)) return;
    const block = event.target.closest(editableBlockSelector);
    if (!block || !selectSheet.contains(block)) return;

    if (activeEditableBlock !== block) {
        restoreEditableBlock();
        previousEditableState = {
            contentEditable: block.getAttribute('contenteditable'),
            tabIndex: block.getAttribute('tabindex')
        };
        activeEditableBlock = block;
        block.setAttribute('contenteditable', 'true');
        block.setAttribute('tabindex', '0');
        block.setAttribute('data-selection-editing', 'true');
    }
    if (block.matches('a[href]')) event.preventDefault();
    block.focus();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selectionEditMode) setSelectionEditMode(false);
});

function formatSelectedText(tagName, className) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        return false;
    }

    const selectedText = selection.toString();
    if (!selectedText || !selectedText.trim()) {
        return false;
    }

    const range = selection.getRangeAt(0);
    if (!selectSheet.contains(range.commonAncestorContainer)) return false;
    const wrapper = document.createElement(tagName);
    wrapper.classList.add(className);

    try {
        range.surroundContents(wrapper);
    } catch (error) {
        const fragment = range.extractContents();
        wrapper.appendChild(fragment);
        range.insertNode(wrapper);
    }

    selection.removeAllRanges();
    return true;
}

if (selectBoldButton) {
    selectBoldButton.addEventListener('click', function () {
        const isApplied = formatSelectedText('strong', 'document-strong');
        if (!isApplied) {
            window.alert('Select the text you want to format as bold.');
        }
    });
}

if (selectHighlightButton) {
    selectHighlightButton.addEventListener('click', function () {
        const isApplied = formatSelectedText('mark', 'document-highlight');
        if (!isApplied) {
            window.alert('Select the text you want to highlight.');
        }
    });
}

if (window.location.hash.toLowerCase() === '#tool/select-to-edit') {
    setSelectionEditMode(true);
}

// List
if (listModal) {
    listModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;
        const raw = document.getElementById('listInput').value || '';
        const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length) {
            const ul = document.createElement('ul');
            ul.classList.add('document-list');
            lines.forEach(line => {
                const li = document.createElement('li');
                li.textContent = line;
                ul.appendChild(li);
            });
            selectSheet.appendChild(ul);
            ul.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Link
if (linkModal) {
    linkModal.addEventListener('submit', function (e) {
        e.preventDefault();
        if (commitLivePreview(this)) return;
        const text = document.getElementById('linkText').value;
        const url = document.getElementById('linkUrl').value;
        if (url && url.trim()) {
            const a = document.createElement('a');
            a.href = url.trim();
            a.textContent = text && text.trim() ? text.trim() : url.trim();
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.classList.add('document-link');
            selectSheet.appendChild(a);
            a.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}
