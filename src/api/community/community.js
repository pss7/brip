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
export async function postCommunity({ category, content, image }) {
  const token = localStorage.getItem("token");

  try {
    // FormData 생성 (파일 업로드를 위한 multipart/form-data)
    const formData = new FormData();
    formData.append("category", category);
    formData.append("content", content);

    // 이미지 파일이 있으면 추가 (파일 객체 확인)
    if (image instanceof File) {
      formData.append("image", image);
    }

    // 🔍 디버깅 로그
    console.log("🚀 업로드 데이터:", {
      category,
      content,
      image: image instanceof File ? image.name : "No Image",
    });

    const response = await axios.post(`${BASE_URL}/post/create`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // ✅ 파일 업로드 시 필요
      },
    });

    return response.data;
  } catch (error) {
    console.error("🚨 게시글 생성 API 에러:", error);
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
export async function getCommentList(page = 0, size = 10, category, postId) {
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

//대댓글 목록 조회 API
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

//API 호출 함수
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

// 커뮤니티 게시글 삭제 API (POST 방식)
export async function deleteCommunityPost({ postId }) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ 토큰이 없습니다.");
    return false;
  }
  try {
    // POST 메서드로 삭제 요청 (DELETE 대신)
    const response = await axios.post(
      `${BASE_URL}/post/delete`,
      { postId }, // 삭제할 게시글 ID를 body에 담아서 전송
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // 성공 시 { result: "success", ... }
  } catch (error) {
    console.error("❌ 게시글 삭제 API 에러:", error);
    return false;
  }
}

//커뮤니티 수정 API
export async function updateCommunityPost({ postId, category, content, image }) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ 토큰이 없습니다.");
    return false;
  }

  try {
    // FormData 생성 (업데이트 시에도 파일 업로드가 필요하면 사용)
    const formData = new FormData();
    formData.append("postId", postId);
    if (category) formData.append("category", category);
    if (content) formData.append("content", content);
    // 이미지가 File 객체이면 전송, 없으면 생략
    if (image instanceof File) {
      formData.append("image", image);
    }

    // 디버깅 로그
    console.log("업데이트 요청 데이터:", {
      postId,
      category,
      content,
      image: image instanceof File ? image.name : "No Image",
    });

    const response = await axios.post(`${BASE_URL}/post/update`, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // { result: "success", ... }
  } catch (error) {
    console.error("❌ 게시글 업데이트 API 에러:", error);
    return null;
  }
}
