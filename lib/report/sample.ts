import { createId } from './id'
import type { ReportDocument } from './types'

/**
 * Ships with the app as the "Demo report" so first-time users have a
 * fully-populated example to learn the schema from and duplicate. These are
 * the same figures the project used before it became a general-purpose
 * builder.
 */
export function buildSampleReport(): ReportDocument {
  const now = new Date().toISOString()
  return {
    id: createId('report'),
    meta: {
      companyName: 'Atlas HQ',
      reportTitle: 'CONDENSED STATEMENT OF OPERATIONS (Unaudited)',
      period: 'Three Months Ended March 31, 2026',
      unitNote: '(In USD)',
      footerNote:
        'This is an unaudited internal financial report prepared for community transparency purposes only.',
    },
    sections: [
      {
        id: createId('section'),
        title: 'Revenue:',
        role: 'revenue',
        totalLabel: 'Total net revenue',
        items: [
          { id: createId('item'), label: 'Subscriptions', value: 0, showCurrencySymbol: true },
          { id: createId('item'), label: 'One-time purchases', value: 0 },
          { id: createId('item'), label: 'Donations', value: 242.63 },
        ],
      },
      {
        id: createId('section'),
        title: 'Cost of revenue:',
        role: 'costOfRevenue',
        totalLabel: 'Total cost of revenue',
        items: [
          { id: createId('item'), label: 'Infrastructure & hosting', value: 12 },
          { id: createId('item'), label: 'Payment processing', value: 7.38 },
        ],
      },
      {
        id: createId('section'),
        title: 'Operating expenses:',
        role: 'operatingExpense',
        totalLabel: 'Total operating expenses',
        items: [
          { id: createId('item'), label: 'Product & development', value: 60 },
          { id: createId('item'), label: 'Marketing & acquisition', value: 0 },
          { id: createId('item'), label: 'Operations & tools', value: 76 },
        ],
      },
    ],
    keyMetrics: [
      { id: createId('metric'), label: 'Monthly recurring revenue (MRR)', value: 0, format: 'currency' },
      { id: createId('metric'), label: 'Active subscribers', value: 0, format: 'number' },
      { id: createId('metric'), label: 'Churn rate', value: 0, format: 'percent' },
      { id: createId('metric'), label: 'Month-over-month growth', value: 375, format: 'percent' },
    ],
    showAllocationBreakdown: true,
    cumulative: {
      enabled: true,
      label: 'Cumulative revenue (since inception)',
      value: 242.63,
    },
    createdAt: now,
    updatedAt: now,
  }
}

/** A minimal starting point for "New report" — one section per role so the shape is obvious. */
export function buildBlankReport(): ReportDocument {
  const now = new Date().toISOString()
  return {
    id: createId('report'),
    meta: {
      companyName: 'My Company',
      reportTitle: 'CONDENSED STATEMENT OF OPERATIONS (Unaudited)',
      period: 'Three Months Ended,',
      unitNote: '(In USD)',
      footerNote: 'This is an unaudited internal financial report prepared for informational purposes only.',
    },
    sections: [
      {
        id: createId('section'),
        title: 'Revenue:',
        role: 'revenue',
        totalLabel: 'Total net revenue',
        items: [{ id: createId('item'), label: 'Line item', value: 0, showCurrencySymbol: true }],
      },
      {
        id: createId('section'),
        title: 'Cost of revenue:',
        role: 'costOfRevenue',
        totalLabel: 'Total cost of revenue',
        items: [{ id: createId('item'), label: 'Line item', value: 0 }],
      },
      {
        id: createId('section'),
        title: 'Operating expenses:',
        role: 'operatingExpense',
        totalLabel: 'Total operating expenses',
        items: [{ id: createId('item'), label: 'Line item', value: 0 }],
      },
    ],
    keyMetrics: [],
    showAllocationBreakdown: false,
    cumulative: { enabled: false, label: 'Cumulative revenue (since inception)', value: 0 },
    createdAt: now,
    updatedAt: now,
  }
}
