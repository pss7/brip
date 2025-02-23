import axios from 'axios';
import { BASE_URL } from '../apiConfig';

export async function getKnowhow() {
  const token = localStorage.getItem("token");

  try {

    const response = await axios.get(`${BASE_URL}post/list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params: {
        page: 0,
        size: 10,
        category: encodeURIComponent("노하우&Q&A"),  // Ensure only one encoding
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching knowhow posts:", error);
    return false;
  }
}
