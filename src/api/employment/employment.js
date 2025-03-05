import axios from "axios";
import { BASE_URL } from "../apiConfig";

// 채용 공고 목록 API
export async function getEmploymentList(
  page = 1,
  pageSize = 10,
  keyword = "",
  regions = [],
  skills = "",
  careers = "",
  workTypes = ""
) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${BASE_URL}/employ/list`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined,
      },
      params: {
        page,
        pageSize,
        keyword,
        regions,
        skills,
        careers,
        workTypes,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Employment API 호출 에러:", error);
    return false;
  }
}

//채용 공고 상세 정보 API
export async function getEmploymentDetail(employId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/employ/${employId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Employment Detail API 호출 에러:", error);
    return false;
  }
}

// 좋아요 API
export async function likeEmployment(employId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/employ/${employId}/like`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("좋아요 API 호출 에러:", error);
    return false;
  }
}

// 즉시지원 API
export async function applyEmployment(employId, resumeId) {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${BASE_URL}/employ/${employId}/apply?resumeId=${resumeId}`, // ✅ 쿼리 파라미터로 전달
      {},  // POST 요청 본문을 비움
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("즉시지원 API 호출 에러:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "지원 요청 중 오류 발생");
  }
}


// 이력서 목록 API
export async function getResumes() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/employ/resumes`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Resumes API 호출 에러:", error);
    return false;
  }
}
