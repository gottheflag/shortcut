import { CanonicalModifier } from "./aliases.js";
import { CompiledBinding } from "./compiler.js";
import { detectPlatform } from "../utils/platform.js";

function resolveMod(): CanonicalModifier {
    return detectPlatform() === "mac" ? "meta" : "ctrl";
}

function resolveModifiers(binding: CompiledBinding): Set<CanonicalModifier> {
    const resolved = new Set<CanonicalModifier>();

    for (const mod of binding.modifiers) {
        resolved.add(mod === "mod" ? resolveMod() : mod);
    }

    return resolved;
}

function activeModifiers(event: KeyboardEvent): Set<CanonicalModifier> {
    const active = new Set<CanonicalModifier>();

    if (event.ctrlKey) active.add("ctrl");
    if (event.shiftKey) active.add("shift");
    if (event.altKey) active.add("alt");
    if (event.metaKey) active.add("meta");

    return active;
}

function setsEqual(a: Set<CanonicalModifier>, b: Set<CanonicalModifier>): boolean {
    return a.size === b.size && [...a].every(x => b.has(x));
}

/**
 * Pure and synchronous — no side effects.
 * 
 * - Resolves `mod` against the current platform
 * - Compares active modifiers via Set equality
 * - Compares key against `event.key` or `event.code` based on `physical`
 * 
 * @param binding Compiled binding to match against
 * @param event `KeyboardEvent` to match
 * @returns `true` if a `KeyboardEvent` matches a `CompiledBinding`.
 */
export function match(binding: CompiledBinding, event: KeyboardEvent): boolean {
    const expected = resolveModifiers(binding);
    const active = activeModifiers(event);

    if (!setsEqual(expected, active)) return false;

    const eventKey = binding.physical
        ? event.code.toLowerCase().replace(/^key|^digit|^arrow/, '')
        : event.key.toLowerCase();
    
    return eventKey === binding.key;
}