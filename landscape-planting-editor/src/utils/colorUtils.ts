/**
 * 색상 관련 유틸리티 함수
 */

/**
 * 16진수 색상에 투명도 추가
 * @param hex - 16진수 색상 코드 (예: "#ff0000")
 * @param alpha - 투명도 (0.0 ~ 1.0)
 * @returns RGBA 색상 문자열
 */
export function addAlpha(hex: string, alpha: number): string {
  // # 제거
  const cleanHex = hex.replace("#", "");

  // RGB 값 추출
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 색상 밝기 조절
 * @param hex - 16진수 색상 코드
 * @param percent - 밝기 조절 비율 (-100 ~ 100)
 * @returns 조절된 16진수 색상 코드
 */
export function adjustBrightness(hex: string, percent: number): string {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const adjust = (value: number) => {
    const adjusted = Math.round(value + (value * percent) / 100);
    return Math.max(0, Math.min(255, adjusted));
  };

  const newR = adjust(r).toString(16).padStart(2, "0");
  const newG = adjust(g).toString(16).padStart(2, "0");
  const newB = adjust(b).toString(16).padStart(2, "0");

  return `#${newR}${newG}${newB}`;
}
