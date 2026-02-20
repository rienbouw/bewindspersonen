export interface Person {
  id: string;
  name: string;
  role: string;
  party: string;
}

export const persons: Person[] = [
  // D66 - Ministers
  { id: "rob-jetten", name: "Rob Jetten", role: "Minister-president, minister van Algemene Zaken", party: "D66" },
  { id: "sjoerd-sjoerdsma", name: "Sjoerd Sjoerdsma", role: "Minister van Buitenlandse Handel en Ontwikkelingssamenwerking", party: "D66" },
  { id: "elanor-boekholt-osullivan", name: "Elanor Boekholt-O'Sullivan", role: "Minister van Volkshuisvesting en Ruimtelijke Ordening", party: "D66" },
  { id: "rianne-letschert", name: "Rianne Letschert", role: "Minister van Onderwijs, Cultuur en Wetenschap", party: "D66" },
  { id: "stientje-van-veldhoven", name: "Stientje van Veldhoven", role: "Minister van Klimaat en Groene Groei", party: "D66" },
  { id: "hans-vijlbrief", name: "Hans Vijlbrief", role: "Minister van Sociale Zaken en Werkgelegenheid", party: "D66" },
  { id: "jaimi-van-essen", name: "Jaimi van Essen", role: "Minister van Landbouw, Visserij, Voedselzekerheid en Natuur", party: "D66" },

  // D66 - Staatssecretarissen
  { id: "claudia-van-bruggen", name: "Claudia van Bruggen", role: "Staatssecretaris van Justitie en Veiligheid", party: "D66" },
  { id: "willemijn-aerdts", name: "Willemijn Aerdts", role: "Staatssecretaris van Economische Zaken", party: "D66" },
  { id: "eelco-eerenberg", name: "Eelco Eerenberg", role: "Staatssecretaris van Financiën", party: "D66" },

  // VVD - Ministers
  { id: "dilan-yesilgoz", name: "Dilan Yesilgöz", role: "Vicepremier, minister van Defensie", party: "VVD" },
  { id: "eelco-heinen", name: "Eelco Heinen", role: "Minister van Financiën", party: "VVD" },
  { id: "david-van-weel", name: "David van Weel", role: "Minister van Justitie en Veiligheid", party: "VVD" },
  { id: "vincent-karremans", name: "Vincent Karremans", role: "Minister van Infrastructuur en Waterstaat", party: "VVD" },
  { id: "sophie-hermans", name: "Sophie Hermans", role: "Minister van Volksgezondheid", party: "VVD" },
  { id: "thierry-aartsen", name: "Thierry Aartsen", role: "Minister van Werk en Participatie", party: "VVD" },

  // VVD - Staatssecretarissen
  { id: "eric-van-der-burg", name: "Eric van der Burg", role: "Staatssecretaris van Binnenlandse Zaken en Koninkrijksrelaties", party: "VVD" },
  { id: "judith-tielen", name: "Judith Tielen", role: "Staatssecretaris van Onderwijs", party: "VVD" },
  { id: "silvio-erkens", name: "Silvio Erkens", role: "Staatssecretaris van Landbouw", party: "VVD" },

  // CDA - Ministers
  { id: "bart-van-den-brink", name: "Bart van den Brink", role: "Vicepremier, minister van Asiel en Migratie", party: "CDA" },
  { id: "tom-berendsen", name: "Tom Berendsen", role: "Minister van Buitenlandse Zaken", party: "CDA" },
  { id: "pieter-heerma", name: "Pieter Heerma", role: "Minister van Binnenlandse Zaken", party: "CDA" },
  { id: "heleen-herbert", name: "Heleen Herbert", role: "Minister van Economische Zaken en Klimaat", party: "CDA" },
  { id: "mirjam-sterk", name: "Mirjam Sterk", role: "Minister van Langdurige Zorg, Jeugd en Sport", party: "CDA" },

  // CDA - Staatssecretarissen
  { id: "derk-boswijk", name: "Derk Boswijk", role: "Staatssecretaris van Defensie", party: "CDA" },
  { id: "annet-bertram", name: "Annet Bertram", role: "Staatssecretaris van Infrastructuur en Waterstaat", party: "CDA" },
  { id: "jo-annes-de-bat", name: "Jo-Annes de Bat", role: "Staatssecretaris van Klimaat en Groene Groei", party: "CDA" },

  // Partijloos
  { id: "sandra-palmen", name: "Sandra Palmen", role: "Staatssecretaris Herstel en Toeslagen", party: "Partijloos" },
];
