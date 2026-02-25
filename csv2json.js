// Run with 'node csv2json.js'
const fs = require('fs');
const path = require('path');

// Read CSV file
const name = 'transit_aspects';
const csvPath = path.join(__dirname, 'lib', `${name}.csv`);
const csvData = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple manual parsing since we don't have papaparse yet)
const lines = csvData.split('\n');
const headers = lines[0].split(',');

// Create JSON object with normalized keys
const aspectsData = {};

for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Split, but respect quoted fields
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    fields.push(current); // Add last field
    
    const aspectingObject = fields[2]?.trim();
    const aspectType = fields[3]?.trim();
    const aspectedObject = fields[4]?.trim();
    
    if (!aspectingObject || !aspectType || !aspectedObject) continue;
    
    // Create normalized key: "Planet1-AspectType-Planet2"
    // Normalize planet names (capitalize first letter)
    const normalizedKey = `${aspectingObject}-${aspectType}-${aspectedObject}`;
    
    aspectsData[normalizedKey] = {
        aspect: fields[0]?.trim(),
        url: fields[1]?.trim(),
        aspectingObject,
        aspectType,
        aspectedObject,
        description: fields[5]?.trim(),
        keywords: fields[6]?.trim(),
        opportunities: fields[7]?.trim(),
        goals: fields[8]?.trim()
    };
}

// Write JSON file
const jsonPath = path.join(__dirname, 'lib', `${name}.json`);
fs.writeFileSync(jsonPath, JSON.stringify(aspectsData, null, 2));

console.log(`✅ Converted ${Object.keys(aspectsData).length} aspects to JSON`);
console.log(`📁 Output: ${jsonPath}`);