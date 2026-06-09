// thaiGlDictionary.js

const THAI_GL_WORD_BANK = [
  // ==========================================
  // 👩 ACTRICES (Principales y Secundarias)
  // ==========================================

  // EngLot Universe
  {
    key: "engfa",
    label: "Engfa Waraha",
    kind: "persona",
    relations: [
      "showmelove",
      "lovebully",
      "petrichor",
      "englot",
      "charlotte",
      "4elementsearth",
    ],
  },
  {
    key: "charlotte",
    label: "Charlotte Austin",
    kind: "persona",
    relations: ["showmelove", "lovebully", "petrichor", "englot", "engfa"],
  },

  // FreenBecky Universe
  {
    key: "freen",
    label: "Freen Sarocha",
    kind: "persona",
    relations: [
      "gap",
      "theloyalpin",
      "freenbecky",
      "becky",
      "noey",
      "4elementswater",
    ],
  },
  {
    key: "becky",
    label: "Becky Armstrong",
    kind: "persona",
    relations: ["gap", "theloyalpin", "freenbecky", "freen", "irin"],
  },
  {
    key: "noey",
    label: "Noey Natnicha",
    kind: "persona",
    relations: ["gap", "freen", "irin"],
  },
  {
    key: "irin",
    label: "Irin Urassaya",
    kind: "persona",
    relations: ["gap", "becky", "noey"],
  },

  // LingOrm Universe
  {
    key: "lingling",
    label: "Lingling Kwong",
    kind: "persona",
    relations: ["thesecretofus", "onlyyou", "lingorm", "orm"],
  },
  {
    key: "orm",
    label: "Orm Kornnaphat",
    kind: "persona",
    relations: ["thesecretofus", "onlyyou", "lingorm", "lingling"],
  },

  // FayeYoko Universe
  {
    key: "faye",
    label: "Faye Peraya",
    kind: "persona",
    relations: ["blank", "fayeyoko", "yoko", "dangerousqueen"],
  },
  {
    key: "yoko",
    label: "Yoko Apasra",
    kind: "persona",
    relations: ["blank", "fayeyoko", "faye"],
  },
  {
    key: "ice",
    label: "Ice Papichaya",
    kind: "persona",
    relations: ["blank", "marissa"],
  },
  {
    key: "marissa",
    label: "Marissa Lloyd",
    kind: "persona",
    relations: ["blank", "ice"],
  },

  // GMMTV: MilkLove, ViewJune & NamtanFilm
  {
    key: "milk",
    label: "Milk Pansa",
    kind: "persona",
    relations: ["23point5", "girlsrules", "milklove", "love", "view"],
  },
  {
    key: "love",
    label: "Love Pattranite",
    kind: "persona",
    relations: ["23point5", "girlsrules", "milklove", "milk", "june"],
  },
  {
    key: "view",
    label: "View Benyapa",
    kind: "persona",
    relations: ["23point5", "girlsrules", "viewjune", "june"],
  },
  {
    key: "june",
    label: "June Wanwimol",
    kind: "persona",
    relations: ["23point5", "viewjune", "view"],
  },
  {
    key: "namtan",
    label: "Namtan Tipnaree",
    kind: "persona",
    relations: ["pluto", "girlsrules", "namtanfilm", "film", "ciize"],
  },
  {
    key: "film",
    label: "Film Rachanun",
    kind: "persona",
    relations: ["pluto", "girlsrules", "namtanfilm", "namtan"],
  },
  {
    key: "ciize",
    label: "Ciize Rutricha",
    kind: "persona",
    relations: ["23point5", "pluto", "namtan"],
  },
  {
    key: "emi",
    label: "Emi Thasorn",
    kind: "persona",
    relations: ["us", "bonnie"],
  },
  {
    key: "bonnie",
    label: "Bonnie Pussara",
    kind: "persona",
    relations: ["us", "emi"],
  },

  // LMSY Universe
  {
    key: "lookmhee",
    label: "Lookmhee Punyapat",
    kind: "persona",
    relations: ["affair", "harmonysecret", "lmsy", "sonya"],
  },
  {
    key: "sonya",
    label: "Sonya Saranphat",
    kind: "persona",
    relations: ["affair", "harmonysecret", "lmsy", "lookmhee"],
  },

  // ==========================================
  // 💖 SHIPS OFICIALES
  // ==========================================
  {
    key: "englot",
    label: "Englot",
    kind: "ship",
    relations: ["engfa", "charlotte", "showmelove", "lovebully", "petrichor"],
  },
  {
    key: "freenbecky",
    label: "FreenBecky",
    kind: "ship",
    relations: ["freen", "becky", "gap", "theloyalpin"],
  },
  {
    key: "lingorm",
    label: "LingOrm",
    kind: "ship",
    relations: ["lingling", "orm", "thesecretofus", "onlyyou"],
  },
  {
    key: "fayeyoko",
    label: "FayeYoko",
    kind: "ship",
    relations: ["faye", "yoko", "blank"],
  },
  {
    key: "milklove",
    label: "MilkLove",
    kind: "ship",
    relations: ["milk", "love", "23point5", "girlsrules"],
  },
  {
    key: "viewjune",
    label: "ViewJune",
    kind: "ship",
    relations: ["view", "june", "23point5"],
  },
  {
    key: "namtanfilm",
    label: "NamtanFilm",
    kind: "ship",
    relations: ["namtan", "film", "pluto", "girlsrules"],
  },
  {
    key: "lmsy",
    label: "LMSY",
    kind: "ship",
    relations: ["lookmhee", "sonya", "affair", "harmonysecret"],
  },

  // ==========================================
  // 🎬 SERIES Y PROYECTOS GL
  // ==========================================
  {
    key: "gap",
    label: "GAP The Series",
    kind: "serie",
    relations: ["freen", "becky", "freenbecky", "noey", "irin"],
  },
  {
    key: "theloyalpin",
    label: "The Loyal Pin",
    kind: "serie",
    relations: ["freen", "becky", "freenbecky"],
  },
  {
    key: "thesecretofus",
    label: "The Secret of Us",
    kind: "serie",
    relations: ["lingling", "orm", "lingorm"],
  },
  {
    key: "blank",
    label: "Blank The Series",
    kind: "serie",
    relations: ["faye", "yoko", "fayeyoko", "ice", "marissa"],
  },
  {
    key: "23point5",
    label: "23.5",
    kind: "serie",
    relations: ["milk", "love", "milklove", "view", "june", "ciize"],
  },
  {
    key: "affair",
    label: "Affair",
    kind: "serie",
    relations: ["lookmhee", "sonya", "lmsy"],
  },
  {
    key: "pluto",
    label: "Pluto",
    kind: "serie",
    relations: ["namtan", "film", "namtanfilm", "ciize"],
  },
  {
    key: "showmelove",
    label: "Show Me Love",
    kind: "serie",
    relations: ["engfa", "charlotte", "englot"],
  },
  {
    key: "lovebully",
    label: "Love Bully",
    kind: "serie",
    relations: ["engfa", "charlotte", "englot"],
  },
  {
    key: "petrichor",
    label: "Petrichor",
    kind: "serie",
    relations: ["engfa", "charlotte", "englot"],
  },
  {
    key: "harmonysecret",
    label: "Harmony Secret",
    kind: "serie",
    relations: ["lookmhee", "sonya", "lmsy"],
  },

  // Megaproyectos GMMTV
  {
    key: "girlsrules",
    label: "Girls Rules",
    kind: "serie",
    relations: ["milk", "love", "namtan", "film", "view"],
  },
  { key: "us", label: "Us", kind: "serie", relations: ["emi", "bonnie"] },

  // Elementos y Proyectos Expandidos
  {
    key: "4elementsearth",
    label: "4 Elements: The Earth",
    kind: "serie",
    relations: ["engfa"],
  },
  {
    key: "4elementswater",
    label: "4 Elements: The Water",
    kind: "serie",
    relations: ["freen"],
  },
  {
    key: "4elementsair",
    label: "4 Elements: The Air",
    kind: "serie",
    relations: ["lingling"],
  }, // Agregado al algoritmo cruzado
  {
    key: "unlimitedlove",
    label: "Unlimited Love",
    kind: "serie",
    relations: ["englot", "freenbecky"],
  }, // Proyecto que une fandoms
  {
    key: "brokenoflove",
    label: "Broken of Love",
    kind: "serie",
    relations: ["lmsy", "lookmhee"],
  },
  {
    key: "onlyyou",
    label: "Only You",
    kind: "serie",
    relations: ["lingorm", "lingling", "orm"],
  },
  {
    key: "dangerousqueen",
    label: "Dangerous Queen",
    kind: "serie",
    relations: ["faye", "fayeyoko"],
  },
  {
    key: "hometownromance",
    label: "Hometown Romance",
    kind: "serie",
    relations: ["viewjune", "view", "june"],
  },
];

export function normalizeWord(value) {
  return `${value}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function getThaiGlWordBank() {
  return THAI_GL_WORD_BANK.map((entry) => ({
    ...entry,
    normalized: normalizeWord(entry.key),
  })).filter((entry) => entry.normalized.length > 0);
}

export function getRandomThaiGlWord({
  minLength = 3,
  maxLength = Infinity,
} = {}) {
  const candidates = getThaiGlWordBank().filter((entry) => {
    const length = entry.normalized.length;
    return length >= minLength && length <= maxLength;
  });

  const pool = candidates.length > 0 ? candidates : getThaiGlWordBank();
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function findThaiGlWordByNormalized(value) {
  const normalized = normalizeWord(value);
  return (
    getThaiGlWordBank().find((entry) => entry.normalized === normalized) || null
  );
}
