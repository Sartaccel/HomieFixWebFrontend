const BASE_URL = 'http://localhost:2222';


export const loginUser = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }), // Changed email to username
      });
      return await response.json();
    } catch (error) {
      return { error: 'Error occurred during login' };
    }
  };
  