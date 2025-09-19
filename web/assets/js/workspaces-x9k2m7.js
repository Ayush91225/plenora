/**
 * ============================================================================
 * PLENORA - WORKSPACE MANAGEMENT SYSTEM
 * ============================================================================
 * 
 * @file        workspaces-x9k2m7.js
 * @version     1.0.0
 * @description Workspace/Pages management system with context menu support
 * @author      Navchetna
 * @company     NINELLMS SOLUTIONS LLP
 * @created     2025
 * 
 * ============================================================================
 */

/**
 * Workspace Management System
 * Handles creation, switching, and context menu for workspaces/pages
 */
let workspaces = [{ id: 'home', name: 'Home', active: true, content: '', sections: [] }];
let currentWorkspace = 'home';

function initializeWorkspaceManagement() {
    const addBtn = document.getElementById('add-workspace-btn');
    const container = document.getElementById('workspaces-container');
    
    if (!addBtn || !container) return;
    
    addBtn.addEventListener('click', () => {
        addWorkspace('Untitled');
    });
    
    updateWorkspaceTabs();
    initializeWorkspaceContextMenu();
    
    // Load current workspace content
    loadWorkspaceContent(currentWorkspace);
}

function addWorkspace(name) {
    const id = 'workspace-' + Date.now();
    const uniqueName = generateUniqueName(name);
    workspaces.push({ id, name: uniqueName, active: false, editing: true, content: '', sections: [] });
    
    // Save current workspace content before switching
    saveCurrentWorkspaceContent();
    
    // Set new workspace as active
    workspaces.forEach(w => w.active = false);
    workspaces[workspaces.length - 1].active = true;
    currentWorkspace = id;
    
    updateWorkspaceTabs();
    loadWorkspaceContent(id);
}

function switchWorkspace(id) {
    // Save current workspace content before switching
    saveCurrentWorkspaceContent();
    
    workspaces.forEach(w => w.active = w.id === id);
    currentWorkspace = id;
    updateWorkspaceTabs();
    loadWorkspaceContent(id);
}

function saveCurrentWorkspaceContent() {
    const currentWs = workspaces.find(w => w.id === currentWorkspace);
    if (currentWs) {
        const canvas = document.getElementById('design-canvas');
        const sectionsList = document.getElementById('sections-list');
        
        if (canvas) {
            currentWs.content = canvas.innerHTML;
        }
        
        if (sectionsList) {
            currentWs.sections = Array.from(sectionsList.children).map(li => ({
                html: li.outerHTML,
                data: li.dataset
            }));
        }
    }
}

function loadWorkspaceContent(workspaceId) {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (!workspace) return;
    
    const canvas = document.getElementById('design-canvas');
    const sectionsList = document.getElementById('sections-list');
    const sectionsEmpty = document.getElementById('sections-empty');
    
    // Load canvas content
    if (canvas) {
        if (workspace.content) {
            canvas.innerHTML = workspace.content;
        } else {
            // Default empty canvas
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
    }
    
    // Load sections list
    if (sectionsList && sectionsEmpty) {
        if (workspace.sections && workspace.sections.length > 0) {
            sectionsList.innerHTML = workspace.sections.map(section => section.html).join('');
            sectionsEmpty.style.display = 'none';
            sectionsList.parentElement.style.display = 'block';
        } else {
            sectionsList.innerHTML = '';
            sectionsEmpty.style.display = 'block';
        }
    }
}

function updateWorkspaceTabs() {
    const container = document.getElementById('workspaces-container');
    if (!container) return;
    
    container.innerHTML = workspaces.map(workspace => `
        <div class="workspace-tab ${workspace.active ? 'active' : ''} flex-shrink-0 px-4 py-2 text-xs ${workspace.active ? 'bg-white/5 text-white' : 'bg-transparent text-slate-400'} border-r border-white/10 cursor-pointer transition hover:bg-white/10 hover:text-white relative" 
             data-workspace="${workspace.id}">
            ${workspace.editing ? `<input type="text" value="${workspace.name}" class="bg-transparent outline-none text-xs w-full" onblur="finishEditing('${workspace.id}', this.value)" onkeydown="if(event.key==='Enter') this.blur()" autofocus>` : workspace.name}
            ${workspace.active ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400"></div>' : ''}
        </div>
    `).join('');
    
    // Add click listeners
    container.querySelectorAll('.workspace-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') return;
            const workspaceId = tab.dataset.workspace;
            switchWorkspace(workspaceId);
        });
    });
}

