import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const fetchWithToken = async (url, options = {}) => {
  let token = localStorage.getItem("token");
  const navigate = useNavigate;

  // 기본 요청 옵션에 Authorization 헤더 추가
  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await fetch(url, fetchOptions);

  // 만약 응답이 401 Unauthorized라면 토큰 재발급을 시도합니다.
  if (response.status === 401) {
    // 여기에서 토큰 재발급 로직을 구현합니다.
    const reissueResponse = await fetch(`http://localhost:8080/api/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // 유저네임을 이용한 재발급 요청이 아닌 다른 인증 정보가 필요한 경우 수정 필요
    });

    if (reissueResponse.ok) {
      const reissueData = await reissueResponse.json();
      localStorage.setItem("token", reissueData.token);
      console.log(reissueData.token)
      token = reissueData.accessToken;

      // 재발급 받은 토큰을 사용하여 요청을 재시도합니다.
      response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      // 재발급 실패 시 처리 (예: 사용자 로그아웃 처리)
      localStorage.removeItem("token"); // 토큰 삭제
      navigate("/login"); // 토큰이 없다면 로그인 페이지로 리다이렉트
     
      console.error("Token reissue failed. Please login again.");
      // 로그아웃 처리 로직 추가
      return null;
    }
  }

  return response;
};
export default fetchWithToken;