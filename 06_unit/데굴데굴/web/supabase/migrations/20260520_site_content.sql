-- 임시 Supabase용 사이트 콘텐츠 테이블.
-- 원본 커뮤니티 DB와 섞지 않고, 공지사항/질문 페이지 데이터만 별도 관리한다.

CREATE TABLE IF NOT EXISTS site_announcements (
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
  ON site_announcements(is_published, pinned DESC, sort_order, updated_at DESC);

CREATE TABLE IF NOT EXISTS site_questions (
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
  ON site_questions(is_published, sort_order, updated_at DESC);
