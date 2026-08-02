# domainame

A small utility for extracting the public domain suffix from hosts, URLs, and request-like objects.

## Installation

```bash
bun install
```

## Usage

```ts
import domainame from "domainame";

domainame("https://www.example.com"); // "example.com"
domainame("example.org"); // "org"
domainame("localhost"); // "localhost"
domainame({ headers: { host: "api.example.com" } }); // "example.com"
```

## Supported inputs

- Strings containing a host or URL
- `URL` instances
- Request-like objects with `headers` and optional `url`
- Plain objects with `headers`

## Development

```bash
bun test
bun run build
```

## Notes

The function returns the suffix portion after the first dot for non-local hosts, while preserving values such as `localhost`, `127.0.0.1`, and IP addresses.
