export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  calories: string;
  tags: string[];
  image: string;
  needsReview?: boolean;
};

export type MenuSubsection = {
  id: string;
  title: string;
  items: MenuItem[];
};

export type MenuCategory = {
  id: string;
  category: string;
  subsections: MenuSubsection[];
};

function dish(
  id: string,
  name: string,
  price: number,
  cal: number,
  tags: string[] = []
): MenuItem {
  return {
    id,
    name,
    description: "",
    price: `${price} SR`,
    calories: `CAL: ${cal}`,
    tags,
    image: "",
  };
}

/** Full menu — prices and calories per restaurant list (SR). */
export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "biryani",
    category: "Biryani Menu",
    subsections: [
      {
        id: "biryani-all",
        title: "Biryani",
        items: [
          dish("bir-1", "Hyderabadi Chicken Biryani (Single)", 23, 580),
          dish("bir-2", "Hyderabadi Mutton Biryani (Single)", 40, 650),
          dish("bir-3", "Hyderabadi Chicken Biryani (Full)", 35, 720),
          dish("bir-4", "Karachi Mutton Biryani (Single)", 32, 550),
          dish("bir-5", "Karachi Chicken Biryani (Single)", 23, 495),
          dish("bir-6", "Karachi Mutton Biryani (Full)", 40, 690),
          dish("bir-7", "Karachi Chicken Biryani (Full)", 35, 645),
          dish("bir-8", "Special Mutton Zaffrani Biryani (Full)", 45, 790),
        ],
      },
    ],
  },
  {
    id: "mutton-curries",
    category: "Curries",
    subsections: [
      {
        id: "mutton-all",
        title: "Curries",
        items: [
          dish("mtc-1", "Mutton Rogan Josh", 37, 379),
          dish("mtc-2", "Palak Gosht", 37, 331),
          dish("mtc-3", "Mutton Kali Mirchi", 37, 442),
          dish("mtc-4", "Mutton Bhuna Gosht", 37, 395),
          dish("mtc-5", "Mutton Kofta", 37, 420),
          dish("mtc-6", "Tawa Mutton", 37, 370),
          dish("mtc-7", "Mutton Kheema Masala", 35, 399),
          dish("mtc-8", "Mutton Kadai", 37, 412),
        ],
      },
    ],
  },
  {
    id: "tandoor",
    category: "Tandoor / Grill",
    subsections: [
      {
        id: "tandoor-all",
        title: "Tandoor / Grill",
        items: [
          dish("tg-1", "Tandoori Chicken (Full)", 44, 280),
          dish("tg-2", "Chicken Tikka Boti", 24, 179),
          dish("tg-3", "Grilled Chicken (Half)", 22, 284),
          dish("tg-4", "Chicken Reshmi Kebab", 24, 180),
          dish("tg-5", "Grilled Chicken (Full)", 44, 568),
          dish("tg-6", "Pathar Ka Gosht", 40, 235),
          dish("tg-7", "Chicken Malai Boti", 24, 188),
          dish("tg-8", "Mutton Seekh Kebab", 30, 245),
          dish("tig-1", "Fish Tikka", 40, 212),
          dish("tig-2", "Teri Meri Mix Platter (Medium)", 110, 512),
          dish("tig-3", "Tandoori Prawns", 45, 245),
          dish("tig-4", "Teri Meri Mix Platter (Full Combo)", 190, 940),
          dish("tig-5", "Grilled King Fish", 35, 320),
          dish("tig-6", "Teri Meri Mix Arabic Kebab Platter", 110, 555),
          dish("tig-7", "Grilled Prawns", 45, 310),
          dish("tig-8", "Teri Meri Mix Arabic Platter (Large)", 190, 995),
        ],
      },
    ],
  },
  {
    id: "biryani-family",
    category: "Family / Party Biryani Pack",
    subsections: [
      {
        id: "biryani-family-all",
        title: "Family & Party",
        items: [
          dish("bf-1", "Hyderabadi Chicken Biryani (Family)", 80, 1950),
          dish("bf-2", "Hyderabadi Mutton Biryani (Family)", 99, 2200),
          dish("bf-3", "Karachi Chicken Biryani (Family)", 80, 1850),
          dish("bf-4", "Karachi Mutton Biryani (Family)", 99, 2150),
          dish("bf-5", "Teri Meri Spl Chicken Combo Pack", 120, 3250),
          dish("bf-6", "Teri Meri Spl Mutton Combo Pack", 159, 3600),
        ],
      },
    ],
  },
  {
    id: "soups",
    category: "Soups",
    subsections: [
      {
        id: "soups-all",
        title: "Soups",
        items: [
          dish("soup-1", "Hot n Sour Vegetable", 14, 142, ["Veg"]),
          dish("soup-2", "Chicken Manchow", 16, 184),
          dish("soup-3", "Manchow Vegetable", 14, 132, ["Veg"]),
          dish("soup-4", "Sweet Corn Chicken", 16, 145),
          dish("soup-5", "Sweet Corn Vegetable", 14, 109, ["Veg"]),
          dish("soup-6", "Dragon Chicken Soup", 16, 152),
          dish("soup-7", "Tomato Soup With Croutons", 14, 103),
          dish("soup-8", "Hot n Sour Seafood", 20, 195),
        ],
      },
    ],
  },
  {
    id: "appetizers-salad",
    category: "Appetizers & Salad",
    subsections: [
      {
        id: "appetizers",
        title: "Appetizers",
        items: [
          dish("app-1", "French Fries", 11, 397),
          dish("app-2", "Garlic 65", 20, 219),
          dish("app-3", "Crispy Corn", 18, 339),
          dish("app-4", "Gobi Manchurian", 20, 310),
          dish("app-5", "Veg Manchurian", 20, 290, ["Veg"]),
          dish("app-6", "Golden Fried Prawns", 32, 515),
        ],
      },
      {
        id: "salads",
        title: "Salad",
        items: [
          dish("sal-1", "Caesar Salad", 16, 190),
          dish("sal-2", "Russian Salad", 18, 260),
        ],
      },
    ],
  },
  {
    id: "chinese",
    category: "Chinese Menu",
    subsections: [
      {
        id: "chinese-starters",
        title: "Starters",
        items: [
          dish("cc-1", "Chicken Manchurian", 30, 310),
          dish("cc-2", "Crunchy Chicken", 30, 375),
          dish("cc-3", "Chilly Chicken", 30, 290),
          dish("cc-4", "Garlic Chicken", 30, 330),
          dish("cc-5", "Chicken 65", 30, 350),
          dish("cc-6", "Chicken 777", 30, 370),
          dish("cc-7", "Chicken Majestic", 30, 320),
          dish("cc-8", "Spicy Fried Chicken", 30, 385),
        ],
      },
      {
        id: "chinese-noodles",
        title: "Noodles",
        items: [
          dish("cn-1", "Veg Soft Noodles", 22, 219, ["Veg"]),
          dish("cn-2", "Chicken Soft Noodles", 27, 310),
          dish("cn-3", "Veg Schezwan Noodles", 22, 270, ["Veg"]),
          dish("cn-4", "Schezwan Chicken Noodles", 27, 345),
          dish("cn-5", "Veg Hakka Noodles", 22, 240, ["Veg"]),
          dish("cn-6", "Spiced Mixed Meat Noodles", 32, 395),
          dish("cn-7", "Veg Singapore Noodles", 22, 255, ["Veg"]),
          dish("cn-8", "Chinese Chopsuey", 30, 355),
        ],
      },
      {
        id: "chinese-fried-rice",
        title: "Fried Rice",
        items: [
          dish("cfr-1", "Veg Fried Rice", 22, 260, ["Veg"]),
          dish("cfr-2", "Chicken Fried Rice", 27, 357),
          dish("cfr-3", "Veg Schezwan Fried Rice", 22, 305, ["Veg"]),
          dish("cfr-4", "Schezwan Chicken Fried Rice", 28, 399),
          dish("cfr-5", "Egg Fried Rice", 22, 295),
          dish("cfr-6", "Burnt Garlic Chicken Fried Rice", 28, 375),
          dish("cfr-7", "Schezwan Egg Fried Rice", 22, 340),
          dish("cfr-8", "Spiced Mixed Meat Fried Rice", 32, 435),
        ],
      },
    ],
  },
];

