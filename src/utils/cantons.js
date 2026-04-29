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

const cantonFlagFiles = import.meta.glob("../assets/cantons/*", {
  eager: true,
  import: "default",
});

const CANTON_CODE_TO_FLAG_SRC = Object.fromEntries(
  Object.entries(cantonFlagFiles).map(([path, src]) => {
    const fileName = path.split("/").pop() ?? "";
    const code = fileName.split(".")[0].toUpperCase();
    return [code, src];
  }),
);

export function getCantonFromAirport(airport) {
  const iata = String(airport?.iata_code ?? "").trim().toUpperCase();
  return IATA_TO_CANTON[iata] ?? null;
}

export function getCantonFlagSrc(code) {
  const normalizedCode = String(code ?? "").trim().toUpperCase();
  if (!normalizedCode) return "";
  if (CANTON_CODE_TO_FLAG_SRC[normalizedCode]) return CANTON_CODE_TO_FLAG_SRC[normalizedCode];
  if (normalizedCode === "ZH" && CANTON_CODE_TO_FLAG_SRC.ZU) return CANTON_CODE_TO_FLAG_SRC.ZU;
  return "";
}
