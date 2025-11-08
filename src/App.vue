<template>
  <div class="app">
    <header class="hero">
      <div class="hero__glow"></div>
      <div class="hero__content">
        <div class="hero__text">
          <p class="eyebrow">Creational · Structural · Behavioral</p>
          <h1>Study Pattern Lab</h1>
          <p class="hero__subtitle">
            세 가지 디자인 패턴으로 스터디 루틴을 조립하고 실행하며, 집중 후 보상까지 한 번의
            흐름으로 연결합니다.
          </p>
          <ul class="badge-row">
            <PatternBadge
              v-for="nav in patternNav"
              :key="nav.label"
              :label="nav.label"
              :type="nav.type"
              @select="scrollToSection(nav.target)"
            />
          </ul>
          <div class="hero__stats">
            <span>선택 과목 · {{ subject || "미정" }}</span>
            <span>집중 시간 · {{ duration }}분</span>
            <span>휴식 간격 · {{ breakInterval }}분</span>
          </div>
          <div class="hero__actions">
            <button class="btn hero__cta" @click="scrollToSection('builder-step')">
              패턴 파이프라인 보기
            </button>
            <small>스크롤로 전체 흐름을 따라 내려보세요.</small>
          </div>
        </div>
        <div class="hero__side">
          <p class="hero__side-title">실시간 플랜 스냅샷</p>
          <p class="hero__side-value">{{ planSummary || "Builder로 플랜을 생성해보세요." }}</p>
        </div>
      </div>
    </header>

    <section class="flow" aria-label="패턴 파이프라인">
      <div class="flow__line"></div>

      <article id="builder-step" class="flow-card">
        <header class="flow-card__header">
          <span class="flow-card__step">STEP 01 · Builder</span>
          <h3>맞춤 스터디 플랜 조립</h3>
          <p>입력만 바꾸면 Builder가 StudyPlan 객체를 새로 생성하고 요약을 즉시 갱신합니다.</p>
        </header>
        <div class="flow-card__body">
          <div class="inline-form">
            <label>
              과목
              <input v-model="subject" placeholder="예: 알고리즘" />
            </label>
            <label>
              집중 시간 (분)
              <input type="number" v-model.number="duration" min="10" max="300" />
            </label>
            <label>
              휴식 간격 (분)
              <input type="number" v-model.number="breakInterval" min="5" max="60" />
            </label>
            <label class="checkbox-inline">
              <input type="checkbox" v-model="useReview" />
              복습 포함
            </label>
            <button class="btn" @click="buildPlan">플랜 빌드</button>
          </div>
          <ul class="metric-strip">
            <li v-for="metric in builderMetrics" :key="metric.label">
              <p class="metric-strip__label">{{ metric.label }}</p>
              <p class="metric-strip__value">{{ metric.value }}</p>
              <p class="metric-strip__hint">{{ metric.hint }}</p>
            </li>
          </ul>
          <p v-if="planSummary" class="result compact">📋 {{ planSummary }}</p>
        </div>
      </article>

      <article id="facade-step" class="flow-card">
        <header class="flow-card__header">
          <span class="flow-card__step">STEP 02 · Facade</span>
          <h3>집중 세션 오케스트레이션</h3>
          <p>타이머·음악·체크리스트를 Facade 한 번으로 호출하고, 로그로 순서를 확인합니다.</p>
        </header>
        <div class="flow-card__body">
          <div class="status-inline">
            <span :class="['status-chip', sessionMeta.state]">{{ sessionMeta.label }}</span>
            <p>{{ sessionMeta.description }}</p>
          </div>
          <div class="button-row">
            <button class="btn secondary" @click="startShort">25분 세션</button>
            <button class="btn danger" @click="startDeep">90분 세션</button>
          </div>
          <transition-group tag="ul" class="log-list" name="log">
            <li v-for="(log, index) in sessionLogs" :key="`${log}-${index}`">
              <span class="log-bullet">✦</span>
              <span>{{ log }}</span>
            </li>
          </transition-group>
        </div>
      </article>

      <article id="strategy-step" class="flow-card">
        <header class="flow-card__header">
          <span class="flow-card__step">STEP 03 · Strategy</span>
          <h3>보상 시나리오 스위치</h3>
          <p>집중 점수와 모드에 맞는 Strategy를 고르고 보상 메시지를 글래스 패널에 띄웁니다.</p>
        </header>
        <div class="flow-card__body">
          <div class="inline-form">
            <label>
              보상 모드
              <select v-model="rewardMode">
                <option value="relax">휴식</option>
                <option value="game">게임</option>
                <option value="growth">성장</option>
              </select>
            </label>
            <label class="slider-pack">
              집중 점수 (1~5)
              <div class="slider-inline">
                <input type="range" min="1" max="5" v-model.number="score" />
                <span class="score-label">{{ score }}</span>
              </div>
              <span class="slider-hint">{{ rewardTip }}</span>
            </label>
            <button class="btn" @click="calculateReward">보상 계산</button>
          </div>
          <div class="reward-gauge">
            <div class="reward-gauge__fill" :style="{ width: rewardGaugeWidth }"></div>
          </div>
          <div v-if="rewardMessage" class="reward-panel compact">
            <span class="reward-panel__mode">{{ rewardModeLabel }}</span>
            <p>{{ rewardMessage }}</p>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { StudyPlanBuilder } from "./Builder"
