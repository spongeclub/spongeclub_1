type TeamRecordOverride = {
  tagline: string;
  summaryLines: string[];
  editorNote: string;
};

type WeekRecordOverride = {
  commentImages: string[];
  commentLabel: string;
  teams: Record<string, TeamRecordOverride>;
};

const weekRecordOverrides: Record<number, WeekRecordOverride> = {
  3: {
    commentImages: [
      '/assets/comments/comment-darami.png',
      '/assets/comments/comment-jingjing.png',
      '/assets/comments/comment-pingping.png',
      '/assets/comments/comment-ddoong.png',
      '/assets/comments/comment-jibge.png',
    ],
    commentLabel: "데굴데굴's Comment",
    teams: {
      '1조': {
        tagline:
          '가까이에 있는 한 사람을 고객으로 두고, 매일 직접 써볼 수 있는 도구를 만들어봤어요.',
        summaryLines: [
          '정의는 회의실보다 빌드 안에서 더 또렷해졌어요.',
          '발송, 분류, 저장, 시각화를 나누자 시스템이 훨씬 단단해졌어요.',
          '내가 매일 쓰지 않는 도구는 다른 사람에게도 닿기 어렵다는 기준이 남았어요.',
        ],
        editorNote:
          '이번 주 1조의 힘은 거창한 시장보다 가까운 한 사람을 먼저 본 데 있었어요. 작게 굴려본 기록이 다음 확장의 가장 좋은 근거가 될 것 같아요.',
      },
      '2조': {
        tagline:
          '고객을 넓게 잡기보다 한 명까지 좁히면서, 기능과 판단 기준을 더 선명하게 만들었어요.',
        summaryLines: [
          '범용을 포기하자 오히려 만들 것이 분명해졌어요.',
          '하네스가 있으면 입력 방식이 바뀌어도 핵심 구조는 살아남아요.',
          '반복해도 안 풀리는 문제는 안을 다듬기보다 방향을 다시 보는 신호였어요.',
        ],
        editorNote:
          '2조는 “누구나”보다 “정확히 누구”가 더 빠른 길이라는 걸 잘 보여줬어요. 좁히는 선택이 오히려 실행 속도를 만들어냈네요.',
      },
      '3조': {
        tagline:
          '한 명의 고객에게 닿는 웹앱과 OS를 만들며, 자동화할 것과 사람이 결정할 것을 구분했어요.',
        summaryLines: [
          'AI에게 더 시키는 것보다 AI가 못 할 자리를 정하는 게 중요했어요.',
          '설계는 짧게 시작하고 실제 마찰에서 다시 짜는 리듬이 보였어요.',
          'OS는 자동화 자랑이 아니라 같은 실수를 반복하지 않게 만드는 안전망이었어요.',
        ],
        editorNote:
          '3조 기록에서는 “멈춰서 다시 보는 힘”이 특히 좋았어요. 만들면서 틀어진 지점을 알아차리고, 다시 설계로 가져오는 태도가 인상적이에요.',
      },
      '4조': {
        tagline:
          '고객을 먼저 정의하고, AI가 우회하기 어려운 토대와 규칙을 함께 세워봤어요.',
        summaryLines: [
          '기능을 더하기 전에 토대를 깔아야 다음 실수가 줄어들어요.',
          '윤리, 타입, 정책을 코드와 문서에 박아두면 에이전트의 우회가 줄어요.',
          '좋은 하네스는 일을 늘리는 장치가 아니라 문제를 미리 줄이는 장치였어요.',
        ],
        editorNote:
          '4조는 “잘 만드는 법”보다 “잘못 만들 수 없게 하는 법”에 가까이 갔어요. 이 관점은 다음 주차 빌드에서도 계속 힘을 발휘할 것 같아요.',
      },
      '5조': {
        tagline:
          '좁은 고객의 진짜 불편에서 출발해, 실제 사용자에게 던져볼 수 있는 도구를 만들었어요.',
        summaryLines: [
          '자동화가 막히는 지점은 포기할 이유가 아니라 차별점을 찾는 힌트였어요.',
          'WHY가 분명해지자 Claude Code가 비로소 일하기 시작했어요.',
          '전부 자동보다 사람이 승인하는 지점이 있는 자동화가 더 믿음직했어요.',
        ],
        editorNote:
          '5조는 현장의 막힘을 피하지 않고 제품의 모양으로 바꿔낸 점이 좋았어요. 사용자 반응까지 붙으니 기록이 훨씬 살아났어요.',
      },
      '6조': {
        tagline:
          '가장 잘 아는 고객을 첫 사용자로 삼고, 각자의 도메인 지식을 제품 구조로 옮겼어요.',
        summaryLines: [
          '도메인을 깊이 알수록 무엇을 만들지보다 무엇을 빼야 할지가 보였어요.',
          '하네스는 미래의 결정량을 줄이는 운영 구조에 가까웠어요.',
          '근접성에서 출발하고 한계로 차별점을 만드는 흐름이 또렷했어요.',
        ],
        editorNote:
          '6조는 “아는 만큼 정확하게 만들 수 있다”는 걸 잘 보여줬어요. 도메인 감각이 PRD가 되는 순간들이 많이 보였네요.',
      },
    },
  },
};

export function getWeekRecordOverride(weekNumber: number): WeekRecordOverride | null {
  return weekRecordOverrides[weekNumber] ?? null;
}
