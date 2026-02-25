# AstroBlurb v2

Astrology web app using [sweph](https://github.com/timotejroiko/sweph) (Swiss Ephemeris) for planetary calculations.

## Features

- Swiss Ephemeris integration for high-precision planetary positions
- Zodiac sign conversion (ecliptic longitude to sign + degree/minute/second)
- House calculations (Placidus, Whole Sign, etc.)
- Natal and synastry aspects with keyword-tagged descriptions
- Blurb templates with per-sign/house/life-path replacements
- Synastry blurb templates with keyword-based token resolution
- Shorter descriptions toggle for synastry aspects (max 4 sentences)
- Profile management with auto-generated blurbs
- Web API for birth chart generation

## Synastry Blurb Tokens

Synastry blurb templates use `[...]` tokens that resolve against the selected profile pair's synastry aspect results (sorted by ascending orb).

### Basic syntax

```
[@planet, fallback]
```

`@planet` matches the first synastry aspect (by orb) involving that planet from either profile. If no aspect is found, the fallback text is used.

```
[@planet@planet, fallback]
```

`@planet@planet` matches the first aspect between those two specific planets, in either direction.

### Supported planet names

`sun`, `moon`, `mercury`, `venus`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`, `pluto`, `chiron`, `lilith`, `NN` / `northnode` / `nnode`

### Arguments

| Position | Purpose | Default |
|----------|---------|---------|
| 1st | `@planet` or `@planet@planet` reference | required |
| 2nd | Fallback text if no aspect found | empty |
| 3rd | Number of keywords to take | 1 |
| 4th | Keyword separator, optionally ending with `a` for Oxford-style last separator ("and") | `, ` |

The 4th argument can contain `[` and `]` as literal separator characters. The parser uses bracket-depth counting to find the real closing `]` of the token.

### Examples

Single keyword with fallback:
```
[@mercury, nothing]
```
Resolves to the first keyword from the first Mercury synastry aspect, or "nothing" if none found.

Two-planet match:
```
[@venus@mars, no spark]
```
Resolves to the first keyword from the first Venus-Mars synastry aspect in either direction.

Multiple keywords with separator:
```
[@mars, not much, 3, [, ]a]
```
Takes up to 3 keywords from the first Mars aspect, joins them with ", " and uses "and" before the last one. Result might be: "hope, strength and farting". If no Mars aspect is found, resolves to "not much".

### Capitalisation

Replacements follow sentence rules: lowercase by default, uppercase at the start of a sentence or paragraph.

## Prerequisites

- **Node.js 24+**
- **Visual Studio Build Tools 2026** (or 2022) with "Desktop development with C++" workload
- **Python 3.x** (for node-gyp)

## Installation

```bash
# Install sweph with VS 2026
npm install sweph
cd node_modules/sweph
npm run preinstall
npx node-gyp rebuild
cd ../..
```

## Usage

Test planetary calculations with default date (1990-01-01 12:00 UTC):
```bash
node test.js
```

Test with custom date:
```bash
node test.js 1995-06-15T08:30:00Z
```

### Sample Output

```
=== Planetary Positions ===
Date: 1990-01-01T12:00:00.000Z
Julian Day: 2447893

SUN        Capricorn 10°48'51"
MOON       Pisces 3°16'4"
MERCURY    Capricorn 25°40'22"
VENUS      Aquarius 6°13'19"
MARS       Sagittarius 10°0'0"
JUPITER    Cancer 5°8'56"
SATURN     Capricorn 15°39'27"
URANUS     Capricorn 5°47'8"
NEPTUNE    Capricorn 12°2'17"
PLUTO      Scorpio 17°5'35"
```

## API Data Structure

Returns JSON with:
- Julian Day
- Date (ISO 8601 UTC)
- Ephemeris path
- Planet positions:
  - `longitude` (0-360 ecliptic longitude)
  - `zodiac` (sign, degree, minute, second, formatted string)
  - `latitude` (ecliptic latitude)
  - `distance` (AU from Earth)
  - `speed_long` (daily motion in longitude)

## Ephemeris Files

Located in `/ephe` folder. Swiss Ephemeris files cover 600-year ranges:
- `sepl_*.se1` - planets
- `semo_*.se1` - moon
- `seas_*.se1` - main asteroids
