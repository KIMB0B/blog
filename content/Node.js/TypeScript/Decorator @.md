# 정의

> TypeScript에서 실험적으로 제공하는 기능
> 구조를 수정하지 않고 기존 객체에 새로운 기능을 추가할 수 있도록 하는 디자인 패턴

---
# tsconfig.json

compilerOptions에 `"experimentalDecorators": true`를 추가해줘야 사용 가능합니다.
```json
// tsconfig.json

{
	"compilerOptions": {
		...
		"experimentalDecorators": true
		...
	}
}
```

---
# 사용 예시
```typescript
function Controller(aaaaaaaaa: any){
    console.log(aaaaaaaaa)
}

@Controller
class ProductController {

}

// 실행결과: [class ProductController]
```
Decorator는 사실은 함수이며, 해당 Decorator의 인자값은 바로 아래 있는 class인 ProductController가 된 것을 알 수 있습니다.

---
# VSCODE Experimental Decorators 옵션 설정
tsconfig.json 파일에 추가 설정을 하였지만, error가 발생한다면? 

- error 내용 : Experimental support for decorators is a feature that is subject to change in a future release. 

- 해결방안 : Vs code 설정 화면으로 들어가서 Experimental Decorators 옵션을 체크 ✅ 하면 해결
<img width="294" alt="Decorator 오류 해결 설정" src="https://gist.github.com/user-attachments/assets/a667a372-f206-4df7-88a1-7441200df5b4">
