/**
 * 조경 식재 패턴 에디터 - 메인 앱 컴포넌트
 * 모든 패널을 조합하여 전체 레이아웃을 구성합니다.
 */

import { EditorProvider } from "./context/EditorContext";
import TopPreviewPanel from "./components/TopPreviewPanel";
import BottomLeftPlantListPanel from "./components/BottomLeftPlantListPanel";
import BottomRightGridEditorPanel from "./components/BottomRightGridEditorPanel";
import SeasonControlPanel from "./components/SeasonControlPanel";

function App() {
  return (
    <EditorProvider>
      <div className="w-full h-full bg-gray-100 p-4">
        {/* 전체 레이아웃: 상단 40%, 하단 60% */}
        <div className="h-full flex flex-col gap-4">
          {/* 상단 영역: 미리보기 + 계절 컨트롤 */}
          <div className="h-[40%] flex gap-4">
            {/* 미리보기 (왼쪽 75%) */}
            <div className="flex-[3]">
              <TopPreviewPanel />
            </div>

            {/* 계절 컨트롤 (오른쪽 25%) */}
            <div className="flex-[1]">
              <SeasonControlPanel />
            </div>
          </div>

          {/* 하단 영역: 식물 리스트 + 그리드 에디터 */}
          <div className="h-[60%] flex gap-4">
            {/* 식물 리스트 (왼쪽 30%) */}
            <div className="flex-[3] min-w-0">
              <BottomLeftPlantListPanel />
            </div>

            {/* 그리드 에디터 (오른쪽 70%) */}
            <div className="flex-[7] min-w-0">
              <BottomRightGridEditorPanel />
            </div>
          </div>
        </div>

        {/* 하단 크레딧 */}
        <div className="mt-2 text-center text-xs text-gray-500">
          조경 식재 패턴 인터랙티브 에디터 v1.0 | React + TypeScript + Tailwind CSS
        </div>
      </div>
    </EditorProvider>
  );
}

export default App;
