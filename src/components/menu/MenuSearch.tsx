"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import type { MenuSearchResult } from "@/data/menu-data";
import { useCart } from "@/context/CartContext";
import { searchMenuLocal } from "@/lib/menu-local-search";
import { MENU_MOODS, MENU_QUICK_CATEGORIES, MENU_QUICK_CATEGORIES_SECOND_ROW } from "@/lib/menu-moods";
import { cn } from "@/lib/utils";
import { SliceButton } from "@/components/ui/SliceButton";
import { SliceButtonLayers } from "@/components/ui/SliceButtonLayers";
import { gsap, useGSAP } from "@/lib/gsap";
import { HEADER_OFFSET } from "@/lib/scroll-constants";
import { scrollToY } from "@/lib/scroll-nav";

type MenuSearchProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 2L13.4 8.6L20 10L13.4 11.4L12 18L10.6 11.4L4 10L10.6 8.6L12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M19 14L19.8 17.2L23 18L19.8 18.8L19 22L18.2 18.8L15 18L18.2 17.2L19 14Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 19V5M12 5L6 11M12 5L18 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchResultRow({ result }: { result: MenuSearchResult }) {
  const { addItem } = useCart();
  const { item, categoryLabel } = result;

  return (
    <li className="menu-search-result">
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[0.62rem] font-bold tracking-[0.22em] text-green uppercase">
          {categoryLabel}
        </p>
        <p className="mt-1 font-sans text-[1.02rem] font-semibold leading-snug text-espresso">
          {item.name}
        </p>
        <p className="mt-1.5 font-sans text-xs tracking-wide text-muted">
          <span className="uppercase">{item.calories}</span>
          <span className="mx-2 text-line">·</span>
          <span className="font-display text-sm text-green">{item.price}</span>
        </p>
      </div>
      <SliceButton
        variant="orange"
        onClick={() => addItem(item)}
        className="shrink-0 px-4 py-2 text-[0.68rem] tracking-[0.12em] uppercase"
        data-cursor="hover"
      >
        Add
      </SliceButton>
    </li>
  );
}

