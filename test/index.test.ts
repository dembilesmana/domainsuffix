import { describe, expect, test } from "bun:test";
import domainame from "../src";

type CaseType = Array<{
  name: string;
  input: Parameters<typeof domainame>[0];
  expected: string;
}>;

describe("domainame()", () => {
  const cases: CaseType = [
    {
      name: "removes port from localhost",
      input: "localhost:3000",
      expected: "localhost",
    },
    {
      name: "removes port from loopback ip",
      input: "127.0.0.1:5173",
      expected: "127.0.0.1",
    },
    {
      name: "removes the first public subdomain",
      input: "my-app.vercel.app",
      expected: "vercel.app",
    },
    {
      name: "handles full URL strings",
      input: "https://sub.example.co.uk/path?x=1",
      expected: "example.co.uk",
    },
    {
      name: "uses host from request object",
      input: new Request("https://my-app.ports.workers.dev/dashboard", {
        headers: { host: "my-app.ports.workers.dev" },
      }),
      expected: "ports.workers.dev",
    },
    {
      name: "uses forwarded host when present",
      input: { headers: { "x-forwarded-host": "my-app.ports.workers.dev" } },
      expected: "ports.workers.dev",
    },
    { name: "returns empty for invalid input", input: "", expected: "" },
    {
      name: "returns empty for null input",
      input: null as never,
      expected: "",
    },
  ];

  for (const { name, input, expected } of cases) {
    test(name, () => {
      expect(domainame(input)).toBe(expected);
    });
  }
});
