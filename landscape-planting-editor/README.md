# 조경 식재 패턴 인터랙티브 웹 에디터

웹 브라우저에서 동작하는 **조경 식재 패턴 시뮬레이터/에디터**입니다.
사용자가 그리드(평면도) 위에 식물을 배치하고, 계절별 변화를 시각적으로 확인할 수 있습니다.

![Landscape Planting Editor](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8) ![Vite](https://img.shields.io/badge/Vite-7-646cff)

## 🌟 주요 기능

### 1. 식물 배치 및 관리
- **좌측 식물 리스트**: 10종의 한국 조경 수종 제공 (벚나무, 단풍나무, 은행나무, 라일락, 수국, 억새, 소나무, 동백나무, 개나리, 무궁화)
- **검색 및 필터**: 식물 이름 검색, 카테고리별 필터링 (교목, 관목, 그라스류 등)
- **그리드 배치**: 20×20 그리드에서 클릭으로 간편하게 식물 배치
- **배치 관리**: 배치된 식물 선택, 삭제, 통계 확인

### 2. 계절별 시각화
- **4계절 시뮬레이션**: 봄, 여름, 가을, 겨울 선택 가능
- **실시간 외관 변경**: 계절에 따라 꽃, 잎, 가지 색상과 상태가 자동으로 변경
- **SVG 렌더링**: 부드럽고 확장 가능한 벡터 그래픽 사용

### 3. 미리보기
- **상단 미리보기 패널**: 배치된 식물들을 전체적으로 조망
- **계절 반영**: 현재 선택된 계절에 맞춰 식물 외관 표시
- **통계 정보**: 총 배치 개수, 사용 수종 수, 그리드 크기 표시

## 📁 프로젝트 구조

```
landscape-planting-editor/
├── src/
│   ├── models/              # TypeScript 타입 정의
│   │   └── types.ts
│   ├── data/                # 샘플 식물 데이터
│   │   └── samplePlants.ts
│   ├── context/             # 상태 관리 (Context API)
│   │   └── EditorContext.tsx
│   ├── components/          # UI 컴포넌트
│   │   ├── TopPreviewPanel.tsx
│   │   ├── BottomLeftPlantListPanel.tsx
│   │   ├── BottomRightGridEditorPanel.tsx
│   │   └── SeasonControlPanel.tsx
│   ├── utils/               # 유틸리티 함수
│   │   └── colorUtils.ts
│   ├── App.tsx              # 메인 앱 컴포넌트
│   ├── main.tsx             # 앱 진입점
│   └── index.css            # Tailwind CSS 설정
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🛠️ 기술 스택

- **프레임워크**: React 18 + TypeScript
- **빌드 도구**: Vite 7
- **스타일링**: Tailwind CSS 3
- **렌더링**: SVG (계절별 색상 변경에 최적화)
- **상태 관리**: React Context API + useReducer

## 🚀 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 3. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

### 4. 빌드 미리보기

```bash
npm run preview
```

## 📖 사용 방법

### 식물 배치하기
1. **좌측 식물 리스트**에서 원하는 식물을 클릭하여 선택
2. **우측 그리드 에디터**에서 원하는 위치를 클릭하여 배치
3. 배치된 식물은 **상단 미리보기**에 실시간으로 반영됩니다

### 계절 변경하기
1. **우측 상단 계절 컨트롤 패널**에서 원하는 계절 버튼 클릭
2. 모든 배치된 식물의 색상과 외관이 즉시 변경됩니다
3. 각 식물의 계절별 특징을 좌측 리스트에서 확인할 수 있습니다

### 배치 관리
- **식물 선택**: 그리드에서 배치된 식물을 클릭
- **식물 삭제**: 선택 후 "삭제" 버튼 클릭
- **전체 삭제**: 계절 컨트롤 패널의 "전체 배치 삭제" 버튼 사용

### 검색 및 필터
- **검색**: 좌측 상단 검색창에 식물 이름 입력
- **카테고리 필터**: 교목, 관목, 그라스류 등 버튼으로 필터링

## 🌱 포함된 식물 (10종)

| 식물명 | 카테고리 | 주요 특징 |
|--------|---------|-----------|
| 왕벚나무 | 교목 | 봄에 분홍빛 꽃 만개 |
| 단풍나무 | 교목 | 가을 붉은 단풍 |
| 은행나무 | 교목 | 가을 황금빛 단풍 |
| 라일락 | 관목 | 봄에 향기로운 보라색 꽃 |
| 수국 | 관목 | 여름에 큰 청색 꽃 |
| 억새 | 그라스류 | 가을 은빛 꽃이삭 |
| 소나무 | 교목 | 사계절 상록 |
| 동백나무 | 관목 | 겨울~봄 붉은 꽃 |
| 개나리 | 관목 | 이른 봄 노란 꽃 |
| 무궁화 | 관목 | 여름~가을 장기 개화 |

## 🎨 주요 특징

### 계절별 시각화 시스템
- **봄**: 꽃 색상 + 연한 녹색 잎
- **여름**: 짙은 녹색 잎
- **가을**: 단풍 색상 (붉은색, 황금색 등)
- **겨울**: 낙엽수는 가지만, 상록수는 녹색 유지

### SVG 기반 렌더링
- **확장 가능**: 확대/축소해도 선명한 그래픽
- **꽃 표현**: 계절에 따라 꽃잎 패턴 자동 생성
- **낙엽 표현**: 겨울철 낙엽수의 가지 구조 시각화

### 반응형 레이아웃
- **상단 40%**: 미리보기 + 계절 컨트롤
- **하단 60%**: 식물 리스트 (30%) + 그리드 에디터 (70%)

## 🔧 커스터마이징

### 식물 추가하기

`src/data/samplePlants.ts` 파일에서 새로운 식물을 추가할 수 있습니다:

```typescript
{
  id: "new-plant",
  commonName: "새 식물",
  scientificName: "Plant species",
  category: "tree",
  thumbnailColor: "#00ff00",
  description: "식물 설명",
  seasonAppearance: {
    spring: { hasFlower: true, flowerColor: "#ff69b4", ... },
    summer: { hasLeaf: true, leafColor: "#228b22", ... },
    autumn: { hasLeaf: true, leafColor: "#daa520", ... },
    winter: { hasLeaf: false, branchColor: "#654321", ... }
  }
}
```

### 그리드 크기 변경

`src/context/EditorContext.tsx`의 `initialState`에서 수정:

```typescript
gridConfig: {
  cols: 30,      // 열 개수 변경
  rows: 30,      // 행 개수 변경
  cellSize: 40,  // 셀 크기(px) 변경
}
```

## 📝 라이선스

MIT License

## 👨‍💻 개발자

이 프로젝트는 React + TypeScript + Tailwind CSS를 사용하여 개발되었습니다.

---

**조경 식재 패턴 인터랙티브 에디터 v1.0**
*아름다운 조경 설계를 위한 시각화 도구*
