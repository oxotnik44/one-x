// compare-screenshots.js
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const referenceDir = path.resolve('.screenshots/reference');
const currentDir = path.resolve('.screenshots/current');
const diffDir = path.resolve('.screenshots/diff');

if (!fs.existsSync(diffDir)) {
    fs.mkdirSync(diffDir, { recursive: true });
}

const referenceFiles = fs.readdirSync(referenceDir).filter((f) => f.endsWith('.png'));

for (const file of referenceFiles) {
    const refPath = path.join(referenceDir, file);
    const curPath = path.join(currentDir, file);
    const diffPath = path.join(diffDir, file);

    if (!fs.existsSync(curPath)) {
        console.log(`[Пропущено] ${file} отсутствует в current`);
        continue;
    }

    const imgRef = PNG.sync.read(fs.readFileSync(refPath));
    const imgCur = PNG.sync.read(fs.readFileSync(curPath));

    if (imgRef.width !== imgCur.width || imgRef.height !== imgCur.height) {
        console.log(`[Ошибка] ${file} — разные размеры изображений`);
        continue;
    }

    const diff = new PNG({ width: imgRef.width, height: imgRef.height });

    const numDiffPixels = pixelmatch(
        imgRef.data,
        imgCur.data,
        diff.data,
        imgRef.width,
        imgRef.height,
        { threshold: 0.1 },
    );

    if (numDiffPixels > 0) {
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
        console.log(
            `[Отличия] ${file} — пикселей с отличиями: ${numDiffPixels}. Дифф сохранён в .screenshots/diff`,
        );
    } else {
        console.log(`[Совпадает] ${file}`);
    }
}
