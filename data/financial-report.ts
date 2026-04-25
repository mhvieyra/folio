export interface FinancialReport {
  period: string;
  currency: string;
  reportDate: string;

  // Revenue
  revenue: {
    subscriptions: number;
    oneTimePurchases: number;
    donations: number;
  };

  // Cost of Revenue
  costOfRevenue: {
    infrastructure: number;
    paymentProcessing: number;
  };

  // Operating Expenses
  operatingExpenses: {
    productDevelopment: number;
    marketingAcquisition: number;
    operationsTools: number;
  };

  // Key Metrics
  keyMetrics: {
    mrr: number;
    registeredUsers: number;
    unregisteredUsers: number;
    userGrowthRate: number; // registered users growth Jan -> Mar (%)
    churnRate: number | null;
    momGrowth: number | null;
  };

  // Cumulative
  cumulativeRevenue: number;
}

export const currentReport: FinancialReport = {
  period: "Three Months Ended March 31, 2025",
  currency: "USD",
  reportDate: "Q1 2025",

  revenue: {
    subscriptions: 0,
    oneTimePurchases: 0,
    donations: 242.63,
  },

  costOfRevenue: {
    infrastructure: 12,       // Hosting, servers, etc
    paymentProcessing: 2,     // Stripe fees, payment gateway
  },

  operatingExpenses: {
    productDevelopment: 60,
    marketingAcquisition: 0,
    operationsTools: 76,
  },

  keyMetrics: {
    mrr: 0,
    activeSubscribers: 0,
    churnRate: 0,
    momGrowth: 375,           // De 4 usuarios en enero a 19 en marzo
  },

  cumulativeRevenue: 242.63,
};
