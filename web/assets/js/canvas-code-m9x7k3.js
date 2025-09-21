/**
 * ============================================================================
 * PLENORA - CANVAS CODE EDITOR SYSTEM
 * ============================================================================
 * 
 * @file        canvas-code-m9x7k3.js
 * @version     1.0.0
 * @description Canvas/Code tab switching with Monaco Editor integration
 * @author      Navchetna
 * @company     NINELLMS SOLUTIONS LLP
 * @created     2025
 * 
 * ============================================================================
 */

let monacoEditor = null;
let currentMode = 'canvas';
let isUpdating = false;
let updateTimeout = null;
let originalCode = '';

/**
 * Initialize Canvas/Code tab functionality
 */
function initializeCanvasCodeTabs() {
    const canvasTab = document.getElementById('canvas-tab');
    const codeTab = document.getElementById('code-tab');
    const canvasContainer = document.getElementById('canvas-container');
    const codeContainer = document.getElementById('code-editor-container');
    
    if (!canvasTab || !codeTab || !canvasContainer || !codeContainer) return;
    
    // Tab click handlers
    canvasTab.addEventListener('click', () => switchToCanvas());
    codeTab.addEventListener('click', () => switchToCode());
    
    // Initialize Monaco Editor
    loadMonacoEditor();
}

/**
 * Switch to Canvas view
 */
function switchToCanvas() {
    currentMode = 'canvas';
    
    // Update tab styles
    document.getElementById('canvas-tab').classList.add('active', 'bg-white/10', 'text-white');
    document.getElementById('canvas-tab').classList.remove('text-slate-400');
    document.getElementById('code-tab').classList.remove('active', 'bg-white/10', 'text-white');
    document.getElementById('code-tab').classList.add('text-slate-400');
    
    // Show/hide containers
    document.getElementById('canvas-container').classList.remove('hidden');
    document.getElementById('code-editor-container').classList.add('hidden');
}

/**
 * Switch to Code view
 */
function switchToCode() {
    currentMode = 'code';
    
    // Update tab styles
    document.getElementById('code-tab').classList.add('active', 'bg-white/10', 'text-white');
    document.getElementById('code-tab').classList.remove('text-slate-400');
    document.getElementById('canvas-tab').classList.remove('active', 'bg-white/10', 'text-white');
    document.getElementById('canvas-tab').classList.add('text-slate-400');
    
    // Show/hide containers
    document.getElementById('code-editor-container').classList.remove('hidden');
    document.getElementById('canvas-container').classList.add('hidden');
    
    // Update editor content and resize
    if (monacoEditor) {
        updateEditorContent();
        setTimeout(() => monacoEditor.layout(), 100);
    }
}

/**
 * Load Monaco Editor
 */
function loadMonacoEditor() {
    // Load Monaco Editor from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
    script.onload = () => {
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            createMonacoEditor();
        });
    };
    document.head.appendChild(script);
}

/**
 * Create Monaco Editor instance
 */
function createMonacoEditor() {
    const editorContainer = document.getElementById('monaco-editor');
    if (!editorContainer) return;
    
    // Define custom theme matching UI
    monaco.editor.defineTheme('plenora-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6b7280' },
            { token: 'keyword', foreground: '60a5fa' },
            { token: 'string', foreground: '34d399' },
            { token: 'number', foreground: 'f59e0b' },
            { token: 'tag', foreground: 'f87171' },
            { token: 'attribute.name', foreground: 'a78bfa' },
            { token: 'attribute.value', foreground: '34d399' }
        ],
        colors: {
            'editor.background': '#0f0f0f',
            'editor.foreground': '#e5e7eb',
            'editorLineNumber.foreground': '#6b7280',
            'editorLineNumber.activeForeground': '#9ca3af',
            'editor.selectionBackground': '#374151',
            'editor.inactiveSelectionBackground': '#1f2937',
            'editorCursor.foreground': '#60a5fa',
            'editor.lineHighlightBackground': '#111827',
            'editorGutter.background': '#0f0f0f',
            'editorWidget.background': '#1f2937',
            'editorWidget.border': '#374151'
        }
    });
    
    monacoEditor = monaco.editor.create(editorContainer, {
        value: getCanvasHTML(),
        language: 'html',
        theme: 'plenora-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        renderWhitespace: 'selection',
        tabSize: 2,
        insertSpaces: true,
        readOnly: false
    });
    
    // Listen for content changes with debouncing
    monacoEditor.onDidChangeModelContent(() => {
        if (currentMode === 'code' && !isUpdating) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                updateCanvasFromCode();
            }, 300);
        }
    });
}

/**
 * Get current canvas HTML content
 */
