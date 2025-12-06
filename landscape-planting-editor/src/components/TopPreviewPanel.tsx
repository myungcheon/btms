/**
 * 상단 미리보기 패널
 * 배치된 식물들을 전체적으로 조망할 수 있는 미리보기를 제공합니다.
 */

import { useEditor } from "../context/EditorContext";
import type { PlacedPlant } from "../models/types";

export default function TopPreviewPanel() {
  const { state } = useEditor();

  const { cols, rows, cellSize } = state.gridConfig;

  // 미리보기는 더 큰 셀 크기 사용 (1.5배)
  const previewCellSize = cellSize * 1.5;
  const previewWidth = cols * previewCellSize;
  const previewHeight = rows * previewCellSize;

  /**
   * 배치된 식물의 색상 가져오기 (현재 계절 반영)
   */
  const getPlantColor = (placedPlant: PlacedPlant): string => {
    const plant = state.plants.find((p) => p.id === placedPlant.plantId);
    if (!plant) return "#cccccc";

    const appearance = plant.seasonAppearance[state.currentSeason];

    // 우선순위: 꽃 > 잎 > 가지 > 기본색
    if (appearance.hasFlower && appearance.flowerColor) {
      return appearance.flowerColor;
    } else if (appearance.hasLeaf && appearance.leafColor) {
      return appearance.leafColor;
    } else if (appearance.branchColor) {
      return appearance.branchColor;
    }

    return plant.thumbnailColor;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3 text-gray-800">식재 패턴 미리보기</h3>

      {/* 안내 메시지 (배치된 식물이 없을 때) */}
      {state.placedPlants.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-xl mb-2">🌱</p>
            <p className="text-sm">아직 배치된 식물이 없습니다.</p>
            <p className="text-xs mt-1">
              좌측에서 식물을 선택하고 우측 그리드에서 배치하세요.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* SVG 미리보기 */}
          <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <svg
              width={previewWidth}
              height={previewHeight}
              className="border border-gray-200 bg-gradient-to-br from-green-50 to-blue-50"
            >
              {/* 배경 그리드 (더 연하게) */}
              {Array.from({ length: cols + 1 }).map((_, i) => (
                <line
                  key={`pv-${i}`}
                  x1={i * previewCellSize}
                  y1={0}
                  x2={i * previewCellSize}
                  y2={previewHeight}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}

              {Array.from({ length: rows + 1 }).map((_, i) => (
                <line
                  key={`ph-${i}`}
                  x1={0}
                  y1={i * previewCellSize}
                  x2={previewWidth}
                  y2={i * previewCellSize}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              ))}

              {/* 배치된 식물들 렌더링 */}
              {state.placedPlants.map((placedPlant) => {
                const cx = (placedPlant.gridX + 0.5) * previewCellSize;
                const cy = (placedPlant.gridY + 0.5) * previewCellSize;
                const radius = (placedPlant.radius || 0.4) * previewCellSize;
                const color = getPlantColor(placedPlant);

                const plant = state.plants.find((p) => p.id === placedPlant.plantId);
                const appearance = plant?.seasonAppearance[state.currentSeason];

                return (
                  <g key={placedPlant.id}>
                    {/* 그림자 효과 */}
                    <circle
                      cx={cx + 2}
                      cy={cy + 2}
                      r={radius}
                      fill="rgba(0, 0, 0, 0.1)"
                    />

                    {/* 메인 원 (잎 또는 가지) */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={color}
                      stroke="#555"
                      strokeWidth="1.5"
                    />

                    {/* 꽃 표시 (더 크고 화려하게) */}
                    {appearance?.hasFlower && appearance.flowerColor && (
                      <>
                        {/* 중앙 꽃 */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={radius * 0.35}
                          fill={appearance.flowerColor}
                          stroke="white"
                          strokeWidth="1"
                        />

                        {/* 주변 꽃잎들 (6개) */}
                        {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
                          const rad = (angle * Math.PI) / 180;
                          const petalX = cx + Math.cos(rad) * radius * 0.6;
                          const petalY = cy + Math.sin(rad) * radius * 0.6;
                          return (
                            <circle
                              key={idx}
                              cx={petalX}
                              cy={petalY}
                              r={radius * 0.25}
                              fill={appearance.flowerColor}
                              stroke="white"
                              strokeWidth="0.5"
                              opacity="0.9"
                            />
                          );
                        })}
                      </>
                    )}

                    {/* 낙엽수이고 잎이 없는 경우 (겨울) 가지 표현 */}
                    {appearance?.isDeciduous && !appearance.hasLeaf && (
                      <>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx - radius * 0.5}
                          y2={cy - radius * 0.7}
                          stroke={appearance.branchColor || "#654321"}
                          strokeWidth="2"
                        />
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx + radius * 0.5}
                          y2={cy - radius * 0.7}
                          stroke={appearance.branchColor || "#654321"}
                          strokeWidth="2"
                        />
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx - radius * 0.3}
                          y2={cy + radius * 0.5}
                          stroke={appearance.branchColor || "#654321"}
                          strokeWidth="2"
                        />
                        <line
                          x1={cx}
                          y1={cy}
                          x2={cx + radius * 0.3}
                          y2={cy + radius * 0.5}
                          stroke={appearance.branchColor || "#654321"}
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 통계 정보 */}
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-2 rounded text-center">
              <p className="text-gray-600">총 배치</p>
              <p className="text-xl font-bold text-blue-600">
                {state.placedPlants.length}
              </p>
            </div>

            <div className="bg-green-50 p-2 rounded text-center">
              <p className="text-gray-600">사용 수종</p>
              <p className="text-xl font-bold text-green-600">
                {new Set(state.placedPlants.map((p) => p.plantId)).size}
              </p>
            </div>

            <div className="bg-purple-50 p-2 rounded text-center">
              <p className="text-gray-600">그리드 크기</p>
              <p className="text-xl font-bold text-purple-600">
                {cols}×{rows}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
