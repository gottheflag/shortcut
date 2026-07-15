import { ShortcutConfigOptions } from "../types.js";

/**
 * Global shortcut configuration state.
 * Mutated exclusively through `configure()`.
 */
const config: ShortcutConfigOptions = {
    /**
     * Emit warnings for invalid shortcuts.
     */
    warnings: true,
    /**
     * Throw instead of warning on invalid shortcuts.
     */
    strict: false
};

/**
 * The returned object is read-only — use `configure()` to update.
 * 
 * @returns current configuration.
 */
export function getConfig(): Readonly<ShortcutConfigOptions> {
    return config;
}

/**
 * Merge overrides into the global configuration. \
 * Unspecified fields retain their current values.
 * 
 * @param overrides Configuration to update.
 */
export function configure(overrides: Partial<ShortcutConfigOptions>): void {
    Object.assign(config, overrides);
}