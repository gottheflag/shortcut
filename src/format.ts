import { normalize } from "./parser/normalize.js";
import { detectPlatform } from "./utils/platform.js";
import { tokenize } from "./parser/tokenize.js";

export type FormatOptions = {
    platform?: "mac" | "windows" | "auto";
    style?: "symbol" | "text";
};

/**
 * Modifier display order — applied consistently
 * regardless of input order.
 * 
 * Follows the macOS convention: Ctrl > Alt > Shift > Meta.
 */
const MODIFIER_ORDER = ["ctrl", "alt", "shift", "meta"];

/**
 * Symbol representations for macOS modifier keys.
 */
const MAC_SYMBOLS: Record<string, string> = {
    meta: "⌘",
    alt: "⌥",
    shift: "⇧",
    ctrl: "⌃"
};

/**
 * Text labels for modifier keys on Windows/Other platforms.
 */
const WINDOWS_LABELS: Record<string, string> = {
    meta: "Win",
    ctrl: "Ctrl",
    shift: "Shift",
    alt: "Alt"
};

const TEXT_LABELS: Record<string, string> = {
    meta: "Meta",
    ctrl: "Ctrl",
    shift: "Shift",
    alt: "Alt"
};

/**
 * Format a shortcut string into a human-readable representation.
 * 
 * - Resolves aliases (`cmd` > `meta`, `esc` > `escape`)
 * - Resolves `mod` against the target platform
 * - Applies consistent modifier ordering
 * 
 * @example
 * format("ctrl+s", { platform: "windows", style: "text" })
 * // "Ctrl+S"
 * 
 * @example
 * format("cmd+shift+p", { platform: "mac", style: "symbol" })
 * // "⇧⌘P"
 */
export function format(
    raw: string,
    options: FormatOptions = {}
): string {
    const { modifiers, key } = normalize(tokenize(raw));

    const platform = options.platform === "auto" || options.platform === undefined
        ? (detectPlatform() === "mac" ? "mac" : "windows")
        : options.platform;
    
    const style = options.style ?? "text";

    const resolved = new Set(
        [...modifiers].map(m => m === "mod"
            ? (platform === "mac" ? "meta" : "ctrl")
            : m
        )
    );

    const sortedModifiers = MODIFIER_ORDER.filter(m => resolved.has(m as any));

    const formattedModifiers = sortedModifiers.map(mod => {
        if (style === "symbol" && platform === "mac") {
            return MAC_SYMBOLS[mod] ?? mod;
        }

        const labels = platform === "mac" ? TEXT_LABELS : WINDOWS_LABELS;

        return labels[mod] ?? mod;
    });

    const formattedKey = key.length === 1
        ? key.toUpperCase()
        : key.charAt(0).toUpperCase() + key.slice(1);
    
    if (style === "symbol" && platform === "mac") {
        return [...formattedModifiers, formattedKey].join('');
    }

    return [...formattedModifiers, formattedKey].join('+');
}