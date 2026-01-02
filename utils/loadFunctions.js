const fs = require('fs');
const path = require('path');

/**
 * Dynamically loads all function files from the functions directory
 * This is useful for initializing functions or checking if they exist
 * @returns {Object} Object containing all loaded functions
 */
function loadFunctions() {
    const functionsPath = path.join(__dirname, '../functions');
    
    if (!fs.existsSync(functionsPath)) {
        console.log('⚠️  Functions directory does not exist');
        return {};
    }

    const functionFiles = fs.readdirSync(functionsPath).filter(file => file.endsWith('.js'));
    const functions = {};

    for (const file of functionFiles) {
        const filePath = path.join(functionsPath, file);
        const functionName = path.basename(file, '.js');
        functions[functionName] = require(filePath);
        console.log(`⚙️  Loaded function: ${functionName}`);
    }

    return functions;
}

module.exports = { loadFunctions };

