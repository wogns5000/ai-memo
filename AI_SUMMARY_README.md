# 메모 앱 - Google Gemini AI 요약 기능

메모를 작성하고 Google Gemini AI를 활용하여 자동으로 요약을 생성할 수 있는 Next.js 기반 메모 애플리케이션입니다.

## 주요 기능

- 📝 메모 작성, 수정, 삭제
- 🏷️ 카테고리 및 태그 관리
- 🔍 검색 및 필터링
- 🤖 **Google Gemini AI를 활용한 메모 요약 생성**
- 💾 로컬 스토리지 기반 데이터 저장

## 기술 스택

- **프론트엔드**: Next.js 15, React 19, TypeScript
- **스타일링**: Tailwind CSS 4
- **마크다운 에디터**: @uiw/react-md-editor
- **AI**: Google Gemini API (@google/genai)
- **테스팅**: Playwright

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 Google Gemini API 키를 설정하세요:

```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
```

**Google Gemini API 키 발급 방법:**

1. [Google AI Studio](https://aistudio.google.com/app/apikey)에 접속
2. 로그인 후 "API 키 생성" 클릭
3. 생성된 API 키를 복사하여 `.env.local` 파일에 추가

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## AI 요약 기능 사용법

1. 메모를 작성하거나 기존 메모를 선택하여 상세보기 모달을 엽니다.
2. 메모 내용 아래의 "AI 요약" 섹션에서 **"요약 생성"** 버튼을 클릭합니다.
3. Gemini AI가 메모를 분석하여 핵심 내용을 3-5문장으로 요약합니다.
4. 요약은 실시간으로 생성되며 저장되지 않습니다.

### 사용 모델

- **모델**: `gemini-2.0-flash-001`
- **최대 출력 토큰**: 500
- **Temperature**: 0.7

## 프로젝트 구조

```
memo-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── summarize/
│   │   │       └── route.ts          # Gemini API 엔드포인트
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── MemoDetailModal.tsx       # AI 요약 기능 포함
│   │   ├── MemoForm.tsx
│   │   ├── MemoItem.tsx
│   │   └── MemoList.tsx
│   ├── hooks/
│   │   └── useMemos.ts
│   ├── types/
│   │   └── memo.ts
│   └── utils/
│       ├── localStorage.ts
│       └── seedData.ts
├── .env.example                       # 환경 변수 템플릿
└── package.json
```

## API 엔드포인트

### POST /api/summarize

메모 내용을 받아 Google Gemini AI로 요약을 생성합니다.

**요청 본문:**

```json
{
  "title": "메모 제목",
  "content": "메모 내용"
}
```

**응답:**

```json
{
  "summary": "생성된 요약 내용",
  "success": true
}
```

**에러 응답:**

```json
{
  "error": "에러 메시지"
}
```

## 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행
- `npm run test` - Playwright 테스트 실행

## 주의사항

- Google Gemini API 키는 절대 공개 저장소에 커밋하지 마세요.
- `.env.local` 파일은 `.gitignore`에 포함되어야 합니다.
- API 사용량에 따라 비용이 발생할 수 있습니다. [Google AI Studio 요금](https://ai.google.dev/pricing)을 확인하세요.

## 라이선스

MIT

