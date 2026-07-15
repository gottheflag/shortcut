/**
 * Editable element tag names.
 * Shortcuts with `ignoreInputs: true` suppress firing when
 * focus is inside any of these elements or a `[contenteditable]`.
 */
const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/**
 * Walks up the DOM via `closest()` to catch nested editable contexts.
 * 
 * @param target 
 * @returns `true` if the target is an editable element.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    if (EDITABLE_TAGS.has(target.tagName)) return true;

    return target.closest("[contenteditable]") !== null;
}