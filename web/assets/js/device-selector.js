// Device selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.getElementById('device-dropdown');
    const options = document.getElementById('device-options');
    const selectedDevice = document.getElementById('selected-device');
    const deviceWidth = document.getElementById('device-width');
    const canvas = document.getElementById('design-canvas');

    // Toggle dropdown
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        options.classList.toggle('hidden');
    });

    // Handle device selection
    document.querySelectorAll('.device-option').forEach(option => {
        option.addEventListener('click', function() {
            const device = this.dataset.device;
            const width = this.dataset.width;
            
            selectedDevice.textContent = device;
            deviceWidth.textContent = width;
            
            // Update canvas width
            if (canvas) {
                canvas.style.maxWidth = width + 'px';
                canvas.style.margin = '0 auto';
            }
            
            options.classList.add('hidden');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        options.classList.add('hidden');
    });
});