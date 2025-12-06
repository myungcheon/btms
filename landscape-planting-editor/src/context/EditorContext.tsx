/**
 * 조경 식재 패턴 에디터 - 상태 관리 Context
 * React Context API와 useReducer를 사용하여 전역 상태를 관리합니다.
 */

import React, { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { EditorState, EditorAction, PlacedPlant } from "../models/types";
import { samplePlants } from "../data/samplePlants";

/**
 * 초기 상태 정의
 */
const initialState: EditorState = {
  plants: samplePlants,                  // 샘플 식물 데이터 로드
  placedPlants: [],                      // 초기에는 배치된 식물 없음
  selectedPlantId: null,                 // 선택된 식물 없음
  selectedPlacedPlantId: null,           // 선택된 배치 인스턴스 없음
  currentSeason: "spring",               // 기본 계절: 봄
  gridConfig: {
    cols: 20,                            // 그리드 열 개수: 20
    rows: 20,                            // 그리드 행 개수: 20
    cellSize: 30,                        // 셀 크기: 30px
  },
  searchQuery: "",                       // 검색어 없음
  categoryFilter: null,                  // 카테고리 필터 없음
};

/**
 * Reducer 함수
 * 모든 액션을 처리하여 새로운 상태를 반환
 */
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    // 식물 선택 (팔레트에서)
    case "SELECT_PLANT":
      return {
        ...state,
        selectedPlantId: action.payload,
        selectedPlacedPlantId: null, // 새로운 식물 선택 시 배치된 식물 선택 해제
      };

    // 배치된 식물 선택 (그리드에서)
    case "SELECT_PLACED_PLANT":
      return {
        ...state,
        selectedPlacedPlantId: action.payload,
      };

    // 식물 배치 추가
    case "ADD_PLACED_PLANT":
      return {
        ...state,
        placedPlants: [...state.placedPlants, action.payload],
      };

    // 배치된 식물 제거
    case "REMOVE_PLACED_PLANT":
      return {
        ...state,
        placedPlants: state.placedPlants.filter((p) => p.id !== action.payload),
        selectedPlacedPlantId:
          state.selectedPlacedPlantId === action.payload
            ? null
            : state.selectedPlacedPlantId,
      };

    // 배치된 식물 업데이트 (위치 이동 등)
    case "UPDATE_PLACED_PLANT":
      return {
        ...state,
        placedPlants: state.placedPlants.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    // 계절 변경
    case "SET_SEASON":
      return {
        ...state,
        currentSeason: action.payload,
      };

    // 검색어 설정
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };

    // 카테고리 필터 설정
    case "SET_CATEGORY_FILTER":
      return {
        ...state,
        categoryFilter: action.payload,
      };

    // 모든 배치 삭제
    case "CLEAR_ALL_PLACEMENTS":
      return {
        ...state,
        placedPlants: [],
        selectedPlacedPlantId: null,
      };

    default:
      return state;
  }
}

/**
 * Context 타입 정의
 */
interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

/**
 * Context 생성
 */
const EditorContext = createContext<EditorContextType | undefined>(undefined);

/**
 * Provider 컴포넌트
 * 앱 전체를 감싸서 상태를 제공
 */
export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

/**
 * Custom Hook - Context 사용을 간편하게
 * 모든 컴포넌트에서 useEditor()로 상태와 dispatch에 접근 가능
 */
export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}

/**
 * 유틸리티 함수 - 특정 위치에 이미 식물이 배치되어 있는지 확인
 */
export function isPositionOccupied(
  placedPlants: PlacedPlant[],
  x: number,
  y: number
): PlacedPlant | undefined {
  return placedPlants.find((p) => p.gridX === x && p.gridY === y);
}

/**
 * 유틸리티 함수 - 고유 ID 생성 (간단한 UUID 대체)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
