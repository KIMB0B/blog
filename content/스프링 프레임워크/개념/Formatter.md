---
title: Formatter란?
date: 2025-02-13T12:44:00
tags:
  - 스프링/개념
---

# Formatter의 정의

> 실제 개발 환경에서는 문자열을 다른 타입으로 변환하거나, 다른 타입을 문자열로 변환하는 상황이 빈번할 것입니다.
> 이 때문에 객체를 특정한 포맷에 맞추어 문자로 출력하거나 또는 그 반대의 역할을 하는 것에 특화된 기능을 가진 Formatter가 생겼습니다.

---
# Formatter 형태

```java
public interface Printer<T> {
	String print(T object, Locale locale);
}

public interface Parser<T> {
	T parse(String text, Locale locale) throws ParseException;
}

public interface Formatter<T> extends Printer<T>, Parser<T> {
	
}
```

- `String print(T object, Locale locale)` : 객체를 문자로 변경한다.
- `T parse(String text, Locale locale)` : 문자를 객체로 변경한다.

---
# Formatter 생성

간단한 예시로 `1000`이란 숫자를 받으면 이를 확인하기 좋게 `1,000`이란 문자열로 변환하거나 그 반대로 행동하는 Formatter를 만들어보겠습니다.

## 1. 생성

```java
public class MyNumberFormatter implements Formatter<Number> {
	
	@Override
	public Number parse(String text, Locale locale) throws ParseException {
		return NumberFormat.getInstance(locale).parse(text);
	}
	
	@Override
	public String print(Number object, Locale locale) {
		return NumberFormat.getInstance(locale).format(object);
	}

}
```
> [!note] Locale이 포함된 이유
> Locale은 지역정보를 나타내는데, 우리가 정한 예시를 보면 우리나라는 3자리마다 쉼표를 통해 숫자를 끊어 나타내지만 독일은 점과 작은 따옴표를 사용하는 등 나라별로 표기법이 다르기 때문에 Locale을 활용합니다.
> NumberFormat을 활용하여 받은 Locale 정보에 맞게 변환하도록 했습니다.

## 2. 사용해보기

```java
class MyNumberFormatterTest {

	MyNumberFormatter formatter = new MyNumberFormatter();
	
	@Test
	void parse() throws ParseException {
		Number result = formatter.parse("1,000", Locale.KOREA);
		assertThat(result).isEqualTo(1000L); //Long 타입 주의
	}
	
	@Test
	void print() {
		String result = formatter.print(1000, Locale.KOREA);
		assertThat(result).isEqualTo("1,000");
	}

}
```

---
# FormattingConversionService 사용

Formatter도 [[Converter#ConversionService 사용|Converter의 ConversionService]]처럼 미리 등록해놓고 사용하는 시스템이 있어야 사용이 편할 것 입니다.
이를 위해 `FormattingConversionService`가 있으며, 이는 `ConversionService` 관련 기능을 상속받기 때문에 [[Converter]]와 Formatter 모두 등록과 사용이 가능합니다.

## 1. 등록

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Override
	public void addFormatters(FormatterRegistry registry) {
		
		registry.addConverter(new StringToIpPortConverter());
		registry.addConverter(new IpPortToStringConverter());
		//추가
		registry.addFormatter(new MyNumberFormatter());
	}
	
}
```

---
# Spring이 지원하는 기본 Formatter

- `@NumberFormat` : 숫자 관련 형식 지정 포맷터 사용
- `@DateTimeFormat` : 날짜 관련 형식 지정 포맷터 사용

## 1. 적용

```java
@Data
static class Form {
	
	@NumberFormat(pattern = "###,###")
	private Integer number;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime localDateTime;
	
}
```

## 2. 사용

```java
@GetMapping("/formatter/edit")
public String formatterForm(Model model) {
	
	Form form = new Form();
	form.setNumber(10000);
	form.setLocalDateTime(LocalDateTime.now());
	model.addAttribute("form", form);
	return "formatter-form";
	
}
```

해당 form을 thymeleaf를 통해 출력하면 아래와 같이 설정한 형태대로 타입이 바뀌어 출력됩니다.
```
${{form.number}}: 10,000
${{form.localDateTime}}: 2025-02-13 12:44:54
```

> [!error] 메시지 컨버터(HttpMessageConverter)에는 컨버전 서비스가 적용되지 않음
> `HttpMessageConverter` 의 역할은 HTTP 메시지 바디의 내용을 객체로 변환하거나 객체를 HTTP 메시지 바디에 입력하는 것입니다. 
> 
> 예를 들어서 JSON을 객체로 변환하는 메시지 컨버터는 내부에서 Jackson 같은 라이브러리를 사용합니다. 
> 객체를 JSON으로 변환한다면 그 결과는 이 라이브러리에 달린 것이기 때문에 JSON 결과로 만들어지는 숫자나 날짜 포맷을 변경하고 싶으면 해당 라이브러리가 제공하는 설정을 통해서 포맷을 지정해야 합니다. 
> 
> 결과적으로 이것은 컨버전 서비스와 전혀 관계가 없습니다.