import { AnyModifier, CANONICAL_MODIFIERS, CanonicalModifier, KEY_ALIASES, MODIFIER_ALIASES } from "./aliases.js";
import { TokenizeResult } from "./tokenize.js";

/**
 * Thrown when a token list fails normalization.
 * Contains the original `raw` string for diagnostics.
 */
export class NormalizeError extends Error {
    constructor(
        message: string,
        public readonly raw: string
    ) {
        super(message);
        this.name = "NormalizeError";
    }
}

export type NormalizeResult = {
    modifiers: Set<AnyModifier>;
    key: string;
    raw: string;
};

/**
 * Takes a `TokenizeResult` and produces a structured binding:
 * - Resolves modidier aliases (`cmd` > `meta`, `opt` > `alt`)
 * - Separates modifiers from the key
 * - Rejects modifiers-only, multiple keys, and duplicate modifiers
 * 
 * `mod` is carried through unresolved — it resolves at match time.
 * 
 * @param result Result of tokenize
 * @returns Structured binding
 */
export function normalize(result: TokenizeResult): NormalizeResult {
    const { tokens, raw } = result;
    const modifiers = new Set<AnyModifier>();
    let key: string | undefined;

    for (const token of tokens) {
        if (CANONICAL_MODIFIERS.has(token as CanonicalModifier)) {
            if (modifiers.has(token as CanonicalModifier)) {
                throw new NormalizeError(`Duplicate modifier "${token}".`, raw);
            }

            modifiers.add(token as CanonicalModifier);
        } else if (token in MODIFIER_ALIASES) {
            const canonical = MODIFIER_ALIASES[token];

            if (modifiers.has(canonical)) {
                throw new NormalizeError(`Duplicate modifier "${token}" (resolves to "${canonical}").`, raw);
            }

            modifiers.add(canonical);
        } else if (token in KEY_ALIASES) {
            if (key !== undefined) {
                throw new NormalizeError(`Multiple keys found: "${key}" and "${token}".`, raw);
            }

            key = KEY_ALIASES[token];
        } else {
            if (key !== undefined) {
                throw new NormalizeError(`Multiple keys found: "${key}" and "${token}".`, raw);
            }

            key = token;
        }
    }

    if (key === undefined) {
        throw new NormalizeError(`No key found - modifiers-only shortcut is not valid.`, raw);
    }

    return { modifiers, key, raw };
}