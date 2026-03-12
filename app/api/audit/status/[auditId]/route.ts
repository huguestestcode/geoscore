import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ auditId: string }> }
) {
  const { auditId } = await params

  const { data: audit, error } = await supabaseAdmin
    .from('audits')
    .select('id, status, score, error_message')
    .eq('id', auditId)
    .single()

  if (error || !audit) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({
    status: audit.status || 'pending',
    score: audit.score,
    error: audit.error_message,
  })
}
