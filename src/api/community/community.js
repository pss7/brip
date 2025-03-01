import axios from 'axios';
import { BASE_URL } from '../apiConfig';

//커뮤니티 목록 API
export async function getCommunityList(category, page = 0, size = 10) {
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
    console.error(`error:`, error);
    return false;
  }
}

// 커뮤니티 게시글 등록 API
export async function postCommunity(category, content, imgUrl) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error:", error);
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/post/create`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        category,
        content,
        imgUrl,
      }
    });

    return response.data;

  } catch (error) {
    console.error("error:", error);
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
export async function reportCommunity(postId, reason) {
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

//커뮤니티 상세 API
export async function getCommunityDetail(communityId) {

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error:", error);
    return false;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/post/detail`,
      {
        params: { postId: communityId },
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error("error", error);

    return false;

  }
}

//커뮤니티 댓글 목록 API
export async function getCommentList(page = 0, size = 10, category) {

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error:", error);
    return false;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/comment/list`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        params: {
          page,
          size,
          category
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error("error", error);

    return false;

  }
}

//커뮤니티 댓글 등록 API
export async function postComment(postId, content) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error");
    return false;
  }

  try {

    const response = await axios.post(
      `${BASE_URL}/comment/create`,
      { postId, content },
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