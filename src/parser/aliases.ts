/**
 * The four canonical modifiers.
 * All modifier aliases resolve to one of these.
 */
export const CANONICAL_MODIFIERS = new Set([
    "ctrl",
    "shift",
    "alt",
    "meta"
] as const);

/**
 * Standard modifier keys after normalization.
 */
export type CanonicalModifier = "ctrl" | "shift" | "alt" | "meta";

/**
 * Unresolved modifier keys that resolves based on the target platform.
 * e.g. `meta` on macOS, `ctrl` elsewhere — at match time.
 */
export type UnresolvedModifier = "mod";

/**
 * Union of all valid modifier values in the compiled pipeline.
 */
export type AnyModifier = CanonicalModifier | UnresolvedModifier;

/**
 * Modifier alias table.
 * Maps all accepted modifier spellings to their canonical form.
 * 
 * `mod` maps to itself — resolved later at match time.
 */
export const MODIFIER_ALIASES: Record<string, AnyModifier> = {
    cmd: "meta",
    command: "meta",
    win: "meta",
    super: "meta",
    option: "alt",
    opt: "alt",
    mod: "mod"
};

/**
 * Key alias table.
 * Maps common alternative key names to their canonical DOM form.
 */
export const KEY_ALIASES: Record<string, string> = {
    return: "enter",
    esc: "escape",
    del: "delete",
};