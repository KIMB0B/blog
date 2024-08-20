# 정의

> 사용자 입력의 데이터 바인딩 과정에서 발생하는 오류를 관리하고 추적하는 인터페이스
> 이를 통해 입력 데이터의 유효성 검사 결과를 저장하고, 필요할 때 오류를 쉽게 처리할 수 있도록 도와줌

>[!warning] 주의사항
> Controller의 함수의 매개변수로 들어가는 BindingResult는 [[@ModelAttribute]]이 붙은 매개변수 바로 뒤에 와야한다. 
> ex) public String addUser(@ModelAttribute User user, <u>BindingResult bindingResult</u>, ...) {...}

# 오류 상황 추가

### 1. 필드 오류 - FieldError

```java
// FieldError 생성자 요약

// 1. 간단한 버전
public FieldError(
	String objectName, 
	String field, 
	String defaultMessage)

// 2. 상세 버전
public FieldError(
	String objectName, 
	String field, 
	@Nullable Object rejectedValue, 
	boolean bindingFailure, 
	@Nullable String[] codes, 
	@Nullable Object[] arguments, 
	@Nullable String defaultMessage)
```
> [!note] 파라미터 정리(간단한 버전)
> - `objectName` : `@ModelAttribute` 이름  
>- `field` : 오류가 발생한 필드 이름  
>- `defaultMessage` : 오류 기본 메시지

> [!note] 파라미터 정리(상세 버전)
> - `objectName` : `@ModelAttribute` 이름  
>- `field` : 오류 필드  
> - `rejectedValue` : 사용자가 입력한 값(거절된 값)  
> - `bindingFailure` : 타입 오류 같은 바인딩 실패인지, 검증 실패인지 구분 값 
> - `codes` : 메시지 코드  
> - `arguments` : 메시지에서 사용하는 인자  
> - `defaultMessage` : 기본 오류 메시지

```java
// 사용 예시
bindingResult.addError(new FieldError("item", "itemName", "상품 이름은 필수입니다.")); 

// 오류 발생 시 사용자가 입력한 값을 유지한 버전
// rejectedValue 파라미터를 추가함
bindingResult.addError(new FieldError("item", "itemName", item.getItemName(), false, null, null, "상품 이름은 필수입니다."))
```

### 2. 글로벌 오류 - ObjectError

```java
// ObjectError 생성자 요약

// 1. 간단한 버전
public ObjectError(
	String objectName, 
	String defaultMessage)

// 2. 상세 버전
public FieldError(
	String objectName, 
	@Nullable String[] codes, 
	@Nullable Object[] arguments, 
	@Nullable String defaultMessage)
```
> [!note] 파라미터 정리(간단한 버전)
> - `objectName` : `@ModelAttribute` 이름 
>- `defaultMessage` : 오류 기본 메시지

> [!note] 파라미터 정리(상세 버전)
> - `objectName` : `@ModelAttribute` 이름  
> - `codes` : 메시지 코드  
> - `arguments` : 메시지에서 사용하는 인자  
> - `defaultMessage` : 기본 오류 메시지
```java
// 사용 예시
if (...) {  
	bindingResult.addError(new ObjectError("item", "총합은 10,000원 이상이어야 합니다.")); 
}
```

# 더 간단한 오류 상황 추가 방법

>[!info] 설명
>[[BindingResult#1. 필드 오류 - FieldError|FieldError]]나 [[BindingResult#2. 글로벌 오류 - ObjectError|ObjectError]]를 사용하지 않아도 가능
>BindingResult는 @ModelAttribute 바로 뒤에 나오기 때문에 검증해야 할 객체 대상을 알고 있어서 간단하게 사용이 가능함
### 1. rejectValue()

```java
void rejectValue(
	@Nullable String field, 
	String errorCode,
	@Nullable Object[] errorArgs, 
	@Nullable String defaultMessage);
```
> [!note] 파라미터 정리
> - `field` : 오류 필드명
> - `errorCode` : 오류 코드(메시지 코드가 아님)
> - `errorArgs` : 오류 메시지에서 `{0}`, `{1}`... 을 치환하기 위한 값
> - `defaultMessage` : 오류 메시지를 찾을 수 없을 때 사용하는 기본 메시지

```java
// 사용 예시
bindingResult.rejectValue("price", "range", new Object[]{1000, 1000000}, null);
```
>[!info] code를 축약할 수 있는 이유
>`errors.properties`에 <u>range.item.price=가격은 {0} ~ {1} 까지 허용합니다.</u> 라고 작성했을 때 code를 "range.item.price"가 아닌 "price"라고 축약하여 써도 잘 작동한다.
>
>그 이유는 작성한 코드 뒤에 자동으로 `.필드명.모델명`이 붙도록 하기 때문이다.

^9302a9
### 2. reject()

```java
void reject(
	String errorCode, 
	@Nullable Object[] errorArgs, 
	@Nullable String defaultMessage);
```
> [!note] 파라미터 정리
> - `errorCode` : 오류 코드(메시지 코드가 아님)
> - `errorArgs` : 오류 메시지에서 `{0}`, `{1}`... 을 치환하기 위한 값
> - `defaultMessage` : 오류 메시지를 찾을 수 없을 때 사용하는 기본 메시지

```java
// 사용 예시
bindingResult.reject("totalPriceMin", new Object[]{10000, resultPrice}, null);
```