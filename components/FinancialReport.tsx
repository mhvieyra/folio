'use client';

import { FinancialReport } from '@/data/financial-report';

interface FinancialReportProps {
  data: FinancialReport;
}

const formatNumber = (value: number, showDollar = false): string => {
  const formatted = value < 0
    ? `(${Math.abs(value).toLocaleString('en-US')})`
    : value.toLocaleString('en-US');
  return showDollar ? `$  ${formatted}` : formatted;
};

const rowBg = (index: number) => index % 2 === 1 ? '#f7f7f7' : '#fff';

export default function FinancialReportComponent({ data }: FinancialReportProps) {
  const totalRevenue =
    data.revenue.subscriptions +
    data.revenue.oneTimePurchases +
    data.revenue.donations;

  const totalCostOfRevenue =
    data.costOfRevenue.infrastructure +
    data.costOfRevenue.paymentProcessing;

  const grossProfit = totalRevenue - totalCostOfRevenue;
  const grossMarginPct = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  const totalOperatingExpenses =
    data.operatingExpenses.productDevelopment +
    data.operatingExpenses.marketingAcquisition +
    data.operatingExpenses.operationsTools;

  const operatingIncome = grossProfit - totalOperatingExpenses;
  const netIncome = operatingIncome;

  const totalExpenses = totalCostOfRevenue + totalOperatingExpenses;
  const pct = (v: number) => totalExpenses > 0 ? Math.round((v / totalExpenses) * 100) : 0;

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  };

  const labelStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '2px 0',
  };

  const valueStyle: React.CSSProperties = {
    textAlign: 'right',
    padding: '2px 0',
    width: '100px',
  };

  return (
    <div style={{ 
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '10pt',
      lineHeight: '1.3',
      color: '#000',
      backgroundColor: '#fff',
      padding: '24px 16px',
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>Atlas HQ</div>
        <div style={{ fontWeight: 'bold', fontSize: '10pt', marginTop: '4px' }}>
          CONDENSED STATEMENT OF OPERATIONS (Unaudited)
        </div>
        <div style={{ fontSize: '9pt', marginTop: '2px' }}>(In USD)</div>
      </div>

      {/* Period Header */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <td style={{ width: '60%' }}></td>
            <td style={{ 
              textAlign: 'center', 
              fontWeight: 'bold', 
              fontSize: '9pt',
              borderBottom: '1px solid #999',
              paddingBottom: '3px',
            }}>
              {data.period}
            </td>
          </tr>
        </thead>
      </table>

      {/* Revenue */}
      <table style={{ ...tableStyle, marginTop: '8px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Revenue:</td>
            <td style={valueStyle}></td>
          </tr>
          <tr style={{ background: rowBg(1) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Subscriptions</td>
            <td style={valueStyle}>{formatNumber(data.revenue.subscriptions, true)}</td>
          </tr>
          <tr style={{ background: rowBg(2) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>One-time purchases</td>
            <td style={valueStyle}>{formatNumber(data.revenue.oneTimePurchases)}</td>
          </tr>
          <tr style={{ background: rowBg(3) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Donations</td>
            <td style={{ ...valueStyle, borderBottom: '1px solid #000' }}>{formatNumber(data.revenue.donations)}</td>
          </tr>
          <tr style={{ background: rowBg(4) }}>
            <td style={{ ...labelStyle, paddingLeft: '32px' }}>Total net revenue</td>
            <td style={valueStyle}>{formatNumber(totalRevenue)}</td>
          </tr>
        </tbody>
      </table>

      {/* Cost of Revenue */}
      <table style={{ ...tableStyle, marginTop: '8px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Cost of revenue:</td>
            <td style={valueStyle}></td>
          </tr>
          <tr style={{ background: rowBg(1) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Infrastructure &amp; hosting</td>
            <td style={valueStyle}>{formatNumber(data.costOfRevenue.infrastructure)}</td>
          </tr>
          <tr style={{ background: rowBg(2) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Payment processing</td>
            <td style={{ ...valueStyle, borderBottom: '1px solid #000' }}>{formatNumber(data.costOfRevenue.paymentProcessing)}</td>
          </tr>
          <tr style={{ background: rowBg(3) }}>
            <td style={{ ...labelStyle, paddingLeft: '32px' }}>Total cost of revenue</td>
            <td style={valueStyle}>{formatNumber(totalCostOfRevenue)}</td>
          </tr>
          <tr style={{ background: rowBg(4) }}>
            <td style={{ ...labelStyle, paddingLeft: '32px' }}>Gross profit</td>
            <td style={valueStyle}>{formatNumber(grossProfit)}</td>
          </tr>
          <tr style={{ background: rowBg(5) }}>
            <td style={{ ...labelStyle, paddingLeft: '32px' }}>Gross margin</td>
            <td style={valueStyle}>{grossMarginPct}%</td>
          </tr>
        </tbody>
      </table>

      {/* Operating Expenses */}
      <table style={{ ...tableStyle, marginTop: '8px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Operating expenses:</td>
            <td style={valueStyle}></td>
          </tr>
          <tr style={{ background: rowBg(1) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Product &amp; development</td>
            <td style={valueStyle}>{formatNumber(data.operatingExpenses.productDevelopment)}</td>
          </tr>
          <tr style={{ background: rowBg(2) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Marketing &amp; acquisition</td>
            <td style={valueStyle}>{formatNumber(data.operatingExpenses.marketingAcquisition)}</td>
          </tr>
          <tr style={{ background: rowBg(3) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Operations &amp; tools</td>
            <td style={{ ...valueStyle, borderBottom: '1px solid #000' }}>{formatNumber(data.operatingExpenses.operationsTools)}</td>
          </tr>
          <tr style={{ background: rowBg(4) }}>
            <td style={{ ...labelStyle, paddingLeft: '32px' }}>Total operating expenses</td>
            <td style={valueStyle}>{formatNumber(totalOperatingExpenses)}</td>
          </tr>
        </tbody>
      </table>

      {/* Operating Income & Net Income */}
      <table style={{ ...tableStyle, marginTop: '8px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Operating income</td>
            <td style={valueStyle}>{formatNumber(operatingIncome)}</td>
          </tr>
          <tr style={{ background: rowBg(1) }}>
            <td style={labelStyle}>Net income</td>
            <td style={{ ...valueStyle, borderBottom: '3px double #000' }}>{formatNumber(netIncome, true)}</td>
          </tr>
        </tbody>
      </table>

      {/* Key Metrics */}
      <table style={{ ...tableStyle, marginTop: '16px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Key metrics:</td>
            <td style={valueStyle}></td>
          </tr>
          <tr style={{ background: rowBg(1) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Monthly recurring revenue (MRR)</td>
            <td style={valueStyle}>{formatNumber(data.keyMetrics.mrr, true)}</td>
          </tr>
          <tr style={{ background: rowBg(2) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Active subscribers</td>
            <td style={valueStyle}>{formatNumber(data.keyMetrics.activeSubscribers)}</td>
          </tr>
          <tr style={{ background: rowBg(3) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Churn rate</td>
            <td style={valueStyle}>{data.keyMetrics.churnRate}%</td>
          </tr>
          <tr style={{ background: rowBg(4) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Month-over-month growth</td>
            <td style={valueStyle}>{data.keyMetrics.momGrowth}%</td>
          </tr>
        </tbody>
      </table>

      {/* Allocation Breakdown */}
      <table style={{ ...tableStyle, marginTop: '16px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Expense allocation:</td>
            <td style={valueStyle}></td>
          </tr>
          <tr style={{ background: rowBg(1) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Product &amp; development</td>
            <td style={valueStyle}>{pct(data.operatingExpenses.productDevelopment)}%</td>
          </tr>
          <tr style={{ background: rowBg(2) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Infrastructure &amp; hosting</td>
            <td style={valueStyle}>{pct(data.costOfRevenue.infrastructure)}%</td>
          </tr>
          <tr style={{ background: rowBg(3) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Marketing &amp; acquisition</td>
            <td style={valueStyle}>{pct(data.operatingExpenses.marketingAcquisition)}%</td>
          </tr>
          <tr style={{ background: rowBg(4) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Operations &amp; tools</td>
            <td style={valueStyle}>{pct(data.operatingExpenses.operationsTools)}%</td>
          </tr>
          <tr style={{ background: rowBg(5) }}>
            <td style={{ ...labelStyle, paddingLeft: '16px' }}>Payment processing</td>
            <td style={{ ...valueStyle, borderBottom: '1px solid #000' }}>{pct(data.costOfRevenue.paymentProcessing)}%</td>
          </tr>
          <tr style={{ background: rowBg(6) }}>
            <td style={{ ...labelStyle, paddingLeft: '32px' }}>Total</td>
            <td style={valueStyle}>100%</td>
          </tr>
        </tbody>
      </table>

      {/* Cumulative Revenue */}
      <table style={{ ...tableStyle, marginTop: '16px' }}>
        <tbody>
          <tr style={{ background: rowBg(0) }}>
            <td style={labelStyle}>Cumulative revenue (since inception)</td>
            <td style={{ ...valueStyle, borderBottom: '3px double #000' }}>{formatNumber(data.cumulativeRevenue, true)}</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ marginTop: '24px', fontSize: '8pt', color: '#666' }}>
        This is an unaudited internal financial report prepared for community transparency purposes only.
      </div>
    </div>
  );
}
