import { auth } from './firebase';

const BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiService {
  /**
   * Helper to retrieve current user's Firebase ID token
   */
  async getAuthToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  }

  /**
   * Generic request executor with error handling and automatic token attachment
   */
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = options.headers ? { ...options.headers } : {};

    // Automatically attach Bearer token if user is signed in
    const token = await this.getAuthToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Do not set Content-Type if uploading FormData (browser sets boundary automatically)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        const error = new Error(data.message || this.getDefaultErrorMessage(response.status));
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.status) throw err;
      // Network or offline error
      const netError = new Error('Network error. Please check your connection and try again.');
      netError.status = 0;
      throw netError;
    }
  }

  getDefaultErrorMessage(status) {
    switch (status) {
      case 401:
        return 'Session expired or not authorized. Please sign in again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. You may have already performed this action.';
      case 422:
        return 'Validation error. Please verify the submitted information.';
      case 429:
        return 'Too many requests. Please slow down and try again shortly.';
      case 500:
      default:
        return 'Server error. Our team has been notified. Please try again later.';
    }
  }

  // REST convenience methods
  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    });
  }

  patch(endpoint, body, headers = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers,
    });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }

  upload(endpoint, formData, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

export const api = new ApiService();
