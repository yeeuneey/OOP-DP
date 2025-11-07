// 1. Component 인터페이스
interface Notifier {
  send(message: string): void;
}

// 2. Concrete Component (기본 기능)
class BaseNotifier implements Notifier {
  send(message: string): void {
    console.log(`기본 알림: ${message}`);
  }
}

// 3. Decorator 추상 클래스
abstract class NotifierDecorator implements Notifier {
  protected wrappee: Notifier;

  constructor(notifier: Notifier) {
    this.wrappee = notifier;
  }

  send(message: string): void {
    this.wrappee.send(message); // 기존 기능 위임
  }
}

// 4. 구체적인 데코레이터들
class EmailNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`이메일 발송: ${message}`);
  }
}

class SMSNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`SMS 발송: ${message}`);
  }
}

class SlackNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`Slack 발송: ${message}`);
  }
}

// ---------------- 사용 예시 ----------------
let notifier: Notifier = new BaseNotifier();

// 기능을 런타임에서 동적으로 조합
notifier = new EmailNotifier(notifier);
notifier = new SMSNotifier(notifier);
notifier = new SlackNotifier(notifier);

notifier.send("긴급 서버 장애 발생!");
