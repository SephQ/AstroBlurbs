const fs = require('fs');
const path = require('path');

function fixSpacing(text) {
    // Add space after ?, ., ! when followed by a non-space character
    return text
        .replace(/\?([^\s])/g, '? $1')
        .replace(/\.([^\s])/g, '. $1')
        .replace(/!([^\s])/g, '! $1');
}

function processJsonFile(filePath) {
    console.log(`Processing ${filePath}...`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON
    const data = JSON.parse(content);
    
    // Fix spacing in all string values
    function fixObject(obj) {
        if (typeof obj === 'string') {
            return fixSpacing(obj);
        } else if (Array.isArray(obj)) {
            return obj.map(fixObject);
        } else if (obj !== null && typeof obj === 'object') {
            const fixed = {};
            for (const [key, value] of Object.entries(obj)) {
                fixed[key] = fixObject(value);
            }
            return fixed;
        }
        return obj;
    }
    
    const fixedData = fixObject(data);
    
    // Write back with pretty formatting
    fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2), 'utf8');
    
    console.log(`✓ Fixed ${filePath}`);
}

// Process all JSON files
const files = [
    path.join(__dirname, 'lib', 'synastry_aspects.json'),
    path.join(__dirname, 'lib', 'planet_aspects.json'),
    path.join(__dirname, 'lib', 'transit_aspects.json')
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        processJsonFile(file);
    } else {
        console.log(`⚠ File not found: ${file}`);
    }
});

console.log('\nDone!');
