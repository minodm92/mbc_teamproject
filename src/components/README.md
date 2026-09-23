# Components

`src/components`에는 페이지 내부에서 사용하는 섹션과 기능 컴포넌트를 둡니다.
라우터에 직접 연결되는 화면은 `src/pages`, 범용 UI는 `src/ui`, 공통 레이아웃은 `src/common/layout`에서 관리합니다.

```text
components/home
components/reservation
```

- 여러 도메인에서 함께 쓰는 범용 UI는 `src/ui`에 둡니다.
- 헤더, 푸터, 페이지 셸은 `src/common/layout`에 둡니다.
- 컴포넌트 전용 스타일은 컴포넌트와 같은 폴더에 둡니다.
- 파일 이름은 PascalCase를 사용합니다. 예: `LoginForm.jsx`, `LoginForm.css`
