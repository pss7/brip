import axios from 'axios';
import { BASE_URL } from '../apiConfig';

//강의 목록 조회 API
export async function getCareerCourses(
  {
    page = '',
    size = '',
    category = '',
    keyword = '',
    jobCategory = ''
  }
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axios.get(`${BASE_URL}/course/list`, {
      params: { page, size, category, keyword, jobCategory },
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("강의 목록 불러오기 오류:", error.response?.data || error.message);
    return { result: "fail", courses: [] };
  }
}

//강의 상세 조회 API
export async function getCareerDetailCourses(career_Id) {

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }
    const response = await axios.get(`${BASE_URL}/course/${career_Id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("error", error);
  }

}

//직무 목록 조회 API
export async function getJopList() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axios.get(`${BASE_URL}/career/list`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response Data:", response.data); // 응답 데이터 확인

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("API 요청 중 알 수 없는 오류 발생:", error);
    }
    return null; // 오류 발생 시 null 반환
  }
}

//직무 상세 조회 API 추가
export async function getJobDetail(jobId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axios.get(`${BASE_URL}/career/${jobId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else {
      console.error("API 요청 중 알 수 없는 오류 발생:", error);
    }
    return null;
  }
}