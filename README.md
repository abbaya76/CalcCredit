# 일본 우리카드 결제 계산기

일본에서 우리카드 및 다른 한국 카드로 물건을 구매할 때 실제 결제되는 원화 금액을 계산해주는 웹 애플리케이션입니다.

## 기능

- 일본 엔(JPY) 금액 입력
- 카드사 선택 (우리카드, 신한카드, KB국민카드, 삼성카드, 현대카드)
- 실시간 환율 정보 적용
- 카드사별 해외 결제 수수료 계산
- 해외 이용 수수료 계산
- 최종 결제 예상 금액 계산

## 사용 방법

1. 일본 엔 금액을 입력합니다.
2. 사용할 카드사를 선택합니다.
3. '계산하기' 버튼을 클릭합니다.
4. 결제 상세 내역을 확인합니다.

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- ExchangeRate-API (환율 정보 API)

## 설치 및 실행

이 프로젝트는 별도의 서버나 설치 과정 없이 웹 브라우저에서 바로 실행할 수 있습니다.

```bash
# 저장소 클론
git clone https://github.com/yourusername/japan-card-calculator.git

# 디렉토리로 이동
cd japan-card-calculator

# index.html 파일을 웹 브라우저에서 열기
```

또는 [GitHub Pages](https://pages.github.com/)와 같은 정적 웹 호스팅 서비스를 통해 배포할 수 있습니다.

## 참고사항

- 이 계산기는 참고용으로만 사용하시기 바랍니다.
- 실제 결제 금액은 결제일의 환율, 카드사 정책 등에 따라 달라질 수 있습니다.
- 환율 정보는 ExchangeRate-API를 통해 실시간으로 갱신됩니다.
- 카드사 수수료율은 2023년 기준으로 설정되어 있으며, 정책 변경에 따라 달라질 수 있습니다. 