# Sponge Village Visual

스폰지클럽 조별 과제 제출 진척도 영역에 넣을 React 컴포넌트입니다.

비주얼은 특정 캐릭터 IP를 직접 차용하지 않고, 말랑한 3D 토이/클레이 렌더 무드의 오리지널 수중 빌리지로 제작했습니다.

현재 버전은 8단계 투명 집 스프라이트를 4개 변형 기준으로 묶어 사용합니다. 각 조의 `weeklyAchievementRate` 값에 따라 집이 `빈 모래 자리 → 받침터 → 파인애플 본체 → 창문·문 → 완성` 순서로 바뀝니다. 배경의 별도 받침은 모래 레이어로 덮고, 집 스프라이트의 바닥만 남겨 이중 받침처럼 보이지 않게 했습니다.

## Files

- `BikiniBottom.tsx`: 실제 전달용 React 컴포넌트
- `assets/stages/pineapple-house-stages-aligned.png`: 0~7단계 투명 집 스프라이트
- `assets/sponge-village-empty-bg.png`: 실제 컴포넌트에서 쓰는 수중 배경
- `assets/sponge-village-bg.png`: 완성형 6채 배경 이미지, 기준 무드
- `demo.html`: 브라우저에서 바로 확인하는 standalone 데모
- `mockups/`: 이전 비교용 목업

## Usage

Next.js 기준으로는 이미지를 아래 위치에 두면 기본값 그대로 사용할 수 있습니다.

- `public/assets/sponge-village-empty-bg.png`
- `public/assets/stages/pineapple-house-stages-aligned.png`

```tsx
import { SpongeVillageProgress } from "./BikiniBottom";

export function TeamProgressSection() {
  return (
    <SpongeVillageProgress
      teams={[
        { name: "1조", weeklyAchievementRate: 24, href: "/teams/1" },
        { name: "2조", weeklyAchievementRate: 43, href: "/teams/2" },
        { name: "3조", weeklyAchievementRate: 12 },
        { name: "4조", weeklyAchievementRate: 58, href: "/teams/4" },
        { name: "5조", weeklyAchievementRate: 69, href: "/teams/5" },
        { name: "6조", weeklyAchievementRate: 74, href: "/teams/6" },
      ]}
    />
  );
}
```

다른 경로에 이미지를 둘 경우 `backgroundImageSrc`와 `stageSpriteSrc`를 넘기면 됩니다.

```tsx
<SpongeVillageProgress
  backgroundImageSrc="/images/sponge-village-empty-bg.png"
  stageSpriteSrc="/images/pineapple-house-stages-aligned.png"
  teams={teams}
/>
```

## Props

```ts
type Team = {
  name: string;
  weeklyAchievementRate?: number;
  achievementRate?: number;
  submittedCount?: number;
  totalAssignments?: number;
  progress?: number;
  href?: string;
};

type SpongeVillageProgressProps = {
  teams: Team[];
  totalStages?: number;
  totalAssignments?: number;
  emptyLabel?: string;
  backgroundImageSrc?: string;
  stageSpriteSrc?: string;
};
```

- `teams`: 최대 6개까지 표시합니다. 부족하면 빈 슬롯으로 채웁니다.
- `weeklyAchievementRate`: 주차별 과제 달성율입니다. `24`처럼 0~100 숫자 또는 `0.24`처럼 0~1 비율을 모두 받습니다.
- `achievementRate`: `weeklyAchievementRate`와 같은 의미의 짧은 alias입니다.
- `submittedCount`: 기존 호환용입니다. `weeklyAchievementRate`가 없을 때 `submittedCount / totalAssignments`로 달성율을 계산합니다.
- `totalAssignments`: 전체 과제 수입니다. 기본값은 `7`입니다.
- `progress`: 기존 호환용입니다. `weeklyAchievementRate`와 `submittedCount`가 없을 때만 사용합니다.
- `href`: 있으면 해당 조 영역이 클릭 가능한 링크가 됩니다. 없어도 hover/focus 반응은 동일합니다.
- `totalStages`: 이전 버전 호환을 위해 타입에 남아 있지만 현재 임계값 기반 단계 계산에는 사용하지 않습니다.
- `backgroundImageSrc`: 기본값은 `/assets/sponge-village-empty-bg.png`입니다.
- `stageSpriteSrc`: 기본값은 `/assets/stages/pineapple-house-stages-aligned.png`입니다.

## Stage Mapping

| 주차별 과제 달성율 | 시각 단계 |
|---:|---|
| 0% 이상, 20% 미만 | 빈 모래 자리 |
| 20% 이상 | 1차 변형: 받침터 |
| 40% 이상 | 2차 변형: 파인애플 본체 |
| 55% 이상 | 3차 변형: 창문, 문 |
| 70% 이상 | 완성: 잎 지붕, 장식/완성 |

기존 0~7단계 스프라이트는 아래처럼 묶어서 표시합니다.

| 기존 단계 | 원래 의미 | 현재 표시 묶음 |
|---:|---|---|
| 0 | 빈 모래 자리 | 빈 모래 자리 |
| 1 | 받침/터 | 1차 변형 |
| 2 | 파인애플 본체 | 2차 변형 |
| 3 | 첫 창문 | 3차 변형 |
| 4 | 두 번째 창문 | 3차 변형 |
| 5 | 문 | 3차 변형 |
| 6 | 잎 지붕 | 완성 |
| 7 | 장식/완성 | 완성 |

기존 코드에서 `BikiniBottom` 이름을 이미 쓰고 있다면 그대로 import해도 됩니다. `BikiniBottom`은 `SpongeVillageProgress`의 호환용 alias입니다.

## Integration Notes

- 컴포넌트는 React 외 의존성이 없습니다.
- 클라이언트 hook을 쓰지 않아 Next.js App Router의 서버 컴포넌트에서도 사용할 수 있습니다.
- 진행 카드와 바는 이미지 내부 하단에 팝업처럼 표시됩니다.
- hover 시 이미지 자체를 scale하지 않고 내부 ring만 켜서 이미지가 잘리지 않습니다.
- 3조처럼 `href`가 없는 조도 hover/focus highlight와 카드 반응이 동일하게 동작합니다.
- 원본 캐릭터 IP, 로고, 텍스트는 이미지에 포함하지 않았습니다.
