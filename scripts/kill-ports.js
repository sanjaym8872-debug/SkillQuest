const { execSync } = require('child_process');

const ports = [5000, 5173];

console.log('Cleaning up ports...');

ports.forEach(port => {
    try {
        // Find PID on port
        const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = stdout.split('\n');

        const pids = new Set();
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 4) {
                const pid = parts[parts.length - 1];
                if (pid !== '0' && !isNaN(pid)) {
                    pids.add(pid);
                }
            }
        });

        pids.forEach(pid => {
            try {
                process.stdout.write(`Killing process ${pid} on port ${port}... `);
                execSync(`taskkill /F /PID ${pid} /T`);
                console.log('Done.');
            } catch (e) {
                console.log('Failed (already closed?).');
            }
        });
    } catch (e) {
        // No process found on this port, which is fine
    }
});

console.log('Ports are clear.');
