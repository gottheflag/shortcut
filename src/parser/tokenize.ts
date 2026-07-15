/**
 * Thrown when a raw shortcut string fails tokenization.
 * Contains the original `raw` string for diagnostics.
 */
export class TokenizeError extends Error {
    constructor(
        message: string,
        public readonly raw: string
    ) {
        super(message);
        this.name = "TokenizeError";
    }
}

export type TokenizeResult = {
    tokens: string[];
    raw: string;
};

/**
 * Splits a raw shortcut string into an ordered list of lowercase tokens.
 * 
 * Rules:
 * - Delimiter is `+`
 * - Tokens are lowercased and trimmed
 * - `ctrl++` > `["ctrl", "+"]` (trailing empty > literal `+` key)
 * - Empty, whitespace-only, or invisible input is rejected
 * 
 * Does not interpret meaning — that is the normalizer's responsibility.
 * 
 * @param raw Raw shortcut string to tokenize.
 * @returns Ordered list of lowercase tokens.
 */
export function tokenize(raw: string): TokenizeResult {
    if (typeof raw !== "string") {
		throw new TokenizeError(
			`Shortcut must be a string, got: ${typeof raw}`,
			String(raw)
		);
	}

	if (raw.trim() === '') {
		throw new TokenizeError(
			raw === ''
				? "Empty shortcut string."
				: `Whitespace-only shortcut is not valid. Use "space" for the space key.`,
			raw
		);
	}

	const parts = raw.split('+');

	let trailingEmpties = 0;
	for (let i = parts.length - 1; i >= 0; i--) {
		if (parts[i] === '') trailingEmpties++;
		else break;
	}

	const isLiteralPlus = trailingEmpties >= 1;

	const meaningful = isLiteralPlus
		? parts.slice(0, parts.length - trailingEmpties)
		: parts;
	
	const tokens: string[] = meaningful.map(t => t.toLowerCase().trim());

	const hasInternalEmpty = tokens.some(t => t === '');
	if (hasInternalEmpty) {
		throw new TokenizeError(
			`Shortcut "${raw}" contains an empty token. Use "space" for the space key.`,
			raw
		);
	}

	const hasEmbeddedSpace = tokens.some(t => /\s/.test(t));
	if (hasEmbeddedSpace) {
		throw new TokenizeError(
			`Shortcut "${raw}" contains a literal space character. Use "space" instead.`,
			raw
		);
	}

	if (isLiteralPlus) {
		tokens.push('+');
	}

	return { tokens, raw };
}