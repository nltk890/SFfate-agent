
import { BACKEND_URL } from '../constants';

export const queryAgent = async (query: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `An error occurred: ${response.statusText}`);
    }

    return data.response;
  } catch (error) {
    console.error('Error querying agent:', error);
    if (error instanceof Error) {
        return `Sorry, I encountered an error: ${error.message}. Please try again later.`;
    }
    return "Sorry, an unexpected error occurred. Please try again later.";
  }
};
