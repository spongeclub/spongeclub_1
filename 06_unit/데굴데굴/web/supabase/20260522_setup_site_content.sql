-- 데굴데굴 사이트 콘텐츠용 임시 Supabase setup script.
-- Supabase SQL Editor에서 이 파일 전체를 1회 실행하면 됩니다.
-- 목적: 공지사항/질문 페이지를 기존 배포판 DB와 분리해 site_* 테이블에서 읽게 한다.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.site_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'guide' CHECK (label IN ('urgent', 'schedule', 'material', 'guide', 'tool')),
  title text,
  text text NOT NULL,
  time_ago text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  href text,
  pinned boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer,
  slack_channel_id text,
  slack_message_ts text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(slack_channel_id, slack_message_ts)
);

CREATE INDEX IF NOT EXISTS idx_site_announcements_public_order
  ON public.site_announcements(is_published, pinned DESC, sort_order, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.site_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'unresolved' CHECK (status IN ('unresolved', 'resolved', 'shared')),
  type text NOT NULL DEFAULT 'question' CHECK (type IN ('question', 'tip', 'site')),
  title text NOT NULL,
  text text,
  author text NOT NULL DEFAULT '익명',
  team integer NOT NULL DEFAULT 0,
  topic_tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  relevance integer NOT NULL DEFAULT 70,
  time_ago text,
  href text,
  reactions jsonb NOT NULL DEFAULT '[]'::jsonb,
  replies jsonb NOT NULL DEFAULT '[]'::jsonb,
  hot boolean NOT NULL DEFAULT false,
  link_to_skill boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer,
  slack_channel_id text,
  slack_message_ts text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(slack_channel_id, slack_message_ts)
);

CREATE INDEX IF NOT EXISTS idx_site_questions_public_order
  ON public.site_questions(is_published, sort_order, updated_at DESC);

-- 공개 사이트는 published row만 읽을 수 있게 한다.
ALTER TABLE public.site_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_announcements_public_read_published" ON public.site_announcements;
CREATE POLICY "site_announcements_public_read_published"
  ON public.site_announcements
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "site_questions_public_read_published" ON public.site_questions;
CREATE POLICY "site_questions_public_read_published"
  ON public.site_questions
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.site_announcements TO anon, authenticated;
GRANT SELECT ON public.site_questions TO anon, authenticated;
GRANT ALL ON public.site_announcements TO service_role;
GRANT ALL ON public.site_questions TO service_role;

-- 데모/검증용 샘플 데이터. 이미 같은 slack key가 있으면 갱신합니다.
INSERT INTO public.site_announcements (
  label, title, text, time_ago, href, pinned, is_published, sort_order, slack_channel_id, slack_message_ts, updated_at
) VALUES
  (
    'urgent',
    'Supabase 연결 테스트 공지',
    '이 공지는 임시 Supabase site_announcements 테이블에서 읽어오는 검증용 데이터입니다.',
    '고정',
    '/announcements',
    true,
    true,
    10,
    'manual-seed',
    'announcement-20260522-001',
    now()
  ),
  (
    'guide',
    'Slack 공지 import 준비 중',
    '다음 단계에서는 Slack 공지 채널 데이터를 이 테이블로 import하고 사이트는 Supabase를 표시 소스로 사용합니다.',
    null,
    '/announcements',
    false,
    true,
    20,
    'manual-seed',
    'announcement-20260522-002',
    now() - interval '1 hour'
  )
ON CONFLICT (slack_channel_id, slack_message_ts) DO UPDATE SET
  label = EXCLUDED.label,
  title = EXCLUDED.title,
  text = EXCLUDED.text,
  time_ago = EXCLUDED.time_ago,
  href = EXCLUDED.href,
  pinned = EXCLUDED.pinned,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = EXCLUDED.updated_at;

INSERT INTO public.site_questions (
  status, type, title, text, author, team, topic_tags, relevance, time_ago, href, reactions, replies, hot, link_to_skill, is_published, sort_order, slack_channel_id, slack_message_ts, updated_at
) VALUES
  (
    'unresolved',
    'question',
    'Supabase 연결 후 질문 카드 테스트',
    '이 질문은 site_questions 테이블에서 읽어오는 검증용 데이터입니다.',
    '운영팀',
    0,
    '["supabase", "공지", "검증"]'::jsonb,
    95,
    '방금',
    '/discussions',
    '[{"emoji":"✅","count":1},{"emoji":"👀","count":2}]'::jsonb,
    '[]'::jsonb,
    true,
    false,
    true,
    10,
    'manual-seed',
    'question-20260522-001',
    now()
  )
ON CONFLICT (slack_channel_id, slack_message_ts) DO UPDATE SET
  status = EXCLUDED.status,
  type = EXCLUDED.type,
  title = EXCLUDED.title,
  text = EXCLUDED.text,
  author = EXCLUDED.author,
  team = EXCLUDED.team,
  topic_tags = EXCLUDED.topic_tags,
  relevance = EXCLUDED.relevance,
  time_ago = EXCLUDED.time_ago,
  href = EXCLUDED.href,
  reactions = EXCLUDED.reactions,
  replies = EXCLUDED.replies,
  hot = EXCLUDED.hot,
  link_to_skill = EXCLUDED.link_to_skill,
  is_published = EXCLUDED.is_published,
  sort_order = EXCLUDED.sort_order,
  updated_at = EXCLUDED.updated_at;

-- SQL Editor 결과 확인용.
SELECT 'site_announcements' AS table_name, count(*) AS published_rows
FROM public.site_announcements
WHERE is_published = true
UNION ALL
SELECT 'site_questions' AS table_name, count(*) AS published_rows
FROM public.site_questions
WHERE is_published = true;
