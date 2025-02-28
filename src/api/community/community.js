import axios from 'axios';
import { BASE_URL } from '../apiConfig';

//커뮤니티 리스트 API
export async function getCommunity(category, page = 0, size = 10) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/post/list`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params: {
        page,
        size,

      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category} posts:`, error);
    return false;
  }
}

//커뮤니티 좋아요 API
export async function toggleLike(postId) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error:", error);
    return false;
  }

  try {

    const response = await axios.post(
      `${BASE_URL}/post/like`,
      { postId },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("error", error);
    return false;
  }
}

//커뮤니티 신고 API
export async function reportPost(postId, reason) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error");
    return false;
  }

  try {

    const response = await axios.post(
      `${BASE_URL}/post/report`,
      { postId, reason },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error("error :", error);
    return false;

  }
}
