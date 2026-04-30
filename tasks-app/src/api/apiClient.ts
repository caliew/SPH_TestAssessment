const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export const apiClient = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { params, ...customConfig } = options;
  
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
  const url = `${BASE_URL}${endpoint}${queryString}`;

  const headers = { "Content-Type": "application/json", ...customConfig.headers };

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => apiClient<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    apiClient<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    apiClient<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data?: any, options?: FetchOptions) => 
    apiClient<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => 
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
