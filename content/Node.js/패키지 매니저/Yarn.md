![image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxpDmD0f7s8mJg2i7syO163PeVAbml6tsu4A&s)

# 정의

> Facebook, Google, Exponent, Tilde 등의 기업과 개인 기여자들에 의해 개발된 새로운 자바스크립트 패키지 관리자.
> 패키지 설치 과정을 병렬로 처리하여 [[NPM]]보다 빠른 설치 속도를 제공.

---
# 설치

```bash
sudo npm install -g yarn
```

---
# 명령어

1. **yarn init**
     - 새 Yarn 프로젝트를 초기화합니다. `package.json` 파일을 생성하거나 수정합니다.
2. **yarn add [패키지명]**
     - 지정된 패키지를 설치하고 `package.json` 및 `yarn.lock` 파일을 업데이트합니다.
3. **yarn upgrade [패키지명]**
     - 하나 또는 모든 패키지를 최신 버전으로 업그레이드합니다.
4. **yarn run [스크립트명]**
     - `package.json`의 `scripts` 섹션에 정의된 스크립트를 실행합니다.
5. **yarn remove [패키지명]**
     - 설치된 패키지를 제거하고 `package.json` 및 `yarn.lock` 파일을 업데이트합니다.
6. **yarn list**
     - 설치된 패키지 목록을 보여줍니다.
7. **yarn publish**
     - 패키지를 Yarn 레지스트리에 게시합니다.
8. **yarn info [패키지명]**
     - 특정 패키지에 대한 정보를 보여줍니다.