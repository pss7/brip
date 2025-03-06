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
export async function postCommunity({ category, content, file }) {
  const token = localStorage.getItem("token");

  try {
    // 1) FormData 생성
    const formData = new FormData();
    formData.append("category", category);
    formData.append("content", content);

    // 서버가 어떤 키로 파일을 받는지 확인 (예: 'file' 이나 'imgFile' 등)
    if (file) {
      formData.append("file", file);
    }

    // 2) multipart/form-data 전송
    const response = await axios.post(`${BASE_URL}/post/create`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // { result: 'success', ... }
  } catch (error) {
    console.error("게시글 생성 API 에러:", error);
    return null;
  }
}

//커뮤니티 좋아요 API
export async function toggleLike(postId) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error");
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
    console.error("error");
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

// 커뮤니티 댓글 목록 API
export async function getCommentList(page=0, size=10, category, postId) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // path param: /comment/list/:postId
    // query param: page, size, category
    const response = await axios.get(
      `${BASE_URL}/comment/list/${postId}`, // ← postId in path
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, category },
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

//댓글 좋아요 API
export async function postCommentLike(commentId) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("error");
    return false;
  }

  try {

    const response = await axios.post(
      `${BASE_URL}/comment/like`,
      { commentId },
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

// 대댓글 목록 조회 API
export async function getReplyList(commentId) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const response = await axios.get(
      `${BASE_URL}/comment/replies/${commentId}`, // ← commentId 경로에 추가
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("대댓글 목록 조회 오류:", error);
    return false;
  }
}

// ✅ API 호출 함수
export async function postReply({ postId, parentId, content }) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ 토큰이 없습니다.");
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/comment/reply`,
      { postId, parentId, content },  // ✅ 필수 값 모두 전달
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;  // { result: "success", data: ... }
  } catch (error) {
    console.error("❌ 대댓글 등록 API 에러:", error);
    return false;
  }
}

// ✅ 커뮤니티 게시글 삭제 API
export async function deleteCommunityPost(postId) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ 토큰이 없습니다.");
    return false;
  }

  try {
    const response = await axios.delete(`${BASE_URL}/post/delete`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { postId }, // DELETE 요청에서 Body를 통해 전달
    });

    return response.data; // { result: "success" }
  } catch (error) {
    console.error("❌ 게시글 삭제 API 에러:", error);
    return false;
  }
}


