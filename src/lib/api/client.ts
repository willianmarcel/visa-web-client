/**
 * A simple API client for making authenticated requests to the backend.
 * Includes automatic handling of errors and JSON parsing.
 */

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Define the types of requests our client can make
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Define the options for our request
type RequestOptions = {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

// Define the response structure
type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
};

/**
 * Make an API request with proper error handling
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Default options
    const defaultOptions: RequestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for auth
    };

    // Merge options
    const mergedOptions: RequestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    // Stringify body if it exists and isn't already a string
    if (mergedOptions.body && typeof mergedOptions.body !== 'string') {
      mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    // Add leading slash if needed
    const normalizedEndpoint = endpoint.startsWith('/') 
      ? endpoint 
      : `/${endpoint}`;

    // Make the request
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, mergedOptions as RequestInit);
    
    // Parse the response
    let data: T | null = null;
    try {
      data = await response.json();
    } catch (e) {
      // If the response is not JSON, set data to null
      data = null;
    }

    // Return the response in our standard format
    if (!response.ok) {
      return {
        data: null,
        error: data && typeof data === 'object' && 'message' in data 
          ? (data as any).message 
          : `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    // Catch network errors or other exceptions
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 0, // No status code for network errors
    };
  }
}

// Shorthand methods for common request types
export const apiClient = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
  
  patch: <T = any>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}; 