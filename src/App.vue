<template>
  <div class="app">
    <h1 class="title">📚 스터디 코치 – 디자인 패턴 실습</h1>
    <section class="card">
      <h2>1. 생성 패턴 – Builder로 스터디 플랜 만들기</h2>
      <div class="form-row">
        <label>과목</label>
        <input v-model="subject" placeholder="예: 알고리즘, 데이터베이스" />
      </div>
      <div class="form-row">
        <label>총 공부 시간 (분)</label>
        <input type="number" v-model.number="duration" min="10" max="300" />
      </div>
      <div class="form-row">
        <label>쉬는 시간 간격 (분)</label>
        <input type="number" v-model.number="breakInterval" min="5" max="60" />
      </div>
      <div class="form-row checkbox-row">
        <label>
          <input type="checkbox" v-model="useReview" />
          마지막에 복습 세션 포함
        </label>
      </div>
      <button class="btn" @click="buildPlan">스터디 플랜 생성</button>

      <p v-if="planSummary" class="result">
        👉 {{ planSummary }}
      </p>
    </section>

    <section class="card">
      <h2>2. 구조 패턴 – Facade로 집중 세션 한 번에 시작</h2>
      <p class="hint">
        현재 선택된 과목:
        <strong>{{ subject || "미정" }}</strong>
      </p>
      <div class="button-row">
        <button class="btn secondary" @click="startShort">짧은 세션 시작 (25분)</button>
        <button class="btn danger" @click="startDeep">딥워크 세션 시작 (90분)</button>
      </div>
      <ul class="log-list">
        <li v-for="(log, index) in sessionLogs" :key="index">
          {{ log }}
        </li>
      </ul>
    </section>

    <section class="card">
      <h2>3. 행위 패턴 – Strategy로 보상 방식 바꾸기</h2>
      <div class="form-row">
        <label>보상 모드 선택</label>
        <select v-model="rewardMode">
          <option value="relax">휴식 모드</option>
          <option value="game">게임 모드</option>
          <option value="growth">성장 모드</option>
        </select>
      </div>
      <div class="form-row">
        <label>오늘의 집중 점수 (1 ~ 5)</label>
        <input type="range" min="1" max="5" v-model.number="score" />
        <span class="score-label">{{ score }}</span>
      </div>
      <button class="btn" @click="calculateReward">보상 확인</button>

      <p v-if="rewardMessage" class="result">
        {{ rewardMessage }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { StudyPlanBuilder } from "./Builder"
import { StudySessionFacade } from "./Facade"
import { createRewardContext } from "./Strategy"
import type { RewardMode } from "./Strategy"

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
    `${plan.breakIntervalMinutes}분마다 휴식하며 공부하고, ` +
    (plan.hasReviewSession
      ? "마지막에 복습 세션도 진행합니다."
      : "복습 세션은 생략합니다.")
}

const facade = new StudySessionFacade()
const sessionLogs = ref<string[]>([])

const startShort = () => {
  sessionLogs.value = facade.startShortSession(subject.value || "미정")
}

const startDeep = () => {
  sessionLogs.value = facade.startDeepWorkSession(subject.value || "미정")
}

const rewardMode = ref<RewardMode>("relax")
const score = ref(3)
const rewardMessage = ref("")

const calculateReward = () => {
  const ctx = createRewardContext(rewardMode.value)
  rewardMessage.value = ctx.run(score.value)
}
</script>
