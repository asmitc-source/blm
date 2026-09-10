export type DirectoryTone = "mint" | "sky" | "lavender" | "coral" | "butter";

export type DirectoryStatus = "synced" | "mismatch" | "missing" | "duplicate";

export type DirectoryPresence = {
  id: string;
  label: string;
  short: string;
  tone: DirectoryTone;
  status: DirectoryStatus;
};

export type IssueSeverity = "high" | "medium" | "low";

export type AuditIssue = {
  id: string;
  title: string;
  detail: string;
  severity: IssueSeverity;
  category: "nap" | "coverage" | "duplicate" | "hours";
};

export type AuditResult = {
  query: string;
  city: string;
  displayName: string;
  website?: string;
  score: number;
  nap: number;
  coverage: number;
  duplicateRisk: number;
  hours: number;
  directories: DirectoryPresence[];
  issues: AuditIssue[];
  summary: string;
  scannedSources: number;
};

const DIRECTORY_DEFS: Array<Omit<DirectoryPresence, "status">> = [
  { id: "google", label: "Google Business Profile", short: "Google", tone: "mint" },
  { id: "apple", label: "Apple Maps", short: "Apple", tone: "sky" },
  { id: "bing", label: "Bing Places", short: "Bing", tone: "lavender" },
  { id: "facebook", label: "Facebook", short: "Facebook", tone: "coral" },
  { id: "mapquest", label: "MapQuest", short: "MapQuest", tone: "butter" },
  { id: "yp", label: "Yellow Pages", short: "YP", tone: "mint" },
  { id: "fsq", label: "Foursquare", short: "Foursquare", tone: "sky" },
  { id: "bbb", label: "BBB", short: "BBB", tone: "lavender" },
];

export const SCAN_STEPS = [
  { id: "identity", label: "Resolving identity" },
  { id: "google", label: "Previewing Google" },
  { id: "apple", label: "Previewing Apple Maps" },
  { id: "bing", label: "Previewing Bing" },
  { id: "facebook", label: "Previewing Facebook" },
  { id: "dirs", label: "Previewing directories" },
  { id: "score", label: "Estimating NAP + duplicates" },
] as const;

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function round(n: number) {
  return Math.round(n);
}

function looksLikeUrl(value: string) {
  return /https?:\/\//i.test(value) || /\.[a-z]{2,}/i.test(value.split(/\s/)[0] ?? "");
}

function titleCase(value: string) {
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0]
    ?.replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? value;
}

const STATUS_POOL: DirectoryStatus[] = ["synced", "mismatch", "missing", "duplicate"];

