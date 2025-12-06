/**
 * 그리드 에디터 패널 (우하단)
 * 사용자가 식물을 배치하고 편집하는 메인 작업 영역입니다.
 */

import { useEditor, generateId, isPositionOccupied } from "../context/EditorContext";
import type { PlacedPlant } from "../models/types";

export default function BottomRightGridEditorPanel() {
  const { state, dispatch } = useEditor();

  const { cols, rows, cellSize } = state.gridConfig;
  const svgWidth = cols * cellSize;
  const svgHeight = rows * cellSize;

  /**
   * 그리드 셀 클릭 핸들러
   * - 선택된 식물이 있으면 해당 위치에 배치
   * - 이미 배치된 식물이 있으면 선택
   */
  const handleCellClick = (x: number, y: number) => {
    const existing = isPositionOccupied(state.placedPlants, x, y);

    if (existing) {
      // 이미 배치된 식물 선택
      dispatch({ type: "SELECT_PLACED_PLANT", payload: existing.id });
    } else if (state.selectedPlantId) {
      // 새로운 식물 배치
      const newPlant: PlacedPlant = {
        id: generateId(),
        plantId: state.selectedPlantId,
        gridX: x,
        gridY: y,
        radius: 0.4, // 셀 크기의 40%
      };
      dispatch({ type: "ADD_PLACED_PLANT", payload: newPlant });
    }
  };

  /**
   * 배치된 식물 삭제 핸들러
   */
  const handleDeletePlant = () => {
    if (state.selectedPlacedPlantId) {
      dispatch({ type: "REMOVE_PLACED_PLANT", payload: state.selectedPlacedPlantId });
    }
  };

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

  /**
   * 선택된 배치 식물의 상세 정보
   */
  const getSelectedPlantInfo = () => {
    if (!state.selectedPlacedPlantId) return null;

    const placedPlant = state.placedPlants.find(
      (p) => p.id === state.selectedPlacedPlantId
    );
    if (!placedPlant) return null;

    const plant = state.plants.find((p) => p.id === placedPlant.plantId);
    if (!plant) return null;

    return { placedPlant, plant };
  };

  const selectedInfo = getSelectedPlantInfo();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">식재 평면도</h3>

        {/* 선택된 배치 식물 정보 및 삭제 버튼 */}
        {selectedInfo && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              선택: <span className="font-semibold">{selectedInfo.plant.commonName}</span>
            </span>
            <button
              onClick={handleDeletePlant}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 안내 메시지 */}
      {!state.selectedPlantId && state.placedPlants.length === 0 && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          💡 좌측 식물 목록에서 식물을 선택한 후, 그리드를 클릭하여 배치하세요.
        </div>
      )}

      {/* SVG 그리드 */}
      <div className="flex-1 overflow-auto bg-gray-50 rounded-lg p-4">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="border border-gray-300 bg-white"
        >
          {/* 그리드 라인 그리기 */}
          {/* 세로선 */}
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={svgHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* 가로선 */}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * cellSize}
              x2={svgWidth}
              y2={i * cellSize}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* 클릭 가능한 셀 영역 */}
          {Array.from({ length: rows }).map((_, rowIdx) =>
            Array.from({ length: cols }).map((_, colIdx) => {
              const occupied = isPositionOccupied(state.placedPlants, colIdx, rowIdx);
              return (
                <rect
                  key={`cell-${colIdx}-${rowIdx}`}
                  x={colIdx * cellSize}
                  y={rowIdx * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="transparent"
                  onClick={() => handleCellClick(colIdx, rowIdx)}
                  className={`
                    cursor-pointer transition-all
                    ${occupied ? "" : "hover:fill-blue-50"}
                  `}
                />
              );
            })
          )}

          {/* 배치된 식물 렌더링 */}
          {state.placedPlants.map((placedPlant) => {
            const cx = (placedPlant.gridX + 0.5) * cellSize;
            const cy = (placedPlant.gridY + 0.5) * cellSize;
            const radius = (placedPlant.radius || 0.4) * cellSize;
            const color = getPlantColor(placedPlant);
            const isSelected = state.selectedPlacedPlantId === placedPlant.id;

            const plant = state.plants.find((p) => p.id === placedPlant.plantId);
            const appearance = plant?.seasonAppearance[state.currentSeason];

            return (
              <g key={placedPlant.id}>
                {/* 선택 표시 (외곽 원) */}
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 4}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* 메인 원 */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={color}
                  stroke={isSelected ? "#3b82f6" : "#666"}
                  strokeWidth={isSelected ? "2" : "1"}
                  className="cursor-pointer transition-all hover:opacity-80"
                  onClick={() =>
                    dispatch({
                      type: "SELECT_PLACED_PLANT",
                      payload: placedPlant.id,
                    })
                  }
                />

                {/* 꽃 표시 (작은 원들) */}
                {appearance?.hasFlower && appearance.flowerColor && (
                  <>
                    <circle
                      cx={cx - radius * 0.3}
                      cy={cy - radius * 0.3}
                      r={radius * 0.25}
                      fill={appearance.flowerColor}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <circle
                      cx={cx + radius * 0.3}
                      cy={cy - radius * 0.3}
                      r={radius * 0.25}
                      fill={appearance.flowerColor}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <circle
                      cx={cx}
                      cy={cy + radius * 0.3}
                      r={radius * 0.25}
                      fill={appearance.flowerColor}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </>
                )}

                {/* 식물 이름 라벨 (작은 텍스트) */}
                {plant && (
                  <text
                    x={cx}
                    y={cy + radius + 12}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#666"
                    className="pointer-events-none select-none"
                  >
                    {plant.commonName}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 하단 정보 */}
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span>그리드: {cols} × {rows}</span>
        {state.selectedPlantId && (
          <span className="text-blue-600">
            ✏️ 배치 모드: {state.plants.find((p) => p.id === state.selectedPlantId)?.commonName}
          </span>
        )}
      </div>
    </div>
  );
}