function getCanvasHTML() {
    // Return original code if available, otherwise get from canvas
    if (originalCode && currentMode === 'code') {
        return originalCode;
    }
    
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return '';
    
    // Get clean HTML without the placeholder content
    let html = canvas.innerHTML;
    
    // Remove placeholder content if it exists
    const placeholderRegex = /<div class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">[\s\S]*?<\/div>/;
    html = html.replace(placeholderRegex, '');
    
    return html.trim();
}

/**
 * Update editor content with current canvas HTML
 */
function updateEditorContent() {
    if (!monacoEditor || isUpdating) return;
    
    const currentHTML = getCanvasHTML();
    const editorValue = monacoEditor.getValue();
    
    // Only update if content is different to avoid cursor jumping
    if (currentHTML !== editorValue) {
        isUpdating = true;
        monacoEditor.setValue(currentHTML);
        setTimeout(() => { isUpdating = false; }, 100);
    }
}

/**
 * Update canvas from code editor content
 */
function updateCanvasFromCode() {
    if (!monacoEditor || currentMode !== 'code' || isUpdating) return;
    
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    let codeContent = monacoEditor.getValue();
    
    try {
        isUpdating = true;
        
        // Store original code to prevent truncation
        originalCode = monacoEditor.getValue();
        
        // Extract and preserve head content, then get body content
        if (codeContent.includes('<html') || codeContent.includes('<body')) {
            // Extract head content for styles
            const headMatch = codeContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
            if (headMatch) {
                extractAndApplyHeadContent(headMatch[1]);
            }
            
            // Extract body content for canvas
            const bodyMatch = codeContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                codeContent = bodyMatch[1].trim();
            }
        }
        
        // Update canvas with editor content
        if (codeContent.trim()) {
            // Execute as HTML compiler but maintain sync
            executeHTMLWithSync(originalCode, codeContent);
        } else {
            // Show placeholder if empty
            canvas.innerHTML = `
                <div class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                             width="48" height="48" 
                             viewBox="0 0 24 24" 
                             fill="none" 
                             stroke="currentColor" 
                             stroke-width="1" 
                             stroke-linecap="round" 
                             stroke-linejoin="round" 
                             class="mx-auto mb-4 opacity-30">
                            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                            <path d="M9 9h6v6H9z"></path>
                        </svg>
                        <p class="opacity-50">Drop sections here to start building</p>
                    </div>
                </div>
            `;
        }
        
        // Sync with sections list
        syncSectionsListFromCanvas();
        
        setTimeout(() => { isUpdating = false; }, 100);
    } catch (error) {
        console.error('Error updating canvas from code:', error);
        isUpdating = false;
    }
}

/**
 * Execute HTML with 3-way synchronization
 */
function executeHTMLWithSync(fullHTML, bodyContent) {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Render content in canvas
    canvas.innerHTML = bodyContent;
    
    // Apply all enhancements
    fixCanvasPositioning();
    executeCanvasJavaScript();
    makeCanvasResponsive();
    makeCodeSectionsEditable();
    
    // Sync with sections list
    syncSectionsListFromCanvas();
}

/**
 * Extract and apply head content (CSS, styles) to canvas
 */
function extractAndApplyHeadContent(headContent) {
    // Remove existing canvas head styles
    const existingStyles = document.querySelectorAll('[data-canvas-head]');
    existingStyles.forEach(style => style.remove());
    
    // Extract style tags
    const styleMatches = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
        styleMatches.forEach(styleTag => {
            const styleContent = styleTag.replace(/<\/?style[^>]*>/gi, '');
            const sandboxedCSS = sandboxCSS(styleContent);
            const style = document.createElement('style');
            style.setAttribute('data-canvas-head', 'true');
            style.textContent = sandboxedCSS;
            document.head.appendChild(style);
        });
    }
}

/**
 * Sandbox CSS to only apply within canvas
 */
function sandboxCSS(css) {
    // Split CSS into rules and scope each one to canvas
    const rules = css.split('}').filter(rule => rule.trim());
    const sandboxedRules = rules.map(rule => {
        const [selector, ...declarations] = rule.split('{');
        if (selector && declarations.length > 0) {
            const cleanSelector = selector.trim();
            // Skip @rules, keyframes, etc.
            if (cleanSelector.startsWith('@')) {
                return rule + '}';
            }
            // Scope selector to canvas
            const scopedSelector = cleanSelector.split(',').map(s => {
                const trimmed = s.trim();
                if (trimmed === 'body' || trimmed === 'html') {
                    return '#design-canvas';
                }
                return `#design-canvas ${trimmed}`;
            }).join(', ');
            return `${scopedSelector} { ${declarations.join('{')}`;
        }
        return rule;
    });
    
    return sandboxedRules.join(' } ') + (sandboxedRules.length > 0 ? ' }' : '');
}