function hasIllegalChars(name) {
    return /[/\\:*?"<>|#%&{}\[\]@!$^+=~`]/.test(name);
}

function sanitizeName(name) {
    // Remove illegal characters for URLs: / \ : * ? " < > | and others
    return name.replace(/[/\\:*?"<>|#%&{}\[\]@!$^+=~`]/g, '').trim();
}

function generateUniqueName(baseName) {
    let cleanName = sanitizeName(baseName) || 'Untitled';
    
    // Check if name already exists (case-insensitive)
    let counter = 0;
    let uniqueName = cleanName;
    
    while (workspaces.some(w => w.name.toLowerCase() === uniqueName.toLowerCase())) {
        counter++;
        uniqueName = `${cleanName} ${counter}`;
    }
    
    return uniqueName;
}

function finishEditing(workspaceId, newName) {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
        const originalName = workspace.name;
        
        // Check for illegal characters
        if (hasIllegalChars(newName)) {
            showIllegalCharsToast();
        }
        
        const cleanName = sanitizeName(newName) || 'Untitled';
        
        // Generate unique name excluding current workspace
        let counter = 0;
        let uniqueName = cleanName;
        
        while (workspaces.some(w => w.id !== workspaceId && w.name.toLowerCase() === uniqueName.toLowerCase())) {
            counter++;
            uniqueName = `${cleanName} ${counter}`;
        }
        
        workspace.name = uniqueName;
        workspace.editing = false;
        updateWorkspaceTabs();
        
        // Show renamed toast if name actually changed
        if (originalName !== uniqueName) {
            showPageRenamedToast();
        }
    }
}

/**
 * Workspace Context Menu System
 * Handles right-click context menu for workspace tabs
 */
function initializeWorkspaceContextMenu() {
    let workspaceContextMenu = null;
    let currentWorkspaceTab = null;
    
    document.addEventListener('contextmenu', function(e) {
        const workspaceTab = e.target.closest('.workspace-tab');
        if (workspaceTab && !e.target.matches('input')) {
            e.preventDefault();
            currentWorkspaceTab = workspaceTab;
            
            // Get current workspace info
            const workspaceId = currentWorkspaceTab.dataset.workspace;
            const workspace = workspaces.find(w => w.id === workspaceId);
            const isHome = workspace && workspace.name.toLowerCase() === 'home';
            
            if (!workspaceContextMenu) {
                workspaceContextMenu = document.createElement('div');
                workspaceContextMenu.className = 'fixed z-[9999] hidden';
                document.body.appendChild(workspaceContextMenu);
            }
            
            // Always regenerate menu content based on current workspace
            workspaceContextMenu.innerHTML = `
                <div class="bg-black/80 border-white/10 border rounded-lg shadow-xl backdrop-blur">
                    <button id="copy-page-path" class="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition">
                        Copy Page Path
                    </button>
                    ${!isHome ? '<button id="rename-workspace" class="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition border-t border-white/10">Rename</button>' : ''}
                    ${!isHome ? '<button id="delete-workspace" class="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition border-t border-white/10">Delete</button>' : ''}
                </div>
            `;
            
            // Add event listeners for the regenerated buttons
            
            workspaceContextMenu.querySelector('#copy-page-path').addEventListener('click', function() {
                const workspaceId = currentWorkspaceTab.dataset.workspace;
                const workspace = workspaces.find(w => w.id === workspaceId);
                
                if (workspace) {
                    const pagePath = workspace.name.toLowerCase() === 'home' ? '/' : `/${workspace.name.toLowerCase().replace(/\s+/g, '-')}`;
                    
                    // Copy to clipboard
                    const textArea = document.createElement('textarea');
                    textArea.value = pagePath;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        showPagePathToast();
                    } catch (err) {
                        console.error('Copy failed:', err);
                    }
                    
                    document.body.removeChild(textArea);
                    workspaceContextMenu.classList.add('hidden');
                }
            });
            
            // Add rename functionality if not Home tab
            const renameBtn = workspaceContextMenu.querySelector('#rename-workspace');
            if (renameBtn) {
                renameBtn.addEventListener('click', function() {
                    const workspaceId = currentWorkspaceTab.dataset.workspace;
                    const workspace = workspaces.find(w => w.id === workspaceId);
                    
                    if (workspace) {
                        workspace.editing = true;
                        updateWorkspaceTabs();
                        workspaceContextMenu.classList.add('hidden');
                    }
                });
            }
            
            // Add delete functionality if not Home tab
            const deleteBtn = workspaceContextMenu.querySelector('#delete-workspace');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const workspaceId = currentWorkspaceTab.dataset.workspace;
                    const workspace = workspaces.find(w => w.id === workspaceId);
                    
                    if (workspace) {
                        showDeleteConfirmationModal(workspace);
                        workspaceContextMenu.classList.add('hidden');
                    }
                });
            }
            
            workspaceContextMenu.style.left = e.pageX + 'px';
            workspaceContextMenu.style.top = e.pageY + 'px';
            workspaceContextMenu.classList.remove('hidden');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (workspaceContextMenu && !workspaceContextMenu.contains(e.target)) {
            workspaceContextMenu.classList.add('hidden');
        }
    });
}

