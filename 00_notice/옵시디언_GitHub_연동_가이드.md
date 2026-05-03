# 스폰지클럽 옵시디언 × GitHub 연동 가이드

## 전체 흐름
Git 설치 → Git 초기 설정 → 빈 폴더 만들기 → 옵시디언 + Terminal 플러그인 설치 → 클론 → 보관함 연결 → GitHub 인증 → 매주 Push/Pull

⏱️ 예상 소요 시간: 30분
💻 Mac & Windows 모두 지원

---

## STEP 1 | 옵시디언과 Git 설치하기

옵시디언 데스크탑 앱을 설치해주세요.
그리고 옵시디언 안에서 작업하려면 컴퓨터에 Git 프로그램이 먼저 설치돼야 해요.

### 🍎 Mac
1. `Cmd + Space` 누르기 → `terminal` 검색 → 엔터
2. 검은 창 (터미널) 열리면 아래 명령어 복붙 후 엔터
   ```bash
   git --version
   ```
3. 설치 팝업이 뜨면 **설치** 클릭
4. `git version 2.x.x` 같은 숫자가 나오면 이미 설치된 거예요 → STEP 2로!

### 🪟 Windows
1. [git-scm.com](https://git-scm.com) 접속
2. **Download for Windows** 클릭
3. 다운로드된 .exe 파일 실행
4. 모든 옵션 기본값 → Next → Install
5. 설치 완료되면 **Git Bash** 앱이 생겨요 (이후 이걸 사용!)

---

## STEP 2 | Git 초기 설정 (딱 1번만)

💡 **컴퓨터 기본 터미널 열기**
- Mac: `Cmd + Space` → `terminal` → 엔터
- Windows: 시작 메뉴 → `Git Bash` 검색 → 실행

아래 명령어를 1개씩 복사 → 붙여넣기 → 엔터

### 명령어 1 — 이름 등록
```bash
git config --global user.name "GitHub아이디"
```
- ⚠️ "GitHub아이디" 부분만 본인 GitHub 아이디로 바꾸세요
- ⚠️ 띄어쓰기 위치: `git`[띄]`config`[띄]`--global`[띄]`user.name`[띄]`"이름"`
- ✅ 아무것도 안 나오고 다음 줄로 넘어가면 성공! (정상이에요)

### 명령어 2 — 이메일 등록
```bash
git config --global user.email "가입이메일@gmail.com"
```
- ⚠️ `user.name` 아니고 `user.email` 이에요! 헷갈리지 마세요
- ✅ 아무것도 안 나오면 성공!

---

## STEP 3 | 빈 폴더 만들기

📌 이 폴더가 스폰지클럽 모든 자료가 쌓이는 곳이에요
⚠️ 위치를 본인이 정하고, 그 위치를 꼭 기억하세요!
⚠️ 한 번 정한 폴더는 **절대 이동/이름변경/삭제하지 마세요**

### ① Finder(Mac) / 탐색기(Windows) 열기

### ② 보관함을 둘 위치 선택
원하는 곳 어디든 OK! 예시:
- 📁 문서 폴더
- 🖥️ 바탕화면
- 📁 별도 작업 폴더 (예: `~/Work/`, `~/PJ/`)

💡 추천: 자주 들여다볼 폴더라서 찾기 쉬운 곳에!

### ③ 그 위치에 새 폴더 만들기
- 폴더명: **spongeclub_1** (이대로!)
- ⚠️ 한글 X, 띄어쓰기 X, 특수문자 X

### ④ 폴더 경로 메모하기
🍎 **Mac:**
- 만든 폴더 우클릭 → 정보 가져오기 → 위치 확인
- 또는 폴더 우클릭 → "...의 경로 복사"

🪟 **Windows:**
- 만든 폴더 들어가서 → 주소창 클릭 → 경로 복사

✅ 예시 경로:
- Mac: `/Users/dada/PJ/spongeclub_1`
- Windows: `C:\Users\dada\Work\spongeclub_1`

📌 이 경로 메모장에 복사해두세요! 다음 단계에서 사용해요

---

## STEP 4 | 옵시디언 설치 & 빈 폴더 열기

1. **옵시디언 앱을 실행한다.**
2. 시작 화면에서 가운데 **'보관함 폴더 열기'** → **[열기]** 클릭
   - ❌ '새 보관함 생성' 아님!
   - ❌ 'Obsidian Sync 보관함 열기' 아님!
   - ✅ 가운데 '보관함 폴더 열기' 선택!
3. STEP 3에서 만든 **spongeclub_1** 폴더 선택 → **[열기]**
4. **'저자를 신뢰하고 모든 플러그인 활성화'** 창이 뜨면 → 확인
   - 💡 **이 창이 안 뜨는 경우도 있어요** (특히 🪟 Windows). 안 떠도 정상이니 다음 단계로 넘어가세요.
5. ✅ 빈 보관함이 열려요 (왼쪽 사이드바에 아무 파일 없는 게 정상)

---

## STEP 5 | Terminal 플러그인 설치

📌 옵시디언 안에서 터미널을 쓰기 위해 필요해요

### ① 커뮤니티 플러그인 켜기
1. 좌측 하단 ⚙️ **설정** 클릭
2. **커뮤니티 플러그인** 클릭
3. **커뮤니티 플러그인 켜기** → **켜기** 클릭

### ② Terminal 플러그인 검색 & 설치
1. **탐색** 클릭
2. 검색창에 `Terminal` 입력
3. **Terminal** 플러그인 선택 (다운로드 수가 가장 많은 것)
4. **설치** → **활성화**

### ③ 터미널 열기 — 명령어 팔레트 사용
1. `Cmd + P` (Mac) / `Ctrl + P` (Windows) → 명령어 팔레트 열기
2. 검색창에 입력 (옵시디언 언어 설정에 따라 다름):
   - **영어 설정**: `terminal` 입력
   - **한국어 설정**: `터미널` 입력
3. 아래 명령어 선택 (⚠️ **루트 디렉토리** 옵션을 고르세요. "current file directory"가 아니라 **보관함 최상위**에서 터미널이 열려야 합니다):
   - **영어 설정**: `Terminal: Open root directory in terminal: Integrated`
   - **한국어 설정**: `터미널: 루트 디렉토리에서 터미널 open: 통합`

💡 **한국어 설정인데 `터미널`로 검색해도 안 나오면**, 옵시디언 언어를 잠깐 영어로 바꿨다가 다시 검색해보세요  
(설정 ⚙️ → 정보(About) → 언어(Language) → English).

### ④ 프로필 선택창이 뜨면

🖼️ [스크린샷 첨부 — Terminal 프로필 선택 화면]

- ✅ **통합 프로필** (Mac은 `darwinIntegratedDefault`, Windows는 `winIntegratedDefault`) 선택!
- ❌ 외부 프로필, 개발자 콘솔 X

💡 통합 프로필 = 옵시디언 안에 터미널이 떠요 (우리가 원하는 것)

✅ 옵시디언 하단에 검은 터미널 창이 뜨면 설치 완료!

---

## STEP 6 | Claude Code 실행

📌 명령어 외울 필요 없이 Claude한테 자연어로 시키기 위해 사용해요!

📌 **Claude Code는 이미 설치·로그인된 환경을 전제로 합니다.** 만약 설치/로그인이 안 되어 있다면 PM에게 문의하세요.

옵시디언 터미널에서:
```bash
claude
```

✅ Claude 인터페이스가 터미널에서 시작돼요

💡 처음 실행했는데 로그인 화면이 뜨면 본인 Anthropic 계정으로 로그인하세요 (Pro / Max / Teams / Enterprise 유료 플랜 필요).

---

### ⚠️ 옵시디언 터미널에서 `claude`가 인식 안 될 때 (특히 🪟 Windows)

**증상:** `command not found: claude` 또는 `claude is not recognized as an internal or external command`

**해결 순서 (위부터 차례로 시도):**

1. **옵시디언을 완전히 종료했다가 다시 실행** → STEP 5 ③번 다시 진행해서 터미널 새로 열기
2. 그래도 안 되면 → **컴퓨터를 재부팅** (PATH 환경변수가 새로고침되어 인식되는 경우 많음)
3. 재부팅 후에도 안 되면 → 옵시디언 터미널 말고 **컴퓨터 기본 터미널**에서 실행
   - 🍎 Mac: Terminal 앱
   - 🪟 Windows: PowerShell 또는 Git Bash
4. 위 모두 안 되면 PM에게 문의

📌 **옵시디언 터미널 대신 별도 터미널에서 실행해도 작업은 똑같이 됩니다.** 옵시디언 안에서 한 화면으로 보는 게 편할 뿐, 필수는 아닙니다. 헤매지 말고 별도 터미널로 넘어가도 OK!

---

## STEP 7 | Claude Code로 공용 레포 클론하기

📌 명령어 외우지 마세요! Claude한테 자연어로 시키면 알아서 처리해줘요

### ① 옵시디언 터미널에서 Claude 실행 중인지 확인
STEP 6에서 `claude` 실행한 상태 그대로 OK.
혹시 Claude가 꺼졌으면 다시 실행:
```bash
claude
```

### ② Claude한테 클론 시키기
Claude에게 자연어로:
```
https://github.com/spongeclub/spongeclub_1.git 이 레포 클론해줘
```

✅ Claude가 알아서:
- 현재 위치 확인
- 적절한 위치로 이동
- clone 실행
- 결과 보고

⚠️ 중간에 권한 묻는 것은 `y` 또는 엔터로 승인
✅ `Cloning into 'spongeclub_1'...` 메시지 나오면 진행 중
✅ `warning: You appear to have cloned an empty repository.` 는 정상! (레포 비어있다는 의미)

### ③ 보관함 다시 열기
지금 옵시디언 보관함이 STEP 3의 빈 폴더로 되어있어요. 새로 클론된 폴더로 바꿔야 해요!

1. 옵시디언 메뉴 → 파일 → **다른 보관함 열기** (또는 좌측 하단 ⚙️)
2. **보관함 폴더 열기** → **[열기]**
3. 새로 클론된 **spongeclub_1** 폴더 선택
4. **'저자를 신뢰하고 모든 플러그인 활성화'** → 확인

✅ 옵시디언이 새 보관함으로 다시 열려요!

---

## STEP 8 | GitHub 인증 설정 (딱 1번만)

📌 본인 개인 GitHub 계정으로 진행하세요!
공용 레포(spongeclub) 설정 아니라 **내 개인 계정** 설정이에요

1. [github.com](https://github.com) 접속 → 본인 계정 로그인
2. 우측 상단 프로필 → **Settings** → **Developer settings**
3. **Personal access tokens** 펼치기

   🖼️ [스크린샷 첨부 — Personal access tokens 메뉴]

   - ❌ **Fine-grained tokens** 아님!
   - ✅ **Tokens (classic)** 클릭

4. **Generate new token (classic)** 클릭

5. **Note**, **Expiration** 설정
   - Note: `sponge` 입력
   - Expiration: **Custom** → 1년 뒤 날짜 설정
   - ❌ **No expiration** 선택 X (GitHub가 보안상 권장 안 함)

6. **Select scopes**에서 **repo** 체크
   - ✅ `repo` 하나만 체크하면 하위 항목 자동 체크돼요
   - 나머지 항목은 건드리지 마세요!

7. 맨 아래 **Generate token** 클릭

8. **`ghp_`로 시작하는 토큰 복사 → 메모장에 저장!**
   - ⚠️ 토큰은 **지금 이 순간만** 보여요. 창 닫으면 다시 못 봐요!
   - 반드시 메모장에 복사해두세요

---

## STEP 9 | 첫 보관함 살펴보기

📌 PM이 미리 만들어둔 폴더 구조와 빈 템플릿을 받아와서 본인 자리를 찾는 단계예요!
📌 모든 작업을 Claude Code에게 자연어로 시킬 수 있어요!

### ① Claude한테 Pull 시키기

옵시디언 터미널에서 Claude 실행된 상태로:
```
git pull 해줘
```

✅ Claude가 알아서 git pull 실행
✅ 폴더와 파일 목록이 다운로드돼요
✅ 옵시디언 왼쪽 사이드바에 조별·멤버별 폴더가 나타나요

🖼️ [스크린샷 첨부 — Pull 후 폴더 구조가 보이는 사이드바]

### ② 본인 조 → 본인 이름 폴더 찾기

왼쪽 사이드바에서 다음 경로로 이동:
```
01-과제 → 본인 조 (예: A조) → 본인 이름 (예: 홍길동) → Week-01
```

📌 본인 자리가 안 보이면 PM에게 슬랙으로 알려주세요!

### ③ '설치완료' 노트 작성

Week-01 폴더 안에 새 노트 만들기
- 제목: `설치완료`
- 내용:
  ```
  설치완료했습니다!
  ```

✅ 저장은 자동! `Cmd + S` 안 눌러도 돼요

> 📝 **(이후 Push 테스트 부분은 다다가 직접 작성 예정)**

---

## STEP 10 | 매주 사용법

💡 STEP 9까지 끝났으면, 이제부터는 정말 간단해요!
옵시디언 터미널에서 Claude한테 자연어로 시키기만 하면 돼요

### 📥 작업 시작 전 — Pull (항상 먼저!)
옵시디언 터미널에서 `claude` 실행 후:
```
git pull 해줘
```
✅ 팀원들이 올린 최신 자료가 내 컴퓨터에 다운로드돼요

### 📝 글 작성 후 — Push
옵시디언에서 글 작성 후, Claude한테:
```
이번 주 과제 푸쉬해줘
```
✅ Claude가 알아서 add → commit → push 모든 단계 처리!
✅ 완료되면 팀원들이 내 글 볼 수 있어요 🎉

---

## ❓ 자주 생기는 문제

**Q. `command not found: claude`**
→ Claude Code는 PM이 미리 설치해두었지만, 옵시디언 터미널에서 인식 안 되면 옵시디언 터미널을 닫았다가 다시 열어보세요
→ 그래도 안 되면 컴퓨터 재시작! (PATH 갱신 필요)
→ 여전히 안 되면 PM에게 문의

**Q. Claude 브라우저 로그인이 안 돼요**
→ 브라우저에 [claude.ai](https://claude.ai) 로그인되어 있는지 먼저 확인
→ 유료 플랜 (Pro / Max / Teams / Enterprise) 인지 확인
→ 무료 플랜은 Claude Code 사용 불가

**Q. Claude가 git push 권한을 물어봐요**
→ `y` 또는 엔터로 승인. 본인 토큰이 저장되어 있으면 자동 진행!

**Q. Push했는데 인증 오류가 나요**
→ Username: GitHub 아이디 / Password: PAT 토큰 (`ghp_...`)
→ 비밀번호 아니에요! 토큰이에요!

**Q. `user.name`에 이메일 넣었어요**
→ Claude한테 시키세요: `git config의 user.email을 [내이메일]로 바꿔줘`

**Q. conflict 에러**
→ 같은 파일 두 사람이 동시에 수정 시 발생. PM에게 슬랙으로!

**Q. 폴더를 옮겼어요**
→ 한번 클론한 폴더는 절대 이동/이름변경 X! 처음부터 다시 클론.

**Q. 토큰을 잃어버렸어요**
→ STEP 8 다시 진행해서 새 토큰 발급. 이전 토큰은 삭제하면 돼요.

**Q. Claude가 같은 명령어 자꾸 물어봐요**
→ 처음엔 권한 확인을 자주 해요. `y` 또는 `1. yes`로 승인하면 돼요.
→ "이 작업은 항상 허용" 옵션 선택하면 다음부턴 안 물어봐요.
