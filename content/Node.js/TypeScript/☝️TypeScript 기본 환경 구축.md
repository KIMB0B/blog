![image](https://images.velog.io/images/hanganda23/post/cc68451e-4eed-4df6-8ff0-af19111f699b/ts.png)

해당 설정 방법은 [[Yarn]] 패키지 매니저를 사용하여 진행하였습니다.
만일 [[NPM]]을 통해 기본 설정을 원하신다면 NPM 글로 이동하여 NPM에 맞게 명령어를 치환하여 진행하여 주시면 됩니다.

---
# TypeScript 모듈 설치

```bash
yarn add --dev @types/node typescript
```

---
# TypeScript 설정 파일 생성(tsconfig.json)

```bash
yarn tsc --init
```

---
# 빌드 파일 생성 경로 지정

생성된 tsconfig.json파일에서 스크롤을 내리면 여러 주석된 줄 중 outDir을 설정하는 줄이 있습니다.
해당 줄의 주석을 풀어주고, 빌드된 파일을 ./dist 경로에 생성되도록 설정했습니다.

```json
// tsconfig.json
{
	"compilerOptions": {
		... 
		"outDir": "./dist", 
		...
	}
}
```

---
# 빌드 실행 스크립트 설정

typescript 모듈을 설치하게 되면 `tsc`라는 명령어를 통해 typescript 파일들 빌드가 가능합니다.

package.json을 통해 `build`라는 명령어를 실행하면 tsc만 실행하여 빌드하도록 설정했습니다.
`start`라는 명령어를 실행하면 tsc를 하여 우선 빌드를 완료한 후 위에서 지정한 경로에 맞게 dist폴더 안의 메인 파일(여기서는 index.js입니다)이 node를 통해 실행되도록 설정했습니다.

```json
// package.json
{
	... 
	"scripts": { 
		"build": "tsc",
		"start": "tsc && node dist/index.js" 
	} 
	...
}
```

---
# 실행시켜보기

index.ts라는 파일에 아래와 같이 코드가 작성되었다고 가정합니다.
```typescript
console.log("Setting Success!");
```

위에 설정한 스크립트로 `start`를 실행시켜봅시다.
```bash
yarn start
```

그럼 tsc명령어가 실행되면서 tsconfig.json에서 설정한대로 dist라는 폴더가 생기고 그 안에 index.js가 생깁니다.
<img width="99" alt="image" src="https://gist.github.com/user-attachments/assets/23a032f4-4052-47d4-a522-adaa19d0f6a5">

그리고 dist/index.js파일이 실행되면서 "Setting Success!"라는 글자가 Console에 출력됩니다.
```bash
Setting Success!
```
