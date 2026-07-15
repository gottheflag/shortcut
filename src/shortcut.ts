import { configure } from "./core/config.js";
import { format } from "./format.js";
import { register } from "./core/registry.js";
import { ShortcutOptions } from "./types.js";

/**
 * Register a keyboard shortcut and returns a dispose function.
 * 
 * Bindings are immutable after creation.
 * Call the returned function to unregister.
 * 
 * @example
 * // Single binding
 * const dispose = shortcut("ctrl+s", save);
 * dispose();
 * 
 * @example
 * // Multiple bindings for the same handler
 * const dispose = shortcut(["ctrl+s", "cmd+s"], save);
 * 
 * @example
 * // With options
 * shortcut("ctrl+s", save, { description: "Save the file" });
 * 
 * 
 * @param keys Keyboard shortcut to listen for.
 * @param handler Function to call when the shortcut fires.
 * @param options Binding options.
 * @returns Dispose function to unregister the shortcut.
 */
export function shortcut(
    keys: string | string[],
    handler: (event: KeyboardEvent) => void,
    options: ShortcutOptions = {}
): () => void {
    return register(keys, handler, options);
}

/**
 * Configure global shortcut behavior.
 * 
 * Merges with existing configuration — partial updates are safe.
 * 
 * @example
 * shortcut.configure({ warnings: false });
 * shortcut.configure({ strict: true });
 */
shortcut.configure = configure;

/**
 * Format a shortcut string for display.
 * 
 * Resolves aliases and platform-aware modifiers before formatting.
 * 
 * @example
 * shortcut.format("ctrl+s")
 * // "Ctrl+S"
 * 
 * @example
 * shortcut.format("mod+s", { platform: "mac", style: "symbol" })
 * // "⌘S"
 * 
 * @example
 * shortcut.format("mod+shift+p", { platform: "auto", style: "symbol" })
 * // "⇧⌘P" (mac)
 * // "Shift+Ctrl+P" (others)
 */
shortcut.format = format;