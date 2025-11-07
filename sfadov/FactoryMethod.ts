// 1. Product 인터페이스 (버튼의 공통 인터페이스)
interface Button {
  render(): void
  onClick(): void
}

// 2. 구체적인 Product 클래스들
class WindowsButton implements Button {
  render(): void {
    console.log("윈도우 스타일 버튼 렌더링")
  }
  onClick(): void {
    console.log("윈도우 버튼 클릭 이벤트 처리")
  }
}

class MacButton implements Button {
  render(): void {
    console.log("맥 스타일 버튼 렌더링")
  }
  onClick(): void {
    console.log("맥 버튼 클릭 이벤트 처리")
  }
}

// 3. Creator 추상 클래스 (팩토리 메서드 정의)
abstract class Dialog {
  // 팩토리 메서드
  abstract createButton(): Button

  // 비즈니스 로직
  renderDialog(): void {
    const button = this.createButton()
    button.render()
    button.onClick()
  }
}

// 4. 구체적인 Creator 클래스들
class WindowsDialog extends Dialog {
  createButton(): Button {
    return new WindowsButton()
  }
}

class MacDialog extends Dialog {
  createButton(): Button {
    return new MacButton()
  }
}

// 5. 클라이언트 코드
function clientApp(osType: string) {
  let dialog: Dialog

  if (osType === "Windows") {
    dialog = new WindowsDialog()
  } else {
    dialog = new MacDialog()
  }

  dialog.renderDialog()
}

// 실행 예시
clientApp("Windows")
// 출력: 윈도우 스타일 버튼 렌더링 / 윈도우 버튼 클릭 이벤트 처리

clientApp("Mac")
// 출력: 맥 스타일 버튼 렌더링 / 맥 버튼 클릭 이벤트 처리