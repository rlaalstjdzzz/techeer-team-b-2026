# 🔧 Clerk 키 오류 해결 - 단계별 가이드

## 📋 문제 진단

**증상**: `frontend/.env`에 `clerk_publishable_key`를 추가했지만 여전히 오류 발생

**원인 분석**:
1. ❌ 변수 이름 오류: `clerk_publishable_key` → `VITE_CLERK_PUBLISHABLE_KEY` 필요
2. ❌ 파일 위치 오류: `frontend/.env` → 프로젝트 루트 `.env` 필요
3. ❌ Vite 서버 미재시작: 환경 변수 변경 후 서버 재시작 필요

## ✅ 해결 방법

### 1단계: 프로젝트 루트의 `.env` 파일 확인

**위치**: `C:\Users\주수아\Desktop\techeer-team-b-2026\.env`

**올바른 형식**:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_실제_키_입력
```

**잘못된 예시**:
```env
❌ clerk_publishable_key=pk_test_...  # 접두사 없음, 소문자
❌ CLERK_PUBLISHABLE_KEY=pk_test_...  # VITE_ 접두사 없음
❌ VITE_clerk_publishable_key=pk_test_...  # 대소문자 혼용
```

### 2단계: 변수 이름 확인 체크리스트

- [ ] `VITE_` 접두사가 있는가? (필수!)
- [ ] `CLERK`가 대문자인가?
- [ ] `PUBLISHABLE_KEY`가 대문자인가?
- [ ] 언더스코어(`_`)로 구분되어 있는가?
- [ ] 값이 비어있지 않은가?

### 3단계: 파일 위치 확인

**Vite 설정 확인**:
- `frontend/vite.config.ts`에서 `envDir: path.resolve(__dirname, '..')` 설정
- 이는 프로젝트 루트를 의미함

**따라서**:
- ✅ `C:\Users\주수아\Desktop\techeer-team-b-2026\.env` (프로젝트 루트)
- ❌ `C:\Users\주수아\Desktop\techeer-team-b-2026\frontend\.env` (프론트엔드 폴더)

### 4단계: Vite 서버 재시작

**환경 변수는 서버 시작 시에만 로드됩니다!**

```powershell
# 1. 현재 실행 중인 서버 종료 (Ctrl+C)

# 2. 서버 재시작
cd frontend
npm run dev
```

## 🔍 검증 방법

### 실험 A: 변수 이름 확인

**PowerShell 명령어**:
```powershell
cd C:\Users\주수아\Desktop\techeer-team-b-2026
Get-Content .env | Select-String "CLERK"
```

**기대 결과**:
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_실제_키
```

**잘못된 결과 예시**:
```
clerk_publishable_key=pk_test_...  # ❌ 접두사 없음
CLERK_PUBLISHABLE_KEY=pk_test_...    # ❌ VITE_ 없음
```

### 실험 B: 브라우저 콘솔 확인

**브라우저 개발자 도구 (F12) → Console**:
```javascript
// 1. 모든 VITE_ 변수 확인
console.log('모든 VITE_ 변수:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));

// 2. Clerk 키 확인
console.log('Clerk Key:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

// 3. 키 길이 확인
console.log('키 길이:', import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.length);
```

**성공 시**:
```
모든 VITE_ 변수: ["VITE_CLERK_PUBLISHABLE_KEY", "VITE_KAKAO_JAVASCRIPT_KEY", ...]
Clerk Key: pk_test_실제_키값
키 길이: 50
```

**실패 시**:
```
모든 VITE_ 변수: ["VITE_KAKAO_JAVASCRIPT_KEY", ...]  # VITE_CLERK_PUBLISHABLE_KEY 없음
Clerk Key: undefined
키 길이: undefined
```

### 실험 C: 코드에서 직접 확인

`frontend/src/lib/clerk.tsx` 파일의 22-27번째 줄에서 자동으로 로그를 출력합니다:

```typescript
console.log('🔑 Clerk Key 로드 상태:', {
  hasKey: !!CLERK_PUBLISHABLE_KEY,
  keyLength: CLERK_PUBLISHABLE_KEY?.length || 0,
  keyPrefix: CLERK_PUBLISHABLE_KEY?.substring(0, 10) || '없음',
  envVars: Object.keys(import.meta.env).filter(k => k.includes('CLERK'))
});
```

**브라우저 콘솔에서 확인**:
- `hasKey: true` → 성공
- `hasKey: false` → 실패 (변수 이름 또는 위치 확인 필요)

## 🚨 자주 하는 실수

### 실수 1: 변수 이름 오류
```env
❌ clerk_publishable_key=pk_test_...
✅ VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 실수 2: 파일 위치 오류
```
❌ frontend/.env
✅ 프로젝트 루트/.env
```

### 실수 3: 서버 미재시작
```
❌ .env 파일 수정 후 서버 재시작 안 함
✅ .env 파일 수정 후 반드시 서버 재시작
```

### 실수 4: 값에 공백 포함
```env
❌ VITE_CLERK_PUBLISHABLE_KEY = pk_test_...  # 공백 있음
✅ VITE_CLERK_PUBLISHABLE_KEY=pk_test_...    # 공백 없음
```

### 실수 5: 따옴표 사용
```env
❌ VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."  # 따옴표 불필요
✅ VITE_CLERK_PUBLISHABLE_KEY=pk_test_...    # 따옴표 없음
```

## 📝 올바른 `.env` 파일 예시

**프로젝트 루트** (`C:\Users\주수아\Desktop\techeer-team-b-2026\.env`):

```env
# ============================================================
# 프론트엔드 환경 변수 (Vite)
# ============================================================
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
VITE_KAKAO_JAVASCRIPT_KEY=YOUR_ACTUAL_KEY_HERE
VITE_API_BASE_URL=http://localhost:8000/api/v1

# ============================================================
# 백엔드 환경 변수
# ============================================================
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
KAKAO_REST_API_KEY=YOUR_ACTUAL_KEY_HERE
```

## 🔄 최종 체크리스트

- [ ] 프로젝트 루트에 `.env` 파일이 있는가?
- [ ] `.env` 파일에 `VITE_CLERK_PUBLISHABLE_KEY`가 있는가?
- [ ] 변수 이름이 정확한가? (`VITE_CLERK_PUBLISHABLE_KEY`)
- [ ] 값이 비어있지 않은가?
- [ ] 값에 공백이나 따옴표가 없는가?
- [ ] Vite 서버를 재시작했는가?
- [ ] 브라우저 콘솔에서 `hasKey: true`가 나오는가?

## 💡 빠른 해결 명령어

**PowerShell에서 한 번에 확인**:
```powershell
cd C:\Users\주수아\Desktop\techeer-team-b-2026

# 1. .env 파일 존재 확인
Test-Path .env

# 2. Clerk 키 확인
Get-Content .env | Select-String "VITE_CLERK"

# 3. 올바른 형식인지 확인
$content = Get-Content .env -Raw
if ($content -match 'VITE_CLERK_PUBLISHABLE_KEY=pk_test_') {
    Write-Host "✅ 올바른 형식입니다!" -ForegroundColor Green
} else {
    Write-Host "❌ 변수 이름을 확인하세요!" -ForegroundColor Red
}
```

---

**마지막 업데이트**: 2026-01-11
