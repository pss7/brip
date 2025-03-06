import axios from "axios";
import { BASE_URL } from "../../apiConfig";

// ✅ 로컬 스토리지에서 토큰 가져오기
const getAuthToken = () => localStorage.getItem("token");

// ✅ 지원 내역 가져오기 API
export const applyStatus = async (startDate, endDate) => {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}/employ/applications`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      params: {
        page: 1,
        pageSize: 10,
        startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD 변환
        endDate: endDate.toISOString().split("T")[0],
        status: "지원완료",
      },
    });

    return response.data;
  } catch (error) {
    console.error("지원 내역 API 호출 에러:", error);
    return null;
  }
};

// ✅ 지원 취소 API
export const cancelApplication = async (applicationId) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `${BASE_URL}/employ/applications/${applicationId}/cancel`,
      {},
      {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
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
  const token = getAuthToken();
  try {
    const response = await axios.delete(
      `${BASE_URL}/employ/applications/${applicationId}/delete`,
      {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
      }
    );
    return response.data;
  } catch (error) {
    console.error("지원 삭제 API 호출 에러:", error);
    return null;
  }
};
