export interface PaymentStrategy {
  calculateFinalPrice(basePrice: number): number;
  getPaymentMethod(): string;
  getDiscountPercentage(): number;
  getInstallments(): number | null;
}

export class CreditCardStrategy implements PaymentStrategy {
  calculateFinalPrice(basePrice: number): number {
    return basePrice; // No discount for credit card
  }

  getPaymentMethod(): string {
    return "credit";
  }

  getDiscountPercentage(): number {
    return 0;
  }

  getInstallments(): number | null {
    return null; // Credit card doesn't have installments in this implementation
  }
}

export class PixStrategy implements PaymentStrategy {
  calculateFinalPrice(basePrice: number): number {
    return basePrice * 0.95; // 5% discount for PIX
  }

  getPaymentMethod(): string {
    return "pix";
  }

  getDiscountPercentage(): number {
    return 5;
  }

  getInstallments(): number | null {
    return null; // PIX is always paid in full
  }
}

export class BankSlipStrategy implements PaymentStrategy {
  calculateFinalPrice(basePrice: number): number {
    return basePrice; // No discount for bank slip
  }

  getPaymentMethod(): string {
    return "bankSlip";
  }

  getDiscountPercentage(): number {
    return 0;
  }

  getInstallments(): number | null {
    return null; // Bank slip is always paid in full
  }
}

export class CreditCardInstallmentsStrategy implements PaymentStrategy {
  constructor(private installments: number = 12) {}

  calculateFinalPrice(basePrice: number): number {
    // Add interest for installments (2% per month)
    const monthlyInterest = 0.02;
    const totalInterest = Math.pow(1 + monthlyInterest, this.installments) - 1;
    return basePrice * (1 + totalInterest);
  }

  getPaymentMethod(): string {
    return "credit";
  }

  getDiscountPercentage(): number {
    return 0;
  }

  getInstallments(): number | null {
    return this.installments;
  }
}

// Strategy Factory
export class PaymentStrategyFactory {
  static createStrategy(
    paymentMethod: string,
    installments?: number
  ): PaymentStrategy {
    switch (paymentMethod) {
      case "credit":
        return installments && installments > 1
          ? new CreditCardInstallmentsStrategy(installments)
          : new CreditCardStrategy();
      case "pix":
        return new PixStrategy();
      case "bankSlip":
        return new BankSlipStrategy();
      default:
        throw new Error(`Unsupported payment method: ${paymentMethod}`);
    }
  }
}
