// Observer 인터페이스
interface Observer {
  update(price: number): void;
}

// Subject 인터페이스
interface Subject {
  register(observer: Observer): void;
  unregister(observer: Observer): void;
  notify(): void;
}

// Concrete Subject (주체)
class Stock implements Subject {
  private observers: Observer[] = [];
  private price: number = 0;

  register(observer: Observer): void {
    this.observers.push(observer);
  }

  unregister(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  setPrice(newPrice: number): void {
    this.price = newPrice;
    this.notify(); // 상태 변화 시 자동 알림
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.price);
    }
  }
}

// Concrete Observers (관찰자들)
class PriceDisplay implements Observer {
  update(price: number): void {
    console.log(`📺 화면에 표시: 현재 주가 = ${price}`);
  }
}

class PriceAlert implements Observer {
  update(price: number): void {
    if (price > 100) {
      console.log(`🚨 알림: 주가 ${price} 초과!`);
    }
  }
}

// 사용 예시
const stock = new Stock();
const display = new PriceDisplay();
const alert = new PriceAlert();

stock.register(display);
stock.register(alert);

stock.setPrice(90);  // 📺 화면에 표시: 현재 주가 = 90
stock.setPrice(120); // 📺 + 🚨 알림 발생
