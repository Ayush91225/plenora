// Context menu functionality for sections
document.addEventListener('DOMContentLoaded', function() {
    let contextMenu = null;
    let currentSection = null;

    // Create context menu
    function createContextMenu() {
        const menu = document.createElement('div');
        menu.id = 'section-context-menu';
        menu.className = 'fixed z-[9999] hidden';
        menu.innerHTML = `
            <div class="max-w-2xl mt-8 mr-auto ml-auto">
                <div class="bg-black/60 border-white/10 border rounded-2xl pt-2 pr-2 pb-2 pl-2 shadow-2xl backdrop-blur">
                    <div class="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                        <input id="prompt" type="text" placeholder="Create Section with Plenora AI" class="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500 px-1 text-white">
                        <button id="run-btn" type="button" class="inline-flex items-center gap-2 px-3 h-9 rounded-lg bg-blue-400 text-black hover:bg-blue-300 transition">
                            Run
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right w-4 h-4">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="px-2 pb-2">
                        <div class="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
                            <button type="button" class="suggestion-btn flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                This section to have a hero banner with headline and button
                            </button>
                            <button type="button" class="suggestion-btn flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                This section to have pricing cards with 3 plans
                            </button>
                            <button type="button" class="suggestion-btn flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                This section to have testimonials with profile pictures
                            </button>
                            <button type="button" class="suggestion-btn flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                This section to have FAQ with collapsible answers
                            </button>
                            <button type="button" class="suggestion-btn flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                This section to have a gallery of product images
                            </button>
                            <button type="button" class="suggestion-btn flex-shrink-0 text-xs px-2.5 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                                This section to have a call-to-action with signup form
                            </button>
                        </div>
                        <p class="mt-2 text-[11px] text-gray-500">Enter what component you want in the section</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(menu);
        return menu;
    }

    // Show context menu
    function showContextMenu(e, section) {
        e.preventDefault();
        currentSection = section;
        
        if (!contextMenu) {
            contextMenu = createContextMenu();
            setupContextMenuEvents();
        }
        
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.classList.remove('hidden');
    }

    // Hide context menu
    function hideContextMenu() {
        if (contextMenu) {
            contextMenu.classList.add('hidden');
        }
    }

    // Setup context menu events
    function setupContextMenuEvents() {
        const promptInput = contextMenu.querySelector('#prompt');
        const runBtn = contextMenu.querySelector('#run-btn');
        const suggestionBtns = contextMenu.querySelectorAll('.suggestion-btn');

        // Run button click
        runBtn.addEventListener('click', function() {
            const prompt = promptInput.value.trim();
            if (prompt && currentSection) {
                console.log('Running AI prompt:', prompt, 'for section:', currentSection);
                // Add your AI processing logic here
            }
            hideContextMenu();
        });

        // Suggestion button clicks
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                promptInput.value = this.textContent.trim();
            });
        });
    }

    // Add right-click listeners to canvas sections
    function addSectionListeners() {
        const canvas = document.getElementById('design-canvas');
        if (canvas) {
            canvas.addEventListener('contextmenu', function(e) {
                const section = e.target.closest('.section-element, .canvas-section, [data-section]');
                if (section) {
                    showContextMenu(e, section);
                }
            });
        }
    }

    // Hide context menu on click outside
    document.addEventListener('click', function(e) {
        if (contextMenu && !contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });

    // Initialize
    addSectionListeners();
});