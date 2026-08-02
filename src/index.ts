import type { IncomingHttpHeaders } from "node:http";

type HeaderValue = string | string[] | undefined;
type HeadersLike = Headers | Record<string, HeaderValue>;

export interface NodeRequestLike {
  headers: IncomingHttpHeaders | Record<string, HeaderValue>;
}

export interface WebRequestLike {
  headers: HeadersLike;
  url?: string;
}

export type RequestLike =
  | WebRequestLike
  | NodeRequestLike
  | Request
  | URL
  | string;

function getHeaderValue(headers: HeadersLike, key: string): string | undefined {
  if ("get" in headers && typeof headers.get === "function") {
    return headers.get(key) || undefined;
  }

  const recordHeaders = headers as Record<string, HeaderValue>;
  const value = recordHeaders[key] ?? recordHeaders[key.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" ? value : undefined;
}

function extractHost(input: RequestLike): string {
  if (typeof input === "string") {
    const value = input.trim();

    if (!value) return "";

    if (value.includes("://")) {
      try {
        return new URL(value).host;
      } catch {
        return value;
      }
    }

    return value;
  }

  if (input instanceof URL) {
    return input.host;
  }

  if (
    input &&
    typeof input === "object" &&
    "headers" in input &&
    input.headers
  ) {
    const hostHeader =
      getHeaderValue(input.headers, "host") ||
      getHeaderValue(input.headers, "x-forwarded-host");

    if (hostHeader) return hostHeader;

    if ("url" in input && typeof input.url === "string" && input.url) {
      try {
        return new URL(input.url).host;
      } catch {
        return "";
      }
    }
  }

  return "";
}

export default function domainame(input: RequestLike): string {
  const host = extractHost(input).trim();

  if (!host) return "";

  const normalizedHost = host.replace(/^\[|\]$/g, "").split(":")[0] ?? "";

  if (!normalizedHost) return "";

  if (
    normalizedHost === "localhost" ||
    normalizedHost === "127.0.0.1" ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(normalizedHost)
  ) {
    return normalizedHost;
  }

  const firstDotIndex = normalizedHost.indexOf(".");
  return firstDotIndex === -1
    ? normalizedHost
    : normalizedHost.slice(firstDotIndex + 1);
}
