const markdown = `Duplicate business listings split reviews, confuse hours, and suppress the map pack. The operator playbook is find, match, suppress, and protect reviews (in that order) across Google, Apple, Bing, and the directory network. Do not delete first. Do not create a “clean” new profile and hope the old one dies. Choose a survivor, merge or report the rest, and watch the fork come back until aggregators catch up.

This is a field guide, not a theory of local SEO. If you need why listings exist as a graph, read [Google Business Profile vs. business listings](/blog/google-business-profile-vs-business-listings). If you need the category definition, use [what is business listing management?](/blog/what-is-business-listing-management).

## Why do duplicate listings appear in the first place?

Duplicates are usually not vandalism. They are a byproduct of how place data is created.

Common sources:

- **Staff and franchisees.** Someone could not get verification mail, so they created a new Google listing. Someone opened Apple Business Connect and started over.
- **Agencies and vendors.** A citation blast that used a slightly different name string. A call-tracking number that became a second identity.
- **Moves and suite changes.** The old address remains a live place. The new address is another. Both rank. Both collect reviews.
- **Acquisitions and rebrands.** Legal names, DBAs, and old brands coexist. Maps are not a brand guidelines PDF.
- **Aggregators.** Data Axle, Foursquare, and peers syndicate. If they hold two versions, directories will too.
- **Closed, then reopened.** The closed profile was never marked closed. The new one is “more correct” and less trusted.

You will not prevent all of these. You can detect them on a schedule and close them with a consistent rule: **one canonical NAP per location, one surviving profile per publisher.**

Duplicates hurt in three measurable ways. Reviews split, so social proof looks weaker. Hours and phones diverge, so customers get the wrong one. Ranking signals split, so the map pack prefers a cleaner competitor. Cleanup is reputation work, not janitorial vanity.

## How do you find duplicates across Google, Apple, Bing, and the directory network?

Search like a customer and like a matcher. Both.

**Customer search.** Brand name plus city. Brand name plus neighborhood. Phone number. Address tokens (street number + street). Category plus city if the name is generic. Do this on Google Maps, Apple Maps, Bing, and Yelp at minimum. Note every profile that a reasonable person might tap.

**Matcher search.** Same phone on a different name. Same address with a legal suffix (LLC, Inc, DBA). Old brand names. Tracking numbers you retired. Former suite numbers. These catch the forks customers do not search for but algorithms still store.

**Inventory the IDs.** Google place / CID where you can, Apple place ids, Bing ids, Yelp biz urls. Two URLs that look like the same clinic often are not. Two different names with the same place id are.

For more than a handful of locations, doing this in a browser tab is how duplicates survive. Use a scan that scores duplicate risk against canonical NAP. [Create a workspace](/signup) for that snapshot, and the [product](/product) duplicate radar is the recurring version: near-matches on phone, place id, and name, queued as risk rather than a quarterly spreadsheet.

Record every candidate in one list: publisher, URL or id, NAP as published, review count, claimed/unclaimed, and a gut match score. You cannot suppress what you have not named.

## How do you match two listings to the same location?

Matching is a judgment with evidence. Require more than a similar name.

Strong signals (any two together is usually enough):

- Same public phone, or a known tracking number mapped to that phone.
- Same address tokens (number, street, suite) after normalizing Ste/Suite/#.
- Same coordinates within a tight radius *and* the same brand family.
- Shared photos or overlapping review text that clearly describe one place.

Weak signals (not enough alone):

- Same city and category.
- Same website domain (agencies reuse domains; brands share domains across locations).
- Similar name without address (franchises collide).

Edge cases to handle explicitly:

- **Two stores on one block.** Do not merge. Same brand, different canonical NAP.
- **SAB versus storefront.** A service-area profile and a storefront for the same brand can both be valid. Do not collapse them unless one is a mistake.
- **Department listings.** A hospital campus with a pharmacy pin is not a duplicate of the hospital. A “Harbor Dental - Orthodontics” pin might be a duplicate if it is the same suite and phone.
- **Closed vs open.** If the business moved, the old pin should be closed or redirected, not merged into a different address as if nothing happened.

When in doubt, do not suppress. Watch for a week, collect another signal, then decide. False suppression is harder to undo than living with a fork for ten more days.

Write the rule down so franchisees and agencies cannot invent local exceptions. Canonical name, address format, and phone live in the system of record. Matching is always against that record, not against whoever last edited Google. [How it works](/how-it-works) is unify NAP *before* close duplicates, on purpose: you cannot pick a survivor if you have not picked a truth.

## How do you suppress a duplicate without losing reviews?

Reviews live on profiles. Delete the profile, lose the reviews. That is the whole game.

**Google.** Prefer **merge** over delete. In GBP, request a merge so reviews and photos can land on the survivor. Unclaimed duplicates can be suggested as duplicates / reported. If you do not own the fork, you still report it. you just cannot merge from the inside. Never create a third listing to “start clean.”

**Apple Maps.** Use Apple Business Connect where you have access; report incorrect places where you do not. Apple’s process is slower and less merge-shaped than Google’s. Document the surviving place id. Expect lag.

**Bing Places.** Claim both if possible, then mark the duplicate closed or report it. Bing will happily keep two Pins if you only tidy Google.

**Yelp and other directories.** Claim, then use the site’s merge or “this is a duplicate” path. Yelp reviews do not move because you merged Google. Treat each publisher as its own reputation store.

**Aggregators.** Update or flag the duplicate at the source when you can. Otherwise the fork will republish in a month. This is why cleanup is a cycle, not a ticket you close forever.

Survivor rules that keep reviews:

- Choose the profile with the strongest review history **if** its NAP can be corrected to canonical. Do not pick a new empty listing because the name string is prettier.
- If the high-review profile has the old address and you moved, follow that publisher’s move/merge process. Do not starve the old reviews on a closed pin without using the official path.
- Screenshot review counts before you file anything. You will want proof if a merge eats photos or a report goes sideways.

Agencies should put this in the SLA: merge preferred, delete prohibited without written exception, reviews counted before and after. See [business listing management for agencies](/blog/business-listing-management-for-agencies).

## What should you do after the surviving listing is chosen?

Suppression is the middle of the job.

- **Fix NAP on the survivor** so it matches canonical exactly. A surviving duplicate with the old tracking number will just become the next matching problem.
- **Align hours and categories** on the survivor. Forks often exist because hours disagreed.
- **Re-scan the graph in 7, 30, and 90 days.** Aggregators recopy. Well-meaning staff recreate. [How it works](/how-it-works) ends on monitoring because forks return.
- **Close the source.** If an agency’s old citation sheet or a franchisee habit created the extra profile, change that process. Otherwise you are mowing.
- **Do not blast new citations** until the survivor is clean. Feeding 50 directories two versions of the truth is how you pay to rebuild the mess.

For footprint and budget, duplicates change the cleanup line more than the software line. Ten locations with forks are a project; ten clean locations are a subscription. Numbers are in [business listing management cost in 2026](/blog/business-listing-management-cost-2026) and on [pricing](/pricing): Starter at $49/month after trial, Growth at $149/month for up to 25 locations, Enterprise for bulk workflow at scale.

If you only remember four verbs: **find, match, suppress, keep reviews.** Everything else is publisher-specific paperwork.

## FAQ

### Should we just delete the listing with fewer reviews?

Almost never. Delete is how reviews disappear and how the remaining profile looks younger than it is. Merge or report as duplicate. Delete only when the profile is spam, a nonexistent place, or a clear policy violation , and still screenshot first.

### How long until a suppressed duplicate disappears?

Google merges can show in days; remnants linger. Apple and directories often take weeks. Aggregator-fed copies can take months. Plan the 30- and 90-day re-scan. “We reported it” is not the same as “customers cannot tap it.”

### Can software close duplicates by itself?

It can find and queue them, and in some networks it can file the request. A human still chooses the survivor when reviews are at stake. Good software makes that choice obvious. see duplicate radar on the [product](/product) page. It should not hide the choice behind a bulk “clean all” button.

### We already ran a citation campaign. Why are forks still here?

Because campaigns publish NAP; they do not reconcile identities. If the campaign used a tracking number or a different suite format, it likely **created** forks. Stop submitting. Inventory, pick survivors, then submit only the canonical record. A fresh [Listing Health Auditor](/) run is the cheapest way to see whether the campaign helped or multiplied you.

## Sources

Publisher and local-search references checked 2026-09-06. Confirm rules in each help center before you file a change; product UIs move.

- [Google Business Profile Help Center](https://support.google.com/business/): claim, verify, edit, hours, categories, and troubleshooting for Google listings.
- [About Google Business Profile](https://support.google.com/business/answer/7091): what a profile includes on Search and Maps.
- [Guidelines for representing your business on Google](https://support.google.com/business/answer/3038177): naming, addresses, and categories Google expects.
- [Apple Business Connect](https://businessconnect.apple.com/): owner tools for places on Apple Maps and related Apple surfaces.
- [Apple Maps / Business Connect resources](https://register.apple.com/resources): program and place-data guidance for brands.
- [Bing Places for Business](https://www.bingplaces.com/): claim and manage listings that feed Bing and Microsoft map surfaces.
- [Bing Places support](https://www.bingplaces.com/Dashboard/Home/Help): listing management help and contact paths.
- [Moz: Local SEO](https://moz.com/learn/seo/local): independent overview of local search, listings, and NAP consistency.
`;

export default markdown;
