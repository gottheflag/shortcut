import { PressEventType, ShortcutOptions } from "../types.js";

/**
 * Produced by {@link resolveOptions} — used internally throughout the pipeline.
 * 
 * @internal
 */
export type ResolvedOptions = {
    id: string;
    description: string | undefined;
    preventDefault: boolean;
    stopPropagation: boolean;
    capture: boolean;
    once: boolean;
    event: PressEventType;
    target: EventTarget;
    when: () => boolean;
    ignoreInputs: boolean;
    allowRepeat: boolean;
    physical: boolean;
};

/**
 * Fills in all defaults for a given `ShortcutOptions` object. \
 * Always produces a complete concrete `ResolvedOptions`.
 * 
 * @param options Options to resolve.
 * @returns Resolved safe to query options.
 */
export function resolveOptions(options: ShortcutOptions): ResolvedOptions {
    return {
        id: options.id ?? crypto.randomUUID(),
        description: options.description ?? undefined,
        preventDefault: options.preventDefault ?? false,
        stopPropagation: options.stopPropagation ?? false,
        capture: options.capture ?? false,
        once: options.once ?? false,
        event: options.event ?? "keydown",
        target: options.target ?? document,
        when: options.when ?? (() => true),
        ignoreInputs: options.ignoreInputs ?? false,
        allowRepeat: options.allowRepeat ?? false,
        physical: options.physical ?? false,

    };
}