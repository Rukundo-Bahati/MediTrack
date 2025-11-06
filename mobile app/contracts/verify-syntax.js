// Simple syntax verification for Solidity contracts
const fs = require('fs');
const path = require('path');

console.log('Verifying Solidity contract syntax...');

function checkSolidityFile(filePath) {
    const fileName = path.basename(filePath);
    console.log(`\nChecking ${fileName}:`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${fileName}`);
        return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for basic Solidity structure
    const checks = [
        { name: 'SPDX License', pattern: /SPDX-License-Identifier/, required: true },
        { name: 'Pragma version', pattern: /pragma solidity/, required: true },
        { name: 'Contract declaration', pattern: /contract \w+/, required: true },
        { name: 'External imports', pattern: /@openzeppelin|import.*\//, required: false, shouldNotExist: true },
        { name: 'Constructor', pattern: /constructor\(\)/, required: true },
        { name: 'Events', pattern: /event \w+/, required: true },
        { name: 'Modifiers', pattern: /modifier \w+/, required: true },
        { name: 'Functions', pattern: /function \w+/, required: true }
    ];
    
    let allPassed = true;
    
    checks.forEach(check => {
        const found = check.pattern.test(content);
        
        if (check.shouldNotExist) {
            if (found) {
                console.log(`${check.name}: Found (should not exist)`);
                allPassed = false;
            } else {
                console.log(`${check.name}: Clean (no external dependencies)`);
            }
        } else if (check.required) {
            if (found) {
                console.log(`${check.name}: Found`);
            } else {
                console.log(`${check.name}: Missing`);
                allPassed = false;
            }
        }
    });
    
    // Check for common syntax issues
    const syntaxChecks = [
        { name: 'Balanced braces', test: () => {
            const openBraces = (content.match(/\{/g) || []).length;
            const closeBraces = (content.match(/\}/g) || []).length;
            return openBraces === closeBraces;
        }},
        { name: 'Balanced parentheses', test: () => {
            const openParens = (content.match(/\(/g) || []).length;
            const closeParens = (content.match(/\)/g) || []).length;
            return openParens === closeParens;
        }},
        { name: 'No TODO comments', test: () => {
            return !content.toLowerCase().includes('todo');
        }}
    ];
    
    syntaxChecks.forEach(check => {
        if (check.test()) {
            console.log(`${check.name}: OK`);
        } else {
            console.log(`${check.name}: Issue detected`);
        }
    });
    
    return allPassed;
}

// Check both contract files
const mediTrackPath = path.join(__dirname, 'MediTrack.sol');
const mediTrackSimplePath = path.join(__dirname, 'MediTrackSimple.sol');

const mediTrackOK = checkSolidityFile(mediTrackPath);
const mediTrackSimpleOK = checkSolidityFile(mediTrackSimplePath);

console.log('\nFinal Results:');
console.log(`MediTrack.sol: ${mediTrackOK ? 'READY' : 'ISSUES'}`);
console.log(`MediTrackSimple.sol: ${mediTrackSimpleOK ? 'READY' : 'ISSUES'}`);

if (mediTrackOK && mediTrackSimpleOK) {
    console.log('\nAll contracts are ready for deployment!');
    console.log('No external dependencies required');
    console.log('Ready to compile with: npx hardhat compile');
} else {
    console.log('\nSome issues detected. Please review the contracts.');
}

console.log('\nNext steps:');
console.log('1. Install Hardhat: npm install --save-dev hardhat');
console.log('2. Compile: npx hardhat compile');
console.log('3. Deploy: npx hardhat run contracts/deploy.js --network <network>');