/**
 * Sidebar color tokens shared with JS. These mirror the SCSS variables in
 * variables.scss. Kept in sync manually — Sass :export proved unreliable with
 * Dart Sass + Vite's module loading. This is the single source of truth for
 * JS consumers (Sidebar/index.vue); the SCSS file is the source for styles.
 */
export const sidebarVariables = {
  menuText: '#bfcbd9',
  menuActiveText: '#409eff',
  subMenuActiveText: '#f4f4f5',
  menuBg: '#304156',
  menuHover: '#263445',
  subMenuBg: '#1f2d3d',
  subMenuHover: '#001528',
  sideBarWidth: '210px',
} as const

export default sidebarVariables
