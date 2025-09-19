class LibraryModal {
    constructor() {
        this.modal = null;
        this.activeTab = 'components';
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'library-modal';
        modal.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 z-50 hidden w-80 max-w-sm';
        
        modal.innerHTML = `
            <div class="relative ring-1 ring-inset ring-white/5 overflow-hidden bg-neutral-900/60 border-white/10 border rounded-2xl backdrop-blur-xl">
                <div id="library-modal-header" class="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-move">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-neutral-200">Library</span>
                        <span class="inline-flex items-center gap-1.5 text-[10px] font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-2 py-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                <path d="M9 9h6v6H9z"></path>
                            </svg>
                            <span id="library-count">6</span> items
                        </span>
                    </div>
                    <button id="close-library-modal" class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
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
                        <input id="library-search" type="text" placeholder="Search library..." class="w-full pl-10 pr-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50">
                    </div>
                </div>
                
                <div class="px-4 py-2 border-b border-white/10">
                    <div class="flex gap-1 overflow-x-auto scrollbar-hide">
                        <button class="tab-btn px-2 py-1 text-xs rounded-md hover:bg-white/5 text-slate-400 whitespace-nowrap" data-tab="templates">Templates</button>
                        <button class="tab-btn active px-2 py-1 text-xs rounded-md bg-white/10 text-white whitespace-nowrap" data-tab="components">Components</button>
                    </div>
                </div>
                
                <div class="tab-content max-h-64 overflow-y-auto">
                    <div id="templates-content" class="px-3 py-3 hidden">
                        <ul class="space-y-2">
                            <li class="library-skeleton flex items-center gap-3 rounded-lg px-2 py-2">
                                <div class="h-6 w-6 rounded-md bg-white/10 animate-pulse"></div>
                                <div class="min-w-0 flex-1">
                                    <div class="h-3 bg-white/10 rounded animate-pulse mb-1"></div>
                                    <div class="h-2 bg-white/5 rounded animate-pulse w-3/4"></div>
                                </div>
                            </li>
                            <li class="library-skeleton flex items-center gap-3 rounded-lg px-2 py-2">
                                <div class="h-6 w-6 rounded-md bg-white/10 animate-pulse"></div>
                                <div class="min-w-0 flex-1">
                                    <div class="h-3 bg-white/10 rounded animate-pulse mb-1"></div>
                                    <div class="h-2 bg-white/5 rounded animate-pulse w-2/3"></div>
                                </div>
                            </li>
                            <li class="library-skeleton flex items-center gap-3 rounded-lg px-2 py-2">
                                <div class="h-6 w-6 rounded-md bg-white/10 animate-pulse"></div>
                                <div class="min-w-0 flex-1">
                                    <div class="h-3 bg-white/10 rounded animate-pulse mb-1"></div>
                                    <div class="h-2 bg-white/5 rounded animate-pulse w-4/5"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div id="components-content" class="px-3 py-3">
                        <ul class="space-y-2">
                            <li class="library-skeleton flex items-center gap-3 rounded-lg px-2 py-2">
                                <div class="h-6 w-6 rounded-md bg-white/10 animate-pulse"></div>
                                <div class="min-w-0 flex-1">
                                    <div class="h-3 bg-white/10 rounded animate-pulse mb-1"></div>
                                    <div class="h-2 bg-white/5 rounded animate-pulse w-3/4"></div>
                                </div>
                            </li>
                            <li class="library-skeleton flex items-center gap-3 rounded-lg px-2 py-2">
                                <div class="h-6 w-6 rounded-md bg-white/10 animate-pulse"></div>
                                <div class="min-w-0 flex-1">
                                    <div class="h-3 bg-white/10 rounded animate-pulse mb-1"></div>
                                    <div class="h-2 bg-white/5 rounded animate-pulse w-2/3"></div>
                                </div>
                            </li>
                            <li class="library-skeleton flex items-center gap-3 rounded-lg px-2 py-2">
                                <div class="h-6 w-6 rounded-md bg-white/10 animate-pulse"></div>
                                <div class="min-w-0 flex-1">
                                    <div class="h-3 bg-white/10 rounded animate-pulse mb-1"></div>
                                    <div class="h-2 bg-white/5 rounded animate-pulse w-4/5"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    bindEvents() {
        // Close modal
        document.getElementById('close-library-modal').addEventListener('click', () => this.close());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Drag functionality
        const modalHeader = document.getElementById('library-modal-header');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        modalHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = this.modal.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            
            this.modal.style.left = x + 'px';
            this.modal.style.top = y + 'px';
            this.modal.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        // Tab switching
        const tabButtons = this.modal.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Search functionality
        document.getElementById('library-search').addEventListener('input', (e) => this.search(e.target.value));

        // Item clicks (disabled for skeleton loaders)
        this.modal.addEventListener('click', (e) => {
            const item = e.target.closest('.library-item');
            if (item && !item.classList.contains('library-skeleton')) {
                console.log('Selected:', item.dataset.item);
                this.close();
            }
        });
    }

    open(tab = 'components', searchTerm = '') {
        this.modal.classList.remove('hidden');
        this.switchTab(tab);
        if (searchTerm) {
            document.getElementById('library-search').value = searchTerm;
            this.search(searchTerm);
        }
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        document.getElementById('library-search').value = '';
        this.search(''); // Clear search
        
        // Reset position
        this.modal.style.left = '';
        this.modal.style.top = '';
        this.modal.style.transform = 'translateX(-50%)';
    }

    switchTab(tab) {
        this.activeTab = tab;
        
        // Update tab buttons
        const tabButtons = this.modal.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            const isActive = btn.dataset.tab === tab;
            btn.classList.toggle('active', isActive);
            btn.classList.toggle('bg-white/10', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('text-slate-400', !isActive);
        });

        // Update content
        document.getElementById('templates-content').classList.toggle('hidden', tab !== 'templates');
        document.getElementById('components-content').classList.toggle('hidden', tab !== 'components');
        
        // Update count
        const activeContent = document.getElementById(`${tab}-content`);
        const itemCount = activeContent.querySelectorAll('.library-item, .library-skeleton').length;
        document.getElementById('library-count').textContent = itemCount;
    }

    search(term) {
        const activeContent = document.getElementById(`${this.activeTab}-content`);
        const items = activeContent.querySelectorAll('.library-item, .library-skeleton');
        let visibleCount = 0;
        
        items.forEach(item => {
            if (item.classList.contains('library-skeleton')) {
                // Always show skeleton loaders
                item.style.display = 'flex';
                visibleCount++;
            } else {
                const text = item.textContent.toLowerCase();
                const isVisible = text.includes(term.toLowerCase());
                item.style.display = isVisible ? 'flex' : 'none';
                if (isVisible) visibleCount++;
            }
        });
        
        document.getElementById('library-count').textContent = visibleCount;
    }
}

// Initialize library modal
const libraryModal = new LibraryModal();

// Global function to open library modal
window.openLibraryModal = (tab = 'components', searchTerm = '') => {
    libraryModal.open(tab, searchTerm);
};