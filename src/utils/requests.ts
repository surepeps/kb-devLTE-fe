/** @format */

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T | null;
  error?: string;
  pagination?: T | null
}

export const GET_REQUEST = async <T = any>(
  url: string,
  token?: string,
  retryCount = 0,
): Promise<ApiResponse<T>> => {
  try {
    // Check if URL is valid
    if (!url || url.includes("undefined")) {
      // Invalid API URL provided
      return {
        error: "Invalid API URL",
        success: false,
        message: "API configuration is missing.",
        data: null,
      };
    }

    // Making request to URL

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const request = await fetch(url, {
      signal: controller.signal,
      // Explicit CORS settings
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    // Check if request was successful
    if (!request.ok) {
      const errorMessage = `HTTP ${request.status}: ${request.statusText}`;
      // Request failed
      return {
        error: errorMessage,
        success: false,
        message: "Failed to fetch data from server.",
        data: null,
      };
    }

    // Check if response has content before parsing JSON
    const text = await request.text();
    if (!text) {
      // Empty response received
      return {
        error: "Empty response",
        success: false,
        message: "Server returned empty response.",
        data: null,
      };
    }

    try {
      const response = JSON.parse(text);
      return response;
    } catch (parseError) {
      // JSON parse error for response
      return {
        error: "Invalid JSON response",
        success: false,
        message: "Server returned invalid data format.",
        data: null,
      };
    }
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || "Network error";

    // Retry once for network errors (not for AbortError)
    if (retryCount === 0 && (error as Error).name !== "AbortError") {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return GET_REQUEST(url, token, 1);
    }

    return {
      error: errorMsg,
      success: false,
      message: "Unable to connect to server. Please check your connection.",
      data: null,
    };
  }
};

export const DELETE_REQUEST = async <T = any>(url: string, data?: unknown, token?: string): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const request = await fetch(url, {
      method: "DELETE",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    // Error occurred
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};

export const POST_REQUEST = async <T = any>(
  url: string,
  data: unknown,
  token?: string,
  customHeaders?: Record<string, string>,
): Promise<T> => {
  try {
    // Build headers with sensible defaults
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(customHeaders || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    // Let the browser set the correct Content-Type boundary for FormData
    if (isFormData) {
      delete headers["Content-Type"];
    }

    const request = await fetch(url, {
      method: "POST",
      headers,
      body: isFormData ? (data as FormData) : JSON.stringify(data),
    });

    // Read response body safely only once
    const text = await request.text();
    const parsed = text ? (() => { try { return JSON.parse(text); } catch { return { success: false, error: "Invalid JSON response" }; } })() : {};

    if (!request.ok) {
      const errMsg = (parsed as any)?.error || (parsed as any)?.message || `HTTP ${request.status}`;
      throw new Error(errMsg);
    }

    return parsed as T;
  } catch (error: unknown) {
    // Ensure consistent error objects
    const e = error as Error;
    throw new Error(e.message || "Network error");
  }
};

export const POST_REQUEST_FILE_UPLOAD = async <T = any>(
  url: string,
  data: FormData,
  token?: string,
): Promise<ApiResponse<T>> => {
  try {
    const request = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    // Error occurred
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};

export const PUT_REQUEST = async <T = any>(
  url: string,
  data: unknown,
  token?: string,
  customHeaders?: Record<string, string>,
): Promise<ApiResponse<T>> => {
  try {
    const headers: Record<string, string> = customHeaders || {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const request = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    // Error occurred
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};
