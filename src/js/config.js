// API Configuration
// This file is generated during build process or manually configured
// for different environments

window.OpenPodcastConfig = {
    // Default to production values
    API_BASE_URL: 'https://api.openpodcast.dev',
    API_ANALYTICS_PATH: '/analytics/v1',
    API_REGISTER_PATH: '/register',
    
    // Auto-detect local development
    init() {
        // Check if we're running locally
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.API_BASE_URL = 'http://localhost:8080';
        }
        
        return this;
    },
    
    // Get full API URLs
    getRegisterUrl() {
        return this.API_BASE_URL + this.API_REGISTER_PATH;
    },
    
    getAnalyticsUrl() {
        return this.API_BASE_URL + this.API_ANALYTICS_PATH;
    }
};

// Initialize config
window.OpenPodcastConfig.init();