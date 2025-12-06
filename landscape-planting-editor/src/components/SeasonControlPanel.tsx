/**
 * 계절 컨트롤 패널
 * 사용자가 계절을 선택하여 모든 식물의 외관을 변경할 수 있습니다.
 */

import { useEditor } from "../context/EditorContext";
import type { SeasonKey } from "../models/types";
import { SEASON_LABELS } from "../models/types";

export default function SeasonControlPanel() {
  const { state, dispatch } = useEditor();

  const seasons: SeasonKey[] = ["spring", "summer", "autumn", "winter"];

  // 계절별 배경 색상
  const seasonColors: Record<SeasonKey, string> = {
    spring: "bg-pink-100 hover:bg-pink-200 border-pink-400",
    summer: "bg-green-100 hover:bg-green-200 border-green-400",
    autumn: "bg-orange-100 hover:bg-orange-200 border-orange-400",
    winter: "bg-blue-100 hover:bg-blue-200 border-blue-400",
  };

  // 계절별 아이콘 (간단한 이모지)
  const seasonIcons: Record<SeasonKey, string> = {
    spring: "🌸",
    summer: "☀️",
    autumn: "🍂",
    winter: "❄️",
  };

  const handleSeasonChange = (season: SeasonKey) => {
    dispatch({ type: "SET_SEASON", payload: season });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-3 text-gray-800">계절 선택</h3>

      {/* 계절 버튼 그리드 */}
      <div className="grid grid-cols-4 gap-2">
        {seasons.map((season) => {
          const isActive = state.currentSeason === season;
          return (
            <button
              key={season}
              onClick={() => handleSeasonChange(season)}
              className={`
                px-3 py-2 rounded-lg border-2 transition-all
                ${seasonColors[season]}
                ${isActive ? "ring-2 ring-offset-2 ring-blue-500 font-bold" : ""}
                flex flex-col items-center justify-center gap-1
              `}
            >
              <span className="text-2xl">{seasonIcons[season]}</span>
              <span className="text-sm">{SEASON_LABELS[season]}</span>
            </button>
          );
        })}
      </div>

      {/* 현재 선택된 계절 정보 */}
      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
        <span className="font-semibold">현재 계절:</span>{" "}
        <span className="text-blue-600">{SEASON_LABELS[state.currentSeason]}</span>
      </div>

      {/* 전체 배치 삭제 버튼 */}
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => {
            if (
              window.confirm(
                "모든 배치된 식물을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
              )
            ) {
              dispatch({ type: "CLEAR_ALL_PLACEMENTS" });
            }
          }}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          전체 배치 삭제
        </button>
      </div>
    </div>
  );
}
