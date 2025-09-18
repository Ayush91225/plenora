// Comprehensive Debug Script - Analyzing All Issues
console.log('=== PLENORA DEBUG SCRIPT LOADED ===');

// Check if DOM is ready
if (document.readyState === 'loading') {
    console.log('DOM is still loading, waiting...');
    document.addEventListener('DOMContentLoaded', runDebugTests);
} else {
    console.log('DOM already loaded, running tests immediately');
    runDebugTests();
}

function runDebugTests() {
    console.log('\n=== STARTING COMPREHENSIVE DEBUG TESTS ===');
    
    // 1. Check all modal elements
    console.log('\n--- MODAL ELEMENTS CHECK ---');
    const modal = document.getElementById('modal');
    const addSectionBtn = document.getElementById('add-section-btn');
    const closeModal = document.getElementById('close-modal');
    const assetsModal = document.getElementById('assets-modal');
    const addAssetBtn = document.getElementById('add-asset-btn');
    const closeAssetsModal = document.getElementById('close-assets-modal');
    const contextMenu = document.getElementById('context-menu');
    
    console.log('Sections Modal:', modal ? '✓ Found' : '✗ Missing');
    console.log('Add Section Button:', addSectionBtn ? '✓ Found' : '✗ Missing');
    console.log('Close Modal Button:', closeModal ? '✓ Found' : '✗ Missing');
    console.log('Assets Modal:', assetsModal ? '✓ Found' : '✗ Missing');
    console.log('Add Asset Button:', addAssetBtn ? '✓ Found' : '✗ Missing');
    console.log('Close Assets Modal:', closeAssetsModal ? '✓ Found' : '✗ Missing');
    console.log('Context Menu:', contextMenu ? '✓ Found' : '✗ Missing');
    
    // 2. Check current modal states
    console.log('\n--- MODAL STATES ---');
    if (modal) {
        console.log('Sections Modal classes:', modal.className);
        console.log('Sections Modal hidden?', modal.classList.contains('hidden'));
        console.log('Sections Modal display:', getComputedStyle(modal).display);
    }
    if (assetsModal) {
        console.log('Assets Modal classes:', assetsModal.className);
        console.log('Assets Modal hidden?', assetsModal.classList.contains('hidden'));
        console.log('Assets Modal display:', getComputedStyle(assetsModal).display);
    }
    if (contextMenu) {
        console.log('Context Menu classes:', contextMenu.className);
        console.log('Context Menu hidden?', contextMenu.classList.contains('hidden'));
        console.log('Context Menu z-index:', getComputedStyle(contextMenu).zIndex);
    }
    
    // 3. Check for existing event listeners
    console.log('\n--- EVENT LISTENERS CHECK ---');
    
    // Test add section button
    if (addSectionBtn) {
        console.log('Testing Add Section Button...');
        const originalClick = addSectionBtn.onclick;
        console.log('Has onclick handler:', !!originalClick);
        
        // Add our own test listener
        addSectionBtn.addEventListener('click', function(e) {
            console.log('🔥 ADD SECTION BUTTON CLICKED!');
            console.log('Event:', e);
            console.log('Target:', e.target);
            console.log('Current target:', e.currentTarget);
            
            if (modal) {
                console.log('Modal before toggle:', modal.classList.contains('hidden'));
                modal.classList.remove('hidden');
                console.log('Modal after toggle:', modal.classList.contains('hidden'));
                
                // Hide context menu
                if (contextMenu) {
                    contextMenu.classList.add('hidden');
                    console.log('Context menu hidden');
                }
            }
        });
    }
    
    // Test add asset button
    if (addAssetBtn) {
        console.log('Testing Add Asset Button...');
        addAssetBtn.addEventListener('click', function(e) {
            console.log('🔥 ADD ASSET BUTTON CLICKED!');
            console.log('Event:', e);
            
            if (assetsModal) {
                console.log('Assets Modal before toggle:', assetsModal.classList.contains('hidden'));
                assetsModal.classList.remove('hidden');
                assetsModal.classList.add('flex');
                console.log('Assets Modal after toggle:', assetsModal.classList.contains('hidden'));
                
                // Hide context menu
                if (contextMenu) {
                    contextMenu.classList.add('hidden');
                    console.log('Context menu hidden');
                }
            }
        });
    }
    
    // Test close buttons
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            console.log('🔥 CLOSE SECTIONS MODAL CLICKED!');
            if (modal) {
                modal.classList.add('hidden');
                console.log('Sections modal closed');
            }
        });
    }
    
    if (closeAssetsModal) {
        closeAssetsModal.addEventListener('click', function(e) {
            console.log('🔥 CLOSE ASSETS MODAL CLICKED!');
            if (assetsModal) {
                assetsModal.classList.add('hidden');
                assetsModal.classList.remove('flex');
                console.log('Assets modal closed');
            }
        });
    }
    
    // 4. Check for script conflicts
    console.log('\n--- SCRIPT CONFLICTS CHECK ---');
    const scripts = document.querySelectorAll('script');
    console.log('Total scripts loaded:', scripts.length);
    scripts.forEach((script, index) => {
        if (script.src) {
            console.log(`Script ${index + 1}: ${script.src}`);
        } else if (script.textContent.trim()) {
            console.log(`Inline Script ${index + 1}: ${script.textContent.substring(0, 100)}...`);
        }
    });
    
    // 5. Check CSS conflicts
    console.log('\n--- CSS CONFLICTS CHECK ---');
    if (modal) {
        const modalStyles = getComputedStyle(modal);
        console.log('Modal computed styles:');
        console.log('- position:', modalStyles.position);
        console.log('- z-index:', modalStyles.zIndex);
        console.log('- display:', modalStyles.display);
        console.log('- visibility:', modalStyles.visibility);
        console.log('- opacity:', modalStyles.opacity);
    }
    
    // 6. Test manual modal opening
    console.log('\n--- MANUAL TESTS ---');
    window.debugOpenSectionsModal = function() {
        console.log('🧪 Manual sections modal test');
        if (modal) {
            modal.classList.remove('hidden');
            console.log('Sections modal opened manually');
        }
    };
    
    window.debugOpenAssetsModal = function() {
        console.log('🧪 Manual assets modal test');
        if (assetsModal) {
            assetsModal.classList.remove('hidden');
            assetsModal.classList.add('flex');
            console.log('Assets modal opened manually');
        }
    };
    
    window.debugCloseAllModals = function() {
        console.log('🧪 Closing all modals');
        if (modal) modal.classList.add('hidden');
        if (assetsModal) {
            assetsModal.classList.add('hidden');
            assetsModal.classList.remove('flex');
        }
        if (contextMenu) contextMenu.classList.add('hidden');
    };
    
    console.log('\n=== DEBUG FUNCTIONS AVAILABLE ===');
    console.log('- debugOpenSectionsModal()');
    console.log('- debugOpenAssetsModal()');
    console.log('- debugCloseAllModals()');
    
    console.log('\n=== DEBUG TESTS COMPLETED ===');
    
    // 7. Monitor for ctrls.js loading
    console.log('\n--- MONITORING CTRLS.JS ---');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT' && node.src && node.src.includes('ctrls.js')) {
                        console.log('🔄 ctrls.js loaded:', node.src);
                        setTimeout(() => {
                            console.log('🔄 Re-running tests after ctrls.js load');
                            runPostCtrlsTests();
                        }, 100);
                    }
                });
            }
        });
    });
    
    observer.observe(document.head, { childList: true, subtree: true });
}

function runPostCtrlsTests() {
    console.log('\n=== POST-CTRLS.JS TESTS ===');
    
    // Check if our event listeners are still working
    const addSectionBtn = document.getElementById('add-section-btn');
    const addAssetBtn = document.getElementById('add-asset-btn');
    
    if (addSectionBtn) {
        console.log('Add Section Button still exists:', !!addSectionBtn);
        // Check if it has multiple listeners
        const listeners = getEventListeners ? getEventListeners(addSectionBtn) : 'DevTools required';
        console.log('Event listeners on Add Section Button:', listeners);
    }
    
    if (addAssetBtn) {
        console.log('Add Asset Button still exists:', !!addAssetBtn);
        const listeners = getEventListeners ? getEventListeners(addAssetBtn) : 'DevTools required';
        console.log('Event listeners on Add Asset Button:', listeners);
    }
}