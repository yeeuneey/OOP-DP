class FocusTimer {
  start(durationMinutes: number): string {
    return `⏱ ${durationMinutes}분 집중 타이머 시작`
  }
}

class LoFiPlayer {
  play(subject: string): string {
    return `🎵 "${subject}" 공부용 Lo-Fi 음악 재생`
  }
}

class TodoChecklist {
  prepare(subject: string): string {
    return `✅ "${subject}" 오늘 할 문제 리스트 로딩`
  }
}

export class StudySessionFacade {
  private timer = new FocusTimer()
  private music = new LoFiPlayer()
  private todos = new TodoChecklist()

  startShortSession(subject: string): string[] {
    const duration = 25
    const logs: string[] = []
    logs.push(this.todos.prepare(subject))
    logs.push(this.music.play(subject))
    logs.push(this.timer.start(duration))
    logs.push("🚀 짧은 집중 세션이 시작되었습니다!")
    return logs
  }

  startDeepWorkSession(subject: string): string[] {
    const duration = 90
    const logs: string[] = []
    logs.push(this.todos.prepare(subject))
    logs.push(this.music.play(subject + " (딥워크 모드)"))
    logs.push(this.timer.start(duration))
    logs.push("🔥 딥워크 모드 ON! 방해 금지🚫")
    return logs
  }
}
