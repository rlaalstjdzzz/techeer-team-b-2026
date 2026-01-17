# 🔧 Clerk 키 오류 해결 가이드

## 📋 상황 요약

프론트엔드에서 마이 페이지 로그인 시 Clerk 키를 계속 요구하는 문제입니다.

## 🎯 원인

1. **`.env` 파일 위치 문제**: Vite는 기본적으로 `frontend/` 폴더의 `.env`를 찾지만, 프로젝트 루트에 `.env`가 있음
2. **환경 변수 미로드**: Vite 서버가 재시작되지 않아서 환경 변수가 로드되지 않음
3. **키 미입력**: `.env` 파일에 `VITE_CLERK_PUBLISHABLE_KEY`가 실제로 입력되지 않았을 수 있음

## ✅ 해결 방법

### 1단계: 프로젝트 루트의 `.env` 파일 확인

프로젝트 루트(`C:\Users\주수아\Desktop\techeer-team-b-2026`)에 `.env` 파일이 있는지 확인하고, 다음 내용이 있는지 확인하세요:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_실제_키_입력
VITE_KAKAO_JAVASCRIPT_KEY=실제_키_입력
```

**중요**: 
- `VITE_` 접두사가 **반드시** 있어야 합니다!
- 값이 비어있으면 안 됩니다 (예: `VITE_CLERK_PUBLISHABLE_KEY=` ❌)

### 2단계: Vite 설정 수정 완료 ✅

`frontend/vite.config.ts`를 수정하여 프로젝트 루트의 `.env` 파일을 읽도록 설정했습니다.

### 3단계: Vite 서버 재시작 (필수!)

환경 변수를 로드하려면 **반드시 Vite 서버를 재시작**해야 합니다.

**현재 실행 중인 Vite 서버가 있다면:**
1. 터미널에서 `Ctrl + C`로 서버 종료
2. 다음 명령어로 재시작:

```powershell
cd frontend
npm run dev
# 또는
yarn dev
```

### 4단계: 브라우저 콘솔에서 확인

브라우저 개발자 도구(F12) → Console 탭에서 다음 메시지를 확인하세요:

```
🔑 Clerk Key 로드 상태: {
  hasKey: true,
  keyLength: 50,  // 실제 키 길이
  keyPrefix: "pk_test_xxx",
  envVars: ["VITE_CLERK_PUBLISHABLE_KEY"]
}
```

**성공 시**: `hasKey: true`, `keyLength`가 0보다 큼
**실패 시**: `hasKey: false`, `keyLength: 0`

## 🔍 검증 방법

### 실험 A: 환경 변수 로드 확인

**목적**: Vite가 `.env` 파일을 제대로 읽는지 확인

**실행 방법**:
1. 브라우저 콘솔 열기 (F12)
2. 다음 코드 입력:

```javascript
console.log('Clerk Key:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
console.log('모든 VITE_ 변수:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
```

**기대 결과**: 
- `Clerk Key:` 뒤에 실제 키 값이 출력되어야 함
- `모든 VITE_ 변수:` 배열에 `VITE_CLERK_PUBLISHABLE_KEY`가 포함되어야 함

**결과 해석**:
- ✅ 키 값이 출력되면: 환경 변수 로드 성공
- ❌ `undefined`면: `.env` 파일 확인 또는 Vite 서버 재시작 필요

### 실험 B: `.env` 파일 내용 확인

**목적**: `.env` 파일에 실제로 키가 입력되어 있는지 확인

**실행 명령** (PowerShell):
```powershell
cd C:\Users\주수아\Desktop\techeer-team-b-2026
Get-Content .env | Select-String "VITE_CLERK"
```

**기대 결과**: 
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_실제_키
```

**결과 해석**:
- ✅ 키가 출력되면: `.env` 파일에 키가 있음
- ❌ 아무것도 출력되지 않으면: `.env` 파일에 키를 추가해야 함

## 🚨 문제 해결 체크리스트

- [ ] 프로젝트 루트에 `.env` 파일이 존재하는가?
- [ ] `.env` 파일에 `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` 형식으로 키가 입력되어 있는가?
- [ ] `VITE_` 접두사가 정확히 붙어있는가? (대소문자 구분)
- [ ] 키 값이 비어있지 않은가? (예: `VITE_CLERK_PUBLISHABLE_KEY=` ❌)
- [ ] Vite 서버를 재시작했는가?
- [ ] 브라우저 콘솔에서 `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`가 출력되는가?

## 📝 `.env` 파일 예시

프로젝트 루트(`C:\Users\주수아\Desktop\techeer-team-b-2026\.env`)에 다음 형식으로 입력하세요:

```env
# Clerk 인증 (프론트엔드용)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE

# 카카오 지도 API (프론트엔드용)
VITE_KAKAO_JAVASCRIPT_KEY=YOUR_ACTUAL_KEY_HERE

# API 서버 URL
VITE_API_BASE_URL=http://localhost:8000/api/v1

# 백엔드용 (프론트엔드에서 사용 안 함)
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
KAKAO_REST_API_KEY=YOUR_ACTUAL_KEY_HERE
```

## ⚠️ 중요 사항

1. **Vite는 `VITE_` 접두사가 붙은 변수만 클라이언트 번들에 포함시킵니다**
   - `CLERK_PUBLISHABLE_KEY` ❌ (접두사 없음)
   - `VITE_CLERK_PUBLISHABLE_KEY` ✅ (접두사 있음)

2. **환경 변수 변경 후 반드시 Vite 서버 재시작**
   - `.env` 파일을 수정한 후 서버를 재시작하지 않으면 변경사항이 반영되지 않습니다

3. **`.env` 파일은 절대 Git에 커밋하지 마세요!**
   - 실제 API 키가 노출되면 보안 문제가 발생합니다

## 🔄 재발 방지

- [ ] `.env.example` 파일을 템플릿으로 유지 (실제 키 제외)
- [ ] 환경 변수 변경 시 Vite 서버 재시작 습관화
- [ ] 브라우저 콘솔에서 환경 변수 로드 상태 확인 습관화

---

**마지막 업데이트**: 2026-01-11
