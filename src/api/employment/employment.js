import axios from "axios";
import { BASE_URL } from '../apiConfig';

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
