let API_BASE_URL = 'https://seaweatherstation.onrender.com/';
export const getBaseURL = () => API_BASE_URL;

// Initialize from localStorage if available
const storedURL = localStorage.getItem('api_base_url');
if (storedURL) {
  API_BASE_URL = storedURL;
}

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: controller.signal,
  });

  clearTimeout(timeoutId);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Function to update the API base URL
export const updateAPIBaseURL = (newURL: string) => {
  // Check if URL needs http:// prefix
  if (!newURL.startsWith('http://') && !newURL.startsWith('https://')) {
    newURL = `http://${newURL}`;
  }

  // Check if URL ends with a slash
  if (!newURL.endsWith('/')) {
    newURL = `${newURL}/`;
  }
  
  // Update the base URL
  API_BASE_URL = newURL;
  
  // Store in localStorage for persistence across refreshes
  localStorage.setItem('api_base_url', API_BASE_URL);
  window.location.reload();
};

// Check status
export const checkStatus = async () => {
  try {
    const response = await fetchAPI('status');
    return response;
  } catch (error) {
    return false;
  }
};

// Get temperature and pressure data
export const getInfo = async () => {
  const infoData = await fetchAPI('info');
  return infoData;
};

// Get weather and wind data
export const getWeather = async () => {
  const weatherData = await fetchAPI('weather');
  return weatherData;
};

export const getWave = async () => {
  const waveData = await fetchAPI('waves', {
    method: 'GET'
  });
  return waveData;
};
