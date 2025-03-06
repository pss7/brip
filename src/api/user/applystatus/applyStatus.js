import axios from "axios";
import { BASE_URL } from "../../apiConfig";

// 로컬 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
const getLocalDateString = (date) => {
  if (!(date instanceof Date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ✅ 지원 내역 가져오기 API
export const applyStatus = async (startDate, endDate, options = {}) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BASE_URL}/employ/applications`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined,
      },
      params: {
        page: options.page || 1,
        pageSize: options.pageSize || 10,
        startDate,
        endDate,
        status: options.status || "지원완료", // API에서 필수인지 확인 필요
      },
    });

    console.log("📌 API 요청 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 지원 내역 API 호출 에러:", error);
    return null;
  }
};

// ✅ 지원 취소 API
export const cancelApplication = async (applicationId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/employ/applications/${applicationId}/cancel`,
      {},
      {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("지원 취소 API 호출 에러:", error);
    return null;
  }
};

// ✅ 지원 삭제 API
export const deleteApplication = async (applicationId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(
      `${BASE_URL}/employ/applications/${applicationId}/delete`,
      {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("지원 삭제 API 호출 에러:", error);
    return null;
  }
};
