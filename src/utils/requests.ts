/** @format */

interface IResponse {
  error: string;
  success: boolean;
  message: string;
  data?: unknown;
}

export const GET_REQUEST = async (
  url: string,
  token?: string
): Promise<IResponse> => {
  try {
    const request = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return {
      error: (error as Error).message || 'Unknown error',
      success: false,
      message: 'An error occurred, please try again.',
    };
  }
};

export const POST_REQUEST = async (
  url: string,
  data: unknown,
  token?: string
): Promise<IResponse> => {
  try {
    const request = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return {
      error: (error as Error).message || 'Unknown error',
      success: false,
      message: 'An error occurred, please try again.',
    };
  }
};

export const POST_REQUEST_FILE_UPLOAD = async (
  url: string,
  data: FormData,
  token?: string
): Promise<IResponse> => {
  try {
    const request = await fetch(url, {
      method: 'POST',
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
      error: (error as Error).message || 'Unknown error',
      success: false,
      message: 'An error occurred, please try again.',
    };
  }
};

export const PUT_REQUEST = async (
  url: string,
  data: unknown,
  token?: string
): Promise<IResponse> => {
  try {
    const request = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    console.log(error);
    return {
      error: (error as Error).message || 'Unknown error',
      success: false,
      message: 'An error occurred, please try again.',
    };
  }
};
