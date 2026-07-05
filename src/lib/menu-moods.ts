export const MENU_MOODS = [
  {
    id: "friends",
    label: "Friends gathering",
    prompt: "Friends gathering",
  },
  {
    id: "family",
    label: "Family feast",
    prompt: "Family feast",
  },
  {
    id: "spicy",
    label: "Something spicy",
    prompt: "Something spicy",
  },
  {
    id: "veg",
    label: "Veg forward",
    prompt: "Veg forward",
  },
  {
    id: "seafood",
    label: "Seafood night",
    prompt: "Seafood night",
  },
  {
    id: "light",
    label: "Light & fresh",
    prompt: "Light & fresh",
  },
  {
    id: "quick",
    label: "Quick bite",
    prompt: "Quick bite",
  },
] as const;

export const MENU_QUICK_CATEGORIES = [
  "Biryani",
  "Curries",
  "Tandoori",
  "Family",
] as const;

export const MENU_QUICK_CATEGORIES_SECOND_ROW = [
  "Soups",
  "Salad",
  "Chinese",
] as const;

export type MenuMoodId = (typeof MENU_MOODS)[number]["id"];
