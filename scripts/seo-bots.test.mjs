import assert from "node:assert/strict";
import test from "node:test";
import { isSocialUnfurlBot } from "../src/lib/seo-bots.ts";
import { absoluteShareImage } from "../src/lib/content/share-image.ts";

test("detects Slackbot", () => {
  assert.equal(isSocialUnfurlBot("Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)"), true);
  assert.equal(isSocialUnfurlBot("Mozilla/5.0"), false);
});

test("absoluteShareImage resolves relative and absolute", () => {
  const origin = "https://businesslistingmanagement.com";
  const fallback = `${origin}/og.png`;
  assert.equal(absoluteShareImage(null, origin, fallback), fallback);
  assert.equal(absoluteShareImage("/media/x.png", origin, fallback), `${origin}/media/x.png`);
  assert.equal(
    absoluteShareImage("https://cdn.example/a.png", origin, fallback),
    "https://cdn.example/a.png",
  );
});