export const MENU_NAV = MENU_CATEGORIES.map((c, i) => ({
  id: c.id,
  label: c.category,
  chapter: String(i + 1).padStart(2, "0"),
}));

/** Category nav: first row count (remaining items go on the second row). */
export const MENU_NAV_PRIMARY_COUNT = 4;

export const ALL_MENU_ITEMS: MenuItem[] = MENU_CATEGORIES.flatMap((c) =>
  c.subsections.flatMap((s) => s.items)
);

/** Filter menu by dish name, category, or subsection title. */
export function filterMenuByQuery(query: string): MenuCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return MENU_CATEGORIES;

  return MENU_CATEGORIES.map((category) => ({
    ...category,
    subsections: category.subsections
      .map((subsection) => ({
        ...subsection,
        items: subsection.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            category.category.toLowerCase().includes(q) ||
            subsection.title.toLowerCase().includes(q)
        ),
      }))
      .filter((subsection) => subsection.items.length > 0),
  })).filter((category) => category.subsections.length > 0);
}

/** Full category list with items filtered — keeps empty sections for scroll targets. */
export function getMenuDisplayCategories(query: string): MenuCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return MENU_CATEGORIES;

  const matched = filterMenuByQuery(query);
  return MENU_CATEGORIES.map((category) => {
    const hit = matched.find((c) => c.id === category.id);
    if (hit) return hit;
    return {
      ...category,
      subsections: category.subsections.map((subsection) => ({
        ...subsection,
        items: [],
      })),
    };
  });
}

export function countMenuItems(categories: MenuCategory[]): number {
  return categories.reduce(
    (total, category) =>
      total +
      category.subsections.reduce(
        (subTotal, subsection) => subTotal + subsection.items.length,
        0
      ),
    0
  );
}

export type MenuSearchResult = {
  item: MenuItem;
  categoryLabel: string;
  categoryId: string;
};

/** Flat search hits with category context — for inline results panel. */
export function getMenuSearchResults(query: string): MenuSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: MenuSearchResult[] = [];
  for (const category of MENU_CATEGORIES) {
    for (const subsection of category.subsections) {
      for (const item of subsection.items) {
        if (
          item.name.toLowerCase().includes(q) ||
          category.category.toLowerCase().includes(q) ||
          subsection.title.toLowerCase().includes(q)
        ) {
          results.push({
            item,
            categoryLabel: category.category,
            categoryId: category.id,
          });
        }
      }
    }
  }
  return results;
}
