/**
 * ============================================================================
 * PLENORA - SIDEBAR RESIZE SYSTEM
 * ============================================================================
 * 
 * @file        resize-k8m3p9.js
 * @version     1.0.0
 * @description Resizable sidebar functionality for left and right panels
 * @author      Navchetna
 * @company     NINELLMS SOLUTIONS LLP
 * @created     2025
 * 
 * ============================================================================
 */

/**
 * Sidebar Resize System
 * Handles resizing of left and right sidebars with drag handles
 */
function initializeSidebarResize() {
    const leftSidebar = document.getElementById('sidebar');
    const rightSidebar = document.getElementById('right-sidebar');
    const mainContent = document.getElementById('main-content');
    
    if (!leftSidebar || !rightSidebar || !mainContent) return;
    
    // Create resize handles
    createResizeHandle(leftSidebar, 'right');
    createResizeHandle(rightSidebar, 'left');
    
    // Initialize resize functionality
    setupResize(leftSidebar, 'left');
    setupResize(rightSidebar, 'right');
}

function createResizeHandle(sidebar, position) {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-handle-${position}`;
    handle.style.cssText = `
        position: absolute;
        ${position}: 0;
        top: 0;
        width: 4px;
        height: 100%;
        cursor: col-resize;
        background: transparent;
        z-index: 10;
        transition: background-color 0.2s;
    `;
    
    handle.addEventListener('mouseenter', () => {
        handle.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    
    handle.addEventListener('mouseleave', () => {
        handle.style.backgroundColor = 'transparent';
    });
    
    sidebar.style.position = 'relative';
    sidebar.appendChild(handle);
}

function setupResize(sidebar, side) {
    const handle = sidebar.querySelector(`.resize-handle-${side === 'left' ? 'right' : 'left'}`);
    if (!handle) return;
    
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    
    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(sidebar).width, 10);
        
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const diff = side === 'left' ? e.clientX - startX : startX - e.clientX;
        const newWidth = Math.max(200, Math.min(600, startWidth + diff));
        
        sidebar.style.width = newWidth + 'px';
        // Canvas width is controlled by device selector, not sidebar resize
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

function updateLayout() {
    // Canvas width should remain independent of sidebar resizing
    // The flex layout handles the main content area automatically
    // Canvas width is controlled by the device selector, not sidebar size
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeSidebarResize, 200);
    });
} else {
    setTimeout(initializeSidebarResize, 200);
}

console.log('📜 SIDEBAR RESIZE LOADED SUCCESSFULLY');