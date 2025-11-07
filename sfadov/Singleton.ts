// 싱글톤 클래스 정의
class Singleton {
  private static readonly instance: Singleton = new Singleton();

  private constructor() {}

  public static getInstance(): Singleton {
    return Singleton.instance;
  }

  // 테스트용 메서드
  public sayHello(): void {
    console.log("안녕하세요! 저는 싱글톤 인스턴스입니다 👋");
  }
}

// ------------------ 사용 예시 ------------------

// 1. 인스턴스 가져오기
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();

// 2. 메서드 호출
s1.sayHello(); // 출력: 안녕하세요! 저는 싱글톤 인스턴스입니다 👋

// 3. 같은 객체인지 확인
console.log(s1 === s2); // true (항상 같은 인스턴스)