export function MenuSearch({ query, onQueryChange }: MenuSearchProps) {
  const root = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef(false);
  const [activeMoodId, setActiveMoodId] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [sendPulse, setSendPulse] = useState(false);
  const sendPulseTimerRef = useRef<number | null>(null);

  const commitSearch = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    pendingScrollRef.current = true;
    setSubmittedQuery(trimmed);
  }, []);

  const triggerSendAnimation = useCallback(() => {
    setSendPulse(true);
    if (sendPulseTimerRef.current !== null) {
      window.clearTimeout(sendPulseTimerRef.current);
    }
    sendPulseTimerRef.current = window.setTimeout(() => {
      setSendPulse(false);
      sendPulseTimerRef.current = null;
    }, 820);
  }, []);

  useEffect(
    () => () => {
      if (sendPulseTimerRef.current !== null) {
        window.clearTimeout(sendPulseTimerRef.current);
      }
    },
    []
  );

  const hasDraft = query.trim().length > 0;
  const showResults =
    submittedQuery.trim().length > 0 &&
    query.trim() === submittedQuery.trim();

  const { results, summary } = useMemo(
    () => searchMenuLocal(submittedQuery),
    [submittedQuery]
  );

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    triggerSendAnimation();
    commitSearch(trimmed);
  }, [query, triggerSendAnimation, commitSearch]);

  const handleMood = useCallback(
    (mood: (typeof MENU_MOODS)[number]) => {
      setActiveMoodId(mood.id);
      onQueryChange(mood.label);
      commitSearch(mood.label);
    },
    [onQueryChange, commitSearch]
  );

  const handleCategory = useCallback(
    (term: string) => {
      setActiveMoodId(null);
      onQueryChange(term);
      commitSearch(term);
    },
    [onQueryChange, commitSearch]
  );

  const renderCategoryChip = (term: string) => (
    <button
      key={term}
      type="button"
      onClick={() => handleCategory(term)}
      className={cn(
        "menu-search-chip",
        query.toLowerCase() === term.toLowerCase() &&
          !activeMoodId &&
          "menu-search-chip--active"
      )}
      data-cursor="hover"
    >
      {term}
    </button>
  );

  const handleClear = useCallback(() => {
    onQueryChange("");
    setSubmittedQuery("");
    setActiveMoodId(null);
    inputRef.current?.focus();
  }, [onQueryChange]);

  useEffect(() => {
    if (!pendingScrollRef.current || !showResults) return;

    pendingScrollRef.current = false;
    const t = window.setTimeout(() => {
      const target = resultsRef.current;
      if (!target) return;
      const y =
        target.getBoundingClientRect().top +
        window.scrollY -
        HEADER_OFFSET -
        20;
      scrollToY(y, { duration: 0.9 });
    }, 120);

    return () => window.clearTimeout(t);
  }, [submittedQuery, showResults, results.length]);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced || !root.current) return;

      gsap.from(".menu-search-intro", {
        y: 28,
        opacity: 0,
        duration: 0.95,
        ease: "expo.out",
        stagger: 0.1,
        delay: 0.55,
      });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced || !showResults) return;

      gsap.fromTo(
        ".menu-search-result",
        { y: 8, opacity: 0.65 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "expo.out",
          stagger: 0.03,
          overwrite: "auto",
        }
      );
    },
    { scope: root, dependencies: [submittedQuery, results.length] }
  );

  return (
    <section
      ref={root}
      aria-label="Search the menu"
      className="menu-search-zone relative z-20"
    >
      <div className="container-tm">
        <div className="menu-search-shell">
          <div className="order-plinth-wrap menu-search-intro">
            <div className="order-plinth order-plinth--wide order-plinth--edge text-center">
              <span
                className="order-plinth-float order-plinth-float--a float-sticker-left"
                aria-hidden
              >
                Skip the queue
              </span>
              <span
                className="order-plinth-float order-plinth-float--b float-sticker-right"
                aria-hidden
              >
                Add to cart
              </span>
              <span
                className="order-plinth-orb order-plinth-orb--orange float-soft"
                aria-hidden
              />
              <span
                className="order-plinth-orb order-plinth-orb--green float-soft"
                aria-hidden
              />
              <div className="order-plinth__content relative z-10">
                <p className="eyebrow text-green">Order online</p>
                <p className="order-plinth__headline mt-8 font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.02] text-espresso">
                  Hate waiting?{" "}
                  <span className="italic text-orange">Order now.</span>
                </p>
                <p className="order-plinth__copy mx-auto mt-8 max-w-lg font-sans text-base leading-[1.75] text-muted md:text-lg">
                  Pick your favourites, add to cart — we&apos;ll have your order
                  ready.
                </p>
              </div>
            </div>
          </div>

          <div
            id="search"
            className="menu-search-inner menu-find-dish mx-auto max-w-2xl scroll-mt-28 md:scroll-mt-32"
          >
            <div className="menu-find-dish-head menu-search-intro text-center">
              <p className="menu-find-dish-eyebrow eyebrow text-green">Find a dish</p>
              <h2 className="menu-find-dish-title mt-5 font-display text-[clamp(1.85rem,4.2vw,2.65rem)] leading-[1.08] text-espresso">
                What are you <span className="italic text-orange">craving</span>?
              </h2>
              <p className="menu-find-dish-sub mx-auto mt-5 max-w-md font-sans text-[0.98rem] font-medium leading-relaxed md:text-[1.05rem]">
                Search by dish name, mood, or category — then add straight to
                your cart.
              </p>
            </div>

            <div className="menu-search-intro mt-12 md:mt-14">
            <div className="menu-search-prompt-wrap">
              <span
                className="menu-search-glow menu-search-glow--orange"
                aria-hidden
              />
              <span
                className="menu-search-glow menu-search-glow--green"
                aria-hidden
              />
              <span
                className="menu-search-glow menu-search-glow--halo"
                aria-hidden
              />
              <div className="menu-search-prompt">
                <form
                  className="menu-search-prompt-inner"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                <span className="menu-search-spark" aria-hidden>
                  <SparkleIcon className="text-green" />
                </span>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setActiveMoodId(null);
                    onQueryChange(e.target.value);
                  }}
                  placeholder="Describe a mood, craving, or dish…"
                  className="menu-search-input"
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                />
                <div className="menu-search-actions">
                {hasDraft ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="menu-search-clear"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="submit"
                  className={cn(
                    "menu-search-send",
                    sendPulse && "menu-search-send--pulse"
                  )}
                  aria-label="Search"
                  data-cursor="hover"
                >
                  <SliceButtonLayers />
                  <SendIcon />
                </button>
                </div>
                </form>
              </div>
            </div>
            </div>

            <div className="menu-search-intro mt-10 md:mt-12">
              <p className="mb-3 text-center font-sans text-[0.62rem] font-semibold tracking-[0.22em] text-green uppercase">
                Moods &amp; occasions
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {MENU_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => handleMood(mood)}
                    className={cn(
                      "menu-search-mood-chip",
                      activeMoodId === mood.id && "menu-search-mood-chip--active"
                    )}
                    data-cursor="hover"
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 md:mt-10">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <span className="w-full text-center font-sans text-[0.62rem] font-semibold tracking-[0.22em] text-muted uppercase sm:w-auto sm:mr-1">
                  Categories
                </span>
                {MENU_QUICK_CATEGORIES.map(renderCategoryChip)}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2.5">
                {MENU_QUICK_CATEGORIES_SECOND_ROW.map(renderCategoryChip)}
              </div>
            </div>
          </div>

          {showResults ? (
            <>
              <div
                className="menu-search-status menu-search-intro mt-10 md:mt-12"
                role="status"
                aria-live="polite"
              >
                {results.length > 0 ? (
                  <>
                    <p className="menu-search-status__title">
                      {results.length} dish{results.length === 1 ? "" : "es"}{" "}
                      found for &ldquo;{submittedQuery.trim()}&rdquo;
                    </p>
                    <p className="menu-search-status__hint">
                      Scroll down for results
                      <span className="menu-search-status__arrow" aria-hidden>
                        ↓
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="menu-search-status__title">
                    No matches for &ldquo;{submittedQuery.trim()}&rdquo;
                  </p>
                )}
              </div>

              <div
                ref={resultsRef}
                className="menu-search-results-wrap menu-search-intro mt-8 md:mt-10"
                role="region"
                aria-label="Search results"
              >
              <div className="menu-search-results-head">
                <p className="font-sans text-[0.65rem] font-bold tracking-[0.24em] text-green uppercase">
                  {results.length === 0 ? "No matches" : "Results"}
                </p>
                <p className="mt-2 font-display text-xl leading-snug text-espresso md:text-2xl">
                  {results.length === 0
                    ? `Nothing for “${submittedQuery.trim()}”`
                    : `${results.length} dish${results.length === 1 ? "" : "es"} for “${submittedQuery.trim()}”`}
                </p>
                {summary ? (
                  <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted md:text-base">
                    {summary}
                  </p>
                ) : null}
              </div>

              {results.length > 0 ? (
                <ul className="menu-search-results">
                  {results.map((result) => (
                    <SearchResultRow key={result.item.id} result={result} />
                  ))}
                </ul>
              ) : (
                <p className="mt-6 font-sans text-sm leading-relaxed text-muted">
                  Try a mood like{" "}
                  <button
                    type="button"
                    className="font-semibold text-orange underline-offset-2 hover:underline"
                    onClick={() =>
                      handleMood(MENU_MOODS.find((m) => m.id === "friends")!)
                    }
                  >
                    Friends gathering
                  </button>
                  , or a category above.
                </p>
              )}
              </div>
            </>
          ) : (
            <p className="menu-search-intro mt-16 text-center font-sans text-sm leading-relaxed text-muted md:mt-20">
              Or scroll down to browse all seven chapters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
