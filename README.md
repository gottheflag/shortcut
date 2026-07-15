# Shortcut

A professional keyboard shortcut manager for web applications.

## Example

```ts
shortcut("ctrl+s", save, {
	id: "save",
	preventDefault: true,
	ignoreInputs: true,
	when: () => isAuthenticated(),
	once: true,
	allowRepeat: false,
	physical: false,
	capture: false,
	target: document,
	event: "keydown",
});
```

## Installation

```sh
pnpm add @gottheflag/shortcut
```

## Usage

```ts
import { shortcut } from "@gottheflag/shortcut";

// Register a shortcut
const dispose = shortcut("ctrl+s", save);

// Unregister
dispose();
```

## Options

| Option            | Type            | Default     |
| ----------------- | --------------- | ----------- |
| `id`              | `string`        | Random UUID |
| `description`     | `string`        | None        |
| `preventDefault`  | `boolean`       | False       |
| `stopPropagation` | `boolean`       | False       |
| `capture`         | `boolean`       | False       |
| `once`            | `boolean`       | False       |
| `event`           | `string`        | `"keydown"` |
| `target`          | `EventTarget`   | Document    |
| `when`            | `() => boolean` | True        |
| `ignoreInputs`    | `boolean`       | False       |
| `allowRepeat`     | `boolean`       | False       |
| `physical`        | `boolean`       | False       |


## Key Syntax

Modifier order does not matter. Matching is case-insensitive.

```ts
shortcut("ctrl+s", handler);
shortcut("ctrl+shift+k", handler);
shortcut("mod+s", handler); // Meta on macOS, Ctrl elsewhere
shortcut("ctrl++", handler); // Ctrl + Plus
```

### Aliases

| Alias | Resolves to |
| ----- | ----------- |
| `cmd`, `command`, `win`, `super` | `meta` |
| `opt`, `option` | `alt` |
| `esc` | `escape` |
| `return` | `enter` |
| `del` | `delete` |

## Multiple Bindings

A single dispose function removes all associated bindings.

```ts
const dispose = shortcut(["ctrl+s", "cmd+s"], save);
dispose();
```

## Format

Format a shortcut string for display.

```ts
shortcut.format("ctrl+s");
// "Ctrl+S"

shortcut.format("mod+s", { platform: "mac", style: "symbol" });
// "⌘S"

shortcut.format("mod+shift+p", { platform: "auto", style: "symbol" });
// "⇧⌘P" (macOS)
// "Shift+Ctrl+P" (other)
```

| Option | Values | Default |
| ------ | ------ | ------- |
| `platform` | `"mac"` `"windows"` `"auto"` | `"auto"` |
| `style` | `"text"` `"symbol"` | `"text"` |

## Configure

```ts
shortcut.configure({
	warnings: true,
	strict: false,
});
```

## License

[Apache-2.0](LICENSE)