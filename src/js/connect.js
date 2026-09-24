// Connect page functionality
// Shared JavaScript for both German and English connect pages

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(function() {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        button.classList.add('text-green-600');
        setTimeout(function() {
            button.innerHTML = originalHTML;
            button.classList.remove('text-green-600');
        }, 2000);
    });
}

function toggleCard(cardId) {
    const content = document.getElementById(cardId + '-content');
    const arrow = document.getElementById(cardId + '-arrow');
    const header = document.getElementById(cardId + '-header');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
        header.classList.add('border-b', 'border-gray-100');
    } else {
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
        header.classList.remove('border-b', 'border-gray-100');
    }
}

async function registerUser(name, email) {
    try {
        const response = await fetch(window.OpenPodcastConfig.getRegisterUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if ((response.ok && data.success) || (response.status === 409 && data.data)) {
            // Store API key for future use (works for both new users and existing users)
            localStorage.setItem('openpodcast_api_key', data.data.apiKey);
            localStorage.setItem('openpodcast_user_id', data.data.userId);
            localStorage.setItem('openpodcast_user_name', data.data.name);
            
            // Show platform connection options
            showPlatformCards();
            hideRegistrationForm();
            
            return data;
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
}

function showPlatformCards() {
    // Update welcome message with user name
    const userName = localStorage.getItem('openpodcast_user_name');
    if (userName) {
        document.getElementById('user-name').textContent = userName;
    }
    
    document.getElementById('platform-cards').classList.remove('hidden');
    document.getElementById('welcome-message').classList.remove('hidden');
}

function hideRegistrationForm() {
    document.getElementById('registration-section').classList.add('hidden');
}

function showRegistrationError(message) {
    const errorDiv = document.getElementById('registration-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideRegistrationError() {
    document.getElementById('registration-error').classList.add('hidden');
}

// Handle Podigee OAuth callback
function handlePodigeeCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (authCode) {
        // Successfully received OAuth code from Podigee
        showPodigeeSuccess();
        // Remove URL parameters from browser history
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
        showPodigeeError();
        // Remove URL parameters from browser history  
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function showPodigeeSuccess() {
    const successDiv = document.getElementById('podigee-success');
    const connectButton = document.getElementById('podigee-connect-button');
    if (successDiv && connectButton) {
        successDiv.classList.remove('hidden');
        connectButton.classList.add('hidden');
    }
}

function showPodigeeError() {
    const errorDiv = document.getElementById('podigee-error');
    if (errorDiv) {
        errorDiv.classList.remove('hidden');
    }
}

// Initialize connect page functionality
function initConnectPage(messages) {
    // Check if user is already registered when page loads
    const apiKey = localStorage.getItem('openpodcast_api_key');
    const userName = localStorage.getItem('openpodcast_user_name');
    
    if (apiKey && userName) {
        document.getElementById('user-name').textContent = userName;
        showPlatformCards();
        hideRegistrationForm();
    }
    
    // Handle Podigee OAuth callback
    handlePodigeeCallback();
    
    // Handle registration form submission
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('user-name-input').value.trim();
            const email = document.getElementById('user-email-input').value.trim();
            const submitButton = document.getElementById('register-button');
            
            if (!name || !email) {
                showRegistrationError(messages.fillAllFields);
                return;
            }
            
            submitButton.disabled = true;
            submitButton.textContent = messages.registering;
            hideRegistrationError();
            
            try {
                await registerUser(name, email);
            } catch (error) {
                showRegistrationError(error.message || messages.registrationFailed);
                submitButton.disabled = false;
                submitButton.textContent = messages.getStarted;
            }
        });
    }
}