# Transaction 도메인 개요

## 1. 데이터 소스 정의
- **/transaction/history**: 최근 N개의 거래 이벤트. 모든 공통 필드를 포함하며 `platform`, `paymentMethod`, `merchantId` 등 메타 데이터가 붙는다.
- **/transaction/asset**: 자산 카드/구독 자산에 대한 상태 변경 내역. `assetName`, `groupName`, `relatedUser` 등의 자산 특화 필드를 갖는다.
- **/transaction/recent**: 유저 대시보드용 요약 데이터. history 구조와 유사하지만 `occurredAt`와 `date`가 함께 내려오며 메세지성 필드가 강조된다.

## 2. 공통 상호작용 시나리오
1. 거래 목록 조회 → 필터 → 상세 확인
2. 페이지네이션(고정 pageSize 10, 추후 변경 가능)
3. 상태 배지/카테고리 뱃지 렌더링
4. 리스트 항목 클릭 시 우측 패널 혹은 Modal로 상세정보 출력

## 3. 컨테이너 요구사항
- React Query 결과(`UseQueryResult`)를 그대로 주입 받는다.
- 컨테이너 내부에서 필터/페이지 상태를 통합 관리하고, `renderFilters`를 통해 UI를 주입받는다.
- `modelBuilder`가 DTO → 도메인 모델 변환 및 파생 속성 계산을 담당한다.
- 리스트/디테일 컴포넌트는 순수 프레젠테이션 역할만 수행한다.

## 4. 향후 작업 흐름
1. 타입 계층 정의(`TransactionSchema`, `AssetTransactionSchema`, Builder 인터페이스)
2. React Query 훅(`useTransactionHistoryQuery`, `useAssetTransactionsQuery` 등) 및 API 어댑터 설계
3. `TransactionContainer` + 테스트용 리스트/디테일/필터 컴포넌트 뼈대 구현
