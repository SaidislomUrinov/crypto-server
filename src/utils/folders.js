import fs from 'fs';
import path from 'path';
function folders() {
    const mainDir = path.join(process.cwd(), 'uploads');
    const subDirs = ['brands', 'users', 'resumes'];
    if (!fs.existsSync(mainDir)) {
        fs.mkdirSync(mainDir, { recursive: true });
        console.log(`📂 '${mainDir}' papkasi yaratildi.`);
    }
    subDirs.forEach(dir => {
        const subDirPath = path.join(mainDir, dir);
        if (!fs.existsSync(subDirPath)) {
            fs.mkdirSync(subDirPath);
            console.log(`📂 '${subDirPath}' papkasi yaratildi.`);
        }
    });
}
folders();
