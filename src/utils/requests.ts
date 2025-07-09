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

    const response = await request.json();
    return response;
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

export const DELETE_REQUEST = async (url: string, token?: string) => {
  try {
    const request = await fetch(url, {
      method: "DELETE", // Added the DELETE method
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  token?: string,
) => {
  try {
    const request = await fetch(url, {
      method: "POST",
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
