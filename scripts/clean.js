const fs = require('node:fs/promises');
const path = require('node:path');

const output = path.resolve(__dirname, '..', 'dist');

fs.rm(output, { recursive: true, force: true })
    .then(() => console.log('Removed dist/'))
    .catch((error) => {
        console.error('Could not clean dist/:', error);
        process.exitCode = 1;
    });
