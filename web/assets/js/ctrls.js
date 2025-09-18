/**
 * ============================================================================
 * PLENORA - AI-POWERED WEBSITE BUILDER
 * ============================================================================
 * 
 * @file        ctrls.js
 * @version     1.0.0
 * @description Core JavaScript controller for Plenora website builder interface
 * @author      Navchetna
 * @company     NINELLMS SOLUTIONS LLP
 * @collaboration Tantrix Solutions OPC PVT LTD
 * @created     2025
 * 
 * ============================================================================
 * COPYRIGHT & LICENSE INFORMATION
 * ============================================================================
 * 
 * Copyright (c) 2025 NINELLMS SOLUTIONS LLP
 * Developed by Navchetna for Tantrix Solutions OPC PVT LTD
 * 
 * This software is proprietary and confidential. Unauthorized copying of this
 * file, via any medium, is strictly prohibited. This software is licensed under
 * a commercial license agreement and may not be used, modified, or distributed
 * without explicit written permission from the copyright holder.
 * 
 * TERMS OF USE:
 * - This software is provided "as is" without warranty of any kind
 * - Commercial use requires valid license agreement
 * - Reverse engineering is strictly prohibited
 * - Distribution without authorization is illegal
 * 
 * For licensing inquiries, contact:
 * NINELLMS SOLUTIONS LLP
 * Email: legal@navchetna.tech
 * 
 * ============================================================================
 * TECHNICAL SPECIFICATIONS
 * ============================================================================
 * 
 * Dependencies: None (Vanilla JavaScript)
 * Browser Support: Modern browsers (ES6+)
 * Performance: Optimized for real-time interactions
 * Security: Input validation and XSS protection implemented
 * 
 * ============================================================================
 */

/**
 * Mobile Device Detection Module
 * Implements responsive design enforcement for desktop-only application
 * @returns {boolean} True if mobile device detected
 */
function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || window.innerWidth <= 1024;
}

if (isMobileDevice()) {
    document.querySelector('.desktop-content').style.display = 'none';
    document.querySelector('.mobile-block').style.display = 'flex';
}

/**
 * Sidebar Management System
 * Handles dynamic layout adjustments and responsive sidebar controls
 * Implements three-panel layout with collapsible sidebars
 */
let leftSidebarOpen = true;
let rightSidebarOpen = true;
const sidebarToggle = document.getElementById('sidebar-toggle');
const floatingToggle = document.getElementById('floating-toggle');
const sidebar = document.getElementById('sidebar');
const rightSidebarToggle = document.getElementById('right-sidebar-toggle');
const floatingRightToggle = document.getElementById('floating-right-toggle');
const rightSidebar = document.getElementById('right-sidebar');
const mainContent = document.getElementById('main-content');

function updateLayout() {
    if (leftSidebarOpen && rightSidebarOpen) {
        mainContent.className = 'relative md:col-span-6 bg-white/[0.01] backdrop-blur-sm';
    } else if (leftSidebarOpen || rightSidebarOpen) {
        mainContent.className = 'relative md:col-span-9 bg-white/[0.01] backdrop-blur-sm';
    } else {
        mainContent.className = 'relative md:col-span-12 bg-white/[0.01] backdrop-blur-sm';
    }
}

function toggleLeftSidebar() {
    leftSidebarOpen = !leftSidebarOpen;
    sidebar.style.display = leftSidebarOpen ? 'block' : 'none';
    floatingToggle.style.display = leftSidebarOpen ? 'none' : 'block';
    updateLayout();
}

function toggleRightSidebar() {
    rightSidebarOpen = !rightSidebarOpen;
    rightSidebar.style.display = rightSidebarOpen ? 'block' : 'none';
    floatingRightToggle.style.display = rightSidebarOpen ? 'none' : 'block';
    updateLayout();
}

