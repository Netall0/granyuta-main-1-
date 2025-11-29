import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.join(__dirname, 'db', 'init_db.py');

try {
    execSync(`python "${scriptPath}" 2`, { stdio: 'inherit' });
} catch {
    try {
        execSync(`python3 "${scriptPath}" 2`, { stdio: 'inherit' });
    } catch (e) {
        console.error('❌ Ошибка: Python не найден');
        process.exit(1);
    }
}

