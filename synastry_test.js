// Test synastry aspect calculation between two charts
// Run with: node synastry_test.js (make sure server is running on port 3000)

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load synastry aspects data
const aspectsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'lib', 'synastry_aspects.json'), 'utf-8')
);

// Sydney coordinates
const SYDNEY = {
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
    location: 'Sydney, Australia'
};

// Birth data
const person1 = {
    name: 'S',
    datetime: '1990-03-29T14:44',
    ...SYDNEY
};

const person2 = {
    name: 'C',
    datetime: '1994-05-09T17:30',
    ...SYDNEY
};

// Aspect definitions with orbs
const ASPECTS = {
    Conjunction: { angle: 0, orb: 10.5, key: 'Conjunct' },
    Opposition: { angle: 180, orb: 10.0, key: 'Opposition' },
    Trine: { angle: 120, orb: 8.3, key: 'Trine' },
    Square: { angle: 90, orb: 7.8, key: 'Square' },
    Sextile: { angle: 60, orb: 6.1, key: 'Sextile' },
    Inconjunct: { angle: 150, orb: 2.7, key: 'Inconjunct' }
};

// Planets to compare
const PLANETS = [
    'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 
    'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO',
    'N. NODE', 'CHIRON', 'LILITH'
];

// Map planet names from API format to synastry data format
function normalizePlanetName(apiName) {
    const mapping = {
        'SUN': 'Sun',
        'MOON': 'Moon',
        'MERCURY': 'Mercury',
        'VENUS': 'Venus',
        'MARS': 'Mars',
        'JUPITER': 'Jupiter',
        'SATURN': 'Saturn',
        'URANUS': 'Uranus',
        'NEPTUNE': 'Neptune',
        'PLUTO': 'Pluto',
        'N. NODE': 'North Node',
        'CHIRON': 'Chiron',
        'LILITH': 'Lilith'
    };
    return mapping[apiName] || apiName;
}

// Calculate angular distance (0-180°)
function getAngularDistance(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);
    if (diff > 180) diff = 360 - diff;
    return diff;
}

// Check if angle matches aspect type within orb
function checkAspect(distance) {
    for (const [aspectName, { angle, orb, key }] of Object.entries(ASPECTS)) {
        const deviation = Math.abs(distance - angle);
        if (deviation <= orb) {
            return { aspectName, aspectKey: key, exactness: orb - deviation };
        }
    }
    return null;
}

// Make POST request to /api/chart
function getChart(birthData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(birthData);
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/chart',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

// Main test
async function testSynastry() {
    try {
        console.log('🔮 Fetching charts...\n');
        
        const [chart1, chart2] = await Promise.all([
            getChart(person1),
            getChart(person2)
        ]);
        
        console.log(`${person1.name}: ${person1.datetime} (${person1.location})`);
        console.log(`${person2.name}: ${person2.datetime} (${person2.location})\n`);
        
        // Find all aspects between the two charts
        const allAspects = [];
        
        for (const planet1 of PLANETS) {
            const p1Data = chart1.planets[planet1];
            if (!p1Data || p1Data.error) continue;
            
            for (const planet2 of PLANETS) {
                const p2Data = chart2.planets[planet2];
                if (!p2Data || p2Data.error) continue;
                
                const distance = getAngularDistance(p1Data.longitude, p2Data.longitude);
                const aspect = checkAspect(distance);
                
                if (aspect) {
                    allAspects.push({
                        planet1,
                        planet2,
                        person1Name: person1.name,
                        person2Name: person2.name,
                        aspectName: aspect.aspectName,
                        aspectKey: aspect.aspectKey,
                        exactness: aspect.exactness,
                        actualAngle: distance.toFixed(2)
                    });
                }
            }
        }
        
        // Sort by exactness (tightest orbs first)
        allAspects.sort((a, b) => b.exactness - a.exactness);
        
        // Display top 10
        console.log('🎯 TOP 10 TIGHTEST ASPECTS:\n');
        console.log('═'.repeat(80));
        
        for (let i = 0; i < Math.min(10, allAspects.length); i++) {
            const asp = allAspects[i];
            
            // Look up description in synastry_aspects.json
            const planet1Name = normalizePlanetName(asp.planet1);
            const planet2Name = normalizePlanetName(asp.planet2);
            let lookupKey = `${planet1Name}-${asp.aspectKey}-${planet2Name}`;
            let aspectData = aspectsData[lookupKey];
            
            // Try reverse order if not found
            if (!aspectData) {
                lookupKey = `${planet2Name}-${asp.aspectKey}-${planet1Name}`;
                aspectData = aspectsData[lookupKey];
            }
            
            const description = aspectData ? aspectData.description : 'No data';
            
            console.log(`\n${i + 1}. ${asp.planet1} (${asp.person1Name}) ${asp.aspectName} ${asp.planet2} (${asp.person2Name})`);
            console.log(`   Angle: ${asp.actualAngle}° | Tightness: ${asp.exactness.toFixed(2)}°`);
            console.log(`\n   ${description}\n`);
            console.log('─'.repeat(80));
        }
        
        console.log(`\nTotal aspects found: ${allAspects.length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nMake sure the server is running: node server.js');
    }
}

testSynastry();
