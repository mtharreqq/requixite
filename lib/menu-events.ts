// Opens the site menu (pages, theme, language) from anywhere: an avatar of
// mine in a chat, say. The rail owns the menu; on touch it's its sheet, on a
// wide screen a dialog.
export const MENU_OPEN_EVENT = "requixite:menu-open";

export function openMenu() {
  window.dispatchEvent(new Event(MENU_OPEN_EVENT));
}
