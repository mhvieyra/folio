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
    activeSubscribers: number;
    churnRate: number;
    momGrowth: number;
  };
  
  // Cumulative
  cumulativeRevenue: number;
}

export const currentReport: FinancialReport = {
  period: "Three Months Ended March 31, 2025",
  currency: "USD",
  reportDate: "Q1 2025",
  
  revenue: {
    subscriptions: 4500,      // MRR x months
    oneTimePurchases: 850,
    donations: 200,
  },
  
  costOfRevenue: {
    infrastructure: 600,       // Hosting, servers, etc
    paymentProcessing: 280,    // Stripe fees, payment gateway
  },
  
  operatingExpenses: {
    productDevelopment: 2800,
    marketingAcquisition: 600,
    operationsTools: 400,
  },
  
  keyMetrics: {
    mrr: 1500,                // Monthly recurring revenue
    activeSubscribers: 450,
    churnRate: 2.5,           // percentage
    momGrowth: 12.3,          // percentage
  },
  
  cumulativeRevenue: 18750,   // Histórico desde el inicio
};
