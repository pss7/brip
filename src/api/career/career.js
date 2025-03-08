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