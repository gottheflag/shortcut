import { AnyModifier } from "./aliases.js";
import { NormalizeResult } from "./normalize.js";

export type CompiledBinding = {
    modifiers: Set<AnyModifier>;
    key: string;
    physical: boolean;
    raw: string;
};

/**
 * Compiles a `NormalizeResult` into an immutable `CompiledBinding`.
 * 
 * This is the final form used by the matcher at runtime.
 * Compiled once at registration — never mutated.
 * 
 * @param result Result of normalization.
 * @param physical Whether the binding is a physical key.
 * @returns Compiled binding
 */
export function compile(result: NormalizeResult, physical: boolean): CompiledBinding {
    return {
        modifiers: result.modifiers,
        key: result.key,
        physical,
        raw: result.raw
    };
}