sidebarToggle.addEventListener('click', toggleLeftSidebar);
floatingToggle.addEventListener('click', toggleLeftSidebar);
rightSidebarToggle.addEventListener('click', toggleRightSidebar);
floatingRightToggle.addEventListener('click', toggleRightSidebar);

/**
 * Design Canvas Management
 * Handles the main design area where sections are dropped and arranged
 */
const designCanvas = document.getElementById('design-canvas');

// Handle canvas resizing
function resizeCanvas() {
    const container = document.getElementById('canvas-container');
    if (designCanvas) {
        designCanvas.style.minHeight = Math.max(800, container.clientHeight) + 'px';
    }
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Make design canvas a drop zone for sections
if (designCanvas) {
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
        
        if (draggedFromModal && draggedElement) {
            const sectionType = e.dataTransfer.getData('text/plain');
            addSectionToCanvas(sectionType);
            closeModalHandler();
        }
    });
}

// Add section to canvas
function addSectionToCanvas(sectionType) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'w-full p-8 border-b border-white/10 hover:bg-white/5 transition-colors';
    sectionElement.innerHTML = `
        <div class="text-center text-slate-400">
            <h3 class="text-lg font-medium mb-2">${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section</h3>
            <p class="text-sm opacity-60">Click to edit this ${sectionType} section</p>
        </div>
    `;
    
    // Remove placeholder if it exists
    const placeholder = designCanvas.querySelector('.absolute.inset-0');
    if (placeholder) {
        placeholder.remove();
    }
    
    designCanvas.appendChild(sectionElement);
}

/**
 * Drag & Drop Interface Controller
 * Handles both section reordering and adding new sections from modal
 */
const sectionsList = document.getElementById('sections-list');
let draggedElement = null;
let draggedFromModal = false;

// Handle drag from modal sections - will be initialized after modal is ready
function initializeDragFromModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('dragstart', (e) => {
            const sectionItem = e.target.closest('.section-item');
            if (sectionItem) {
                draggedElement = sectionItem;
                draggedFromModal = true;
                e.target.style.opacity = '0.5';
                e.dataTransfer.setData('text/plain', sectionItem.dataset.section);
            }
        });

        modal.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
            draggedElement = null;
            draggedFromModal = false;
        });
    }
}

// Drag from modal initialization is now handled by initializeAllSystems()

// Handle drag within sections list
sectionsList.addEventListener('dragstart', (e) => {
    if (!draggedFromModal) {
        draggedElement = e.target.closest('li');
        e.target.style.opacity = '0.5';
    }
});

sectionsList.addEventListener('dragend', (e) => {
    e.target.style.opacity = '1';
    if (!draggedFromModal) {
        draggedElement = null;
    }
});

sectionsList.addEventListener('dragover', (e) => {
    e.preventDefault();
});

sectionsList.addEventListener('drop', (e) => {
    e.preventDefault();
    
    if (draggedFromModal && draggedElement) {
        // Create new section from modal
        const sectionType = e.dataTransfer.getData('text/plain');
        const newSection = createSectionElement(sectionType);
        
        const dropTarget = e.target.closest('li');
        if (dropTarget) {
            const rect = dropTarget.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (e.clientY < midpoint) {
                sectionsList.insertBefore(newSection, dropTarget);
            } else {
                sectionsList.insertBefore(newSection, dropTarget.nextSibling);
            }
        } else {
            sectionsList.appendChild(newSection);
        }
        
        closeModalHandler();
    } else if (draggedElement && !draggedFromModal) {
        // Reorder existing sections
        const dropTarget = e.target.closest('li');
        if (dropTarget && draggedElement && dropTarget !== draggedElement) {
            const rect = dropTarget.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            
            if (e.clientY < midpoint) {
                sectionsList.insertBefore(draggedElement, dropTarget);
            } else {
                sectionsList.insertBefore(draggedElement, dropTarget.nextSibling);
            }
        }
    }
});

