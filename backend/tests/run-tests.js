import assert from "node:assert/strict";
import { createRateLimiter } from "../middlewares/rateLimiter.js";
import { buildPaginationMeta, parsePagination } from "../utils/pagination.js";

const tests = [];

const test = (name, fn) => {
  tests.push({ name, fn });
};

test("parsePagination falls back to defaults for invalid input", () => {
  const result = parsePagination({ page: "-2", limit: "abc" });

  assert.deepEqual(result, {
    page: 1,
    limit: 10,
    skip: 0,
  });
});

test("parsePagination respects custom limit caps", () => {
  const result = parsePagination(
    { page: "3", limit: "200" },
    { page: 1, limit: 10, maxLimit: 50 }
  );

  assert.deepEqual(result, {
    page: 3,
    limit: 50,
    skip: 100,
  });
});

test("buildPaginationMeta returns expected navigation flags", () => {
  const result = buildPaginationMeta({
    page: 2,
    limit: 10,
    total: 35,
  });

  assert.deepEqual(result, {
    page: 2,
    limit: 10,
    total: 35,
    totalPages: 4,
    hasNextPage: true,
    hasPrevPage: true,
  });
});

test("rate limiter blocks requests above the configured threshold", () => {
  const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });
  let nextCalls = 0;

  const createRes = () => ({
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  });

  const req = {
    ip: `test-ip-${Date.now()}`,
    headers: {},
    socket: {},
  };

  limiter(req, createRes(), () => {
    nextCalls += 1;
  });
  limiter(req, createRes(), () => {
    nextCalls += 1;
  });

  const blockedRes = createRes();
  limiter(req, blockedRes, () => {
    nextCalls += 1;
  });

  assert.equal(nextCalls, 2);
  assert.equal(blockedRes.statusCode, 429);
  assert.equal(blockedRes.body?.success, false);
});

let failed = 0;

for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

if (failed > 0) {
  process.exitCode = 1;
} else {
  console.log(`All ${tests.length} tests passed.`);
}
