import Link from "next/link";
import { siteConfig } from "../_data/config";

type NavKey = "missions" | "teams" | "skills";

interface HeaderProps {
  active?: NavKey;
  breadcrumb?: string;
}

export function Header({ active, breadcrumb }: HeaderProps = {}) {
  const navClass = (key: NavKey) =>
    active === key
      ? "text-ink-900 font-medium"
      : "text-ink-500 hover:text-ink-900";

  return (
    <header className="bg-white border-b border-ink-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-3">
        <Link
          href="/missions"
          className="flex items-center gap-2 hover:opacity-80 shrink-0"
        >
          <span className="text-xl leading-none">🧽</span>
          <span className="font-semibold">스폰지클럽</span>
          {breadcrumb && (
            <>
              <span className="hidden sm:inline text-ink-300">/</span>
              <span className="hidden sm:inline text-ink-700">{breadcrumb}</span>
            </>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/missions" className={navClass("missions")}>
            주차별 미션
          </Link>
          <Link href="/teams" className={navClass("teams")}>
            과제 현황판
          </Link>
          <Link href="/skills" className={navClass("skills")}>
            스킬 &amp; 인사이트
          </Link>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://bit.ly/selfish_zoom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
            title="스폰지클럽 Zoom 바로가기"
          >
            <span aria-hidden="true">🎥</span>
            <span className="hidden sm:inline">스폰지 ZOOM</span>
            <span className="sm:hidden">Zoom</span>
            <span className="text-[10px]">↗</span>
          </a>
          <a
            href={siteConfig.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
            title="스폰지클럽 커뮤니티 바로가기"
          >
            <span aria-hidden="true">🧽</span>
            <span className="hidden sm:inline">이기적인 스폰지들</span>
            <span className="sm:hidden">Community</span>
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
}