/**
 * Toast Notification for Illegal Characters
 * Shows warning when illegal characters are used
 */
function showIllegalCharsToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 right-4 z-[10000] transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-500/20 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" style="color: #ef4444;">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path>
                <path d="m12 17 .01 0"></path>
            </svg>
            <span class="text-sm">Illegal chars not allowed</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Delete Confirmation Modal
 * Shows confirmation dialog before deleting a workspace
 */
function showDeleteConfirmationModal(workspace) {
    const pagePath = workspace.name.toLowerCase() === 'home' ? '/' : `/${workspace.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-black/80 border border-white/10 rounded-xl p-5 max-w-sm w-full mx-4 shadow-2xl backdrop-blur-md">
            <h3 class="text-white font-medium mb-2">Delete ${workspace.name}</h3>
            <p class="text-slate-400 text-sm mb-4">This will permanently delete <strong>${pagePath}</strong></p>
            <input 
                id="delete-confirmation-input" 
                type="text" 
                placeholder="delete" 
                class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm mb-2 outline-none focus:border-red-500/50 focus:bg-white/10"
            >
            <p class="text-xs text-slate-400 mb-4">Type "delete" to delete the mentioned page</p>
            <div class="flex gap-2">
                <button id="cancel-delete" class="flex-1 py-2 text-sm bg-white/5 hover:bg-white/10 text-white rounded-lg transition">
                    Cancel
                </button>
                <button id="confirm-delete" class="flex-1 py-2 text-sm bg-red-600/50 text-red-300 rounded-lg transition opacity-50 cursor-not-allowed" disabled>
                    Delete
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = modal.querySelector('#delete-confirmation-input');
    const confirmBtn = modal.querySelector('#confirm-delete');
    const cancelBtn = modal.querySelector('#cancel-delete');
    
    // Enable delete button only when correct text is entered
    input.addEventListener('input', function() {
        if (this.value === 'delete') {
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-red-600/50', 'text-red-300');
            confirmBtn.classList.add('bg-red-600', 'hover:bg-red-700', 'text-white');
        } else {
            confirmBtn.disabled = true;
            confirmBtn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-red-600/50', 'text-red-300');
            confirmBtn.classList.remove('bg-red-600', 'hover:bg-red-700', 'text-white');
        }
    });
    
    // Handle delete confirmation
    confirmBtn.addEventListener('click', function() {
        if (input.value === 'delete') {
            deleteWorkspace(workspace.id);
            document.body.removeChild(modal);
        }
    });
    
    // Handle cancel
    cancelBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Focus input
    setTimeout(() => input.focus(), 100);
}

function deleteWorkspace(workspaceId) {
    const workspaceIndex = workspaces.findIndex(w => w.id === workspaceId);
    if (workspaceIndex === -1) return;
    
    const wasActive = workspaces[workspaceIndex].active;
    
    // Remove workspace
    workspaces.splice(workspaceIndex, 1);
    
    // If deleted workspace was active, switch to Home
    if (wasActive && workspaces.length > 0) {
        const homeWorkspace = workspaces.find(w => w.name.toLowerCase() === 'home');
        if (homeWorkspace) {
            homeWorkspace.active = true;
            currentWorkspace = homeWorkspace.id;
            loadWorkspaceContent(homeWorkspace.id);
        }
    }
    
    updateWorkspaceTabs();
    showPageDeletedToast();
}

/**
 * Toast Notification for Page Delete
 * Shows success message when page is deleted
 */
function showPageDeletedToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 right-4 z-[10000] transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md bg-red-500/20 border border-red-500/20 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" style="color: #ef4444;">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2"></path>
                <line x1="10" x2="10" y1="11" y2="17"></line>
                <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
            <span class="text-sm">Page deleted</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Toast Notification for Page Rename
 * Shows success message when page is renamed
 */
function showPageRenamedToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 right-4 z-[10000] transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md bg-purple-500/20 border border-purple-500/20 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" style="color: #a855f7;">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <path d="m10 13 2 2 4-4"></path>
            </svg>
            <span class="text-sm">Page renamed</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

/**
 * Toast Notification for Page Path Copy
 * Shows success message when page path is copied
 */
function showPagePathToast() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-5 right-4 z-[10000] transition-all duration-300 transform translate-x-full opacity-0';
    toast.innerHTML = `
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-md bg-black/20 border border-white/20 text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" style="color: #f7b984;">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                <path d="m9 11 3 3L22 4"></path>
            </svg>
            <span class="text-sm">Page path copied</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Make functions globally available
window.finishEditing = finishEditing;
window.initializeWorkspaceManagement = initializeWorkspaceManagement;

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeWorkspaceManagement, 100); // Delay to ensure DOM is ready
    });
} else {
    setTimeout(initializeWorkspaceManagement, 100);
}

console.log('📜 WORKSPACE MANAGEMENT LOADED SUCCESSFULLY');