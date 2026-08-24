import { ReportWorkspace } from '@/components/report/ReportWorkspace'

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ReportWorkspace reportId={id} />
}
