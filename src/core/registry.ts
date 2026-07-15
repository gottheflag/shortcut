import { compile, CompiledBinding } from "../parser/compiler.js";
import { match } from "../parser/match.js";
import { normalize } from "../parser/normalize.js";
import { ResolvedOptions, resolveOptions } from "./options.js";
import { tokenize } from "../parser/tokenize.js";
import { ShortcutOptions } from "../types.js";
import { isEditableTarget } from "../utils/utils.js";

type Registration = {
    id: string;
    bindings: CompiledBinding[];
    handler: (event: KeyboardEvent) => void;
    listener: (event: KeyboardEvent) => void;
    options: ResolvedOptions;
};

/**
 * Internal map of all active registrations, keyed by ID.
 */
const registrations = new Map<string, Registration>();

/**
 * Wraps the user's handler with all runtime guards:
 * repeat filtering, editable target suppression,
 * conditional matching, event options, and once disposal.
 * 
 * @param bindings Compiled bindings to match against.
 * @param handler User-provided handler.
 * @param options Resolved options.
 * @param dispose Function to unregister the shortcut.
 * @returns Wrapped handler.
 */
function buildListener(
    bindings: CompiledBinding[],
    handler: (event: KeyboardEvent) => void,
    options: ResolvedOptions,
    dispose: () => void
): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent) => {
        if (!options.allowRepeat && event.repeat) return;

        if (options.ignoreInputs && isEditableTarget(event.target)) return;

        if (!options.when()) return;

        const matched = bindings.some(binding => match(binding, event));
        if (!matched) return;

        if (options.preventDefault) event.preventDefault();
        if (options.stopPropagation) event.stopPropagation();

        handler(event);

        if (options.once) dispose();
    };
}

/**
 * Registers a shortcut against an `EventTarget`.
 * Returns a dispose function that removes all associated bindings.
 */
export function register(
    keys: string | string[],
    handler: (event: KeyboardEvent) => void,
    opts: ShortcutOptions = {}
): () => void {
    const options = resolveOptions(opts);
    const keyList = Array.isArray(keys) ? keys : [keys];
    const bindings = keyList.map(key => compile(normalize(tokenize(key)), options.physical));

    function dispose() {
        const reg = registrations.get(options.id);
        if (!reg) return;

        reg.options.target.removeEventListener(
            reg.options.event,
            reg.listener as EventListener,
            { capture: reg.options.capture }
        );
        registrations.delete(options.id);
    }

    const listener = buildListener(bindings, handler, options, dispose);

    const registration: Registration = {
        id: options.id,
        bindings,
        handler,
        listener,
        options
    };

    registrations.set(options.id, registration);

    options.target.addEventListener(
        options.event,
        listener as EventListener,
        { capture: options.capture }
    );

    return dispose;
}