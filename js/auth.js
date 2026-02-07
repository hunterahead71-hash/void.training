// Auth management for frontend
class AuthManager {
  constructor() {
    this.baseUrl = "https://mod-application-backend.onrender.com";
    this.user = null;
    this.isAdmin = false;
  }

  async checkAuth() {
    try {
      const response = await fetch(`${this.baseUrl}/me`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          this.user = data.user;
          this.isAdmin = data.isAdmin || false;
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  async startTest() {
    try {
      // Set test intent
      const response = await fetch(`${this.baseUrl}/set-intent/test`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Redirect to Discord OAuth
        window.location.href = `${this.baseUrl}/auth/discord`;
      } else {
        throw new Error('Failed to set test intent');
      }
    } catch (error) {
      console.error('Start test error:', error);
      alert('Failed to start test. Please try again.');
    }
  }

  logout() {
    window.location.href = `${this.baseUrl}/logout`;
  }
}

// Initialize auth manager
window.authManager = new AuthManager();

// Check auth status on page load
document.addEventListener('DOMContentLoaded', async function() {
  // Check URL parameters for test start
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('startTest') === '1') {
    // User has been authenticated, show test interface
    window.userDiscordUsername = urlParams.get('discord_username') || 'User';
    window.userDiscordId = urlParams.get('discord_id') || '0000';
    
    // Hide main content and show test interface
    const mainContainer = document.getElementById('mainContainer');
    const testPage = document.getElementById('testPage');
    const mobileDiscord = document.getElementById('mobileDiscord');
    
    if (mainContainer) mainContainer.style.display = 'none';
    
    // Determine if mobile or desktop
    if (window.innerWidth <= 768) {
      // Mobile test
      if (mobileDiscord) {
        mobileDiscord.classList.add('active');
        
        // Initialize mobile interface
        if (typeof initializeMobileInterface === 'function') {
          initializeMobileInterface();
        }
        
        setTimeout(() => {
          if (typeof startMobileTest === 'function') {
            startMobileTest();
          }
        }, 1000);
      }
    } else {
      // Desktop test
      if (testPage) {
        testPage.style.display = 'block';
        
        // Initialize Discord interface
        if (typeof initializeDiscordInterface === 'function') {
          initializeDiscordInterface();
        }
      }
    }
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});
