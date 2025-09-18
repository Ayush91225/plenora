function selectFromIframe() {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const selector = '.fixed.top-0.inset-x-0.z-40.transition.animate-\\[slideInBlur_0\\.8s_ease-out_0\\.2s_forwards\\].bg-neutral-950\\/40.border-white\\/10.border-b.blur-sm.backdrop-blur.translate-y-\\[-20px\\]';
    
    const elements = iframeDoc.querySelectorAll(selector);
    elements.forEach(el => {
        el.style.border = '2px dashed cyan';
    });
    
    return elements;
}