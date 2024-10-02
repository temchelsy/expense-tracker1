import { API_BASE_URL } from "../contants/contants"; // Use the API base URL constant

const fetchCurrentUser = async () => {
  const token = localStorage.getItem('token');

  if (!token) return null; // Ensure token exists

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { // Ensure correct endpoint
      method: 'GET', // Explicitly specify the GET method
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok'); // Handle non-2xx responses
    }

    const data = await response.json(); // Parse JSON response
    console.log('Protected data:', data);

    return data;
  } catch (error) {
    console.error('Error fetching protected data:', error); // Catch and log errors
    return null; // Return null on error
  }
};

export {
  fetchCurrentUser
}
