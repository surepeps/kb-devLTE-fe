/** @format */

export const GET_REQUEST = async (
  url: string,
  token?: string,
  retryCount = 0,
): Promise<any> => {
  try {
    // Check if URL is valid
    if (!url || url.includes("undefined")) {
      console.warn("Invalid API URL provided:", url);
      return {
        error: "Invalid API URL",
        success: false,
        message: "API configuration is missing.",
        data: [],
      };
    }

    console.log("Making request to:", url);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const request = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    // Check if request was successful
    if (!request.ok) {
      const errorMessage = `HTTP ${request.status}: ${request.statusText}`;
      console.warn("Request failed:", errorMessage);
      return {
        error: errorMessage,
        success: false,
        message: "Failed to fetch data from server.",
        data: [],
      };
    }

    // Check if response has content before parsing JSON
    const text = await request.text();
    if (!text) {
      console.warn("Empty response received from:", url);
      return {
        error: "Empty response",
        success: false,
        message: "Server returned empty response.",
        data: [],
      };
    }

    try {
      const response = JSON.parse(text);
      return response;
    } catch (parseError) {
      console.error("JSON parse error for response from:", url, "Response text:", text);
      return {
        error: "Invalid JSON response",
        success: false,
        message: "Server returned invalid data format.",
        data: [],
      };
    }
  } catch (error: unknown) {
    const errorMsg = (error as Error).message || "Network error";
    console.error("GET_REQUEST error:", errorMsg);

    // Retry once for network errors (not for AbortError)
    if (retryCount === 0 && (error as Error).name !== "AbortError") {
      console.log("Retrying request...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
      return GET_REQUEST(url, token, 1);
    }

    return {
      error: errorMsg,
      success: false,
      message: "Unable to connect to server. Please check your connection.",
      data: [],
    };
  }
};

export const DELETE_REQUEST = async (url: string, data?: unknown, token?: string) => {
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
    console.log(error);
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};

export const POST_REQUEST = async (
  url: string,
  data: unknown,
  customHeaders?: HeadersInit,
  token?: string,
) => {
  try {
    const headers: HeadersInit = customHeaders || {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Handle FormData - don't set Content-Type for FormData as browser will set it with boundary
    const isFormData = data instanceof FormData;
    if (isFormData && headers["Content-Type"] === "multipart/form-data") {
      delete headers["Content-Type"];
    }

    const request = await fetch(url, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });

    const response = await request.json();
    return response;
  } catch (error: unknown) {
    console.error("POST_REQUEST error:", error);
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};


export const POST_REQUEST_FILE_UPLOAD = async (
  url: string,
  data: FormData,
  token?: string,
) => {
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
    console.log(error);
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};

export const PUT_REQUEST = async (
  url: string,
  data: unknown,
  token?: string,
) => {
  try {
    const request = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return {
      error: (error as Error).message || "Unknown error",
      success: false,
      message: "An error occurred, please try again.",
    };
  }
};
