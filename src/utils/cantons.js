const IATA_TO_CANTON = {
  ACH: { code: "SG", name: "St-Gall" },
  BRN: { code: "BE", name: "Berne" },
  BXO: { code: "NW", name: "Nidwald" },
  EML: { code: "LU", name: "Lucerne" },
  GVA: { code: "GE", name: "Geneve" },
  LUG: { code: "TI", name: "Tessin" },
  QLS: { code: "VD", name: "Vaud" },
  QNC: { code: "NE", name: "Neuchatel" },
  QYW: { code: "GL", name: "Glaris" },
  SIR: { code: "VS", name: "Valais" },
  SMV: { code: "GR", name: "Grisons" },
  VIP: { code: "VD", name: "Vaud" },
  ZHI: { code: "SO", name: "Soleure" },
  ZHV: { code: "NE", name: "Neuchatel" },
  ZJI: { code: "TI", name: "Tessin" },
  ZLJ: { code: "VD", name: "Vaud" },
  ZRH: { code: "ZH", name: "Zurich" },
};

// Charge les drapeaux cantonaux à la compilation (mapping code -> URL d'asset).
const cantonFlagFiles = import.meta.glob("../assets/cantons/*", {
  eager: true,
  import: "default",
});

// Relie les codes cantonaux aux URLs des drapeaux correspondants, en extrayant le code à partir du nom de fichier.
// ex: "../assets/cantons/VD.png" -> "VD" -> { code: "VD", name: "Vaud" }
const CANTON_CODE_TO_FLAG_SRC = Object.fromEntries(
  Object.entries(cantonFlagFiles).map(([path, src]) => {
    const fileName = path.split("/").pop() ?? "";
    const code = fileName.split(".")[0].toUpperCase();
    return [code, src];
  }),
);

// Retourne l'objet canton correspondant à l'aéroport donné, ou null si l'aéroport est invalide ou n'est pas associé à un canton.
// ex: pour l'aéroport de Genève (GVA) -> { code: "GE", name: "Geneve" }
export function getCantonFromAirport(airport) {
  const iata = String(airport?.iata_code ?? "").trim().toUpperCase();
  return IATA_TO_CANTON[iata] ?? null;
}

// Retourne l'URL de l'image du drapeau cantonal correspondant au code donné, ou une chaîne vide si le code est invalide ou non trouvé.
export function getCantonFlagSrc(code) {
  const normalizedCode = String(code ?? "").trim().toUpperCase();
  if (!normalizedCode) return "";
  return CANTON_CODE_TO_FLAG_SRC[normalizedCode] ?? "";
}
