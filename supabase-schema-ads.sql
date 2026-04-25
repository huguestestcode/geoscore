-- ═══════════════════════════════════════════════════════════════════════════
-- Ads Creative Analyzer — Supabase Schema
-- Run this in your Supabase SQL Editor to create the required tables
-- ═══════════════════════════════════════════════════════════════════════════

-- Tracked brands (brands you want to monitor)
CREATE TABLE IF NOT EXISTS tracked_brands (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  meta_page_id       TEXT,
  tiktok_advertiser_id TEXT,
  logo_url    TEXT,
  industry    TEXT,
  country     TEXT DEFAULT 'FR',
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tracked_brands_updated_at
  BEFORE UPDATE ON tracked_brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_tracked_brands_name ON tracked_brands (name);
CREATE INDEX IF NOT EXISTS idx_tracked_brands_meta_page_id ON tracked_brands (meta_page_id) WHERE meta_page_id IS NOT NULL;
