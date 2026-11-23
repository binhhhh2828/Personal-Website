/**
 * Unfinished content ([Placeholder] blocks, empty photo frames, draft chapters) is shown
 * while developing — so you can see what is left to write — and hidden from visitors
 * in production. Set SHOW_DRAFTS=true to preview a production build with them.
 */
export const showDrafts = process.env.NODE_ENV !== "production" || process.env.SHOW_DRAFTS === "true";

/** True while a value still contains the "[Placeholder]" marker. */
export const isPlaceholder = (text: string) => text.includes("[Placeholder]");
