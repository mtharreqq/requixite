// Opens the hero chat dialog from anywhere on the page, optionally with a
// prefilled draft. Kept apart from chat-dialog.tsx so callers don't pull in
// the dialog's code.
export const CHAT_OPEN_EVENT = "requixite:chat-open";

export function openChat(draft?: string) {
  window.dispatchEvent(new CustomEvent(CHAT_OPEN_EVENT, { detail: draft }));
}
