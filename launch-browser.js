const { exec } = require('child_process');

// Open default browser with the warehouse management URL
const url = 'http://localhost:5052';

console.log('Opening warehouse management interface in default browser...');

// Use the 'open' command on macOS to open default browser
exec(`open "${url}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error opening browser: ${error}`);
        return;
    }
    console.log('Browser opened successfully!');
    console.log(`URL: ${url}`);
});
