/**
 * src/data/venueCoords.js
 *
 * Turns a program row into map coordinates.
 *
 * The programs feed carries a `LocationLink` (a maps.app.goo.gl short link) but
 * no lat/lng, so tools/build-venue-coords.mjs resolves those links offline and
 * writes ./venueCoords.generated.js. This module layers hand-maintained fixes
 * on top of that generated data and exposes one resolver.
 *
 * Hand-maintained entries always win, so re-running the generator can never
 * clobber a correction made here.
 */
import {
  GENERATED_VENUE_COORDS,
  GENERATED_VENUE_COORDS_BY_NAME,
  GENERATED_CITY_COORDS,
} from './venueCoords.generated.js';

const norm = (v) => String(v || '').trim().toLowerCase();

export function linkKey(link) {
  return String(link || '').trim().replace(/\/+$/, '').toLowerCase();
}

/**
 * Fixes for venues the feed gets wrong or doesn't link at all. Keyed by
 * lowercased LocationName. Checked before anything generated.
 */
export const MANUAL_VENUE_COORDS_BY_NAME = {
  // The feed's LocationLink for this one points at St. Dominic School in
  // Cumberland, OTTAWA - about 370km from the "Severn/Cumberland Beach" the
  // feed lists as its city. Pinned to Cumberland Beach until the upstream
  // link is corrected.
  'st. dominic school': { lat: 44.706029, lng: -79.387096 },

  // These two have LocationLink: null in the feed.
  'dr. j.m. denison secondary school': { lat: 44.069711, lng: -79.477330 },
  'innisfil rec complex': { lat: 44.297749, lng: -79.609850 },
};

/** Same idea, keyed by normalized LocationLink. */
export const MANUAL_VENUE_COORDS = {};

/**
 * City fallbacks. The generator computes these as the centroid of each city's
 * resolved venues; entries here override that.
 */
export const MANUAL_CITY_COORDS = {
  // Only venue in this city is the mis-linked St. Dominic School above, so the
  // generated centroid inherits the same Ottawa error.
  'severn/cumberland beach': { lat: 44.706029, lng: -79.387096 },
};

export const VENUE_COORDS = GENERATED_VENUE_COORDS;
export const VENUE_COORDS_BY_NAME = GENERATED_VENUE_COORDS_BY_NAME;
export const CITY_COORDS = { ...GENERATED_CITY_COORDS, ...MANUAL_CITY_COORDS };

/**
 * Coordinates resolved at runtime, for venues the generated table predates.
 *
 * venueCoords.generated.js is a build-time snapshot, so a venue added to the
 * feed after the last build has no coordinates and drops off the map entirely.
 * Regenerating fixes it only until the next new venue appears. Instead the map
 * asks the theme's /ea/v1/venue-coords endpoint for anything it can't resolve
 * locally (the browser can't ask Google directly - no CORS headers) and merges
 * the answers here, so a new venue self-resolves on first view with no rebuild.
 *
 * Kept in localStorage as well as memory so a repeat visitor never re-asks.
 */
const RUNTIME_STORAGE_KEY = 'ea_venue_coords_v1';

const runtimeCoords = (() => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RUNTIME_STORAGE_KEY) || 'null');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {}; // private mode, quota, or corrupt entry - memory-only is fine
  }
})();

/**
 * Merges endpoint results into the runtime table. Returns how many were new,
 * so the caller can skip a re-render when nothing changed.
 */
export function registerRuntimeVenueCoords(entries) {
  let added = 0;
  Object.keys(entries || {}).forEach((link) => {
    const c = entries[link];
    const k = linkKey(link);
    if (!k || runtimeCoords[k]) return;
    if (!c || !Number.isFinite(c.lat) || !Number.isFinite(c.lng)) return;
    runtimeCoords[k] = { lat: c.lat, lng: c.lng };
    added++;
  });
  if (added) {
    try {
      window.localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(runtimeCoords));
    } catch {
      // Storage unavailable - the in-memory copy still serves this page view.
    }
  }
  return added;
}

/**
 * True when asking the endpoint could actually improve this row's pin: it has a
 * link we haven't resolved yet, and today it either has no coordinates at all
 * or only a city centroid.
 */
export function needsRuntimeVenueLookup(p) {
  const linkK = linkKey(p && p.LocationLink);
  if (!linkK || runtimeCoords[linkK]) return false;
  const resolved = resolveVenueCoords(p);
  return !resolved || resolved.source === 'city';
}

/**
 * Stable identity for a venue. Name first: the feed sometimes mints a
 * distinct LocationLink per session/time-slot at the same physical venue
 * (e.g. Trinity United Church has one link per basketball slot), and keying
 * on that split what should be one map pin into several. LocationName is
 * the actual venue identity and is consistent across those rows, so it only
 * falls back to link when a row has no name at all - then city, so nothing
 * is ever unkeyed.
 *
 * Deliberately not derived from the adapted program's `id`, which embeds an
 * array index and therefore changes whenever filters change.
 */
export function venueKeyFor(p) {
  const name = norm(p && p.LocationName);
  if (name) return `name:${name}`;
  const link = linkKey(p && p.LocationLink);
  if (link) return `link:${link}`;
  const city = norm(p && p.City);
  return city ? `city:${city}` : 'venue:unknown';
}

/**
 * Coordinates for a program row, most precise source first.
 * Returns { lat, lng, source } or null. `source` of 'city' means the pin is a
 * city centroid rather than the real venue, which the map surfaces as
 * "approximate" and uses to decide whether to spread overlapping pins.
 */
export function resolveVenueCoords(p) {
  if (!p) return null;

  const nameK = norm(p.LocationName);
  const linkK = linkKey(p.LocationLink);

  const manualByName = nameK && MANUAL_VENUE_COORDS_BY_NAME[nameK];
  if (manualByName) return { ...manualByName, source: 'venue' };

  const manualByLink = linkK && MANUAL_VENUE_COORDS[linkK];
  if (manualByLink) return { ...manualByLink, source: 'venue' };

  const byLink = linkK && VENUE_COORDS[linkK];
  if (byLink) return { lat: byLink.lat, lng: byLink.lng, source: 'venue' };

  const mappedKey = nameK && VENUE_COORDS_BY_NAME[nameK];
  const byName = mappedKey && VENUE_COORDS[mappedKey];
  if (byName) return { lat: byName.lat, lng: byName.lng, source: 'venue-name' };

  // Anything baked or hand-fixed wins; this only fills genuine gaps, and beats
  // the city centroid below because it's the venue's real position.
  const runtime = linkK && runtimeCoords[linkK];
  if (runtime) return { lat: runtime.lat, lng: runtime.lng, source: 'venue' };

  const city = CITY_COORDS[norm(p.City)];
  if (city) return { lat: city.lat, lng: city.lng, source: 'city' };

  return null;
}
