---
title: "@Validated"
date: 2024-08-20T23:43:00
---

# @Validated의 정의

> [[검증(Validation) 기능|검증]]기를 실행하라는 Annotation<br>`WebDataBinder` 에 등록한 검증기를 찾아서 실행합니다.

# 검증기 선정 방법

여러 검증기 중 어떤 검증기를 적용하게 될 지는 supports()에서 지정한 클래스를 통해 정해집니다.

# 사용 예시
### 검증기(변동 없음)
```java
@Component
public class ItemValidator implements Validator {
    @Override    
    public boolean supports(Class<?> clazz) {
        return Item.class.isAssignableFrom(clazz);
    }

	@Override
	public void validate(Object target, Errors errors) {
		...
	}
}
```
### 호출 클래스 상위
```java
@InitBinder
public void init(WebDataBinder dataBinder) {
    dataBinder.addValidators(itemValidator);
}
```

^dfaab1

[[Bean Validation]]을 이용하면 생략 가능합니다.

### 호출 메서드
```java
@PostMapping("/add")
public String addItem(
	@Validated @ModelAttribute Item item, 
	BindingResult bindingResult, 
	...) {

	// 아래 부분 제외해도 검증 가능
	// itemValidator.validate(item, bindingResult);
	...
}
```

# [[@RequestBody]]를 이용한 반환

[[@RequestBody]]를 사용하여 객체 자체를 return할 때도 검증 기능을 사용할 수 있습니다.
```java
@PostMapping("/add")
public Object addItem(
	@RequestBody @Validated ItemSaveForm form, 
	BindingResult bindingResult) { 

	// 오류 발생 시
	if (bindingResult.hasErrors()) {  
		log.info("검증 오류 발생 errors={}", bindingResult); 
		return bindingResult.getAllErrors();
	}

	// 성공 시
    return form;
}
```

실패 응답 예시 (9999개 제한인 제품 수량에 10000을 입력한 경우)
```json
[  
	{
		"codes": [
		    "Max.itemSaveForm.quantity",
		    "Max.quantity",
		    "Max.java.lang.Integer",
		    "Max"
		],
		"arguments": [
			{
				"codes": [
			        "itemSaveForm.quantity",
					"quantity"
				],        
				"arguments": null,
			    "defaultMessage": "quantity",
			    "code": "quantity"
			},
			9999
		],  
		"defaultMessage": "9999 이하여야 합니다", 
		"objectName": "itemSaveForm", 
		"field": "quantity",  
		"rejectedValue": 10000, 
		"bindingFailure": false,  
		"code": "Max"
	}
]
```
>[!tip] 팁
>이렇게 에러 내용 전체를 출력하기 보단 필요한 내용만 뽑아서 출력하는게 도움됩니다.

# [[@ModelAttribute]]와 [[@RequestBody]]에서 작동의 차이

- `@ModelAttribute` 는 특정 필드가 바인딩 되지 않아도 나머지 필드 는 정상 바인딩 되고, Validator를 사용한 검증도 적용할 수 있습니다.  
- `@RequestBody` 는 HttpMessageConverter 단계에서 JSON 데이터를 객체로 변경하지 못하면 이후 단계 자 체가 진행되지 않고 예외가 발생합니다. 컨트롤러도 호출되지 않고, Validator도 적용할 수 없습니다.
