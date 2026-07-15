export type Platform = "mac" | "other";

/**
 * Detects the current platform.
 * 
 * @returns `other` in SSR environments where `navigator` is unavailable.
 */
export function detectPlatform(): Platform {
    if (typeof navigator === "undefined") return "other";

    return navigator.platform
        .toLowerCase()
        .startsWith("mac") ? "mac" : "other";
}