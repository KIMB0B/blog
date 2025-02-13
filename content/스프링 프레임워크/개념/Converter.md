---
title: Converter란?
date: 2025-02-13T11:41:00
---
# Converter의 정의

> Spring에서 변환해야 할 타입에 다한 정의를 미리 구현해놓은 것
> 이를 호출하여 자주 변환하는 타입에 대해 간편하게 타입 변환을 할 수 있습니다.

---
# Converter 생성

예시로 ip와 port 정보를 입력받으면 `127.0.0.1:8080`과 같은 형태로 타입을 변환하거나 그 반대로 변환하는 Converter를 만들어보겠습니다.

## 1. 객체 생성

ip와 port 정보가 있는 간단한 객체입니다.
```java
@Getter
@EqualsAndHashCode
public class IpPort {
	
	private String ip;
	private int port;
	
	public IpPort(String ip, int port) {
		this.ip = ip;
		this.port = port;
	}
	
}
```
> [!note] @EqualsAndHashCode를 사용한 이유
> Lombok의 @EqualsAndHashCode 어노테이션을 사용하면 equals() 메서드를 자동으로 생성하고, 이는 각자 다른 객체여도 안에 포함된 값이 같다면 true를 반환해줍니다.
> 다른 두 IpPort 객체이지만 안의 값이 같은 객체의 동일 여부를 나중에 확인하기 위해 추가했습니다.

## 2. IP 객체를 문자열로 변환하는 Converter 생성

Converter 생성에는 implements를 추가하여 `Converter<변환전 데이터 타입, 변환후 데이터 타입>`을 넣어줍니다.

```java
public class IpPortToStringConverter implements Converter<IpPort, String> {

	@Override
	public String convert(IpPort source) {
		return source.getIp() + ":" + source.getPort();
	}

}
```

## 3. 문자열을 IP 객체로 변환하는 Converter

```java
public class StringToIpPortConverter implements Converter<String, IpPort> {
	
	@Override
	public IpPort convert(String source) {
		String[] split = source.split(":");
		String ip = split[0];
		int port = Integer.parseInt(split[1]);
		return new IpPort(ip, port);
	}
	
}
```

## 4. 사용해보기

```java
@Test
void ipPortToString() {
	
	IpPortToStringConverter converter = new IpPortToStringConverter();
	
	IpPort source = new IpPort("127.0.0.1", 8080);
	String result = converter.convert(source);
	assertThat(result).isEqualTo("127.0.0.1:8080");
	
}
```

위 테스트를 실행하면 테스트가 성공합니다.

---
# ConversionService 사용

위 사용한 코드를 확인하면 우리가 따로 타입을 바꿔주는 클래스를 만드는거랑 별 차이가 없어보입니다. 
굳이 만든 Converter클래스를 하나하나 new 하여 호출하기 번거로우니 `ConversionService`라는 기능을 사용하여 만들어놓은 Converter들을 편하게 호출하도록 할 수 있습니다.

## 1. 일반 호출로 사용해보기

```java
@Test
void conversionService() {

	//등록
	DefaultConversionService conversionService = new DefaultConversionService();
	conversionService.addConverter(new StringToIpPortConverter());
	conversionService.addConverter(new IpPortToStringConverter());
	
	//사용
	IpPort ipPort = conversionService.convert("127.0.0.1:8080", IpPort.class);
	assertThat(ipPort).isEqualTo(new IpPort("127.0.0.1", 8080));
	
	String ipPortString = conversionService.convert(new IpPort("127.0.0.1", 8080), String.class);
	assertThat(ipPortString).isEqualTo("127.0.0.1:8080");

}
```
> [!note] DefaultConversionService를 사용한 이유
> ConversionService는 단순히 컨버팅이 가능한가? 확인하는 기능과, 컨버팅 기능을 제공합니다.
> DefaultConversionService는 ConversionService인터페이스를 구현했는데, 추가로 컨버터를 등록하는 기능이 있어서 컨버터 등록을 위해 DefaultConversionService를 사용했습니다.

ConversionService를 통해 사용할 Converter를 전부 등록해놓을 수 있습니다.
또한 convert()를 진행할 때, 변환하고 싶은 타입의 클래스만 인자로 전달했고, <span style="background:#fff88f">어떤 Converter를 사용할지는 ConversionService에서 알아서 정해 사용</span>하기 때문에 사용하는 메서드에 의존하지 않게 되었습니다.
## 2. Spring Web 애플리케이션에서 사용해보기

### 2-1. 등록

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addFormatters(FormatterRegistry registry) {
		registry.addConverter(new StringToIpPortConverter());
		registry.addConverter(new IpPortToStringConverter());
	}

}
```

### 2-2. 사용

```java
@GetMapping("/ip-port")
public String ipPort(@RequestParam IpPort ipPort) {
	System.out.println("ipPort IP = " + ipPort.getIp());
	System.out.println("ipPort PORT = " + ipPort.getPort());
	return "ok";
}
```

```
// 요청
http://localhost:8080/ip-port?ipPort=127.0.0.1:8080

// 결과
ipPort IP = 127.0.0.1
ipPort PORT = 8080
```

따로 변환하는 과정을 넣지 않았지만, WebMvcConfigurer에 String을 IpPort로 변환하는 Converter를 등록해놨기 때문에 요청에서 `ipPort=127.0.0.1:8080`라는 파라미터를 넣으면 `@RequestParam IpPort ipPort` 부분에서 받아온 String값을 IpPort 타입에 맞게 자동으로 convert해줍니다.