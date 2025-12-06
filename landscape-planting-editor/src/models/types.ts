/**
 * 조경 식재 패턴 에디터 - 타입 정의
 * 식물, 배치, 계절 등 핵심 도메인 모델을 정의합니다.
 */

// 계절 타입 (봄, 여름, 가을, 겨울)
export type SeasonKey = "spring" | "summer" | "autumn" | "winter";

// 식물 카테고리 (교목, 관목, 다년생초화, 지피식물, 그라스류)
export type PlantCategory = "tree" | "shrub" | "perennial" | "groundcover" | "grass";

/**
 * 계절별 식물 외관 정보
 * 각 계절마다 꽃, 잎, 가지의 유무와 색상을 정의
 */
export interface PlantSeasonAppearance {
  hasFlower: boolean;          // 해당 계절에 꽃이 피는지
  hasLeaf: boolean;            // 해당 계절에 잎이 있는지
  isDeciduous: boolean;        // 낙엽수 여부 (겨울에 잎이 떨어지는 등)
  flowerColor?: string;        // 꽃 색상 (예: "#ff69b4")
  leafColor?: string;          // 잎 색상 (예: "#4ade80")
  branchColor?: string;        // 가지/줄기 색상 (예: "#8b4513")
  note?: string;               // 계절별 특징 설명
}

/**
 * 식물 정보
 * 수종의 기본 정보와 계절별 외관을 포함
 */
export interface Plant {
  id: string;                                        // 고유 식별자
  commonName: string;                                // 국명 (예: "벚나무")
  scientificName?: string;                           // 학명 (선택)
  category: PlantCategory;                           // 식물 카테고리
  thumbnailColor: string;                            // 리스트용 기본 색상
  seasonAppearance: Record<SeasonKey, PlantSeasonAppearance>;  // 계절별 외관
  description?: string;                              // 식물 전체 설명
}

/**
 * 배치된 식물 정보
 * 그리드 상의 특정 위치에 배치된 식물 인스턴스
 */
export interface PlacedPlant {
  id: string;                  // 배치 인스턴스 ID (UUID 등)
  plantId: string;             // 어떤 Plant인지 참조 (Plant.id)
  gridX: number;               // 그리드 X 좌표 (정수, 칸 인덱스)
  gridY: number;               // 그리드 Y 좌표 (정수, 칸 인덱스)
  radius?: number;             // 심볼 반경 (그리드 셀 기준 상대 크기, 기본값: 0.4)
  density?: number;            // 식재 밀도 (선택, 1.0 = 100%)
  note?: string;               // 배치에 대한 메모
}

/**
 * 그리드 설정 정보
 */
export interface GridConfig {
  cols: number;                // 그리드 열 개수
  rows: number;                // 그리드 행 개수
  cellSize: number;            // 셀 크기 (픽셀)
}

/**
 * 전체 에디터 상태
 * 애플리케이션의 중앙 상태를 관리
 */
export interface EditorState {
  plants: Plant[];                      // 사용 가능한 식물 목록
  placedPlants: PlacedPlant[];          // 평면에 배치된 식물들
  selectedPlantId: string | null;       // 현재 선택된 식물 (팔레트에서 선택)
  selectedPlacedPlantId: string | null; // 그리드 상에서 선택된 배치 인스턴스
  currentSeason: SeasonKey;             // 현재 계절
  gridConfig: GridConfig;               // 그리드 설정
  searchQuery: string;                  // 식물 검색어
  categoryFilter: PlantCategory | null; // 카테고리 필터
}

/**
 * 에디터 액션 타입
 * Reducer에서 사용되는 모든 액션을 정의
 */
export type EditorAction =
  | { type: "SELECT_PLANT"; payload: string | null }
  | { type: "SELECT_PLACED_PLANT"; payload: string | null }
  | { type: "ADD_PLACED_PLANT"; payload: PlacedPlant }
  | { type: "REMOVE_PLACED_PLANT"; payload: string }
  | { type: "UPDATE_PLACED_PLANT"; payload: PlacedPlant }
  | { type: "SET_SEASON"; payload: SeasonKey }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_CATEGORY_FILTER"; payload: PlantCategory | null }
  | { type: "CLEAR_ALL_PLACEMENTS" };

/**
 * 계절 한글 레이블
 */
export const SEASON_LABELS: Record<SeasonKey, string> = {
  spring: "봄",
  summer: "여름",
  autumn: "가을",
  winter: "겨울",
};

/**
 * 카테고리 한글 레이블
 */
export const CATEGORY_LABELS: Record<PlantCategory, string> = {
  tree: "교목",
  shrub: "관목",
  perennial: "다년생초화",
  groundcover: "지피식물",
  grass: "그라스류",
};
