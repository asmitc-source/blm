-- Write editor LLM-parity fields for cms_articles
ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS meta_title text not null default '';
ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS canonical_url text not null default '';
ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS published_at text not null default '';
ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS category text not null default '';
ALTER TABLE cms_articles ADD COLUMN IF NOT EXISTS cover_alt text not null default '';
