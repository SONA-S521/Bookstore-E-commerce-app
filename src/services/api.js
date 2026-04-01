const API_URL = 'http://localhost:5001/api';
const api = {
  testConnection: async () => {
    try {
      console.log('🔍 Testing connection to backend...');
      const response = await fetch('http://localhost:5001/test');
      const data = await response.json();
      console.log('✅ Server test:', data);
      return true;
    } catch (error) {
      console.error('❌ Server test failed:', error);
      return false;
    }
  },
  signup: async (name, email, password) => {
    try {
      console.log('📝 Sending signup request to:', `${API_URL}/users/signup`);
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      console.log('📝 Signup response:', data);
      return data;
    } catch (error) {
      console.error('❌ Signup error:', error);
      return { success: false, message: 'Network error - cannot reach server' };
    }
  },
  login: async (email, password) => {
    try {
      console.log('🔑 Sending login request to:', `${API_URL}/users/login`);
      console.log('📧 Email:', email);
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      console.log('🔑 Login response status:', response.status);
      console.log('🔑 Login response data:', data);
      return data;
    } catch (error) {
      console.error('❌ Login fetch error:', error);
      return { success: false, message: 'Network error - cannot reach server' };
    }
  },
  getBooks: async () => {
    try {
      console.log('📚 Fetching books...');
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      console.log('📚 Books fetched:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching books:', error);
      return [];
    }
  },
  placeOrder: async (orderData) => {
    try {
      console.log('📦 Placing order:', orderData);
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      console.log('📦 Order placed:', data);
      return data;
    } catch (error) {
      console.error('❌ Order error:', error);
      return null;
    }
  },
  getUserOrders: async (email) => {
    try {
      console.log(`📦 Fetching orders for ${email}...`);
      const response = await fetch(`${API_URL}/orders/user/${email}`);
      const data = await response.json();
      console.log(`📦 Orders found:`, data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return [];
    }
  }
};
console.log('🚀 API Service loaded');
api.testConnection();
export default api;
