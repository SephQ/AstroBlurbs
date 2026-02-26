const express = require('express');
const path = require('path');
const { DateTime } = require('luxon');
const sweph = require('sweph');

const app = express();
const PORT = process.env.PORT || 8080;

// Set ephemeris path
const ephePath = path.resolve(__dirname, 'ephe');
sweph.set_ephe_path(ephePath);

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/lib', express.static('lib'));

// Zodiac signs
const ZODIAC_SIGNS = [
	'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
	'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Life Path number order (1-9, 11, 22, 33)
const LP_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

// Planet IDs
const PLANETS = {
	SUN: 0,
	MOON: 1,
	MERCURY: 2,
	VENUS: 3,
	MARS: 4,
	JUPITER: 5,
	SATURN: 6,
	URANUS: 7,
	NEPTUNE: 8,
	PLUTO: 9,
	'N. NODE': 10,
	LILITH: 12,
	CHIRON: 15,
	CERES: 17,
	PALLAS: 2,
	JUNO: 3,
	VESTA: 4,
	PHOLUS: 5145,
	ERIS: 136199
};

function longitudeToZodiac(longitude) {
	const normalizedLong = ((longitude % 360) + 360) % 360;
	const signIndex = Math.floor(normalizedLong / 30);
	const degreeInSign = normalizedLong % 30;
	const degrees = Math.floor(degreeInSign);
	const minutesDecimal = (degreeInSign - degrees) * 60;
	const minutes = Math.floor(minutesDecimal);
	const seconds = Math.round((minutesDecimal - minutes) * 60);
	
	return {
		sign: ZODIAC_SIGNS[signIndex],
		signIndex: signIndex,
		degree: degrees,
		minute: minutes,
		second: seconds,
		formatted: `${ZODIAC_SIGNS[signIndex]} ${degrees}°${minutes}'${seconds}"`
	};
}

function getHousePosition(longitude, houseCusps) {
	const normalizedLong = ((longitude % 360) + 360) % 360;
	
	for (let i = 0; i < 12; i++) {
		const currentCusp = houseCusps[i];
		const nextCusp = houseCusps[(i + 1) % 12];
		
		if (currentCusp < nextCusp) {
			if (normalizedLong >= currentCusp && normalizedLong < nextCusp) {
				return i + 1;
			}
		} else {
			if (normalizedLong >= currentCusp || normalizedLong < nextCusp) {
				return i + 1;
			}
		}
	}
	
	return 1;
}

// Calculate Life Path number using numerology
function calculateLifePath(day, month, year) {
	// Reduce a number to 1-9, 11, 22, or 33
	function reduceNumber(num) {
		while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
			num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
		}
		return num;
	}
	
	// Reduce each component
	const dayReduced = reduceNumber(day);
	const monthReduced = reduceNumber(month);
	const yearReduced = reduceNumber(year);
	
	// Sum and reduce the total
	const total = dayReduced + monthReduced + yearReduced;
	return reduceNumber(total);
}

// Calculate birth chart
app.post('/api/chart', (req, res) => {
	try {
		const { datetime, latitude, longitude, timezone, location } = req.body;
		
		// Parse datetime with timezone
		const dt = DateTime.fromISO(datetime, { zone: timezone });
		const utcDt = dt.toUTC();
		
		// Calculate Julian Day
		const year = utcDt.year;
		const month = utcDt.month;
		const day = utcDt.day;
		const hour = utcDt.hour + utcDt.minute / 60 + utcDt.second / 3600;
		const jd = sweph.julday(year, month, day, hour, 1);
		
		// Calculate houses (Placidus)
		const housesResult = sweph.houses(jd, latitude, longitude, 'P');
		
		const results = {
			jd,
			datetime_local: dt.toISO(),
			datetime_utc: utcDt.toISO(),
			timezone,
			location: {
				name: location,
				latitude,
				longitude
			},
			planets: {},
			houses: {
				system: 'Placidus',
				cusps: housesResult.data.houses.map((cusp, index) => ({
					house: index + 1,
					longitude: cusp,
					zodiac: longitudeToZodiac(cusp)
				})),
				angles: {
					ascendant: {
						longitude: housesResult.data.points[0],
						zodiac: longitudeToZodiac(housesResult.data.points[0])
					},
					mc: {
						longitude: housesResult.data.points[1],
						zodiac: longitudeToZodiac(housesResult.data.points[1])
					},
					vertex: {
						longitude: housesResult.data.points[3],
						zodiac: longitudeToZodiac(housesResult.data.points[3])
					}
				}
			}
		};
		
		// Calculate planets
		for (const [name, id] of Object.entries(PLANETS)) {
			try {
				const planetData = sweph.calc_ut(jd, id, 2);
				const zodiac = longitudeToZodiac(planetData.data[0]);
				const house = getHousePosition(planetData.data[0], housesResult.data.houses);
				
				results.planets[name] = {
					longitude: planetData.data[0],
					zodiac,
					house,
					latitude: planetData.data[1],
					distance: planetData.data[2],
					speed_long: planetData.data[3]
				};
			} catch (e) {
				results.planets[name] = { error: e.message };
			}
		}
		
		// Calculate Life Path number from birth date (local time)
		results.lifePath = calculateLifePath(dt.day, dt.month, dt.year);
		
		res.json(results);
	} catch (error) {
		console.error('Chart calculation error:', error);
		res.status(400).json({ error: error.message });
	}
});

