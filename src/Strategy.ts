export interface RewardStrategy {
  getRewardMessage(score: number): string
}

export class RelaxRewardStrategy implements RewardStrategy {
  getRewardMessage(score: number): string {
    if (score <= 2) {
      return "오늘은 좀 힘들었지? ☕ 따뜻한 차 한 잔 마시면서 쉬자."
    }
    if (score <= 4) {
      return "수고했어! 🎧 좋아하는 음악 들으면서 20분만 쉬자."
    }
    return "완전 열심히 했네! 🧘 30분 힐링 타임 가져도 돼."
  }
}

export class GameRewardStrategy implements RewardStrategy {
  getRewardMessage(score: number): string {
    if (score <= 2) {
      return "오늘은 살짝 부족했어… 🎮 15분만 가볍게 게임하고 내일 다시 도전!"
    }
    if (score <= 4) {
      return "좋았어! 🎮 30분 게임 타임 보상!"
    }
    return "전설적인 집중력이다… 🏆 한 판 풀코스로 즐겨도 인정!"
  }
}

export class GrowthRewardStrategy implements RewardStrategy {
  getRewardMessage(score: number): string {
    if (score <= 2) {
      return "오늘은 워밍업이라고 생각하자. ✏️ 내일은 10분만 더 집중해보자!"
    }
    if (score <= 4) {
      return "좋은 흐름이야! 📚 오늘 한 개념만 더 정리해보자."
    }
    return "완벽했다! 🧠 오늘 배운 내용 블로그나 노션에 정리하면 더 오래 간다."
  }
}

export type RewardMode = "relax" | "game" | "growth"

export class RewardContext {
  private strategy: RewardStrategy

  constructor(strategy: RewardStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: RewardStrategy) {
    this.strategy = strategy
  }

  run(score: number): string {
    return this.strategy.getRewardMessage(score)
  }
}

export function createRewardStrategy(mode: RewardMode): RewardStrategy {
  switch (mode) {
    case "relax":
      return new RelaxRewardStrategy()
    case "game":
      return new GameRewardStrategy()
    case "growth":
    default:
      return new GrowthRewardStrategy()
  }
}

export function createRewardContext(mode: RewardMode): RewardContext {
  const strategy = createRewardStrategy(mode)
  return new RewardContext(strategy)
}
