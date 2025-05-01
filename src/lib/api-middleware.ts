// lib/api-middleware.ts
import { AxiosError } from 'axios';

export function handleApiError(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    const responseData = error.response.data as { detail?: string };
    throw new Error(responseData.detail || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
    throw new Error('Error setting up request');
  }
}