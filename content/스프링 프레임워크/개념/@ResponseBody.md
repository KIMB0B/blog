# 정의

> Controller의 메서드가 return하는 데이터 자체가 클라이언트에게 전달되도록 하는 Annotation

# 단순 텍스트 응답

```java
@ResponseBody
@GetMapping("/response-body-string")
public String responseBody() {}
    return "ok";
}
```

# JSON 응답
```java
@ResponseStatus(HttpStatus.OK)
@ResponseBody
@GetMapping("/response-body-json-v2")
public HelloData responseBodyJsonV2() {

    HelloData helloData = new HelloData();
    helloData.setUsername("userA");
    helloData.setAge(20);

    return helloData;
}
```