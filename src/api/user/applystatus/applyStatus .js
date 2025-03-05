import axios from "axios";
import { BASE_URL } from "../../apiConfig";

// ✅ 지원 내역 가져오기 API
export const applyStatus = async (token, startDate, endDate) => {
  try {
    const response = await axios.get(`${BASE_URL}/employ/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