// Generate blurb from chart and template
app.post('/api/blurb/generate', (req, res) => {
	try {
		const { chart, blurbTemplate, replacements } = req.body;
		
		console.log('=== BLURB GENERATION DEBUG ===');
		console.log('Template:', blurbTemplate);
		console.log('Replacements:', JSON.stringify(replacements, null, 2));
		
		// Zodiac sign index mapping
		const ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
							  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
		
		// Function to get zodiac index (0-11) from sign name
		const getZodiacIndex = (signName) => {
			return ZODIAC_SIGNS.findIndex(s => s.toLowerCase() === signName?.toLowerCase());
		};
		
		// Extract chart data
		const chartData = {
			sun: { sign: chart.planets.SUN?.zodiac?.sign, house: chart.planets.SUN?.house },
			moon: { sign: chart.planets.MOON?.zodiac?.sign, house: chart.planets.MOON?.house },
			mercury: { sign: chart.planets.MERCURY?.zodiac?.sign, house: chart.planets.MERCURY?.house },
			venus: { sign: chart.planets.VENUS?.zodiac?.sign, house: chart.planets.VENUS?.house },
			mars: { sign: chart.planets.MARS?.zodiac?.sign, house: chart.planets.MARS?.house },
			jupiter: { sign: chart.planets.JUPITER?.zodiac?.sign, house: chart.planets.JUPITER?.house },
			saturn: { sign: chart.planets.SATURN?.zodiac?.sign, house: chart.planets.SATURN?.house },
			uranus: { sign: chart.planets.URANUS?.zodiac?.sign, house: chart.planets.URANUS?.house },
			neptune: { sign: chart.planets.NEPTUNE?.zodiac?.sign, house: chart.planets.NEPTUNE?.house },
			pluto: { sign: chart.planets.PLUTO?.zodiac?.sign, house: chart.planets.PLUTO?.house },
			chiron: { sign: chart.planets.CHIRON?.zodiac?.sign, house: chart.planets.CHIRON?.house },
			ceres: { sign: chart.planets.CERES?.zodiac?.sign, house: chart.planets.CERES?.house },
			pallas: { sign: chart.planets.PALLAS?.zodiac?.sign, house: chart.planets.PALLAS?.house },
			juno: { sign: chart.planets.JUNO?.zodiac?.sign, house: chart.planets.JUNO?.house },
			vesta: { sign: chart.planets.VESTA?.zodiac?.sign, house: chart.planets.VESTA?.house },
			lilith: { sign: chart.planets.LILITH?.zodiac?.sign, house: chart.planets.LILITH?.house },
			pholus: { sign: chart.planets.PHOLUS?.zodiac?.sign, house: chart.planets.PHOLUS?.house },
			eris: { sign: chart.planets.ERIS?.zodiac?.sign, house: chart.planets.ERIS?.house },
			northnode: { sign: chart.planets['N. NODE']?.zodiac?.sign, house: chart.planets['N. NODE']?.house },
			northNode: { sign: chart.planets['N. NODE']?.zodiac?.sign, house: chart.planets['N. NODE']?.house },
			NN: { sign: chart.planets['N. NODE']?.zodiac?.sign, house: chart.planets['N. NODE']?.house },
			ascendant: { sign: chart.houses?.angles?.ascendant?.zodiac?.sign },
			rising: { sign: chart.houses?.angles?.ascendant?.zodiac?.sign },
			mc: { sign: chart.houses?.angles?.mc?.zodiac?.sign }
		};
		
		// Add Life Path number
		if (chart.lifePath) {
			chartData.LP = { number: chart.lifePath };
			chartData.lifepath = { number: chart.lifePath };
		}
		
		// Helper function to convert number to ordinal (1 -> "1st", 2 -> "2nd", etc.)
		const toOrdinal = (num) => {
			const j = num % 10;
			const k = num % 100;
			if (j === 1 && k !== 11) return num + "st";
			if (j === 2 && k !== 12) return num + "nd";
			if (j === 3 && k !== 13) return num + "rd";
			return num + "th";
		};
		
		// Replace placeholders in template
		let result = blurbTemplate;
		
		// First pass: Replace ordinal house placeholders (e.g., @sunHth, @sunhouseth)
		for (const [planet, data] of Object.entries(chartData)) {
			if (data.house) {
				const ordinal = toOrdinal(data.house);
				// Match @planetHth, @planethouseth patterns
				const regexOrdinal = new RegExp(`@${planet}(H|house)th\\b`, 'gi');
				result = result.replace(regexOrdinal, ordinal);
			}
		}
		
		// Second pass: Process each placeholder type (signs, houses, life path)
		for (const [planet, data] of Object.entries(chartData)) {		// Handle Life Path number placeholders (special case: 9-12 values)
		if ((planet === 'LP' || planet === 'lifepath') && data.number && replacements && replacements[planet]) {
			const replacementList = replacements[planet];
			if (Array.isArray(replacementList) && replacementList.length >= 9) {
				const index = LP_ORDER.indexOf(data.number);
				let replacement;
				
				if (index !== -1 && replacementList[index] !== undefined) {
					replacement = replacementList[index];
				} else if (data.number === 11 && replacementList[1] !== undefined) {
					replacement = replacementList[1]; // Fallback 11 -> 2
				} else if (data.number === 22 && replacementList[3] !== undefined) {
					replacement = replacementList[3]; // Fallback 22 -> 4
				} else if (data.number === 33 && replacementList[5] !== undefined) {
					replacement = replacementList[5]; // Fallback 33 -> 6
				}
				
				if (replacement) {
					const regex = new RegExp(`@${planet}\\b`, 'gi');
					result = result.replace(regex, replacement);
				}
			}
			continue;
		}
					// Handle sign-based placeholders (e.g., @sun, @moon)
			const signIndex = getZodiacIndex(data.sign);
			if (signIndex !== -1 && replacements && replacements[planet]) {
				const replacementList = replacements[planet];
				if (Array.isArray(replacementList) && replacementList.length === 12) {
					const replacement = replacementList[signIndex];
					const regex = new RegExp(`@${planet}(?!H|house)\\b`, 'gi');
					result = result.replace(regex, replacement);
				}
			}
			
			// Handle house-based placeholders (e.g., @sunH, @sunhouse, @plutoH)
			if (data.house && replacements && replacements[`${planet}H`]) {
				const replacementList = replacements[`${planet}H`];
				if (Array.isArray(replacementList) && replacementList.length === 12) {
					const houseIndex = data.house - 1; // Convert house 1-12 to index 0-11
					const replacement = replacementList[houseIndex];
					// Match @planetH, @planethouse and @planet_house formats
					const regexHouse = new RegExp(`@${planet}(H|_?house)\\b`, 'gi');
					result = result.replace(regexHouse, replacement);
				}
			}
		}
		
		// Fix a/an grammar: change "a" to "an" before vowel-starting words
		result = result.replace(/\ba\s+([aeiouAEIOU])/g, 'an $1');
		
		res.json({ 
			blurb: result,
			chartData
		});
	} catch (error) {
		console.error('Blurb generation error:', error);
		res.status(400).json({ error: error.message });
	}
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
	console.log(`AstroBlurb server running at http://localhost:${PORT}`);
});