import { StudySessionFacade } from "./Facade"
import { createRewardContext } from "./Strategy"
import type { RewardMode } from "./Strategy"
import PatternBadge from "./components/PatternBadge.vue"

type PatternNav = {
  label: string
  type: "creational" | "structural" | "behavioral"
  target: string
}

const patternNav: PatternNav[] = [
  { label: "Builder", type: "creational", target: "builder-step" },
  { label: "Facade", type: "structural", target: "facade-step" },
  { label: "Strategy", type: "behavioral", target: "strategy-step" },
]

const subject = ref("알고리즘")
const duration = ref(50)
const breakInterval = ref(10)
const useReview = ref(true)
const planSummary = ref("")

const buildPlan = () => {
  const builder = new StudyPlanBuilder()
    .setSubject(subject.value || "미정")
    .setDuration(duration.value)
    .setBreakInterval(breakInterval.value)

  if (useReview.value) {
    builder.enableReviewSession()
  } else {
    builder.disableReviewSession()
  }

  const plan = builder.build()
  planSummary.value =
    `"${plan.subject}"를 ${plan.durationMinutes}분 동안, ` +
    `${plan.breakIntervalMinutes}분마다 쉬어 가며 학습하고, ` +
    (plan.hasReviewSession ? "마지막에 복습 세션도 진행합니다." : "복습 세션은 생략합니다.")
}

const builderMetrics = computed(() => [
  {
    label: "집중 블록",
    value: `${duration.value}분`,
    hint: "포커스 타임",
  },
  {
    label: "휴식 루프",
    value: `${breakInterval.value}분`,
    hint: "마이크로 브레이크",
  },
  {
    label: "복습 모듈",
    value: useReview.value ? "ON" : "OFF",
    hint: useReview.value ? "기억 고정 단계" : "속도 우선",
  },
])

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: "smooth", block: "start" })
}

const facade = new StudySessionFacade()
const sessionLogs = ref<string[]>([])

const startShort = () => {
  sessionLogs.value = facade.startShortSession(subject.value || "미정")
}

const startDeep = () => {
  sessionLogs.value = facade.startDeepWorkSession(subject.value || "미정")
}

const sessionMeta = computed(() => {
  if (!sessionLogs.value.length) {
    return {
      state: "idle",
      label: "대기 중",
      description: "세션을 실행하면 Facade가 모든 서브시스템을 호출하고 로그가 채워집니다.",
    }
  }
  return {
    state: "active",
    label: `${sessionLogs.value.length} 단계 진행`,
    description: `"${subject.value || "미정"}" 세션이 구동 중입니다.`,
  }
})

const rewardMode = ref<RewardMode>("relax")
const score = ref(3)
const rewardMessage = ref("")

const rewardModeLabel = computed(() => {
  switch (rewardMode.value) {
    case "relax":
      return "휴식 모드"
    case "game":
      return "게임 모드"
    default:
      return "성장 모드"
  }
})

const rewardTip = computed(() => {
  if (score.value <= 2) return "컨디션 회복용 보상 추천"
  if (score.value <= 4) return "리듬 유지가 핵심!"
  return "최고 집중력, 스스로에게 투자할 차례"
})

const rewardGaugeWidth = computed(() => `${(score.value / 5) * 100}%`)

const calculateReward = () => {
  const ctx = createRewardContext(rewardMode.value)
  rewardMessage.value = ctx.run(score.value)
}
</script>