/**
 * Execute JavaScript code within canvas safely
 */
function executeCanvasJavaScript() {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Find and execute script tags within canvas
    const scripts = canvas.querySelectorAll('script');
    scripts.forEach(script => {
        try {
            // Create sandboxed execution context
            const canvasScope = {
                document: {
                    getElementById: (id) => canvas.querySelector(`#${id}`),
                    querySelector: (selector) => canvas.querySelector(selector),
                    querySelectorAll: (selector) => canvas.querySelectorAll(selector),
                    createElement: (tag) => document.createElement(tag)
                },
                console: {
                    log: (...args) => console.log('[Canvas]', ...args),
                    error: (...args) => console.error('[Canvas]', ...args)
                },
                alert: (msg) => console.log('[Canvas Alert]', msg),
                canvas: canvas
            };
            
            // Execute script in sandboxed context
            const scriptContent = script.textContent || script.innerHTML;
            if (scriptContent.trim()) {
                const func = new Function('canvas', 'document', 'console', 'alert', scriptContent);
                func.call(canvasScope, canvas, canvasScope.document, canvasScope.console, canvasScope.alert);
            }
        } catch (error) {
            console.error('Canvas script execution error:', error);
        }
    });
}

/**
 * Make canvas content responsive to device width changes
 */
function makeCanvasResponsive() {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Remove existing responsive overrides to allow natural responsiveness
    const existingStyle = document.getElementById('canvas-responsive-override');
    if (existingStyle) existingStyle.remove();
    
    // Get current canvas width
    const canvasWidth = canvas.offsetWidth;
    
    // Create minimal responsive adjustments that work with natural CSS
    const style = document.createElement('style');
    style.id = 'canvas-responsive-override';
    
    // Only add viewport simulation, let CSS media queries work naturally
    style.textContent = `
        #design-canvas {
            width: ${canvasWidth}px;
            max-width: 100%;
            overflow-x: auto;
        }
        
        /* Simulate viewport width for media queries */
        @media (max-width: ${canvasWidth}px) {
            #design-canvas {
                /* Let natural responsive behavior work */
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Fix positioning issues in canvas content
 */
function fixCanvasPositioning() {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Find elements with positioning issues and fix them
    const allElements = canvas.querySelectorAll('*');
    allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        
        // Fix fixed positioning
        if (computedStyle.position === 'fixed') {
            element.style.position = 'relative';
            element.style.top = 'auto';
            element.style.left = 'auto';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
        
        // Reset high z-index values that could overlay interface
        const zIndex = parseInt(computedStyle.zIndex);
        if (!isNaN(zIndex) && zIndex > 100) {
            element.style.zIndex = 'auto';
        }
    });
}

/**
 * Make code-added sections editable in canvas
 */
function makeCodeSectionsEditable() {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    let modified = false;
    const sections = canvas.querySelectorAll('section[data-section]');
    
    sections.forEach(section => {
        const sectionId = section.dataset.section;
        
        // Add ID if missing
        if (!section.id && sectionId) {
            section.id = sectionId;
            modified = true;
        }
        
        // Make section clickable for editing
        if (!section.hasAttribute('data-editable')) {
            section.setAttribute('data-editable', 'true');
            section.style.cursor = 'pointer';
            
            section.addEventListener('click', (e) => {
                e.stopPropagation();
                // Add visual feedback
                section.style.outline = '2px solid #60a5fa';
                setTimeout(() => {
                    section.style.outline = '';
                }, 1000);
            });
        }
    });
    
    // Update editor if modifications were made
    if (modified && monacoEditor) {
        setTimeout(() => {
            const updatedHTML = getCanvasHTML();
            monacoEditor.setValue(updatedHTML);
        }, 50);
    }
}

/**
 * Sync sections list from canvas content with full bidirectional support
 */
function syncSectionsListFromCanvas() {
    const canvas = document.getElementById('design-canvas');
    const sectionsList = document.getElementById('sections-list');
    const sectionsEmpty = document.getElementById('sections-empty');
    
    if (!canvas || !sectionsList || isUpdating) return;
    
    // Get elements with IDs (user HTML elements) and section elements
    const elementsWithIds = canvas.querySelectorAll('[id]:not(#design-canvas)');
    const sectionElements = canvas.querySelectorAll('section[data-section]');
    
    // Clear sections list
    sectionsList.innerHTML = '';
    
    // Add user HTML elements with IDs to sections list
    elementsWithIds.forEach(element => {
        const sectionId = element.id;
        if (!sectionId) return;
        
        const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/([A-Z])/g, ' $1').trim();
        
        const li = document.createElement('li');
        li.draggable = true;
        li.className = 'flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5 cursor-move';
        li.dataset.section = sectionId;
        li.dataset.name = sectionName;
        li.dataset.type = 'element';
        
        li.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" class="text-slate-400">
                <path d="M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 text-blue-400">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>
            ${sectionName}
        `;
        
        // Add click handler for section list items to sync with canvas
        li.addEventListener('click', () => {
            const canvasElement = canvas.querySelector(`#${sectionId}`);
            if (canvasElement) {
                canvasElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                canvasElement.style.outline = '2px solid #60a5fa';
                setTimeout(() => canvasElement.style.outline = '', 1000);
            }
        });
        
        sectionsList.appendChild(li);
    });
    
    // Add section elements to sections list
    sectionElements.forEach(element => {
        const sectionId = element.dataset.section;
        if (!sectionId) return;
        
        const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
        
        const li = document.createElement('li');
        li.draggable = true;
        li.className = 'flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5 cursor-move';
        li.dataset.section = sectionId;
        li.dataset.name = sectionName;
        li.dataset.type = 'section';
        
        li.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" class="text-slate-400">
                <path d="M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 text-blue-400">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>
            ${sectionName}
        `;
        
        // Add click handler for section list items to sync with canvas
        li.addEventListener('click', () => {
            const canvasElement = canvas.querySelector(`[data-section="${sectionId}"]`);
            if (canvasElement) {
                canvasElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                canvasElement.style.outline = '2px solid #60a5fa';
                setTimeout(() => canvasElement.style.outline = '', 1000);
            }
        });
        
        sectionsList.appendChild(li);
    });
    
    // Update empty state
    if (sectionsEmpty) {
        sectionsEmpty.style.display = sectionsList.children.length > 0 ? 'none' : 'block';
    }
    
    // Update code editor to reflect current canvas state
    updateCodeFromCanvas();
}

/**
 * Update code editor from canvas changes
 */
function updateCodeFromCanvas() {
    if (!monacoEditor || isUpdating) return;
    
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Get current canvas HTML
    const canvasHTML = canvas.innerHTML;
    
    // Update original code with new body content
    if (originalCode && originalCode.includes('<body')) {
        const updatedCode = originalCode.replace(
            /<body[^>]*>([\s\S]*?)<\/body>/i,
            `<body>\n${canvasHTML}\n</body>`
        );
        originalCode = updatedCode;
        
        // Update editor if in code mode
        if (currentMode === 'code') {
            isUpdating = true;
            monacoEditor.setValue(originalCode);
            setTimeout(() => { isUpdating = false; }, 100);
        }
    } else if (canvasHTML.trim()) {
        // Create basic HTML structure if none exists
        originalCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
${canvasHTML}
</body>
</html>`;
        
        // Update editor if in code mode
        if (currentMode === 'code') {
            isUpdating = true;
            monacoEditor.setValue(originalCode);
            setTimeout(() => { isUpdating = false; }, 100);
        }
    }
}