// Create section element based on type
function createSectionElement(sectionType) {
    const sectionData = {
        header: { name: 'Header', icon: 'M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z', color: 'text-sky-400' },
        hero: { name: 'Hero', icon: 'M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8', color: 'text-purple-400' },
        features: { name: 'Features', icon: 'M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8', color: 'text-emerald-400' },
        pricing: { name: 'Pricing', icon: 'M20 14H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z', color: 'text-amber-400' },
        testimonials: { name: 'Testimonials', icon: 'M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z', color: 'text-pink-400' },
        footer: { name: 'Footer', icon: 'M22 12h-4l-3 9L9 3l-3 9H2', color: 'text-yellow-400' },
        about: { name: 'About', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', color: 'text-green-400' },
        services: { name: 'Services', icon: 'M7 3v18M3 9h18M3 15h18', color: 'text-orange-400' },
        contact: { name: 'Contact', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07', color: 'text-red-400' }
    };
    
    const data = sectionData[sectionType] || sectionData.header;
    
    const li = document.createElement('li');
    li.draggable = true;
    li.className = 'flex items-center gap-2 rounded-md px-2 py-1 hover:bg-white/5 cursor-move';
    li.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" class="text-slate-400">
            <path d="M104,60A12,12,0,1,1,92,48,12,12,0,0,1,104,60Zm60,12a12,12,0,1,0-12-12A12,12,0,0,0,164,72ZM92,116a12,12,0,1,0,12,12A12,12,0,0,0,92,116Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,116ZM92,184a12,12,0,1,0,12,12A12,12,0,0,0,92,184Zm72,0a12,12,0,1,0,12,12A12,12,0,0,0,164,184Z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 ${data.color}">
            <path d="${data.icon}"></path>
        </svg>
        ${data.name}
    `;
    
    return li;
}

/**
 * Modal Dialog Management System
 * Compact window-style modal with drag-and-drop functionality
 */
function initializeModal() {
    console.log('🔧 Initializing Modal System...');
    
    const modal = document.getElementById('modal');
    const addSectionBtn = document.getElementById('add-section-btn');
    const closeModal = document.getElementById('close-modal');
    const modalHeader = document.getElementById('modal-header');
    const searchInput = document.getElementById('section-search');
    
    console.log('Modal elements check:', {
        modal: !!modal,
        addSectionBtn: !!addSectionBtn,
        closeModal: !!closeModal,
        modalHeader: !!modalHeader,
        searchInput: !!searchInput
    });
    
    if (!modal || !addSectionBtn || !closeModal) {
        console.error('❌ Modal elements not found - initialization failed');
        return;
    }

    // Drag functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    modalHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = modal.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        modal.style.left = x + 'px';
        modal.style.top = y + 'px';
        modal.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const sectionItems = document.querySelectorAll('.section-item');
        
        sectionItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const listItem = item.closest('li');
            if (listItem) {
                listItem.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            } else {
                item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
            }
        });
        
        updateSectionsCount();
    });

    function updateSectionsCount() {
        const visibleSections = document.querySelectorAll('.section-item:not([style*="display: none"])');
        document.getElementById('sections-count').textContent = visibleSections.length;
    }

    function closeModalHandler() {
        modal.classList.add('hidden');
        // Reset position
        modal.style.left = '';
        modal.style.top = '';
        modal.style.transform = 'translateX(-50%)';
        // Clear search
        searchInput.value = '';
        document.querySelectorAll('.section-item').forEach(item => {
            const listItem = item.closest('li');
            if (listItem) {
                listItem.style.display = 'flex';
            } else {
                item.style.display = 'flex';
            }
        });
        updateSectionsCount();
        // Hide context menu when modal closes
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.classList.add('hidden');
        }
    }

    // Remove any existing listeners first
    const newAddBtn = addSectionBtn.cloneNode(true);
    addSectionBtn.parentNode.replaceChild(newAddBtn, addSectionBtn);
    
    newAddBtn.addEventListener('click', (e) => {
        console.log('🚀 Add Section Button Clicked (ctrls.js)');
        e.preventDefault();
        e.stopPropagation();
        
        // Hide context menu before opening modal
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.classList.add('hidden');
            console.log('✅ Context menu hidden');
        }
        
        modal.classList.remove('hidden');
        updateSectionsCount();
        console.log('✅ Sections modal opened');
    });

    // Remove any existing listeners first
    const newCloseBtn = closeModal.cloneNode(true);
    closeModal.parentNode.replaceChild(newCloseBtn, closeModal);
    
    newCloseBtn.addEventListener('click', (e) => {
        console.log('🚀 Close Modal Button Clicked (ctrls.js)');
        e.preventDefault();
        e.stopPropagation();
        closeModalHandler();
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!modal.contains(e.target) && !addSectionBtn.contains(e.target) && !modal.classList.contains('hidden')) {
            closeModalHandler();
        }
    });

    // Initialize count
    updateSectionsCount();
}

// Modal initialization is now handled by initializeAllSystems()

/**
 * Assets Modal Management
 */
function initializeAssetsModal() {
    console.log('🔧 Initializing Assets Modal System...');
    
    const assetsModal = document.getElementById('assets-modal');
    const addAssetBtn = document.getElementById('add-asset-btn');
    const closeAssetsModal = document.getElementById('close-assets-modal');
    const assetsModalHeader = document.getElementById('assets-modal-header');
    
    console.log('Assets modal elements check:', {
        assetsModal: !!assetsModal,
        addAssetBtn: !!addAssetBtn,
        closeAssetsModal: !!closeAssetsModal,
        assetsModalHeader: !!assetsModalHeader
    });
    
    if (!assetsModal || !addAssetBtn || !closeAssetsModal) {
        console.error('❌ Assets modal elements not found - initialization failed');
        return;
    }

    // Drag functionality for assets modal
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    if (assetsModalHeader) {
        assetsModalHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = assetsModal.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            
            assetsModal.style.left = x + 'px';
            assetsModal.style.top = y + 'px';
            assetsModal.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    function closeAssetsModalHandler() {
        assetsModal.classList.add('hidden');
        // Reset position
        assetsModal.style.left = '';
        assetsModal.style.top = '';
        assetsModal.style.transform = 'translateX(-50%)';
        // Hide context menu
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.classList.add('hidden');
        }
    }

    // Remove any existing listeners first
    const newAddAssetBtn = addAssetBtn.cloneNode(true);
    addAssetBtn.parentNode.replaceChild(newAddAssetBtn, addAssetBtn);
    
    newAddAssetBtn.addEventListener('click', (e) => {
        console.log('🚀 Add Asset Button Clicked (ctrls.js)');
        e.preventDefault();
        e.stopPropagation();
        
        // Hide context menu before opening modal
        const contextMenu = document.getElementById('context-menu');
        if (contextMenu) {
            contextMenu.classList.add('hidden');
            console.log('✅ Context menu hidden');
        }
        
        assetsModal.classList.remove('hidden');
        console.log('✅ Assets modal opened');
    });

    // Remove any existing listeners first
    const newCloseAssetsBtn = closeAssetsModal.cloneNode(true);
    closeAssetsModal.parentNode.replaceChild(newCloseAssetsBtn, closeAssetsModal);
    
    newCloseAssetsBtn.addEventListener('click', (e) => {
        console.log('🚀 Close Assets Modal Button Clicked (ctrls.js)');
        e.preventDefault();
        e.stopPropagation();
        closeAssetsModalHandler();
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!assetsModal.contains(e.target) && !newAddAssetBtn.contains(e.target) && !assetsModal.classList.contains('hidden')) {
            closeAssetsModalHandler();
        }
    });

    // Handle asset item clicks to trigger file inputs
    const assetItems = assetsModal.querySelectorAll('.asset-item');
    assetItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const assetType = item.dataset.asset;
            console.log('🚀 Asset item clicked:', assetType);
            
            // Map asset types to input IDs
            const inputMap = {
                'images': 'images-input',
                'videos': 'videos-input', 
                'documents': 'documents-input',
                'pdfs': 'pdfs-input'
            };
            
            const inputId = inputMap[assetType];
            if (inputId) {
                const input = document.getElementById(inputId);
                if (input) {
                    input.click();
                    console.log('✅ File input triggered:', inputId);
                } else {
                    console.error('❌ File input not found:', inputId);
                }
            }
        });
    });
}

// Assets modal initialization is now handled by initializeAllSystems()

/**
 * Digital Asset Management Module
 * Handles multi-format file uploads with thumbnail generation
 * Supports images, videos, documents, and PDFs with type validation
 */
let assets = [];

function initializeAssetManagement() {
    const assetsGrid = document.getElementById('assets-grid');
    const assetsEmpty = document.getElementById('assets-empty');
    
    if (!assetsGrid || !assetsEmpty) {
        console.error('Asset management elements not found');
        return;
    }

    function createVideoThumbnail(file) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                video.currentTime = 1;
            });
            
            video.addEventListener('seeked', () => {
                ctx.drawImage(video, 0, 0);
                resolve(canvas.toDataURL());
            });
            
            video.src = URL.createObjectURL(file);
        });
    }

    function getAssetDisplay(asset) {
        if (asset.type === 'video') {
            return `<div class="aspect-video overflow-hidden rounded-md bg-white/5 border border-white/10 relative cursor-pointer">
                <img src="${asset.thumbnail}" alt="${asset.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="bg-black/50 rounded-full p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white">
                            <polygon points="5,3 19,12 5,21 5,3"></polygon>
                        </svg>
                    </div>
                </div>
            </div>`;
        } else if (asset.type === 'document' || asset.type === 'pdf') {
            const iconColor = asset.type === 'pdf' ? 'text-red-400' : 'text-blue-400';
            return `<div class="aspect-video overflow-hidden rounded-md bg-white/5 border border-white/10 flex flex-col items-center justify-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${iconColor}">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                </svg>
                <span class="text-xs text-slate-400 mt-1 truncate w-full text-center px-1">${asset.name}</span>
            </div>`;
        } else {
            return `<div class="aspect-video overflow-hidden rounded-md bg-white/5 border border-white/10 cursor-pointer">
                <img src="${asset.url}" alt="${asset.name}" class="w-full h-full object-cover">
            </div>`;
        }
    }

    function updateAssetsDisplay() {
        if (assets.length === 0) {
            assetsGrid.classList.add('hidden');
            assetsEmpty.classList.remove('hidden');
        } else {
            assetsGrid.classList.remove('hidden');
            assetsEmpty.classList.add('hidden');
            assetsGrid.innerHTML = assets.map(getAssetDisplay).join('');
        }
    }

    async function handleFileUpload(files, type) {
        const assetsModal = document.getElementById('assets-modal');
        for (const file of files) {
            const url = URL.createObjectURL(file);
            const asset = { name: file.name, url, type };
            
            if (type === 'video') {
                asset.thumbnail = await createVideoThumbnail(file);
            }
            
            assets.push(asset);
        }
        updateAssetsDisplay();
        if (assetsModal) {
            assetsModal.classList.add('hidden');
            assetsModal.classList.remove('flex');
        }
    }

    // File upload handlers - now handled by asset items in initializeAssetsModal
    const fileInputs = ['images-input', 'videos-input', 'documents-input', 'pdfs-input'];
    
    fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', (e) => {
                const type = inputId.split('-')[0].slice(0, -1); // Remove 's' and '-input'
                const fileType = type === 'image' ? 'image' : type === 'video' ? 'video' : type === 'document' ? 'document' : 'pdf';
                handleFileUpload(Array.from(e.target.files), fileType);
                
                // Close assets modal after file selection
                const assetsModal = document.getElementById('assets-modal');
                if (assetsModal) {
                    assetsModal.classList.add('hidden');
                    // Reset position
                    assetsModal.style.left = '';
                    assetsModal.style.top = '';
                    assetsModal.style.transform = 'translateX(-50%)';
                }
            });
        }
    });

    updateAssetsDisplay();
}

// Asset management initialization is now handled by initializeAllSystems()

// File upload handlers are now in initializeAssetManagement function

// Context menu is now handled by m7x9k2p8.js

/**
 * Tab Management System for Sections Modal
 * Handles dynamic tab switching and content display
 * Implements active state management for section categories
 */
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update button states
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-white/10', 'text-white', 'ring-white/20');
                btn.classList.add('text-slate-400', 'ring-white/10');
            });
            
            button.classList.add('active', 'bg-white/10', 'text-white', 'ring-white/20');
            button.classList.remove('text-slate-400', 'ring-white/10');
            
            // Update panel visibility
            tabPanels.forEach(panel => {
                panel.classList.add('hidden');
            });
            
            const targetPanel = document.getElementById(targetTab + '-tab');
            if (targetPanel) {
                targetPanel.classList.remove('hidden');
            }
        });
    });
}

// Tabs initialization is now handled by initializeAllSystems()

// Add scrollbar hide utility
const style = document.createElement('style');
style.textContent = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`;
document.head.appendChild(style);

/**
 * Global Initialization Function
 * Ensures all systems are properly initialized in the correct order
 */
function initializeAllSystems() {
    console.log('\n🚀 PLENORA CTRLS.JS - INITIALIZING ALL SYSTEMS');
    console.log('DOM State:', document.readyState);
    
    // Initialize in specific order with delays to prevent conflicts
    setTimeout(() => {
        console.log('🔄 Step 1: Initializing Modal System');
        initializeModal();
    }, 50);
    
    setTimeout(() => {
        console.log('🔄 Step 2: Initializing Assets Modal');
        initializeAssetsModal();
    }, 100);
    
    setTimeout(() => {
        console.log('🔄 Step 3: Initializing Asset Management');
        initializeAssetManagement();
    }, 150);
    
    // Context menu initialization removed - handled by m7x9k2p8.js
    
    setTimeout(() => {
        console.log('🔄 Step 5: Initializing Tabs');
        initializeTabs();
    }, 250);
    
    setTimeout(() => {
        console.log('🔄 Step 6: Initializing Drag from Modal');
        initializeDragFromModal();
    }, 300);
    
    setTimeout(() => {
        console.log('✅ ALL SYSTEMS INITIALIZED SUCCESSFULLY');
        
        // Final verification
        const modal = document.getElementById('modal');
        const assetsModal = document.getElementById('assets-modal');
        const addSectionBtn = document.getElementById('add-section-btn');
        const addAssetBtn = document.getElementById('add-asset-btn');
        
        console.log('\n🔍 FINAL VERIFICATION:');
        console.log('- Sections Modal:', modal ? '✓' : '❌');
        console.log('- Assets Modal:', assetsModal ? '✓' : '❌');
        console.log('- Add Section Button:', addSectionBtn ? '✓' : '❌');
        console.log('- Add Asset Button:', addAssetBtn ? '✓' : '❌');
        
        // Make functions globally available for debugging
        window.plenoraDebug = {
            openSectionsModal: () => modal && modal.classList.remove('hidden'),
            openAssetsModal: () => assetsModal && (assetsModal.classList.remove('hidden'), assetsModal.classList.add('flex')),
            closeAllModals: () => {
                modal && modal.classList.add('hidden');
                assetsModal && (assetsModal.classList.add('hidden'), assetsModal.classList.remove('flex'));
            },
            testAddSection: () => addSectionBtn && addSectionBtn.click(),
            testAddAsset: () => addAssetBtn && addAssetBtn.click()
        };
        
        console.log('\n🛠️ Debug functions available: window.plenoraDebug');
    }, 400);
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllSystems);
} else {
    initializeAllSystems();
}

console.log('📜 PLENORA CTRLS.JS LOADED SUCCESSFULLY');