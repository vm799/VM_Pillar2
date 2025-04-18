/**
 * Tab Manager Module
 * Handles tab navigation and content switching with proper event handling
 */

const TabManager = (function() {
    // Private variables
    let activeTabs = {};
    let tabChangedCallbacks = [];
    
    /**
     * Initializes tab navigation functionality
     * @param {string} tabsSelector - CSS selector for tab elements
     * @param {string} contentSelector - CSS selector pattern for content sections
     * @param {string} defaultTab - ID of the default tab to show (optional)
     */
    function initializeTabs(tabsSelector, contentSelector, defaultTab) {
        const tabs = document.querySelectorAll(tabsSelector);
        if (!tabs || tabs.length === 0) {
            console.warn(`No tabs found with selector: ${tabsSelector}`);
            return;
        }
        
        // Track tabs in this group
        const tabGroupId = tabsSelector.replace(/[^a-zA-Z0-9]/g, '');
        activeTabs[tabGroupId] = null;
        
        // Set up click handlers for each tab
        tabs.forEach(tab => {
            // Add role and aria attributes if not present
            if (!tab.hasAttribute('role')) {
                tab.setAttribute('role', 'tab');
            }
            
            const tabId = tab.getAttribute('data-tab');
            if (!tabId) {
                console.warn('Tab missing data-tab attribute:', tab);
                return;
            }
            
            const contentId = `${tabId}-content`;
            const contentElement = document.getElementById(contentId);
            
            if (!contentElement) {
                console.warn(`Content element not found for tab: ${tabId}`);
                return;
            }
            
            // Set ARIA attributes
            tab.setAttribute('aria-controls', contentId);
            contentElement.setAttribute('aria-labelledby', tab.id || '');
            contentElement.setAttribute('role', 'tabpanel');
            
            // Set up click handler
            tab.addEventListener('click', () => {
                selectTab(tabGroupId, tabId, tabsSelector, contentSelector);
            });
            
            // Set up keyboard navigation
            tab.addEventListener('keydown', (event) => {
                handleTabKeyboard(event, tabsSelector);
            });
        });
        
        // Initialize with default tab or first tab
        if (defaultTab) {
            selectTab(tabGroupId, defaultTab, tabsSelector, contentSelector);
        } else if (tabs.length > 0) {
            const firstTabId = tabs[0].getAttribute('data-tab');
            if (firstTabId) {
                selectTab(tabGroupId, firstTabId, tabsSelector, contentSelector);
            }
        }
    }
    
    /**
     * Handles keyboard navigation for tabs
     * @param {KeyboardEvent} event - The keyboard event
     * @param {string} tabsSelector - CSS selector for tabs in this group
     */
    function handleTabKeyboard(event, tabsSelector) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            return;
        }
        
        const tabs = Array.from(document.querySelectorAll(tabsSelector));
        const currentTab = event.target;
        const currentIndex = tabs.indexOf(currentTab);
        
        if (currentIndex === -1) return;
        
        let nextIndex;
        if (event.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % tabs.length;
        } else {
            nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }
        
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
        event.preventDefault();
    }
    
    /**
     * Selects a specific tab and shows its content
     * @param {string} tabGroupId - Identifier for the tab group
     * @param {string} tabId - ID of the tab to select
     * @param {string} tabsSelector - CSS selector for all tabs
     * @param {string} contentSelector - CSS selector pattern for content sections
     */
    function selectTab(tabGroupId, tabId, tabsSelector, contentSelector) {
        const tabs = document.querySelectorAll(tabsSelector);
        const prevTabId = activeTabs[tabGroupId];
        
        // Do nothing if this tab is already active
        if (prevTabId === tabId) return;
        
        // Update tab states
        tabs.forEach(tab => {
            const isSelected = tab.getAttribute('data-tab') === tabId;
            tab.classList.toggle('active', isSelected);
            tab.setAttribute('aria-selected', isSelected.toString());
            
            // If selected, set focus for keyboard accessibility
            if (isSelected && document.activeElement !== tab) {
                tab.focus();
            }
        });
        
        // Hide all content sections
        const allContents = document.querySelectorAll('.main-content');
        allContents.forEach(content => {
            content.hidden = true;
            content.classList.remove('active-content');
        });
        
        // Show the selected content
        const selectedContent = document.getElementById(`${tabId}-content`);
        if (selectedContent) {
            selectedContent.hidden = false;
            selectedContent.classList.add('active-content');
            
            // Ensure proper focus management for screen readers
            const focusableElement = selectedContent.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElement) {
                // Only move focus if user is using keyboard navigation
                if (document.activeElement && document.activeElement.getAttribute('role') === 'tab') {
                    focusableElement.focus();
                }
            }
        }
        
        // Store the new active tab
        activeTabs[tabGroupId] = tabId;
        
        // Trigger callbacks
        triggerTabChangedCallbacks(tabId, prevTabId);
        
        // Trigger a custom event for other modules to listen to
        const event = new CustomEvent('tabChanged', {
            detail: {
                tabId: tabId,
                prevTabId: prevTabId,
                tabGroupId: tabGroupId
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Manually selects a tab by its ID
     * @param {string} tabId - ID of the tab to select
     */
    function selectTabById(tabId) {
        const tab = document.querySelector(`[data-tab="${tabId}"]`);
        if (tab) {
            tab.click();
        } else {
            console.warn(`Tab with ID '${tabId}' not found`);
        }
    }
    
    /**
     * Registers a callback function for tab change events
     * @param {Function} callback - Function to call when tabs change
     * @returns {number} Callback ID for later removal
     */
    function onTabChanged(callback) {
        if (typeof callback === 'function') {
            tabChangedCallbacks.push(callback);
            return tabChangedCallbacks.length - 1;
        }
        return -1;
    }
    
    /**
     * Removes a previously registered tab change callback
     * @param {number} callbackId - The ID returned from onTabChanged
     */
    function offTabChanged(callbackId) {
        if (callbackId >= 0 && callbackId < tabChangedCallbacks.length) {
            tabChangedCallbacks[callbackId] = null;
        }
    }
    
    /**
     * Triggers all registered tab change callbacks
     * @param {string} newTabId - ID of the newly selected tab
     * @param {string} prevTabId - ID of the previously selected tab
     * @private
     */
    function triggerTabChangedCallbacks(newTabId, prevTabId) {
        tabChangedCallbacks.forEach(callback => {
            if (typeof callback === 'function') {
                try {
                    callback(newTabId, prevTabId);
                } catch (e) {
                    console.error('Error in tab changed callback:', e);
                }
            }
        });
    }
    
    /**
     * Gets the ID of the currently active tab
     * @param {string} tabGroupId - Identifier for the tab group
     * @returns {string|null} ID of the active tab or null if none is active
     */
    function getActiveTabId(tabGroupId) {
        return activeTabs[tabGroupId] || null;
    }
    
    // Public API
    return {
        initializeTabs,
        selectTabById,
        onTabChanged,
        offTabChanged,
        getActiveTabId
    };
})();

// Export to global scope
window.TabManager = TabManager;