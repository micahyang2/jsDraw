// RLE library{
// Performs Run-Length Encoding (RLE) for a single row
function encodeRow(row) {
    let encodedRow = '';
    let count = 1;

    for (let i = 1; i < row.length; i++) {
        if (row[i] === row[i - 1]) {
            count++;
        } else {
            encodedRow += (count > 1 ? count : '') + row[i - 1];
            count = 1;
        }
    }

    encodedRow += (count > 1 ? count : '') + row[row.length - 1];
    return encodedRow;
};

// Decodes a single RLE-encoded row
function decodeRow(row) {
    let decodedRow = '';
    let count = '';

    for (let i = 0; i < row.length; i++) {
        if (isNaN(row[i])) {
            if (count === '') {
                decodedRow += row[i];
            } else {
                const repeatCount = parseInt(count, 10);
                decodedRow += row[i].repeat(repeatCount);
                count = '';
            }
        } else {
            count += row[i];
        }
    }

    return decodedRow;
};

// Applying RLE to a bitmap array
function compBitmap(bitmap) {
    const result = [];
    let repeatCount = 1;

    for (let y = 1; y < bitmap.length; y++) {
        if (Array.isArray(bitmap[y])) {
            bitmap[y] = bitmap[y].join("");
        }
        if (bitmap[y] === bitmap[y - 1]) {
            repeatCount++;
        } else {
            result.push((repeatCount > 1 ? encodeRow(bitmap[y - 1]) + repeatCount : encodeRow(bitmap[y - 1])));
            repeatCount = 1;
        }
    }

    result.push((repeatCount > 1 ? encodeRow(bitmap[bitmap.length - 1]) + repeatCount : encodeRow(bitmap[bitmap.length - 1])));
    return result.join("/");
};

// Decompress from a compressed string into a bitmap
function decompBitmap(compressed) {
    const result = [];
    const rows = compressed.split("/");

    for (let y = 0; y < rows.length; y++) {
        let row = rows[y];
        if (/\d+$/.test(row)) { // Last ? numbers
            const repeatCount = parseInt(row.match(/\d+$/)[0], 10);
            row = row.replace(/\d+$/, ''); // Remove the number from the end of the row
            for (let i = 0; i < repeatCount; i++) {
                result.push(decodeRow(rows[y]));
            }
        } else {
            result.push(decodeRow(rows[y]));
        }
    }

    return result;
};
// }

function parseRgba(rgba) {
    // Match the RGBA values from the string using a regular expression
    const regex = /^rgba\((\d+), \s*(\d+), \s*(\d+), \s*(\d+)\)$/;
    const match = rgba.match(regex);
    
    if (match) {
        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10),
            a: parseInt(match[4], 10)
        };
    } else {
        throw new Error('Invalid RGBA format');
    }
}


function loadBitmap(bitmap, colors, pixelSize = 2) {
    if (typeof bitmap === 'string') {
        bitmap = decompBitmap(bitmap);
    }
    const width = bitmap[0].length;
    const height = bitmap.length;
    
    const canvas = document.createElement('canvas');
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;
    const ctx = canvas.getContext('2d');
    
    // Draw each pixel as a larger rectangle
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const color = parseRgba(colors[bitmap[y][x]]);
            ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
    
    return canvas;
}

export { loadBitmap, parseRgba, decompBitmap, compBitmap };
