import {
  MENU_CATEGORIES,
  getMenuSearchResults,
  type MenuSearchResult,
} from "@/data/menu-data";

const MOOD_KEYWORDS: Record<string, string[]> = {
  friends: ["platter", "combo", "family", "pack", "mix", "arabic"],
  "family feast": ["family", "combo", "pack", "platter"],
  spicy: ["spicy", "schezwan", "chilly", "hot", "kali mirchi", "65", "777"],
  "veg forward": ["veg"],
  "seafood night": ["prawn", "fish", "seafood", "king fish"],
  "light & fresh": ["salad", "soup", "caesar", "tomato", "corn"],
  "quick bite": ["fries", "65", "corn", "manchurian", "starter"],
};

function scoreItemForMood(
  item: MenuSearchResult["item"],
  categoryLabel: string,
  keywords: string[]
): number {
  const haystack =
    `${item.name} ${categoryLabel} ${item.tags.join(" ")}`.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) score += kw.length > 3 ? 2 : 1;
  }
  return score;
}

/** Local menu search — keywords, moods, and category matching. */
export function searchMenuLocal(query: string): {
  results: MenuSearchResult[];
  summary: string;
} {
  const q = query.trim().toLowerCase();
  if (!q) return { results: [], summary: "" };

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    if (q.includes(mood) || mood.includes(q)) {
      const scored: { result: MenuSearchResult; score: number }[] = [];
      for (const category of MENU_CATEGORIES) {
        for (const subsection of category.subsections) {
          for (const item of subsection.items) {
            const score = scoreItemForMood(item, category.category, keywords);
            if (score > 0) {
              scored.push({
                score,
                result: {
                  item,
                  categoryLabel: category.category,
                  categoryId: category.id,
                },
              });
            }
          }
        }
      }
      scored.sort((a, b) => b.score - a.score);
      return {
        results: scored.slice(0, 12).map((s) => s.result),
        summary: `Picked for a ${mood} — matched from our menu.`,
      };
    }
  }

  const results = getMenuSearchResults(query);
  return {
    results,
    summary:
      results.length > 0
        ? `Found ${results.length} dish${results.length === 1 ? "" : "es"} matching your search.`
        : "No exact matches — try a mood or category above.",
  };
}