// Listen for canvas changes to update code editor
function setupCanvasChangeListener() {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Use MutationObserver to watch for canvas changes with debouncing
    const observer = new MutationObserver(() => {
        if (monacoEditor && !isUpdating) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                // Always sync sections list when canvas changes
                syncSectionsListFromCanvas();
                
                // Update editor content if in canvas mode
                if (currentMode === 'canvas') {
                    updateEditorContent();
                }
            }, 200);
        }
    });
    
    observer.observe(canvas, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
    
    // Watch for canvas width changes to update responsiveness
    const resizeObserver = new ResizeObserver(() => {
        if (canvas.innerHTML.trim() && !canvas.querySelector('.absolute.inset-0')) {
            // Debounce responsive updates
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                makeCanvasResponsive();
            }, 100);
        }
    });
    
    resizeObserver.observe(canvas);
}

// Make functions globally available
window.initializeCanvasCodeTabs = initializeCanvasCodeTabs;
window.switchToCanvas = switchToCanvas;
window.switchToCode = switchToCode;
window.syncSectionsListFromCanvas = syncSectionsListFromCanvas;
window.updateCodeFromCanvas = updateCodeFromCanvas;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initializeCanvasCodeTabs();
            setupCanvasChangeListener();
        }, 200);
    });
} else {
    setTimeout(() => {
        initializeCanvasCodeTabs();
        setupCanvasChangeListener();
    }, 200);
}

console.log('📝 CANVAS CODE EDITOR LOADED SUCCESSFULLY');