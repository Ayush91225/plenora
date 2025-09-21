/**
 * ============================================================================
 * PLENORA - FIGMA-LIKE CANVAS EDITOR
 * ============================================================================
 * 
 * @file        canvas-editor-x8k4m2.js
 * @version     2.0.0
 * @description Improved UX canvas editing with context menu and smooth dragging
 * @author      Navchetna
 * @company     NINELLMS SOLUTIONS LLP
 * @created     2025
 * 
 * ============================================================================
 */

let selectedElement = null;
let isDragging = false;
let isMoveModeActive = false;
let selectionBox = null;
let elementContextMenu = null;

/**
 * Initialize canvas editor
 */
function initializeCanvasEditor() {
    const canvas = document.getElementById('design-canvas');
    if (!canvas) return;
    
    // Create selection box and context menu
    createSelectionBox();
    createElementContextMenu();
    
    // Add canvas event listeners
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('contextmenu', handleCanvasRightClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    console.log('🎨 Canvas Editor Initialized');
}

/**
 * Create selection box element
 */
function createSelectionBox() {
    selectionBox = document.createElement('div');
    selectionBox.id = 'canvas-selection-box';
    selectionBox.className = 'absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10 rounded hidden';
    selectionBox.style.zIndex = '9998';
    document.body.appendChild(selectionBox);
}

/**
 * Create element context menu
 */
function createElementContextMenu() {
    elementContextMenu = document.createElement('div');
    elementContextMenu.id = 'element-context-menu';
    elementContextMenu.className = 'fixed z-[9999] hidden';
    elementContextMenu.innerHTML = `
        <div class="bg-black/80 border-white/10 border rounded-lg shadow-xl backdrop-blur p-1">
            <button id="edit-element" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Text
            </button>
            <button id="move-element" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="5 9 2 12 5 15"></polyline>
                    <polyline points="9 5 12 2 15 5"></polyline>
                    <polyline points="15 19 12 22 9 19"></polyline>
                    <polyline points="19 9 22 12 19 15"></polyline>
                    <line x1="2" x2="22" y1="12" y2="12"></line>
                    <line x1="12" x2="12" y1="2" y2="22"></line>
                </svg>
                Move
            </button>
            <button id="delete-element" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                Delete
            </button>
        </div>
    `;
    document.body.appendChild(elementContextMenu);
    
    // Add context menu event listeners
    setupContextMenuEvents();
}

/**
 * Setup context menu event listeners
 */
function setupContextMenuEvents() {
    const editBtn = elementContextMenu.querySelector('#edit-element');
    const moveBtn = elementContextMenu.querySelector('#move-element');
    const deleteBtn = elementContextMenu.querySelector('#delete-element');
    
    editBtn.addEventListener('click', () => {
        enableEditMode();
        hideContextMenu();
    });
    
    moveBtn.addEventListener('click', () => {
        enableMoveMode();
        hideContextMenu();
    });
    
    deleteBtn.addEventListener('click', () => {
        deleteSelectedElement();
        hideContextMenu();
    });
    
    // Hide context menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!elementContextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });
}

/**
 * Handle canvas click to select elements
 */
function handleCanvasClick(e) {
    const canvas = document.getElementById('design-canvas');
    const clickedElement = e.target;
    
    // Don't select the canvas itself or placeholder
    if (clickedElement === canvas || clickedElement.closest('.absolute.inset-0')) {
        deselectElement();
        return;
    }
    
    // If in move mode, start dragging
    if (isMoveModeActive && selectedElement === clickedElement) {
        startDragging(e);
        return;
    }
    
    // Select the clicked element
    selectElement(clickedElement);
}

/**
 * Handle canvas right click for context menu
 */
function handleCanvasRightClick(e) {
    const canvas = document.getElementById('design-canvas');
    const clickedElement = e.target;
    
    // Don't show context menu for canvas itself, placeholder, or section elements
    if (clickedElement === canvas || 
        clickedElement.closest('.absolute.inset-0') ||
        clickedElement.closest('section[data-section]')) {
        return;
    }
    
    e.preventDefault();
    
    // Select element if not already selected
    if (selectedElement !== clickedElement) {
        selectElement(clickedElement);
    }
    
    // Show context menu
    showContextMenu(e.pageX, e.pageY);
}

/**
 * Select an element
 */
function selectElement(element) {
    // Deselect previous element
    deselectElement();
    
    selectedElement = element;
    
    // Add selection styling
    element.style.outline = '2px solid #3b82f6';
    element.style.outlineOffset = '2px';
    element.setAttribute('data-selected', 'true');
    
    // Position selection box
    updateSelectionBox();
}

/**
 * Deselect current element
 */
function deselectElement() {
    if (selectedElement) {
        selectedElement.style.outline = '';
        selectedElement.style.outlineOffset = '';
        selectedElement.style.cursor = '';
        selectedElement.removeAttribute('data-selected');
        selectedElement = null;
    }
    
    if (selectionBox) {
        selectionBox.classList.add('hidden');
    }
    
    // Disable move mode
    isMoveModeActive = false;
    isDragging = false;
    
    // Hide context menu
    hideContextMenu();
}

/**
 * Update selection box position
 */
function updateSelectionBox() {
    if (!selectedElement || !selectionBox) return;
    
    const rect = selectedElement.getBoundingClientRect();
    
    selectionBox.style.left = (rect.left - 2) + 'px';
    selectionBox.style.top = (rect.top - 2) + 'px';
    selectionBox.style.width = (rect.width + 4) + 'px';
    selectionBox.style.height = (rect.height + 4) + 'px';
    selectionBox.classList.remove('hidden');
}

/**
 * Show context menu
 */
function showContextMenu(x, y) {
    if (!elementContextMenu || !selectedElement) return;
    
    // Check if element has editable text
    const hasText = hasEditableText(selectedElement);
    const editBtn = elementContextMenu.querySelector('#edit-element');
    editBtn.style.display = hasText ? 'flex' : 'none';
    
    elementContextMenu.style.left = x + 'px';
    elementContextMenu.style.top = y + 'px';
    elementContextMenu.classList.remove('hidden');
}

/**
 * Hide context menu
 */
function hideContextMenu() {
    if (elementContextMenu) {
        elementContextMenu.classList.add('hidden');
    }
}

/**
 * Check if element has editable text
 */
function hasEditableText(element) {
    const textElements = element.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6, div');
    return Array.from(textElements).some(el => 
        el.textContent.trim() && !el.querySelector('svg')
    );
}

/**
 * Enable edit mode for text
 */
function enableEditMode() {
    if (!selectedElement) return;
    
    const textElements = selectedElement.querySelectorAll('span, p, h1, h2, h3, h4, h5, h6, div');
    
    textElements.forEach(textEl => {
        if (textEl.textContent.trim() && !textEl.querySelector('svg')) {
            textEl.contentEditable = 'true';
            textEl.style.outline = '1px dashed #60a5fa';
            textEl.focus();
            
            textEl.addEventListener('blur', () => {
                textEl.contentEditable = 'false';
                textEl.style.outline = '';
                updateCodeFromCanvas();
            });
            
            textEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    textEl.blur();
                }
            });
        }
    });
}

