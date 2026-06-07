// ============ HELLOMOBILE DATA ============

const benefits = [
  {
    id: "hello-친구추천",
    통신사: "헬로모바일",
    종류: "친구추천 신세계상품권",
    금액: 210000,
    기간: 7,
    월지급액: 30000,
    지급방식: "매월",
    현금성: true,
    조건: [{ 타입: "최소요금", 값: 15900 }]
  },
  {
    id: "hello-프로모션코드-14만",
    통신사: "헬로모바일",
    종류: "프로모션코드 신세계상품권 (15,900원 이상)",
    금액: 140000,
    기간: 7,
    월지급액: 20000,
    지급방식: "매월",
    현금성: true,
    조건: [
      { 타입: "최소요금", 값: 15900 },
      { 타입: "행동", 값: "프로모션코드 입력" }
    ]
  },
  {
    id: "hello-쿠폰팩",
    통신사: "헬로모바일",
    종류: "쿠폰팩 네이버페이",
    금액: 120000,
    기간: 24,
    월지급액: 5000,
    지급방식: "매월",
    현금성: true,
    조건: [{ 타입: "카테고리", 값: "쿠폰팩" }]
  }
];

const plans = [
  {
    id: "hello-7gb-쿠폰팩",
    통신사: "헬로모바일",
    요금제명: "쿠폰팩 유심 7GB",
    데이터: 7,
    데이터플러스: "1Mbps무제한",
    통화: "기본",
    문자: "기본",
    영상부가통화: 300,
    월요금: 18330,
    카테고리: ["쿠폰팩"],
    받을수있는혜택: ["hello-친구추천", "hello-프로모션코드-14만", "hello-쿠폰팩"]
  }
];

// ============ 계산 함수 ============

function calculateBenefitsForN(plan, N) {
  let totalBenefit = 0;

  for (const benefitId of plan.받을수있는혜택) {
    const benefit = benefits.find(b => b.id === benefitId);
    if (!benefit || !benefit.현금성) continue;

    if (benefit.지급방식 === "매월") {
      const months = Math.min(N, benefit.기간);
      totalBenefit += months * benefit.월지급액;
    } else if (benefit.지급방식 === "1회") {
      if (N >= 1) totalBenefit += benefit.금액;
    }
  }

  return totalBenefit;
}

function calculateRealProfit(plan, N) {
  const totalBenefit = calculateBenefitsForN(plan, N);
  const totalCost = plan.월요금 * N;
  return totalBenefit - totalCost;
}

function findOptimalMonths(plan) {
  let bestN = 6;
  let bestMonthlyProfit = -Infinity;

  for (let N = 6; N <= 24; N++) {
    const profit = calculateRealProfit(plan, N);
    const monthlyProfit = profit / N;

    if (monthlyProfit > bestMonthlyProfit) {
      bestMonthlyProfit = monthlyProfit;
      bestN = N;
    }
  }

  return {
    optimalN: bestN,
    monthlyProfit: Math.round(bestMonthlyProfit),
    totalProfit: calculateRealProfit(plan, bestN)
  };
}

function getPlanResult(plan) {
  return {
    plan,
    periods: {
      6: {
        혜택: calculateBenefitsForN(plan, 6),
        실질이익: calculateRealProfit(plan, 6),
        월환산: Math.round(calculateRealProfit(plan, 6) / 6)
      },
      7: {
        혜택: calculateBenefitsForN(plan, 7),
        실질이익: calculateRealProfit(plan, 7),
        월환산: Math.round(calculateRealProfit(plan, 7) / 7)
      },
      12: {
        혜택: calculateBenefitsForN(plan, 12),
        실질이익: calculateRealProfit(plan, 12),
        월환산: Math.round(calculateRealProfit(plan, 12) / 12)
      },
      24: {
        혜택: calculateBenefitsForN(plan, 24),
        실질이익: calculateRealProfit(plan, 24),
        월환산: Math.round(calculateRealProfit(plan, 24) / 24)
      }
    },
    optimal: findOptimalMonths(plan)
  };
}

// ============ 실행 ============
const testPlan = plans[0];
const result = getPlanResult(testPlan);

console.log("=== 요금제:", testPlan.요금제명, "===");
console.log("월 요금:", testPlan.월요금.toLocaleString(), "원");
console.log("");
console.log("[6개월 유지]");
console.log("  받는 혜택:", result.periods[6].혜택.toLocaleString(), "원");
console.log("  실질 이익:", result.periods[6].실질이익.toLocaleString(), "원");
console.log("  월 환산  :", result.periods[6].월환산.toLocaleString(), "원/월");
console.log("");
console.log("[7개월 유지] (5/22 손계산 검증용)");
console.log("  받는 혜택:", result.periods[7].혜택.toLocaleString(), "원");
console.log("  실질 이익:", result.periods[7].실질이익.toLocaleString(), "원");
console.log("  월 환산  :", result.periods[7].월환산.toLocaleString(), "원/월");
console.log("");
console.log("[12개월 유지]");
console.log("  받는 혜택:", result.periods[12].혜택.toLocaleString(), "원");
console.log("  실질 이익:", result.periods[12].실질이익.toLocaleString(), "원");
console.log("  월 환산  :", result.periods[12].월환산.toLocaleString(), "원/월");
console.log("");
console.log("[24개월 유지]");
console.log("  받는 혜택:", result.periods[24].혜택.toLocaleString(), "원");
console.log("  실질 이익:", result.periods[24].실질이익.toLocaleString(), "원");
console.log("  월 환산  :", result.periods[24].월환산.toLocaleString(), "원/월");
console.log("");
console.log("⭐ 효율 정점:", result.optimal.optimalN, "개월");
console.log("   정점 실질이익:", result.optimal.totalProfit.toLocaleString(), "원");
console.log("   정점 월환산  :", result.optimal.monthlyProfit.toLocaleString(), "원/월");