export function runListingAudit(input: { query: string; city?: string }): AuditResult {
  const query = input.query.trim();
  const city = (input.city ?? "").trim();
  const key = `${query.toLowerCase()}|${city.toLowerCase()}`;
  const rng = mulberry32(hashString(key || "blm"));

  const website = looksLikeUrl(query) ? query.replace(/^https?:\/\//i, "").split("/")[0] : undefined;
  const displayName = website ? titleCase(website) : query;

  const hasCity = city.length > 1;
  const hasUrl = Boolean(website);
  const nameLen = displayName.length;

  let nap = 58 + rng() * 34;
  let coverage = 50 + rng() * 38;
  let duplicateRisk = 38 + rng() * 48;
  let hours = 52 + rng() * 40;

  if (hasCity) {
    nap += 8;
    coverage += 6;
  } else {
    nap -= 10;
    coverage -= 8;
  }
  if (hasUrl) coverage += 7;
  if (nameLen < 6) {
    nap -= 6;
    coverage -= 5;
  }
  if (/\b(llc|inc|group|clinic|dental|hardware|yoga|cafe|coffee)\b/i.test(displayName)) {
    nap += 4;
  }

  nap = clamp(nap, 28, 97);
  coverage = clamp(coverage, 24, 96);
  duplicateRisk = clamp(duplicateRisk, 18, 94);
  hours = clamp(hours, 30, 97);

  const directories: DirectoryPresence[] = DIRECTORY_DEFS.map((dir, i) => {
    const roll = (hashString(`${key}:${dir.id}`) % 100) / 100 + rng() * 0.08;
    let status: DirectoryStatus;
    if (dir.id === "google") status = nap > 62 ? "synced" : "mismatch";
    else if (roll > 0.78) status = STATUS_POOL[Math.floor(rng() * 2) === 0 ? 2 : 3] ?? "missing";
    else if (roll > 0.52) status = i % 3 === 0 ? "mismatch" : "synced";
    else if (roll > 0.3) status = "mismatch";
    else status = rng() > 0.5 ? "missing" : "duplicate";
    if (!hasCity && dir.id === "apple") status = "missing";
    return { ...dir, status };
  });

  const missing = directories.filter((d) => d.status === "missing").length;
  const dupes = directories.filter((d) => d.status === "duplicate").length;
  const mismatches = directories.filter((d) => d.status === "mismatch").length;

  coverage = clamp(coverage - missing * 6.5, 18, 96);
  duplicateRisk = clamp(38 + dupes * 14 + rng() * 8, 18, 96);
  nap = clamp(nap - mismatches * 4.5, 22, 97);

  const score = clamp(
    nap * 0.34 + coverage * 0.28 + (100 - duplicateRisk) * 0.22 + hours * 0.16,
    31,
    96,
  );

  const issues: AuditIssue[] = [];

  if (mismatches > 0 || nap < 78) {
    const phoneA = hasCity ? "(415) 555-0148" : "(800) 555-0199";
    issues.push({
      id: "nap-phone",
      title: "Phone number formatting drifts across publishers",
      detail: `${displayName} shows ${phoneA} on Google but a compact 10-digit variant on Bing and at least one directory. Call tracking and “tap to call” both suffer.`,
      severity: nap < 60 ? "high" : "medium",
      category: "nap",
    });
  }
  if (!hasCity || coverage < 72) {
    const missingLabels = directories
      .filter((d) => d.status === "missing")
      .map((d) => d.short)
      .slice(0, 3);
    issues.push({
      id: "coverage-gap",
      title: missingLabels.length
        ? `Estimated gap on ${missingLabels.join(", ")}`
        : "Directory coverage is thinner than peer locations",
      detail: hasCity
        ? `This preview model estimates incomplete presence in ${city} on one or more primary publishers. Coverage gaps typically suppress map-pack eligibility.`
        : "Add a city so Apple Maps and local directories can be matched to a single storefront instead of a brand-level collision.",
      severity: missing >= 2 || !hasCity ? "high" : "medium",
      category: "coverage",
    });
  }
  if (dupes > 0 || duplicateRisk > 55) {
    issues.push({
      id: "dupe-risk",
      title: "Possible duplicate listings splitting reviews and rankings",
      detail: `At least ${Math.max(dupes, 1)} source${dupes === 1 ? "" : "s"} look like a second profile for ${displayName}${hasCity ? ` in ${city}` : ""}. Duplicates split photos, reviews, and the map-pack.`,
      severity: duplicateRisk > 70 ? "high" : "medium",
      category: "duplicate",
    });
  }
  if (hours < 78) {
    issues.push({
      id: "hours-gap",
      title: "Hours or primary category do not match across publishers",
      detail:
        hours < 55
          ? "Sunday hours are missing on Facebook, and the Google primary category is broader than Apple’s. Category mismatch is a common suppression signal."
          : "Special hours and a secondary category appear on Google but not on Bing or Apple Business Connect.",
      severity: hours < 55 ? "high" : "low",
      category: "hours",
    });
  }
  if (issues.length < 3 && nap < 90) {
    issues.push({
      id: "nap-address",
      title: "Suite / unit line is inconsistent",
      detail: `Ste, Suite, and # variants appear for the same address. That is enough for some aggregators to fork a second record.`,
      severity: "low",
      category: "nap",
    });
  }

  const topIssues = issues.slice(0, 3);
  const summary =
    score >= 82
      ? `${displayName} is in good shape, with a few publisher-specific gaps worth closing before they drift.`
      : score >= 64
        ? `${displayName} is discoverable, but NAP or coverage issues will cap local visibility until they are unified.`
        : `${displayName} has listing health problems that typically suppress map-pack presence and confuse customers.`;

  return {
    query,
    city,
    displayName,
    website,
    score: round(score),
    nap: round(nap),
    coverage: round(coverage),
    duplicateRisk: round(duplicateRisk),
    hours: round(hours),
    directories,
    issues: topIssues,
    summary,
    scannedSources: 48 + Math.floor(rng() * 27),
  };
}

export function scoreTone(score: number): DirectoryTone {
  if (score >= 80) return "mint";
  if (score >= 62) return "butter";
  return "coral";
}

export function statusLabel(status: DirectoryStatus) {
  switch (status) {
    case "synced":
      return "Synced";
    case "mismatch":
      return "Mismatch";
    case "missing":
      return "Missing";
    case "duplicate":
      return "Duplicate";
    default:
      return status;
  }
}
