import { useEffect, useState, type MutableRefObject } from "react";

export function usePinnedProgress(ref: MutableRefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setProgress(1);
      return;
    }

    let raf = 0;
    let last = -1;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.1;
      const end = r.height - vh * 0.78;
      const traveled = start - r.top;
      const p = end > 0 ? traveled / end : 0;
      const clamped = Math.min(1, Math.max(0, p));
      if (Math.abs(clamped - last) < 0.003) return;
      last = clamped;
      setProgress(clamped);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}

const DEFAULT_CUTS = [0.32, 0.58] as const;

export function usePinnedPhase(
  ref: MutableRefObject<HTMLElement | null>,
  cuts: readonly number[] = DEFAULT_CUTS,
) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase(cuts.length);
      return;
    }

    let raf = 0;
    const update = () => {
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.12;
      const end = r.height - vh * 0.72;
      const traveled = start - r.top;
      const p = end > 0 ? traveled / end : 0;
      const clamped = Math.min(1, Math.max(0, p));
      let next = 0;
      for (let i = 0; i < cuts.length; i += 1) {
        if (clamped >= cuts[i]) next = i + 1;
      }
      setPhase((cur) => (cur === next ? cur : next));
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, cuts]);

  return phase;
}

export function useScrollSpy(refs: MutableRefObject<Array<HTMLElement | null>>, line = 0.38) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const y = window.innerHeight * line;
      let best = 0;
      let bestDist = Infinity;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < 72 || r.top > window.innerHeight - 48) return;
        const anchor = r.top + Math.min(52, r.height * 0.32);
        const dist = Math.abs(anchor - y);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      });
      setActive((cur) => (cur === best ? cur : best));
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [refs, line]);

  return [active, setActive] as const;
}
