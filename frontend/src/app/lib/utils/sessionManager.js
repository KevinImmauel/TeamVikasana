import { jwtDecode } from 'jwt-decode';

/**
 * Session Manager utility for handling token validation, expiry and session management
 */
class SessionManager {
  /**
   * Get the JWT token from localStorage
   * @returns {string|null} The JWT token if exists, null otherwise
   */
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }
  
  /**
   * Set a token in localStorage
   * @param {string} token - JWT token to store
   */
  setToken(token) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }
  
  /**
   * Clear token from localStorage
   */
  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
  }
  
  /**
   * Check if the token is valid and not expired
   * @returns {boolean} True if token is valid, false otherwise
   */
  isTokenValid() {
    const token = this.getToken();
    
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      
      // Check if token has expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token has expired
        this.clearToken();
        return false;
      }
      
      // Token is valid
      return true;
    } catch (error) {
      // Token is invalid
      console.error('Invalid token:', error);
      this.clearToken();
      return false;
    }
  }
  
  /**
   * Get the remaining time (in seconds) before token expires
   * @returns {number} Time in seconds until expiry, or 0 if token is invalid or expired
   */
  getTimeUntilExpiry() {
    const token = this.getToken();
    
    if (!token) return 0;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        return 0;
      }
      
      return Math.round(decoded.exp - currentTime);
    } catch (error) {
      return 0;
    }
  }
  
  /**
   * Handle unauthorized responses (401)
   * Clears token and redirects to login page
   */
  handleUnauthorized() {
    this.clearToken();
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('user');
    window.location.href = '/auth/login?session_expired=true';
  }
}

const sessionManager = new SessionManager();
export default sessionManager;