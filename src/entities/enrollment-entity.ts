export const PaymentMethods = ["credit", "pix", "bankSlip"] as const;

export type PaymentMethod = (typeof PaymentMethods)[number];

export interface EnrollmentEntity {
  id: string;
  finished: boolean;
  finishedModulesIds: string[];
  finishedClassesIds: string[];
  paymentMethod: PaymentMethod;
  finalPrice: number;
  courseId: string;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
}
