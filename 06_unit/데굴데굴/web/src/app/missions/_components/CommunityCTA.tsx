import { siteConfig } from "../_data/config";

export function CommunityCTA() {
  return (
    <a
      href={siteConfig.communityUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl bg-gradient-to-br from-ink-900 to-ink-700 text-white p-6 hover:shadow-lg transition relative overflow-hidden"
    >
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-sponge-500/30 blur-3xl" />
      <div className="absolute -left-10 -bottom-16 w-56 h-56 rounded-full bg-sponge-300/20 blur-3xl" />
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-sponge-300 text-xs font-semibold tracking-wider uppercase">
            커뮤니티 · 활동 공간
          </div>
          <h3 className="mt-1 text-2xl font-bold">🧽 이기적인 스폰지들</h3>
          <p className="mt-2 text-sm text-ink-100/80 max-w-xl">
            활동 랭킹과 공유회 신청은 여기서. 멤버들의 활동·인정의 표시가 한곳에
            모입니다.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="text-center">
            <div className="text-2xl">🏆</div>
            <div className="text-[11px] text-ink-100/70 mt-1">활동 랭킹</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🎙️</div>
            <div className="text-[11px] text-ink-100/70 mt-1">공유회</div>
          </div>
          <span className="text-sponge-300 text-2xl ml-2">↗</span>
        </div>
      </div>
    </a>
  );
}
