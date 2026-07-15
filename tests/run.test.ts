import { describe, it, expect, vi, beforeEach } from "vitest";
import { shortcut } from "../src/index.js";
import * as platform from "../src/utils/platform.js";

function mockTarget() {
    const listeners = new Map<string, EventListener>();
    return {
        addEventListener:    vi.fn((type: string, fn: EventListener) => listeners.set(type, fn)),
        removeEventListener: vi.fn((type: string) => listeners.delete(type)),
        dispatch(event: KeyboardEvent) {
            listeners.get(event.type)?.(event);
        },
    };
}

function mockEvent(
    key: string,
    modifiers: Partial<Record<"ctrlKey" | "shiftKey" | "altKey" | "metaKey", boolean>> = {},
    extra: Partial<{ repeat: boolean; code: string; target: EventTarget }> = {}
): KeyboardEvent {
    return {
        type:     "keydown",
        key,
        code:     extra.code   ?? key,
        repeat:   extra.repeat ?? false,
        target:   extra.target ?? null,
        ctrlKey:  modifiers.ctrlKey  ?? false,
        shiftKey: modifiers.shiftKey ?? false,
        altKey:   modifiers.altKey   ?? false,
        metaKey:  modifiers.metaKey  ?? false,
        preventDefault:  vi.fn(),
        stopPropagation: vi.fn(),
    } as unknown as KeyboardEvent;
}

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("end-to-end", () => {
    it("registers and triggers a shortcut", () => {
        const target  = mockTarget();
        const handler = vi.fn();
        shortcut("ctrl+s", handler, { target: target as unknown as EventTarget });
        target.dispatch(mockEvent("s", { ctrlKey: true }));
        expect(handler).toHaveBeenCalledOnce();
    });

    it("dispose stops the handler", () => {
        const target  = mockTarget();
        const handler = vi.fn();
        const dispose = shortcut("ctrl+s", handler, { target: target as unknown as EventTarget });
        dispose();
        target.dispatch(mockEvent("s", { ctrlKey: true }));
        expect(handler).not.toHaveBeenCalled();
    });

    it("array of keys — both trigger the same handler", () => {
        const target  = mockTarget();
        const handler = vi.fn();
        shortcut(["ctrl+s", "ctrl+k"], handler, { target: target as unknown as EventTarget });
        target.dispatch(mockEvent("s", { ctrlKey: true }));
        target.dispatch(mockEvent("k", { ctrlKey: true }));
        expect(handler).toHaveBeenCalledTimes(2);
    });

    it("mod resolves correctly on mac", () => {
        vi.spyOn(platform, "detectPlatform").mockReturnValue("mac");
        const target  = mockTarget();
        const handler = vi.fn();
        shortcut("mod+s", handler, { target: target as unknown as EventTarget });
        target.dispatch(mockEvent("s", { metaKey: true }));
        expect(handler).toHaveBeenCalledOnce();
    });

    it("format produces correct output", () => {
        expect(shortcut.format("ctrl+s", { platform: "windows", style: "text" })).toBe("Ctrl+S");
        expect(shortcut.format("cmd+s",  { platform: "mac",     style: "symbol" })).toBe("⌘S");
    });

    it("configure merges correctly", () => {
        shortcut.configure({ warnings: false });
        // no throw — just verifying it doesn't break anything
    });
});