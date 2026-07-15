/**
 * The type of event to listen for.
 */
export type PressEventType =
    | "keydown"
    | "keyup";

export type ShortcutOptions = {
    /**
     * Unique identifier for this registeration. \
     * Auto-generated as a UUID if not provided.
     * 
     * Used for debugging and diagnostics.
     */
    id?: string;

    /**
     * Human-readable description of what this shortcut does.
     * 
     * @example
     * { description: "Save the current file" }
     */
    description?: string;

    /**
     * Prevent the browser's default behavior when this shortcut fires.
     * 
     * @example
     * // Prevents the browser save dialog on Ctrl+S
     * preventDefault: true
     * 
     * @default false
     */
    preventDefault?: boolean;

    /**
     * Stop the event from propagating to other listeners.
     * 
     * @default false
     */
    stopPropagation?: boolean;

    /**
     * Listen during the capture phase instead of bubble phase. \
     * Useful for intercepting events before they reach the nested targets.
     * 
     * @example
     * // The parent can intercept the event..
     * // before it reaches the child
     * capture: true
     * 
     * @default false
     */
    capture?: boolean;

    /**
     * Unregister automatically after the shortcut fires once.
     * 
     * @example
     * // Show a one-time welcome message
     * once: true
     * 
     * @default false
     */
    once?: boolean;

    /**
     * Keyboard event to listen for.
     * 
     * @default "keydown"
     */
    event?: PressEventType;

    /**
     * The `EventTarget` to attach the listener to. \
     * Accepts `document`, `window`, shadow roots, or any custom target.
     * 
     * @default document
     */
    target?: EventTarget;

    /**
     * The shortcut only fires when this predicate returns `true`.
     * 
     * @example
     * // Only trigger in wide viewports
     * when: () => window.innerWidth > 768
     * 
     * @default true
     * 
     * @returns `true` if the shortcut should fire
     */
    when?: () => boolean;

    /**
     * Suppress the shortcut when focus is inside an editable element:
     * `<input>`, `<textarea>`, `<select>`, or `[contenteditable]`.
     * 
     * @default false
     */
    ignoreInputs?: boolean;

    /**
     * Allow the shortcut to fire repeatedly while the key is held down.
     * 
     * @default false
     */
    allowRepeat?: boolean;

    /**
     * Match against `KeyboardEvent.code` instead of `KeyboardEvent.key`.
     * 
     * Useful for layout-independent matching — e.g. *WASD* movement
     * keys that should work regardless of keyboard layout.
     * 
     * @default false
     */
    physical?: boolean;
};

export type ShortcutConfigOptions = {
    warnings: boolean;
    strict: boolean;
};