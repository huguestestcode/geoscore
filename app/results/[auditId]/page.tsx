import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ResultsClient from './ResultsClient'

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ auditId: string }>
  searchParams: Promise<{ unlocked?: string }>
}) {
  const { auditId } = await params
  const { unlocked } = await searchParams

  const { data: audit, error } = await supabaseAdmin
    .from('audits')
    .select('*')
    .eq('id', auditId)
    .single()

  if (error || !audit) {
    notFound()
  }

  const isUnlocked = audit.tier === 'paid' || audit.tier === 'saas' || unlocked === 'true'

  return <ResultsClient audit={audit} isUnlocked={isUnlocked} />
}
