import assert from "node:assert/strict";
import test from "node:test";
import { extractProviderReviews } from "../src/scraper/providers/index.js";
import { normalizeReviews } from "../src/scraper/utils.js";

test("extracts nested provider review payloads", () => {
  const reviews = extractProviderReviews([
    {
      url: "https://judge.me/api/reviews",
      body: {
        data: {
          reviews: [
            {
              title: "Works well",
              body: "<p>I would buy this again.</p>",
              reviewer_name: "Grace",
              rating: 4,
              created_at: "2026-02-01",
            },
          ],
        },
      },
    },
  ]);

  assert.deepEqual(normalizeReviews(reviews), [
    {
      source: "judge.me",
      rating: 4,
      title: "Works well",
      body: "I would buy this again.",
      author: "Grace",
      date: "2026-02-01",
    },
  ]);
});

test("extracts Yotpo review payloads", () => {
  const reviews = extractProviderReviews([
    {
      url: "https://api.yotpo.com/v1/widget/some-app-key/products/12345/reviews.json?page=1",
      body: {
        response: {
          reviews: [
            {
              title: "Excellent",
              content: "Fast shipping and great quality.",
              user: {
                display_name: "Mia",
              },
              score: 5,
              created_at: "2026-03-10",
            },
          ],
        },
      },
    },
  ]);

  assert.deepEqual(normalizeReviews(reviews), [
    {
      source: "yotpo",
      rating: 5,
      title: "Excellent",
      body: "Fast shipping and great quality.",
      author: "Mia",
      date: "2026-03-10",
    },
  ]);
});

test("extracts Yotpo reviewer object names via user.displayName", () => {
  const reviews = extractProviderReviews([
    {
      url: "https://api.yotpo.com/v1/widget/some-app-key/products/12345/reviews.json?page=1",
      body: {
        response: {
          reviews: [
            {
              title: "Excellent",
              content: "Fast shipping and great quality.",
              user: {
                displayName: "Mia",
              },
              score: 5,
              created_at: "2026-03-10",
            },
          ],
        },
      },
    },
  ]);

  assert.deepEqual(normalizeReviews(reviews), [
    {
      source: "yotpo",
      rating: 5,
      title: "Excellent",
      body: "Fast shipping and great quality.",
      author: "Mia",
      date: "2026-03-10",
    },
  ]);
});

test("extracts Yotpo reviewer object names", () => {
  const reviews = extractProviderReviews([
    {
      url: "https://api.yotpo.com/v1/widget/some-app-key/products/12345/reviews.json?page=1",
      body: {
        response: {
          reviews: [
            {
              title: "Excellent",
              content: "Fast shipping and great quality.",
              reviewer: {
                display_name: "Mia",
              },
              score: 5,
              created_at: "2026-03-10",
            },
          ],
        },
      },
    },
  ]);

  assert.deepEqual(normalizeReviews(reviews), [
    {
      source: "yotpo",
      rating: 5,
      title: "Excellent",
      body: "Fast shipping and great quality.",
      author: "Mia",
      date: "2026-03-10",
    },
  ]);
});
