/**
 * Placeholder Handler
 * Provides fallback functionality for placeholder images
 */

const PlaceholderHandler = (function() {
    /**
     * Initializes the placeholder handler
     */
    function initialize() {
        // Replace all placeholder image URLs with generated SVG data URIs
        replacePlaceholderImages();
        
        // Observe DOM changes to handle dynamically added images
        observeDOMChanges();
    }
    
    /**
     * Finds and replaces all placeholder image URLs in the document
     */
    function replacePlaceholderImages() {
        // Find all images with placeholder URLs
        const images = document.querySelectorAll('img[src^="/api/placeholder/"]');
        
        images.forEach(img => {
            replacePlaceholderImage(img);
        });
    }
    
    /**
     * Replaces a single placeholder image with an SVG data URI
     * @param {HTMLImageElement} img - The image element to replace
     */
    function replacePlaceholderImage(img) {
        const src = img.getAttribute('src');
        
        // Check if it's a placeholder URL
        if (!src || !src.startsWith('/api/placeholder/')) {
            return;
        }
        
        // Parse dimensions from URL (format: /api/placeholder/width/height)
        const parts = src.split('/');
        const width = parseInt(parts[3], 10) || 300;
        const height = parseInt(parts[4], 10) || 200;
        
        // Create SVG placeholder
        const svgContent = createPlaceholderSVG(width, height);
        
        // Set as data URI
        img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
        
        // Mark as processed
        img.setAttribute('data-placeholder-processed', 'true');
    }
    
    /**
     * Creates an SVG placeholder with the specified dimensions
     * @param {number} width - Width of the placeholder
     * @param {number} height - Height of the placeholder
     * @returns {string} SVG markup as a string
     */
    function createPlaceholderSVG(width, height) {
        const colors = {
            background: '#f0f0f0',
            border: '#e0e0e0',
            text: '#888888'
        };
        
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <rect width="100%" height="100%" fill="${colors.background}" />
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" stroke="${colors.border}" stroke-width="2" fill="none" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" dy=".3em" fill="${colors.text}">
                ${width} × ${height}
            </text>
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 20 0 L 20 20 L 0 20 Z" fill="none" stroke="${colors.border}" stroke-width="0.5" />
                </pattern>
            </defs>
        </svg>`;
    }
    
    /**
     * Observes DOM changes to handle dynamically added images
     */
    function observeDOMChanges() {
        // Create a mutation observer
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                // Check for added nodes
                mutation.addedNodes.forEach(node => {
                    // If it's an image with placeholder URL
                    if (node.nodeName === 'IMG' && node.src && node.src.startsWith('/api/placeholder/')) {
                        replacePlaceholderImage(node);
                    }
                    
                    // If it contains images, process them
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.querySelectorAll('img[src^="/api/placeholder/"]');
                        images.forEach(img => replacePlaceholderImage(img));
                    }
                });
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Public API
    return {
        initialize
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    PlaceholderHandler.initialize();
});