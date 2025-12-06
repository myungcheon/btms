/**
 * 식물 리스트 패널 (좌하단)
 * 사용 가능한 식물 목록을 표시하고, 검색 및 필터링 기능을 제공합니다.
 */

import { useEditor } from "../context/EditorContext";
import type { Plant, PlantCategory } from "../models/types";
import { CATEGORY_LABELS, SEASON_LABELS } from "../models/types";

export default function BottomLeftPlantListPanel() {
  const { state, dispatch } = useEditor();

  // 검색어와 카테고리 필터에 따라 식물 필터링
  const filteredPlants = state.plants.filter((plant) => {
    const matchesSearch =
      state.searchQuery === "" ||
      plant.commonName.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      plant.scientificName?.toLowerCase().includes(state.searchQuery.toLowerCase());

    const matchesCategory =
      state.categoryFilter === null || plant.category === state.categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // 배치된 식물 통계 계산
  const plantUsageCount = state.placedPlants.reduce((acc, placed) => {
    acc[placed.plantId] = (acc[placed.plantId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handlePlantSelect = (plantId: string) => {
    dispatch({ type: "SELECT_PLANT", payload: plantId });
  };

  const handleSearchChange = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const handleCategoryFilter = (category: PlantCategory | null) => {
    dispatch({ type: "SET_CATEGORY_FILTER", payload: category });
  };

  // 현재 계절의 식물 외관 가져오기
  const getSeasonAppearance = (plant: Plant) => {
    return plant.seasonAppearance[state.currentSeason];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-3 text-gray-800">식물 목록</h3>

      {/* 검색 입력 */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="식물 이름 검색..."
          value={state.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* 카테고리 필터 버튼 */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryFilter(null)}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            state.categoryFilter === null
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          전체
        </button>
        {(Object.keys(CATEGORY_LABELS) as PlantCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryFilter(category)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              state.categoryFilter === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      {/* 식물 리스트 (스크롤 가능) */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredPlants.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            검색 결과가 없습니다.
          </div>
        ) : (
          filteredPlants.map((plant) => {
            const isSelected = state.selectedPlantId === plant.id;
            const usageCount = plantUsageCount[plant.id] || 0;
            const appearance = getSeasonAppearance(plant);

            return (
              <div
                key={plant.id}
                onClick={() => handlePlantSelect(plant.id)}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* 색상 미리보기 (현재 계절 반영) */}
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 flex-shrink-0"
                    style={{
                      backgroundColor:
                        appearance.hasFlower && appearance.flowerColor
                          ? appearance.flowerColor
                          : appearance.hasLeaf && appearance.leafColor
                          ? appearance.leafColor
                          : appearance.branchColor || plant.thumbnailColor,
                    }}
                  />

                  {/* 식물 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {plant.commonName}
                      </h4>
                      {usageCount > 0 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex-shrink-0 ml-2">
                          {usageCount}개
                        </span>
                      )}
                    </div>

                    {plant.scientificName && (
                      <p className="text-xs text-gray-500 italic mb-1 truncate">
                        {plant.scientificName}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {CATEGORY_LABELS[plant.category]}
                      </span>
                    </div>

                    {/* 현재 계절 상태 */}
                    <p className="text-xs text-gray-600 mt-2">
                      <span className="font-semibold">
                        {SEASON_LABELS[state.currentSeason]}:
                      </span>{" "}
                      {appearance.note || "정보 없음"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 배치 통계 */}
      {state.placedPlants.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">총 배치:</span>{" "}
            <span className="text-blue-600">{state.placedPlants.length}개</span>
          </p>
        </div>
      )}
    </div>
  );
}
