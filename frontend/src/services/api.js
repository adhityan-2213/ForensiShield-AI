const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://forensishield-ai-backend.onrender.com/api";

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function handleUnauthorized() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Unable to connect to the backend. Please check whether the server is running."
    );
  }

  if (response.status === 401 && token) {
    handleUnauthorized();
    throw new Error("Your session has expired. Please log in again.");
  }

  return response;
}

export async function uploadLogFiles(files) {
  if (!files || files.length === 0) {
    throw new Error("Please select at least one log file.");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiRequest(
    `${API_BASE_URL}/analysis/upload/`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The backend returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      data.error || `Upload failed with status ${response.status}.`
    );
  }

  return data;
}

export async function checkBackendHealth() {
  const response = await apiRequest(`${API_BASE_URL}/health/`);

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The backend returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error("Backend health check failed.");
  }

  return data;
}

export async function sendChatMessage(message) {
  const response = await apiRequest(
    `${API_BASE_URL}/ai/chat/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || "Unable to get an AI response."
    );
  }

  return data.answer;
}

export async function getInvestigations() {
  const response = await apiRequest(
    `${API_BASE_URL}/investigations/`
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || "Unable to load investigation history."
    );
  }

  return data;
}