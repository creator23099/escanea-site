export type NetworkStat = {
  readonly value: string;
  readonly label: string;
  readonly desc: string;
  /** Slightly smaller value type for longer text (e.g. city names). */
  readonly valueStyle?: "default" | "small";
};

export const NETWORK_STAT_DRIVERS: NetworkStat = {
  value: "100+",
  label: "Conductores en la red",
  desc: "",
};

export const NETWORK_STAT_VIEWS_VALUE = "850.000" as const;
export const NETWORK_STAT_VIEWS_LABEL = "Vistas hiperlocales / 90 días" as const;

export const NETWORK_STAT_IMPRESSIONS: NetworkStat = {
  value: NETWORK_STAT_VIEWS_VALUE,
  label: NETWORK_STAT_VIEWS_LABEL,
  desc: "Con 5 vehículos × 3.000–5.000 km/mes en zonas de alto tráfico. Los escaneos QR son verificables — las vistas son el estimado conservador.",
};

export const NETWORK_STAT_IMPRESSIONS_HYPERLOCAL: NetworkStat = {
  value: NETWORK_STAT_VIEWS_VALUE,
  label: NETWORK_STAT_VIEWS_LABEL,
  desc: "Basado en una campaña piloto de 5 vehículos",
};

export const NETWORK_STAT_VEHICLES_PER_CAMPAIGN: NetworkStat = {
  value: "5–20",
  label: "Vehículos por campaña",
  desc: "Según tu zona y objetivo",
};

export const NETWORK_STAT_CITIES: NetworkStat = {
  value: "Medellín y Bogotá",
  label: "Ciudades activas",
  desc: "",
  valueStyle: "small",
};

/** Stats grid on /marcas — sourced from shared definitions above. */
export const MARCAS_STATS_BAR: readonly NetworkStat[] = [
  NETWORK_STAT_DRIVERS,
  NETWORK_STAT_IMPRESSIONS,
  NETWORK_STAT_VEHICLES_PER_CAMPAIGN,
];

/** Compact 3-column row on homepage Cómo funciona section. */
export const HOME_STATS_ROW: readonly NetworkStat[] = [
  NETWORK_STAT_DRIVERS,
  NETWORK_STAT_IMPRESSIONS_HYPERLOCAL,
  NETWORK_STAT_CITIES,
];
