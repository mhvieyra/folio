import FinancialReportComponent from '@/components/FinancialReport';
import { currentReport } from '@/data/financial-report';

export default function Home() {
  return <FinancialReportComponent data={currentReport} />;
}
