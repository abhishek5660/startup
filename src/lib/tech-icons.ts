import {
  siReact,
  siNextdotjs,
  siHtml5,
  siCss,
  siJavascript,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siPython,
  siPostgresql,
  siMysql,
  siMongodb,
  siSupabase,
  siGit,
  siGithub,
  siFigma,
  siTypescript,
} from "simple-icons";

/** Official brand marks from the Simple Icons project (CC0). Only these are bundled. */
export const techIcons: Record<string, { path: string; hex: string; title: string }> = {
  siReact,
  siNextdotjs,
  siHtml5,
  siCss,
  siJavascript,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siPython,
  siPostgresql,
  siMysql,
  siMongodb,
  siSupabase,
  siGit,
  siGithub,
  siFigma,
  siTypescript,
};

/** Simple Icons uses pure black for some brands; lift it so it stays visible on dark backgrounds. */
export function iconColor(hex: string, onDark: boolean) {
  if (!onDark) return `#${hex}`;
  const lum = parseInt(hex.slice(0, 2), 16) + parseInt(hex.slice(2, 4), 16) + parseInt(hex.slice(4, 6), 16);
  return lum < 120 ? "#ffffff" : `#${hex}`;
}
