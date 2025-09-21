/**
 * Canvas Section Context Menu System
 * Provides AI prompt interface for canvas sections
 */

// Global variables for context menu
let canvasContextMenu = null;
let currentCanvasSection = null;

// Initialize canvas context menu system
function initializeCanvasContextMenu() {
    console.log('🔧 Initializing Canvas Context Menu System...');
    
    // Create context menu if it doesn't exist
    if (!canvasContextMenu) {
        canvasContextMenu = createCanvasContextMenu();
        setupCanvasContextMenuEvents();
    }
    
    // Add right-click listeners to canvas
    addCanvasSectionListeners();
}

// Create canvas context menu
function createCanvasContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'canvas-section-context-menu';
    menu.className = 'fixed z-[9999] hidden';
    menu.innerHTML = `
        <div class="w-80">
            <div class="bg-black/80 border-white/10 border rounded-lg p-3 shadow-xl backdrop-blur">
                <div class="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <input id="canvas-prompt" type="text" placeholder="Create Section with Plenora AI" class="flex-1 bg-transparent outline-none text-xs placeholder:text-gray-500 px-1 text-white">
                    <button id="canvas-run-btn" type="button" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-blue-400 text-black hover:bg-blue-300 transition">
                        <span class="run-text">Run</span>
                        <svg class="run-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                        <svg class="loading-icon hidden animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                    </button>
                </div>
                <div class="mt-2 flex gap-1 overflow-x-auto">
                    <button type="button" class="canvas-suggestion-btn flex-shrink-0 text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-prompt="Create a hero banner with large headline, subtitle, and call-to-action button">
                        Hero banner
                    </button>
                    <button type="button" class="canvas-suggestion-btn flex-shrink-0 text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-prompt="Create pricing cards with 3 plans showing features, price, and signup button">
                        Pricing cards
                    </button>
                    <button type="button" class="canvas-suggestion-btn flex-shrink-0 text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white" data-prompt="Create a testimonial section with avatar, quote, and customer name">
                        Testimonials
                    </button>
                </div>
                <p class="mt-2 text-[10px] text-gray-500">Enter what component you want in the section</p>
            </div>
        </div>
    `;
    document.body.appendChild(menu);
    return menu;
}

// Setup canvas context menu events
function setupCanvasContextMenuEvents() {
    if (!canvasContextMenu) return;
    
    const promptInput = canvasContextMenu.querySelector('#canvas-prompt');
    const runBtn = canvasContextMenu.querySelector('#canvas-run-btn');
    const suggestionBtns = canvasContextMenu.querySelectorAll('.canvas-suggestion-btn');

    // Add suggestion button listeners
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prompt = this.dataset.prompt || this.textContent.trim();
            promptInput.value = prompt;
        });
    });
    
    // Add run button functionality
    runBtn.addEventListener('click', function() {
        const prompt = promptInput.value.trim();
        if (prompt && currentCanvasSection) {
            const runText = this.querySelector('.run-text');
            const runIcon = this.querySelector('.run-icon');
            const loadingIcon = this.querySelector('.loading-icon');
            
            runText.textContent = 'Loading...';
            runIcon.classList.add('hidden');
            loadingIcon.classList.remove('hidden');
            this.disabled = true;
            
            const originalContent = currentCanvasSection.innerHTML;
            currentCanvasSection.innerHTML = `
                <div class="flex items-center justify-center p-8">
                    <div class="flex items-center gap-2 text-slate-300">
                        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                        <span class="text-sm">Generating content...</span>
                    </div>
                </div>
            `;
            
            setTimeout(() => {
                runText.textContent = 'Run';
                runIcon.classList.remove('hidden');
                loadingIcon.classList.add('hidden');
                this.disabled = false;
                currentCanvasSection.innerHTML = originalContent;
                hideCanvasContextMenu();
            }, 5000);
        }
    });
}

// Show canvas context menu
function showCanvasContextMenu(e, section) {
    e.preventDefault();
    currentCanvasSection = section;
    
    if (!canvasContextMenu) {
        canvasContextMenu = createCanvasContextMenu();
        setupCanvasContextMenuEvents();
    }
    
    canvasContextMenu.style.left = e.pageX + 'px';
    canvasContextMenu.style.top = e.pageY + 'px';
    canvasContextMenu.classList.remove('hidden');
}

// Hide canvas context menu
function hideCanvasContextMenu() {
    if (canvasContextMenu) {
        canvasContextMenu.classList.add('hidden');
    }
}

// Add right-click listeners to canvas sections
function addCanvasSectionListeners() {
    const canvas = document.getElementById('design-canvas');
    if (canvas) {
        canvas.addEventListener('contextmenu', function(e) {
            // Only show AI prompt menu for section elements with data-section
            const section = e.target.closest('section[data-section]');
            if (section && section.dataset.section) {
                showCanvasContextMenu(e, section);
            }
        });
    }
}

// Hide context menu on click outside
document.addEventListener('click', function(e) {
    if (canvasContextMenu && !canvasContextMenu.contains(e.target)) {
        hideCanvasContextMenu();
    }
});

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCanvasContextMenu);
} else {
    setTimeout(initializeCanvasContextMenu, 100);
}

console.log('📝 CANVAS CONTEXT MENU LOADED SUCCESSFULLY');