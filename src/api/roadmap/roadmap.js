// /api/roadmap/roadmapApi.js
import axios from "axios";
import { BASE_URL } from "../../api/apiConfig";

/**
 * 로컬스토리지에서 토큰을 가져옴 (로그인 여부 확인)
 */
function getAuthToken() {
  return localStorage.getItem("token") || null;
}

/**
 * ✅ 로드맵 질문 조회 API
 * GET /roadmap/questions
 * @returns {Object} 예: { result: 'success', questions: [ {...}, ... ] }
 */
export async function fetchRoadmapQuestions() {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}/roadmap/questions`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("로드맵 질문 조회 에러:", error);
    return null;
  }
}

/**
 * ✅ 로드맵 답변 저장 API
 * POST /roadmap/answers
 * @param {Object} answersObj - 사용자가 선택한 답변 (ex: { 2: [1], 3: [7], 5: [15,16] })
 * @returns {Object} 예: { result: 'success', ... }
 */
export async function submitRoadmapAnswers(answersObj) {
  const token = getAuthToken();

  try {
    // answersObj = { 2: [2], 3: [8], 4: [13], 5: [15,16], 6: [19], ... }
    // 만약 사용자가 Q5에 (15,16)을 고른다면 => "15,16" 이라는 문자열로 결합
    const payload = Object.entries(answersObj).map(([questionId, selectedArr]) => {
      // selectedArr는 [2] 또는 [15,16] 등 배열
      // 배열을 쉼표로 이어 붙인 문자열 생성
      const selectedString = selectedArr.join(",");

      return {
        questionId: Number(questionId),
        selectedOptions: selectedString,
      };
    });

    // 서버가 배열( [...]) 자체를 요청 바디로 요구하므로 그대로 POST
    const response = await axios.post(
      `${BASE_URL}/roadmap/answers`,
      payload, // ← 배열 형태로 전송
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { result: "success", ... }
  } catch (error) {
    console.error("로드맵 답변 저장 API 에러:", error);
    return null;
  }
}

//로드맵 점수 api
export async function getRoadmapScores() {
  const token = getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}/roadmap/scores`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("로드맵 점수 조회 API 에러:", error);
    return null;
  }
}