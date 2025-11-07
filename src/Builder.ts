export interface StudyPlan {
  subject: string
  durationMinutes: number
  breakIntervalMinutes: number
  hasReviewSession: boolean
}

export class StudyPlanBuilder {
  private plan: StudyPlan = {
    subject: "미정",
    durationMinutes: 50,
    breakIntervalMinutes: 10,
    hasReviewSession: false,
  }

  setSubject(subject: string): this {
    this.plan.subject = subject
    return this
  }

  setDuration(minutes: number): this {
    this.plan.durationMinutes = minutes
    return this
  }

  setBreakInterval(minutes: number): this {
    this.plan.breakIntervalMinutes = minutes
    return this
  }

  enableReviewSession(): this {
    this.plan.hasReviewSession = true
    return this
  }

  disableReviewSession(): this {
    this.plan.hasReviewSession = false
    return this
  }

  build(): StudyPlan {
    return { ...this.plan }
  }
}
