![image](https://res.cloudinary.com/practicaldev/image/fetch/s--J6qf2Ctw--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/gd97g4kdyk1bpdeyfqst.png)

해당 설정 방법은 [[Yarn]] 패키지 매니저를 사용하여 진행하였습니다.
만일 [[NPM]]을 통해 기본 설정을 원하신다면 NPM 글로 이동하여 NPM에 맞게 명령어를 치환하여 진행하여 주시면 됩니다.

---
# 모듈 설치

TypeScript에서 jest를 사용하기 위해선 그냥 jest만 설치하는 것이 아닌 **ts-jest** 와 **@types/jest**도 설치해 주어야 합니다.
```bash
yarn add --dev jest ts-jest @types/jest
```

---
# Jest 설정 파일 생성

루트 디렉토리에 **jest.config.js** 라는 파일을 직접 만들고 아래와 같이 설정해야 합니다.
```javascript
module.exports = { 
	preset: 'ts-jest', 
	testEnvironment: 'node', 
	testMatch: ['**/*.test.ts'], 
};
```

이렇게 하면 모든 경로 안에 test.ts로 끝나는 파일은 Jest가 전부 테스트 파일로 인식하여 테스트를 진행합니다.