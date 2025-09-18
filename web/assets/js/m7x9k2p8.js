/**
 * Dynamic Modal Generator
 * Generates modals programmatically using JavaScript
 */

// Global variable to store CSV data
let csvSections = [];

// Load CSV data
async function loadCSVData() {
    try {
        const response = await fetch('assets/items.csv');
        const csvText = await response.text();
        
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        csvSections = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                if (values.length >= 2) {
                    csvSections.push({
                        websiteType: values[0].trim(),
                        section: values[1].replace(/"/g, '').trim()
                    });
                }
            }
        }
        
        console.log(`Loaded ${csvSections.length} sections from CSV`);
    } catch (error) {
        console.error('Error loading CSV:', error);
    }
}

// Generate sections HTML from CSV data
function generateSectionsHTML() {
    const categories = {};
    
    csvSections.forEach(item => {
        const category = item.websiteType;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(item.section);
    });
    
    let html = '';
    
    Object.keys(categories).forEach(category => {
        const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const categoryName = category.replace(' / ', ' / ');
        
        html += `
            <div class="mb-4">
                <h3 class="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2 px-2">${categoryName}</h3>
                <ul class="space-y-2">
        `;
        
        categories[category].forEach(section => {
            const sectionId = section.toLowerCase().replace(/[^a-z0-9]/g, '-');
            html += `
                    <li draggable="true" class="section-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors cursor-move" data-section="${sectionId}" data-category="${categoryId}">
                        <div class="h-6 w-6 rounded-md grid place-items-center bg-blue-500/20 text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-white">${section}</p>
                            <p class="text-xs text-neutral-400">${categoryName}</p>
                        </div>
                    </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    return html;
}

function createSectionsModal() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 hidden w-80 max-w-sm';
    
    modal.innerHTML = `
       <div class="relative ring-1 ring-inset ring-white/5 overflow-hidden bg-neutral-900/60 border-white/10 border rounded-2xl backdrop-blur-xl">
    <div id="modal-header" class="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-move">
        <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-neutral-200">Add Section</span>
            <span class="inline-flex items-center gap-1.5 text-[10px] font-medium text-green-300 bg-green-500/10 border border-green-500/20 rounded-full px-2 py-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 256 256" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"></path>
                </svg>
                <span id="sections-count">0</span> sections
            </span>
        </div>
        <button id="close-modal" class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
            </svg>
        </button>
    </div>
    
    <div class="px-4 py-3 border-b border-white/10">
        <div class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input id="section-search" type="text" placeholder="Search sections..." class="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50">
        </div>
    </div>
    
    <div class="px-4 py-2 border-b border-white/10">
        <div class="flex gap-1 overflow-x-auto scrollbar-hide">
            <button class="tab-btn active px-2 py-1 text-xs rounded-md bg-white/10 text-white whitespace-nowrap" data-tab="all">All</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="universal">Universal</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="business">Business</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="ecommerce">E-commerce</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="portfolio">Portfolio</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="agency">Agency</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="events">Events</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="food">Food</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="nonprofit">Non-Profit</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="saas">SaaS</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="blog">Blog</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="education">Education</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="healthcare">Healthcare</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="realestate">Real Estate</button>
            <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="community">Community</button>
        </div>
    </div>
    
    <div class="tab-content max-h-64 overflow-y-auto">
        <div id="all-sections" class="px-3 py-3">
            <!-- Sections will be dynamically loaded here -->
        </div>
    `;
    
    return modal;
}

function createAssetsModal() {
    const modal = document.createElement('div');
    modal.id = 'assets-modal';
    modal.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 hidden w-80 max-w-sm';
    
    modal.innerHTML = `
        <div class="relative ring-1 ring-inset ring-white/5 overflow-hidden bg-neutral-900/60 border-white/10 border rounded-2xl backdrop-blur-xl">
            <div id="assets-modal-header" class="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-move">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-neutral-200">Add Asset</span>
                    <span class="inline-flex items-center gap-1.5 text-[10px] font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                            <path d="M12 22V12"></path>
                            <polyline points="3.29 7 12 12 20.71 7"></polyline>
                        </svg>
                        <span id="assets-count">4</span> types
                    </span>
                </div>
                <button id="close-assets-modal" class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                    </svg>
                </button>
            </div>
            
            <div class="max-h-64 overflow-y-auto px-3 py-3">
                <ul class="space-y-2">
                    <li class="asset-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors cursor-pointer" data-asset="images">
                        <div class="h-6 w-6 rounded-md grid place-items-center bg-blue-500/20 text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-white">Images</p>
                            <p class="text-xs text-neutral-400">JPG, PNG, GIF</p>
                        </div>
                    </li>
                    <li class="asset-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors cursor-pointer" data-asset="videos">
                        <div class="h-6 w-6 rounded-md grid place-items-center bg-green-500/20 text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect width="15" height="14" x="1" y="5" rx="2" ry="2"></rect>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-white">Videos</p>
                            <p class="text-xs text-neutral-400">MP4, MOV, AVI</p>
                        </div>
                    </li>
                    <li class="asset-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors cursor-pointer" data-asset="documents">
                        <div class="h-6 w-6 rounded-md grid place-items-center bg-purple-500/20 text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-white">Documents</p>
                            <p class="text-xs text-neutral-400">DOC, TXT, RTF</p>
                        </div>
                    </li>
                    <li class="asset-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors cursor-pointer" data-asset="pdfs">
                        <div class="h-6 w-6 rounded-md grid place-items-center bg-red-500/20 text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <path d="M16 13H8"></path>
                                <path d="M16 17H8"></path>
                                <path d="M10 9H8"></path>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-white">PDFs</p>
                            <p class="text-xs text-neutral-400">PDF files only</p>
                        </div>
                    </li>
                </ul>
            </div>
            
            <input type="file" id="images-input" class="hidden" accept="image/*" multiple>
            <input type="file" id="videos-input" class="hidden" accept="video/*" multiple>
            <input type="file" id="documents-input" class="hidden" accept=".doc,.docx,.txt,.rtf" multiple>
            <input type="file" id="pdfs-input" class="hidden" accept=".pdf" multiple>
        </div>
    `;
    
    return modal;
}

function createContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.className = 'fixed z-[60] hidden bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-lg p-1 shadow-2xl';
    
    menu.innerHTML = `
        <button id="duplicate-item" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
            Duplicate
        </button>
        <button id="delete-item" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Delete
        </button>
    `;
    
    return menu;
}

// Initialize modals when DOM is ready
async function initializeModals() {
    console.log('🚀 Creating modals dynamically...');
    
    // Load CSV data first
    await loadCSVData();
    
    // Create and append modals
    const sectionsModal = createSectionsModal();
    const assetsModal = createAssetsModal();
    const contextMenu = createContextMenu();
    
    document.body.appendChild(sectionsModal);
    document.body.appendChild(assetsModal);
    document.body.appendChild(contextMenu);
    
    // Populate sections after modal is created
    populateSections();
    
    // Initialize drag and drop
    initializeSectionsDragDrop();
    
    // Initialize context menu
    initializeSectionsContextMenu();
    
    // Update empty state initially
    updateEmptyState();
    
    // Make closeModalHandler globally available
    window.closeModalHandler = closeModalHandler;
    
    console.log('✅ Modals created successfully');
}

// Close modal handler function
function closeModalHandler() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Show/hide empty state
function updateEmptyState() {
    const sectionsList = document.getElementById('sections-list');
    const emptyState = document.getElementById('sections-empty');
    
    if (!sectionsList || !emptyState) return;
    
    const hasSections = sectionsList.children.length > 0;
    emptyState.style.display = hasSections ? 'none' : 'block';
}

// Create section list item
function createSectionListItem(sectionName, sectionId) {
    const li = document.createElement('li');
    li.draggable = true;
    li.className = 'flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5 cursor-move';
    li.dataset.section = sectionId;
    li.dataset.name = sectionName;
    
    li.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" class="text-slate-400">
            <path d="M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 text-blue-400">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
        </svg>
        ${sectionName}
    `;
    
    return li;
}

// Add section to sections list
function addSectionToList(sectionName, sectionId) {
    const sectionsList = document.getElementById('sections-list');
    if (!sectionsList) return;
    
    // Allow duplicates by generating unique IDs
    const existingCount = sectionsList.querySelectorAll(`[data-section^="${sectionId}"]`).length;
    const uniqueId = existingCount > 0 ? `${sectionId}-${existingCount + 1}` : sectionId;
    
    const li = createSectionListItem(sectionName, uniqueId);
    sectionsList.appendChild(li);
    updateEmptyState();
    syncCanvasWithList();
}

// Add section to sections list at specific position
function addSectionToListAtPosition(sectionName, sectionId, targetElement, insertBefore) {
    const sectionsList = document.getElementById('sections-list');
    if (!sectionsList) return;
    
    // Allow duplicates by generating unique IDs
    const existingCount = sectionsList.querySelectorAll(`[data-section^="${sectionId}"]`).length;
    const uniqueId = existingCount > 0 ? `${sectionId}-${existingCount + 1}` : sectionId;
    
    const li = createSectionListItem(sectionName, uniqueId);
    
    if (insertBefore) {
        sectionsList.insertBefore(li, targetElement);
    } else {
        sectionsList.insertBefore(li, targetElement.nextSibling);
    }
    
    updateEmptyState();
    syncCanvasWithList();
}

// Delete section from list
function deleteSectionFromList(sectionElement) {
    if (sectionElement && sectionElement.parentNode) {
        sectionElement.remove();
        updateEmptyState();
        syncCanvasWithList();
    }
}

// Duplicate section in list
function duplicateSectionInList(sectionElement) {
    if (!sectionElement) return;
    
    const sectionName = sectionElement.dataset.name;
    const sectionId = sectionElement.dataset.section;
    
    // Generate unique ID for duplicate
    const sectionsList = document.getElementById('sections-list');
    const baseId = sectionId.replace(/-\d+$/, ''); // Remove existing number suffix
    const existingCount = sectionsList.querySelectorAll(`[data-section^="${baseId}"]`).length;
    const uniqueId = `${baseId}-${existingCount + 1}`;
    
    const duplicatedLi = createSectionListItem(sectionName, uniqueId);
    sectionsList.insertBefore(duplicatedLi, sectionElement.nextSibling);
    
    syncCanvasWithList();
}

// Initialize context menu for sections list
function initializeSectionsContextMenu() {
    const sectionsList = document.getElementById('sections-list');
    const contextMenu = document.getElementById('context-menu');
    const duplicateBtn = document.getElementById('duplicate-item');
    const deleteBtn = document.getElementById('delete-item');
    
    if (!sectionsList || !contextMenu) return;
    
    let currentTarget = null;
    
    // Show context menu on right click
    sectionsList.addEventListener('contextmenu', (e) => {
        const sectionItem = e.target.closest('li');
        if (sectionItem) {
            e.preventDefault();
            currentTarget = sectionItem;
            
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.classList.remove('hidden');
        }
    });
    
    // Remove existing event listeners to prevent duplicates
    if (duplicateBtn) {
        const newDuplicateBtn = duplicateBtn.cloneNode(true);
        duplicateBtn.parentNode.replaceChild(newDuplicateBtn, duplicateBtn);
        
        newDuplicateBtn.addEventListener('click', () => {
            if (currentTarget) {
                duplicateSectionInList(currentTarget);
                contextMenu.classList.add('hidden');
                currentTarget = null;
            }
        });
    }
    
    if (deleteBtn) {
        const newDeleteBtn = deleteBtn.cloneNode(true);
        deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
        
        newDeleteBtn.addEventListener('click', () => {
            if (currentTarget) {
                deleteSectionFromList(currentTarget);
                contextMenu.classList.add('hidden');
                currentTarget = null;
            }
        });
    }
    
    // Hide context menu on click outside
    document.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
        currentTarget = null;
    });
}

// Sync canvas with sections list order
function syncCanvasWithList() {
    const sectionsList = document.getElementById('sections-list');
    const designCanvas = document.getElementById('design-canvas');
    
    if (!sectionsList || !designCanvas) return;
    
    // Remove placeholder if it exists
    const placeholder = designCanvas.querySelector('.absolute.inset-0');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Clear canvas
    designCanvas.innerHTML = '';
    
    // Add sections in order from list
    Array.from(sectionsList.children).forEach(li => {
        const sectionId = li.dataset.section;
        const sectionName = li.dataset.name;
        
        const sectionElement = document.createElement('div');
        sectionElement.className = 'w-full p-8 border-b border-white/10 hover:bg-white/5 transition-colors';
        sectionElement.dataset.section = sectionId;
        sectionElement.innerHTML = `
            <div class="text-center text-slate-400">
                <h3 class="text-lg font-medium mb-2">${sectionName} Section</h3>
                <p class="text-sm opacity-60">Click to edit this ${sectionName.toLowerCase()} section</p>
            </div>
        `;
        
        designCanvas.appendChild(sectionElement);
    });
    
    // Show placeholder if no sections
    if (sectionsList.children.length === 0) {
        designCanvas.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                <div class="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 opacity-30">
                        <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                        <path d="M9 9h6v6H9z"></path>
                    </svg>
                    <p class="opacity-50">Drop sections here to start building</p>
                </div>
            </div>
        `;
    }
}

// Initialize drag and drop for sections list
function initializeSectionsDragDrop() {
    const sectionsList = document.getElementById('sections-list');
    const designCanvas = document.getElementById('design-canvas');
    
    if (!sectionsList || !designCanvas) return;
    
    let draggedElement = null;
    
    // Handle drag from sections list
    sectionsList.addEventListener('dragstart', (e) => {
        draggedElement = e.target.closest('li');
        if (draggedElement) {
            e.target.style.opacity = '0.5';
        }
    });
    
    sectionsList.addEventListener('dragend', (e) => {
        e.target.style.opacity = '1';
        draggedElement = null;
    });
    
    // Handle drop in sections list (reordering and adding)
    const sectionsContainer = sectionsList.parentElement;
    
    sectionsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        sectionsContainer.classList.add('bg-white/5');
    });
    
    sectionsContainer.addEventListener('dragleave', (e) => {
        if (!sectionsContainer.contains(e.relatedTarget)) {
            sectionsContainer.classList.remove('bg-white/5');
        }
    });
    
    sectionsContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        sectionsContainer.classList.remove('bg-white/5');
        
        // Handle drop from modal (adding new section)
        const sectionData = e.dataTransfer.getData('text/plain');
        if (sectionData && !draggedElement) {
            try {
                const data = JSON.parse(sectionData);
                
                // Find drop position
                const dropTarget = e.target.closest('li');
                if (dropTarget) {
                    const rect = dropTarget.getBoundingClientRect();
                    const midpoint = rect.top + rect.height / 2;
                    addSectionToListAtPosition(data.name, data.id, dropTarget, e.clientY < midpoint);
                } else {
                    addSectionToList(data.name, data.id);
                }
                
                closeModalHandler();
                return;
            } catch {
                // Handle simple string data
                const sectionId = sectionData;
                const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
                addSectionToList(sectionName, sectionId);
                closeModalHandler();
                return;
            }
        }
        
        // Handle reordering existing sections
        if (draggedElement) {
            const dropTarget = e.target.closest('li');
            if (dropTarget && dropTarget !== draggedElement) {
                const rect = dropTarget.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    sectionsList.insertBefore(draggedElement, dropTarget);
                } else {
                    sectionsList.insertBefore(draggedElement, dropTarget.nextSibling);
                }
                
                syncCanvasWithList();
            }
        }
    });
    
    // Handle drop in canvas (also adds to sections list)
    designCanvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        designCanvas.classList.add('bg-zinc-900/50');
    });
    
    designCanvas.addEventListener('dragleave', (e) => {
        if (!designCanvas.contains(e.relatedTarget)) {
            designCanvas.classList.remove('bg-zinc-900/50');
        }
    });
    
    designCanvas.addEventListener('drop', (e) => {
        e.preventDefault();
        designCanvas.classList.remove('bg-zinc-900/50');
        
        // Handle drop from modal
        const sectionData = e.dataTransfer.getData('text/plain');
        if (sectionData) {
            try {
                const data = JSON.parse(sectionData);
                addSectionToList(data.name, data.id);
                closeModalHandler();
            } catch {
                // Handle simple string data
                const sectionId = sectionData;
                const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' ');
                addSectionToList(sectionName, sectionId);
                closeModalHandler();
            }
        }
    });
}

// Handle section item clicks from modal
function handleSectionClick(event) {
    const sectionItem = event.target.closest('.section-item');
    if (!sectionItem) return;
    
    // Prevent click if this was a drag operation
    if (sectionItem.dataset.wasDragged === 'true') {
        return;
    }
    
    const sectionName = sectionItem.querySelector('p.text-sm').textContent;
    const sectionId = sectionItem.dataset.section;
    
    // Add to sections list
    addSectionToList(sectionName, sectionId);
    
    // Close modal
    closeModalHandler();
}

// Handle drag start from modal sections
function handleModalDragStart(event) {
    const sectionItem = event.target.closest('.section-item');
    if (!sectionItem) return;
    
    // Mark as dragged to prevent click event
    sectionItem.dataset.wasDragged = 'true';
    
    const sectionName = sectionItem.querySelector('p.text-sm').textContent;
    const sectionId = sectionItem.dataset.section;
    
    event.dataTransfer.setData('text/plain', JSON.stringify({
        name: sectionName,
        id: sectionId
    }));
    
    event.target.style.opacity = '0.5';
}

function handleModalDragEnd(event) {
    event.target.style.opacity = '1';
    
    // Clear drag flag after drop completes
    const sectionItem = event.target.closest('.section-item');
    if (sectionItem) {
        setTimeout(() => {
            delete sectionItem.dataset.wasDragged;
        }, 200);
    }
}

// Tab filtering functionality
function initializeTabFiltering() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update button states
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-white/10', 'text-white');
                btn.classList.add('text-slate-400');
            });
            
            button.classList.add('active', 'bg-white/10', 'text-white');
            button.classList.remove('text-slate-400');
            
            // Filter sections based on tab
            filterSectionsByTab(targetTab);
        });
    });
}

// Filter sections by tab
function filterSectionsByTab(tab) {
    const sectionsContainer = document.getElementById('all-sections');
    const sectionsCountElement = document.getElementById('sections-count');
    
    if (!sectionsContainer || csvSections.length === 0) return;
    
    let filteredSections = csvSections;
    
    if (tab !== 'all') {
        const tabMapping = {
            'universal': 'Universal Sections',
            'business': 'General / Business Website',
            'ecommerce': 'E-commerce / Online Store',
            'portfolio': 'Portfolio / Personal Website',
            'agency': 'Agency / Professional Services',
            'events': 'Event / Conference Website',
            'food': 'Restaurant / Bakery / Café Website',
            'nonprofit': 'Non-Profit / Charity Website',
            'saas': 'SaaS / Tech Product Website',
            'blog': 'Blog / Media / Personal Journal',
            'education': 'Education / School / University',
            'healthcare': 'Healthcare / Medical Website',
            'realestate': 'Real Estate Website',
            'community': 'Community / Forum Website'
        };
        
        const categoryName = tabMapping[tab];
        if (categoryName) {
            filteredSections = csvSections.filter(item => item.websiteType === categoryName);
        }
    }
    
    // Generate HTML for filtered sections
    const categories = {};
    filteredSections.forEach(item => {
        const category = item.websiteType;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(item.section);
    });
    
    let html = '';
    Object.keys(categories).forEach(category => {
        const categoryId = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const categoryName = category.replace(' / ', ' / ');
        
        html += `
            <div class="mb-4">
                <h3 class="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2 px-2">${categoryName}</h3>
                <ul class="space-y-2">
        `;
        
        categories[category].forEach(section => {
            const sectionId = section.toLowerCase().replace(/[^a-z0-9]/g, '-');
            html += `
                    <li draggable="true" class="section-item flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 transition-colors cursor-move" data-section="${sectionId}" data-category="${categoryId}">
                        <div class="h-6 w-6 rounded-md grid place-items-center bg-blue-500/20 text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm font-medium text-white">${section}</p>
                            <p class="text-xs text-neutral-400">${categoryName}</p>
                        </div>
                    </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    });
    
    sectionsContainer.innerHTML = html;
    sectionsCountElement.textContent = filteredSections.length;
    
    // Re-add event handlers after filtering
    setTimeout(() => {
        const sectionItems = document.querySelectorAll('.section-item');
        sectionItems.forEach(item => {
            item.addEventListener('click', handleSectionClick);
            item.addEventListener('dragstart', handleModalDragStart);
            item.addEventListener('dragend', handleModalDragEnd);
        });
    }, 50);
}

// Populate sections from CSV data
function populateSections() {
    const sectionsContainer = document.getElementById('all-sections');
    const sectionsCountElement = document.getElementById('sections-count');
    
    if (sectionsContainer && csvSections.length > 0) {
        sectionsContainer.innerHTML = generateSectionsHTML();
        sectionsCountElement.textContent = csvSections.length;
        
        // Add event handlers to section items
        setTimeout(() => {
            const sectionItems = document.querySelectorAll('.section-item');
            sectionItems.forEach(item => {
                item.addEventListener('click', handleSectionClick);
                item.addEventListener('dragstart', handleModalDragStart);
                item.addEventListener('dragend', handleModalDragEnd);
            });
        }, 50);
        
        // Initialize tab filtering after sections are populated
        setTimeout(() => {
            initializeTabFiltering();
        }, 100);
        
        console.log(`✅ Populated ${csvSections.length} sections from CSV`);
    } else {
        console.warn('⚠️ No sections container found or no CSV data loaded');
    }
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModals);
} else {
    initializeModals();
}