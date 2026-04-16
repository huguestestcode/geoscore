import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { TrackedBrand } from '@/app/ads-analyzer/types'

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// ─── In-memory fallback when Supabase is not configured ──────────────────────
let memoryBrands: TrackedBrand[] = []

// ─── GET: List all tracked brands ────────────────────────────────────────────
export async function GET() {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('tracked_brands')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ brands: data })
  }

  // Fallback: in-memory
  return NextResponse.json({ brands: memoryBrands })
}

// ─── POST: Add a brand to track ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, meta_page_id, tiktok_advertiser_id, industry, country, notes } = body

  if (!name) {
    return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
  }

  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('tracked_brands')
      .insert({
        name,
        meta_page_id: meta_page_id || null,
        tiktok_advertiser_id: tiktok_advertiser_id || null,
        industry: industry || null,
        country: country || 'FR',
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ brand: data }, { status: 201 })
  }

  // Fallback: in-memory
  const brand: TrackedBrand = {
    id: `brand_${Date.now()}`,
    name,
    meta_page_id: meta_page_id || undefined,
    tiktok_advertiser_id: tiktok_advertiser_id || undefined,
    industry: industry || undefined,
    country: country || 'FR',
    notes: notes || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  memoryBrands.unshift(brand)
  return NextResponse.json({ brand }, { status: 201 })
}

// ─── DELETE: Remove a tracked brand ──────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 })
  }

  const supabase = getSupabase()

  if (supabase) {
    const { error } = await supabase
      .from('tracked_brands')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  // Fallback: in-memory
  memoryBrands = memoryBrands.filter((b) => b.id !== id)
  return NextResponse.json({ success: true })
}
