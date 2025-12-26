import React from "react";
import {
  Sprout,
  BookOpen,
  LayoutDashboard,
  History,
} from "lucide-react";

/* =========================
   THEME COLORS (AGRIC)
   ========================= */
export const COLORS = {
  primary: "#047857",   // Emerald 700
  secondary: "#d97706", // Amber 600 (maize)
  accent: "#84cc16",    // Lime 500
  earth: "#78350f",     // Soil brown
  bg: "#fafaf9",        // Stone 50
};

/* =========================
   GHANA DISTRICTS (SAMPLE)
   ========================= */
export const GHANA_DISTRICTS = [
  "Accra Metropolitan",
  "Kumasi Metropolitan",
  "Tamale Metropolitan",
  "Sekondi-Takoradi",
  "Sunyani Municipal",
  "Ho Municipal",
  "Wa Municipal",
  "Bolgatanga Municipal",
  "Cape Coast",
  "Koforidua",
];

/* =========================
   NAVIGATION
   ========================= */
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Yield Predictor",
    path: "/predict",
    icon: <Sprout size={20} />,
  },
  {
    label: "Farming Insights",
    path: "/insights",
    icon: <BookOpen size={20} />,
  },
  {
    label: "History",
    path: "/history",
    icon: <History size={20} />,
  },
];

/* =========================
   HISTORICAL YIELD TRENDS
   Dataset period: 2011–2021
   Units: tons/hectare
   ========================= */
export const HISTORICAL_YIELD_TRENDS = [
  { year: 2011, yield: 1.8 },
  { year: 2012, yield: 1.9 },
  { year: 2013, yield: 2.0 },
  { year: 2014, yield: 2.1 },
  { year: 2015, yield: 2.0 },
  { year: 2016, yield: 2.2 },
  { year: 2017, yield: 2.3 },
  { year: 2018, yield: 2.4 },
  { year: 2019, yield: 2.1 },
  { year: 2020, yield: 2.3 },
  { year: 2021, yield: 2.2 },
];
