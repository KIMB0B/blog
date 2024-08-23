---
title: Mac에서 백준 환경 최적화로 Sublime Text3를 설정해보자! (for Python)
date: 2024-08-24T01:55:00
---
# Sublime Text3란?

![image](https://upload.wikimedia.org/wikipedia/en/d/d2/Sublime_Text_3_logo.png)

간단한 코드를 실행하기에 좋은 매우 가벼운 IDE입니다.<br>코딩테스트 공부를 하면서 무거운 프로그램을 짤 일은 없기 때문에 코딩테스트 공부에 매우 적합합니다!

---
# 설치 방법

[Sublime Text3 설치 링크](https://www.sublimetext.com/3)를 클릭해서 OS X버전을 클릭하여 다운로드합니다.

![image](https://gist.github.com/user-attachments/assets/85dc222c-a9e6-4ab3-b0e0-caec0cbcff07)

DMG 파일을 실행하여 위와 같은 화면이 나오면 Sublime Text 아이콘을 Applications 폴더로 드래그해줍니다.

그럼 설치는 끝!

---

# 테마 설정하기

우선 상위의 Sublime Text에서 `Settings... -> Select Theme... -> Adapative`를 선택해줍니다.

![image](https://gist.github.com/user-attachments/assets/d9dc13e3-6ec2-4263-b6c7-a0c4a21cd4fc)

(여기있습니다)

## Package Control 다운받기

`Cmd + Shift + P` 를 눌러줍니다.
그리고 입력창에 Install Package Control를 입력해서 엔터쳐줍시다.
그 후 시간이 조금 지나면 설치가 완료되었다고 뜨고, 그럼 OK를 눌러줍니다.

그리고 다시 `Cmd + Shift + P` 를 눌러줍니다.
이번엔 Package Control: Install Package를 검색해서 엔터를 눌러주고, 위와 같이 조금 기다리고 OK를 눌러줍시다

## Colorsublime 다운받기

또 다시 `Cmd + Shift + P` 를 눌러주고 다시 한번 Package Control: Install Package를 검색해서 엔터를 쳐줍시다.
그럼 이번엔 뭔가 검색할 수 있는 것이 나오는데, Colorsublime을 검색해서 다운받아줍시다.

## 테마 적용하기

이젠 마지막으로 `Cmd + Shift + P` 를 눌러주고 Colorsublime: Install Theme를 검색해서 엔터를 쳐줍시다.
그럼 다양한 테마가 나오게 되는데 저는 1337 테마로 진행하겠습니다.

![image](https://gist.github.com/user-attachments/assets/55184998-ab3a-4e88-b287-1d7f55524e35)

---

# 백준 환경 Build 시스템 추가

## 파일 기본 환경 구성

백준의 문제는 입력값이 있고 이를 input()을 통해 가져와서 문제를 풀게 되어있습니다.

그렇기에 우선 test.py라는 파이썬 파일과 입력값이 들어갈 input.txt를 넣어주겠습니다.

![image](https://gist.github.com/user-attachments/assets/2464cd97-cb07-4b2f-a8d9-cfede4e15777)

(같은 경로에 넣어주세요!)

그리고 test.py가 실행될 때 입력을 input.txt에서 받도록 Build 시스템을 작성해서 저장해봅시다.

## Build System 생성

상위에서 `Tools -> Build System -> New Build System...`을 클릭합니다.

![image](https://gist.github.com/user-attachments/assets/d3bb303f-e324-47b4-95ee-45726e4be5da)

그리고 아래와 같이 빌드파일을 만들어줍시다.
```json
{
	"cmd": ["python3", "-u", "$file"],
	"file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)",
	"selector": "source.python",

	"env": {"PYTHONIOENCODING": "utf-8"},

	"variants":
	[
		{
			"name": "Run",
            "shell_cmd": "python3 -u \"${file}\" < input.txt",
		}
	]
}
```

마지막으로 `Cmd + S`를 눌러 파일을 저장하고 파일 이름은 `Python (BOJ)`와 같이 저장하고 확장자는 `.sublime-build`여야 합니다.

---

# 잘 구성됐나 테스트해보기

## 파일 두개 한번에 열기

저희는 test.py와 input.txt를 한번에 열어야 합니다. 이럴 때 `Cmd + Opt + 2`를 눌러 창을 2개를 만들 수 있습니다. 그래서 한쪽에는 python파일, 다른 한쪽에는 input파일을 엽니다.

![image](https://gist.github.com/user-attachments/assets/0b805b9c-9b1c-469e-80da-235c19ec5d94)

## 실행시켜보기

test.py와 input.txt를 각각 아래와 같이 작성해봅시다.

```python
input1 = input() 
input2 = input() 
print(input1) 
print(input2)
```

```text
10 20
123123
```

그리고 test.py쪽에 마우스를 대고 `Cmd + B`를 눌러줍시다. 그럼 아래와 같이 뭔가가 나옵니다.

![image](https://gist.github.com/user-attachments/assets/a48cb704-675d-47a4-ad67-926a150c4c02)

여기서 Python (BOJ) - Run을 누르게 되면 아래와 같이 실행이 성공하여 결과가 아래에 출력됩니다.

![image](https://gist.github.com/user-attachments/assets/700f6cfa-aeaa-4b7b-945c-f55467623c87)
