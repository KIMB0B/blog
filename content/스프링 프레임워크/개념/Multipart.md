---
title: Multipart란? (Spring에서 파일 전송하기)
date: 2025-02-14T11:25:00
---
# Multipart의 정의

> Http요청에서 파일 업로드를 할 때 주로 사용되며, 요청 데이터에 있는 파일이 Multipart 형태로 들어오게 됩니다.

# Multipart의 종류

| **Content-Type**      | **설명**                                             |
| --------------------- | -------------------------------------------------- |
| multipart/form-data   | 파일 업로드 시 사용 (HTML 폼에서 \<input type="file">을 사용할 때) |
| multipart/mixed       | 서로 다른 데이터 타입을 포함할 때 사용                             |
| multipart/alternative | 동일한 내용을 여러 형식(예: HTML, Plain Text)으로 보낼 때 사용       |
| multipart/related     | 본문과 연관된 데이터를 함께 보낼 때 (예: HTML 본문과 이미지 첨부)          |

# multipart/form-data 예시

```
POST /upload HTTP/1.1
Host: example.com
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="username"
john_doe

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="image.jpg"
Content-Type: image/jpeg

(binary data)

------WebKitFormBoundary--
```

# Spring에서 Multipart관련 설정

## 1. Size 관련 설정

- `spring.servlet.multipart.max-file-size` = 파일 하나의 사이즈 최대값
- `spring.servlet.multipart.max-request-size` = 한 요청에서 들어올 수 있는 파일들 사이즈 합의 최대값

위 조건을 넘는 사이즈로 요청이 들어올 경우 `SizeLimitExceededException`가 발생합니다.

## 2. 사용 여부 설정

- `spring.servlet.multipart.enabled` = Multipart 요청을 받을지 여부

# Spring에서 Multipart 사용

# 1. Upload

```java
@PostMapping("/upload")
public String uploadFile(@RequestParam MultipartFile file, HttpServletRequest request) throws IOException {

	if (!file.isEmpty()) {
		String fullPath = "/example/upload/" + file.getOriginalFilename();
		log.info("파일 저장 fullPath={}", fullPath);
		file.transferTo(new File(fullPath));
	}
	return "upload-form";

}
```

- `getOriginalFilename()` : 업로드한 파일명을 가져옴
- `transferTo()` : 해당 경로로 파일 저장

# 2. View

\[image를 UrlResource로 Return해주는 API 구현]
```java
@Controller
@RequiredArgsConstructor
public class ItemController {
	
	@ResponseBody
	@GetMapping("/images/{filename}")
	public Resource downloadImage(@PathVariable String filename) throws MalformedURLException {
		return new UrlResource("file:" + "/example/upload/" + filename));
	}
}
```

\[html로 이미지 불러오기]
```html
<img th:each="imageFile : ${item.imageFiles}" th:src="|/images/${imageFile.getStoreFileName()}|" />
```

# 3. Download

```java
@GetMapping("/attach/{itemId}")
public ResponseEntity<Resource> downloadAttach(@PathVariable Long itemId) throws MalformedURLException {
	Item item = itemRepository.findById(itemId);
	String storeFileName = item.getAttachFile().getStoreFileName();
	String uploadFileName = item.getAttachFile().getUploadFileName();
	UrlResource resource = new UrlResource("file:" + fileStore.getFullPath(storeFileName));
	String encodedUploadFileName = UriUtils.encode(uploadFileName, StandardCharsets.UTF_8);
	String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";
	return ResponseEntity.ok()
		.header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
		.body(resource);
}
```
> [!note] 중요한 점
> 여기서 파악해야할 점은 header에tj CONTENT_DISPOSITION으로 `attachment; filename="파일명"`을 넘겼다는 점입니다. 이렇게 해야 HTTP는 해당 파일이 파일이란 것을 인식하고 다운로드 할 수 있습니다.