import type { Project } from "@/lib/data";

/**
 * Illustrated website mockups for the sample concepts (no stock photos needed).
 * Each is taller than its frame so it can "scroll" on hover.
 */
export default function ProjectPreview({ kind }: { kind: Project["preview"] }) {
  if (kind === "restaurant") {
    return (
      <div className="h-[170%] w-full bg-[#fbf6ef] p-4">
        <div className="flex items-center justify-between">
          <span className="h-2.5 w-14 rounded bg-[#3b2416]" />
          <span className="flex gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-6 rounded bg-[#3b2416]/30" />)}</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="space-y-2 pt-3">
            <span className="block h-3.5 w-[90%] rounded bg-[#3b2416]" />
            <span className="block h-3.5 w-[70%] rounded bg-[#3b2416]" />
            <span className="block h-1.5 w-[85%] rounded bg-[#3b2416]/30" />
            <span className="block h-1.5 w-[60%] rounded bg-[#3b2416]/30" />
            <span className="mt-3 block h-5 w-20 rounded-full bg-[#c8642b]" />
          </div>
          <div className="aspect-square rounded-2xl bg-[radial-gradient(circle_at_40%_40%,#f0b77a,#c8642b_55%,#6b3418)]">
            <div className="m-[22%] aspect-square rounded-full border-4 border-[#fbf6ef]/70 bg-[#3b2416]/40" />
          </div>
        </div>
        <span className="mt-6 block h-2.5 w-24 rounded bg-[#3b2416]" />
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {["#e8c39e", "#d99a6c", "#b5714a", "#f1d2b0", "#c88a5e", "#9c5a37"].map((c) => (
            <div key={c} className="rounded-xl bg-white p-2 shadow-sm">
              <div className="aspect-[4/3] rounded-lg" style={{ background: c }} />
              <span className="mt-2 block h-1.5 w-[80%] rounded bg-[#3b2416]/50" />
              <span className="mt-1 block h-1.5 w-[40%] rounded bg-[#c8642b]/70" />
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-[#3b2416] p-4">
          <span className="block h-2.5 w-28 rounded bg-[#fbf6ef]" />
          <div className="mt-3 grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-6 rounded-md bg-[#fbf6ef]/15" />)}</div>
          <span className="mt-3 block h-6 w-24 rounded-full bg-[#c8642b]" />
        </div>
      </div>
    );
  }

  if (kind === "dashboard") {
    return (
      <div className="flex h-[170%] w-full bg-[#0d1330]">
        <div className="w-[22%] space-y-2 border-r border-white/5 p-3">
          <span className="block h-3 w-3 rounded bg-gradient-to-br from-sky to-violet" />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`block h-2 rounded ${i === 1 ? "bg-electric" : "bg-white/10"}`} />
          ))}
        </div>
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between">
            <span className="h-2.5 w-20 rounded bg-white/80" />
            <span className="h-5 w-5 rounded-full bg-violet/70" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["To do", "Doing", "Done"].map((col, ci) => (
              <div key={col} className="space-y-2 rounded-lg bg-white/[0.04] p-2">
                <span className="block h-1.5 w-10 rounded bg-white/40" />
                {Array.from({ length: 4 - ci }).map((_, i) => (
                  <div key={i} className="space-y-1.5 rounded-md bg-white/[0.07] p-2">
                    <span className="block h-1.5 w-[85%] rounded bg-white/50" />
                    <span className="block h-1.5 w-[50%] rounded bg-white/20" />
                    <span className={`block h-1 w-6 rounded ${["bg-sky", "bg-violet", "bg-emerald-400"][ci]}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-white/[0.04] p-3">
            <span className="block h-1.5 w-16 rounded bg-white/40" />
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {[40, 65, 30, 80, 55, 90, 70, 45, 85, 60].map((h, i) => (
                <span key={i} className="flex-1 rounded-t bg-gradient-to-t from-electric to-violet" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[170%] w-full bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="h-2.5 w-16 rounded bg-[#123c3a]" />
        <span className="h-5 w-16 rounded-full bg-[#1f8a70]" />
      </div>
      <div className="mt-3 rounded-2xl bg-[linear-gradient(135deg,#bfe3d4,#7cc3a8_50%,#1f8a70)] p-4">
        <span className="block h-3.5 w-[60%] rounded bg-white" />
        <div className="mt-3 flex gap-1.5 rounded-xl bg-white p-1.5">
          <span className="h-5 flex-1 rounded-md bg-[#123c3a]/10" />
          <span className="h-5 w-12 rounded-md bg-[#123c3a]/10" />
          <span className="h-5 w-10 rounded-md bg-[#1f8a70]" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-[#123c3a]/10">
            <div className="relative aspect-[4/3] bg-[linear-gradient(160deg,#dbeee6,#a9d6c3)]">
              <div className="absolute bottom-0 left-1/2 h-[55%] w-[55%] -translate-x-1/2 bg-[#f6f3ea]" style={{ clipPath: "polygon(50% 0,100% 40%,100% 100%,0 100%,0 40%)" }} />
            </div>
            <div className="space-y-1 p-2">
              <span className="block h-1.5 w-[70%] rounded bg-[#123c3a]/60" />
              <span className="block h-1.5 w-[40%] rounded bg-[#1f8a70]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
