// thaiGlDictionary.js

const THAI_GL_WORD_BANK = [
  // ==========================================
  // 🏢 AGENCIAS / PRODUCTORAS
  // ==========================================
  {
    key: "gmmtv",
    label: "GMMTV",
    kind: "productora",
    relations: [
      "milk", "love", "view", "june", "namtan", "film", "ciize", "emi", "bonnie",
      "mim", "pahn", "fond", "jan", "jingjing", "mewnich",
      "23point5", "pluto", "girlsrules", "us", "ditto", "bakelovefeeling", "wishuponastar", "moonshadow", "enemieswithbenefits", "lovesechoes", "her",
      "milklove", "viewjune", "namtanfilm", "viewmim", "pahnfond", "janjingjing", "junemewnich"
    ],
  },
  {
    key: "idolfactory",
    label: "IdolFactory",
    kind: "productora",
    relations: [
      "freen", "becky", "lookmhee", "sonya", "fahn", "baimint",
      "gap", "theloyalpin", "affair", "mymarvellousdreamisyou",
      "freenbecky", "lmsy", "fahnbaimint"
    ],
  },
  {
    key: "grandtv",
    label: "GrandTV",
    kind: "productora",
    relations: [
      "engfa", "charlotte", "showmelove", "lovebully", "petrichor", "englot"
    ],
  },
  {
    key: "starhunter",
    label: "Star Hunter",
    kind: "productora",
    relations: [
      "anda", "lookkaew", "lovesenior", "remain", "andalookkaew"
    ],
  },
  {
    key: "ch3",
    label: "CH3 Thailand",
    kind: "productora",
    relations: [
      "lingling", "orm", "thesecretofus", "onlyyou", "inloveforever", "lingorm"
    ],
  },
  {
    key: "ninestar",
    label: "Nine Star Studios",
    kind: "productora",
    relations: [
      "faye", "yoko", "blank", "fayeyoko"
    ],
  },
  {
    key: "fabelentertainment",
    label: "Fabel Entertainment",
    kind: "productora",
    relations: [
      "faye", "atom", "brokenoflove", "fayeatom"
    ],
  },

  // ==========================================
  // 👩 ACTRICES (Principales y Secundarias)
  // ==========================================

  // EngLot Universe
  {
    key: "engfa",
    label: "Engfa Waraha",
    kind: "persona",
    relations: [
      "showmelove", "lovebully", "petrichor", "englot", "charlotte",
      "4elementsearth", "4elementsair", "unlimitedlove", "4elementswater", "grandtv"
    ],
  },
  {
    key: "charlotte",
    label: "Charlotte Austin",
    kind: "persona",
    relations: [
      "showmelove", "lovebully", "petrichor", "englot", "engfa",
      "4elementsair", "unlimitedlove", "4elementswater", "grandtv"
    ],
  },

  // FreenBecky Universe
  {
    key: "freen",
    label: "Freen Sarocha",
    kind: "persona",
    relations: [
      "gap", "theloyalpin", "uranus2324", "freenbecky", "becky", "noey",
      "4elementswater", "4elementsearth", "4elementsair", "idolfactory"
    ],
  },
  {
    key: "becky",
    label: "Becky Armstrong",
    kind: "persona",
    relations: [
      "gap", "theloyalpin", "uranus2324", "freenbecky", "freen", "irin", "4elementsair", "idolfactory"
    ],
  },
  {
    key: "noey",
    label: "Noey Natnicha",
    kind: "persona",
    relations: ["gap", "freen", "irin", "idolfactory"],
  },
  {
    key: "irin",
    label: "Irin Urassaya",
    kind: "persona",
    relations: ["gap", "becky", "noey", "idolfactory"],
  },

  // LingOrm Universe
  {
    key: "lingling",
    label: "Lingling Kwong",
    kind: "persona",
    relations: ["thesecretofus", "onlyyou", "inloveforever", "lingorm", "orm", "ch3"],
  },
  {
    key: "orm",
    label: "Orm Kornnaphat",
    kind: "persona",
    relations: ["thesecretofus", "onlyyou", "inloveforever", "lingorm", "lingling", "ch3"],
  },

  // FayeYoko / FayeAtom Universe
  {
    key: "faye",
    label: "Faye Peraya",
    kind: "persona",
    relations: ["blank", "fayeyoko", "yoko", "dangerousqueen", "ninestar", "atom", "fayeatom", "brokenoflove", "fabelentertainment"],
  },
  {
    key: "yoko",
    label: "Yoko Apasra",
    kind: "persona",
    relations: ["blank", "fayeyoko", "faye", "ninestar"],
  },
  {
    key: "atom",
    label: "Atom Pariya",
    kind: "persona",
    relations: ["faye", "fayeatom", "brokenoflove", "fabelentertainment"],
  },
  {
    key: "ice",
    label: "Ice Papichaya",
    kind: "persona",
    relations: ["blank", "marissa", "ninestar"],
  },
  {
    key: "marissa",
    label: "Marissa Lloyd",
    kind: "persona",
    relations: ["blank", "ice", "ninestar"],
  },

  // GMMTV Universe (MilkLove, ViewJune/ViewMim, NamtanFilm, etc)
  {
    key: "milk",
    label: "Milk Pansa",
    kind: "persona",
    relations: ["23point5", "girlsrules", "ditto", "milklove", "love", "view", "gmmtv"],
  },
  {
    key: "love",
    label: "Love Pattranite",
    kind: "persona",
    relations: ["23point5", "girlsrules", "ditto", "milklove", "milk", "june", "gmmtv"],
  },
  {
    key: "view",
    label: "View Benyapa",
    kind: "persona",
    relations: ["23point5", "girlsrules", "bakelovefeeling", "viewjune", "viewmim", "june", "mim", "milk", "gmmtv"],
  },
  {
    key: "june",
    label: "June Wanwimol",
    kind: "persona",
    relations: ["23point5", "lovesechoes", "viewjune", "junemewnich", "view", "mewnich", "love", "gmmtv"],
  },
  {
    key: "mim",
    label: "Mim Rattanawadee",
    kind: "persona",
    relations: ["bakelovefeeling", "viewmim", "view", "gmmtv"],
  },
  {
    key: "namtan",
    label: "Namtan Tipnaree",
    kind: "persona",
    relations: ["pluto", "girlsrules", "her", "namtanfilm", "film", "ciize", "gmmtv"],
  },
  {
    key: "film",
    label: "Film Rachanun",
    kind: "persona",
    relations: ["pluto", "girlsrules", "her", "namtanfilm", "namtan", "gmmtv"],
  },
  {
    key: "ciize",
    label: "Ciize Rutricha",
    kind: "persona",
    relations: ["23point5", "pluto", "namtan", "gmmtv"],
  },
  {
    key: "emi",
    label: "Emi Thasorn",
    kind: "persona",
    relations: ["us", "moonshadow", "bonnie", "girlsrules", "gmmtv"],
  },
  {
    key: "bonnie",
    label: "Bonnie Pussara",
    kind: "persona",
    relations: ["us", "moonshadow", "emi", "girlsrules", "gmmtv"],
  },
  {
    key: "pahn",
    label: "Pahn Patitta",
    kind: "persona",
    relations: ["wishuponastar", "pahnfond", "fond", "gmmtv"],
  },
  {
    key: "fond",
    label: "Fond Natticha",
    kind: "persona",
    relations: ["wishuponastar", "pahnfond", "pahn", "gmmtv"],
  },
  {
    key: "jan",
    label: "Jan Ployshampoo",
    kind: "persona",
    relations: ["enemieswithbenefits", "janjingjing", "jingjing", "gmmtv"],
  },
  {
    key: "jingjing",
    label: "Jingjing Yu",
    kind: "persona",
    relations: ["enemieswithbenefits", "janjingjing", "jan", "gmmtv"],
  },
  {
    key: "mewnich",
    label: "Mewnich Nannaphas",
    kind: "persona",
    relations: ["lovesechoes", "junemewnich", "june", "gmmtv"],
  },

  // LMSY Universe & IdolFactory Additional
  {
    key: "lookmhee",
    label: "Lookmhee Punyapat",
    kind: "persona",
    relations: ["affair", "harmonysecret", "lmsy", "sonya", "hometownromance", "idolfactory"],
  },
  {
    key: "sonya",
    label: "Sonya Saranphat",
    kind: "persona",
    relations: ["affair", "harmonysecret", "lmsy", "lookmhee", "hometownromance", "idolfactory"],
  },
  {
    key: "fahn",
    label: "Fahn Natchaya",
    kind: "persona",
    relations: ["mymarvellousdreamisyou", "fahnbaimint", "baimint", "idolfactory"],
  },
  {
    key: "baimint",
    label: "Baimint Kittiya",
    kind: "persona",
    relations: ["mymarvellousdreamisyou", "fahnbaimint", "fahn", "idolfactory"],
  },

  // Star Hunter Universe
  {
    key: "anda",
    label: "Anda Anunta",
    kind: "persona",
    relations: ["lovesenior", "remain", "andalookkaew", "lookkaew", "starhunter"],
  },
  {
    key: "lookkaew",
    label: "Lookkaew Kamollak",
    kind: "persona",
    relations: ["lovesenior", "remain", "andalookkaew", "anda", "starhunter"],
  },

  // Nuevas Actrices GL Independientes
  {
    key: "enjoy",
    label: "Enjoy Thidarat",
    kind: "persona",
    relations: ["loveonhire", "enjoyjune", "june_n"],
  },
  {
    key: "june_n",
    label: "June Nannirin",
    kind: "persona",
    relations: ["loveonhire", "enjoyjune", "enjoy"],
  },

  // ==========================================
  // 💖 SHIPS OFICIALES
  // ==========================================
  {
    key: "englot",
    label: "Englot",
    kind: "ship",
    relations: ["engfa", "charlotte", "showmelove", "lovebully", "petrichor", "grandtv"],
  },
  {
    key: "freenbecky",
    label: "FreenBecky",
    kind: "ship",
    relations: ["freen", "becky", "gap", "theloyalpin", "uranus2324", "idolfactory"],
  },
  {
    key: "lingorm",
    label: "LingOrm",
    kind: "ship",
    relations: ["lingling", "orm", "thesecretofus", "onlyyou", "inloveforever", "ch3"],
  },
  {
    key: "fayeyoko",
    label: "FayeYoko",
    kind: "ship",
    relations: ["faye", "yoko", "blank", "ninestar"],
  },
  {
    key: "fayeatom",
    label: "FayeAtom",
    kind: "ship",
    relations: ["faye", "atom", "brokenoflove", "fabelentertainment"],
  },
  {
    key: "milklove",
    label: "MilkLove",
    kind: "ship",
    relations: ["milk", "love", "23point5", "ditto", "girlsrules", "gmmtv"],
  },
  {
    key: "viewjune",
    label: "ViewJune",
    kind: "ship",
    relations: ["view", "june", "23point5", "gmmtv"],
  },
  {
    key: "viewmim",
    label: "ViewMim",
    kind: "ship",
    relations: ["view", "mim", "bakelovefeeling", "gmmtv"],
  },
  {
    key: "namtanfilm",
    label: "NamtanFilm",
    kind: "ship",
    relations: ["namtan", "film", "pluto", "her", "girlsrules", "gmmtv"],
  },
  {
    key: "pahnfond",
    label: "PahnFond",
    kind: "ship",
    relations: ["pahn", "fond", "wishuponastar", "gmmtv"],
  },
  {
    key: "janjingjing",
    label: "JanJingjing",
    kind: "ship",
    relations: ["jan", "jingjing", "enemieswithbenefits", "gmmtv"],
  },
  {
    key: "junemewnich",
    label: "JuneMewnich",
    kind: "ship",
    relations: ["june", "mewnich", "lovesechoes", "gmmtv"],
  },
  {
    key: "lmsy",
    label: "LMSY",
    kind: "ship",
    relations: ["lookmhee", "sonya", "affair", "harmonysecret", "hometownromance", "idolfactory"],
  },
  {
    key: "andalookkaew",
    label: "AndaLookkaew",
    kind: "ship",
    relations: ["anda", "lookkaew", "lovesenior", "remain", "starhunter"],
  },
  {
    key: "fahnbaimint",
    label: "FahnBaimint",
    kind: "ship",
    relations: ["fahn", "baimint", "mymarvellousdreamisyou", "idolfactory"],
  },
  {
    key: "enjoyjune",
    label: "EnjoyJune",
    kind: "ship",
    relations: ["enjoy", "june_n", "loveonhire"],
  },

  // ==========================================
  // 🎬 SERIES Y PROYECTOS GL
  // ==========================================
  {
    key: "gap",
    label: "GAP The Series",
    kind: "serie",
    relations: ["freen", "becky", "freenbecky", "noey", "irin", "idolfactory"],
  },
  {
    key: "theloyalpin",
    label: "The Loyal Pin",
    kind: "serie",
    relations: ["freen", "becky", "freenbecky", "idolfactory"],
  },
  {
    key: "uranus2324",
    label: "Uranus 2324",
    kind: "serie",
    relations: ["freen", "becky", "freenbecky"],
  },
  {
    key: "thesecretofus",
    label: "The Secret of Us",
    kind: "serie",
    relations: ["lingling", "orm", "lingorm", "ch3"],
  },
  {
    key: "onlyyou",
    label: "Only You",
    kind: "serie",
    relations: ["lingorm", "lingling", "orm", "ch3"],
  },
  {
    key: "inloveforever",
    label: "In Love Forever",
    kind: "serie",
    relations: ["lingorm", "lingling", "orm", "ch3"],
  },
  {
    key: "blank",
    label: "Blank The Series",
    kind: "serie",
    relations: ["faye", "yoko", "fayeyoko", "ice", "marissa", "ninestar"],
  },
  {
    key: "brokenoflove",
    label: "Broken of Love",
    kind: "serie",
    relations: ["faye", "atom", "fayeatom", "fabelentertainment"],
  },
  {
    key: "23point5",
    label: "23.5",
    kind: "serie",
    relations: ["milk", "love", "milklove", "view", "june", "viewjune", "ciize", "gmmtv"],
  },
  {
    key: "ditto",
    label: "Ditto",
    kind: "serie",
    relations: ["milk", "love", "milklove", "gmmtv"],
  },
  {
    key: "bakelovefeeling",
    label: "Bake Love Feeling",
    kind: "serie",
    relations: ["view", "mim", "viewmim", "gmmtv"],
  },
  {
    key: "wishuponastar",
    label: "Wish Upon a Star",
    kind: "serie",
    relations: ["pahn", "fond", "pahnfond", "gmmtv"],
  },
  {
    key: "enemieswithbenefits",
    label: "Enemies with Benefits",
    kind: "serie",
    relations: ["jan", "jingjing", "janjingjing", "gmmtv"],
  },
  {
    key: "lovesechoes",
    label: "Love's Echoes",
    kind: "serie",
    relations: ["june", "mewnich", "junemewnich", "gmmtv"],
  },
  {
    key: "her",
    label: "Her",
    kind: "serie",
    relations: ["namtan", "film", "namtanfilm", "gmmtv"],
  },
  {
    key: "pluto",
    label: "Pluto",
    kind: "serie",
    relations: ["namtan", "film", "namtanfilm", "ciize", "gmmtv"],
  },
  {
    key: "affair",
    label: "Affair",
    kind: "serie",
    relations: ["lookmhee", "sonya", "lmsy", "idolfactory"],
  },
  {
    key: "showmelove",
    label: "Show Me Love",
    kind: "serie",
    relations: ["engfa", "charlotte", "englot", "grandtv"],
  },
  {
    key: "lovebully",
    label: "Love Bully",
    kind: "serie",
    relations: ["engfa", "charlotte", "englot", "grandtv"],
  },
  {
    key: "petrichor",
    label: "Petrichor",
    kind: "serie",
    relations: ["engfa", "charlotte", "englot", "grandtv"],
  },
  {
    key: "harmonysecret",
    label: "Harmony Secret",
    kind: "serie",
    relations: ["lookmhee", "sonya", "lmsy", "hometownromance", "idolfactory"],
  },
  {
    key: "lovesenior",
    label: "Love Senior The Series",
    kind: "serie",
    relations: ["anda", "lookkaew", "andalookkaew", "starhunter"],
  },
  {
    key: "remain",
    label: "Remain",
    kind: "serie",
    relations: ["anda", "lookkaew", "andalookkaew", "starhunter"],
  },
  {
    key: "loveonhire",
    label: "Love on Hire",
    kind: "serie",
    relations: ["enjoy", "june_n", "enjoyjune"],
  },
  {
    key: "mymarvellousdreamisyou",
    label: "My Marvellous Dream Is You",
    kind: "serie",
    relations: ["fahn", "baimint", "fahnbaimint", "idolfactory"],
  },

  // Megaproyectos GMMTV
  {
    key: "girlsrules",
    label: "Girls Rules",
    kind: "serie",
    relations: ["milk", "love", "namtan", "film", "view", "emi", "bonnie", "gmmtv"],
  },
  { 
    key: "us", 
    label: "Us", 
    kind: "serie", 
    relations: ["emi", "bonnie", "moonshadow", "gmmtv"] 
  },
  {
    key: "moonshadow",
    label: "Moonshadow",
    kind: "serie",
    relations: ["emi", "bonnie", "us", "gmmtv"]
  },

  // Elementos y Proyectos Expandidos
  {
    key: "4elementsearth",
    label: "4 Elements: The Earth",
    kind: "serie",
    relations: ["engfa", "freen"],
  },
  {
    key: "4elementswater",
    label: "4 Elements: The Water",
    kind: "serie",
    relations: ["freen", "engfa", "charlotte"],
  },
  {
    key: "4elementsair",
    label: "4 Elements: The Air",
    kind: "serie",
    relations: ["becky", "engfa", "charlotte", "freen"],
  },
  {
    key: "unlimitedlove",
    label: "Unlimited Love",
    kind: "serie",
    relations: ["englot", "engfa", "charlotte", "grandtv"],
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
    relations: ["lookmhee", "sonya", "lmsy", "harmonysecret", "affair", "idolfactory"],
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

export function getDailyThaiGlWord({
  gameId = "juego_1",
  minLength = 3,
  maxLength = Infinity,
} = {}) {
  const candidates = getThaiGlWordBank().filter((entry) => {
    const length = entry.normalized.length;
    return length >= minLength && length <= maxLength;
  });

  const pool = candidates.length > 0 ? candidates : getThaiGlWordBank();
  
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  let seed = 0;
  const strToHash = gameId + dateString;
  for (let i = 0; i < strToHash.length; i++) {
    seed = Math.imul(31, seed) + strToHash.charCodeAt(i) | 0;
  }
  if (seed === 0) seed = 1;
  
  const x = Math.sin(seed) * 10000;
  const randomValue = Math.abs(x - Math.floor(x));
  
  const index = Math.floor(randomValue * pool.length);
  return pool[index];
}