/**
 * Enable move mode
 */
function enableMoveMode() {
    if (!selectedElement) return;
    
    isMoveModeActive = true;
    selectedElement.style.cursor = 'move';
    
    // Visual feedback
    selectedElement.style.outline = '2px solid #10b981';
    
    // Show instruction
    showMoveInstruction();
}

/**
 * Show move instruction
 */
function showMoveInstruction() {
    const instruction = document.createElement('div');
    instruction.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm';
    instruction.textContent = 'Click and drag to move the element';
    document.body.appendChild(instruction);
    
    setTimeout(() => {
        instruction.remove();
    }, 3000);
}

/**
 * Start dragging
 */
function startDragging(e) {
    if (!selectedElement || !isMoveModeActive) return;
    
    isDragging = true;
    
    // Set position to absolute for free movement
    selectedElement.style.position = 'absolute';
    selectedElement.style.cursor = 'grabbing';
    selectedElement.style.zIndex = '1000';
    
    // Position element under cursor immediately
    const canvas = document.getElementById('design-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    const x = e.clientX - canvasRect.left - (selectedElement.offsetWidth / 2);
    const y = e.clientY - canvasRect.top - (selectedElement.offsetHeight / 2);
    
    selectedElement.style.left = Math.max(0, x) + 'px';
    selectedElement.style.top = Math.max(0, y) + 'px';
    
    updateSelectionBox();
    
    // Add mouse move listener specifically for this drag operation
    document.addEventListener('mousemove', dragElement);
    document.addEventListener('mouseup', stopDragging);
}

/**
 * Drag element function
 */
function dragElement(e) {
    if (!isDragging || !selectedElement) return;
    
    const canvas = document.getElementById('design-canvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    // Keep element centered under cursor
    const x = e.clientX - canvasRect.left - (selectedElement.offsetWidth / 2);
    const y = e.clientY - canvasRect.top - (selectedElement.offsetHeight / 2);
    
    // Constrain to canvas bounds
    const maxX = canvas.offsetWidth - selectedElement.offsetWidth;
    const maxY = canvas.offsetHeight - selectedElement.offsetHeight;
    
    selectedElement.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    selectedElement.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    
    updateSelectionBox();
}

/**
 * Stop dragging function
 */
function stopDragging() {
    if (isDragging) {
        isDragging = false;
        
        if (selectedElement) {
            selectedElement.style.cursor = 'move';
            selectedElement.style.zIndex = '';
            updateCodeFromCanvas();
        }
        
        // Remove event listeners
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', stopDragging);
    }
}

/**
 * Handle mouse move for dragging (fallback)
 */
function handleMouseMove(e) {
    // This is now handled by the specific drag listeners
    return;
}

/**
 * Handle mouse up to stop dragging (fallback)
 */
function handleMouseUp(e) {
    // This is now handled by the specific drag listeners
    return;
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyDown(e) {
    // Escape to deselect or exit move mode
    if (e.key === 'Escape') {
        if (isMoveModeActive) {
            isMoveModeActive = false;
            if (selectedElement) {
                selectedElement.style.cursor = '';
                selectedElement.style.outline = '2px solid #3b82f6';
            }
        } else {
            deselectElement();
        }
    }
}

/**
 * Delete selected element
 */
function deleteSelectedElement() {
    if (!selectedElement) return;
    
    const elementId = selectedElement.id;
    
    // Remove from canvas
    selectedElement.remove();
    
    // Remove from sections list if it has an ID
    if (elementId) {
        const sectionsList = document.getElementById('sections-list');
        const listItem = sectionsList.querySelector(`[data-section="${elementId}"]`);
        if (listItem) {
            listItem.remove();
        }
    }
    
    deselectElement();
    updateCodeFromCanvas();
    
    // Update empty state
    const sectionsEmpty = document.getElementById('sections-empty');
    const sectionsList = document.getElementById('sections-list');
    if (sectionsEmpty && sectionsList) {
        sectionsEmpty.style.display = sectionsList.children.length > 0 ? 'none' : 'block';
    }
}

/**
 * Update code editor from canvas changes
 */
function updateCodeFromCanvas() {
    if (window.updateCodeFromCanvas) {
        setTimeout(() => {
            window.updateCodeFromCanvas();
        }, 100);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeCanvasEditor, 300);
    });
} else {
    setTimeout(initializeCanvasEditor, 300);
}

// Handle window resize to update selection box
window.addEventListener('resize', () => {
    if (selectedElement) {
        setTimeout(updateSelectionBox, 100);
    }
});

console.log('🎨 IMPROVED CANVAS EDITOR LOADED SUCCESSFULLY');