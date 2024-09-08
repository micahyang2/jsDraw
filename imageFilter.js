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

// Image filters and similar functions
const filters = {
    mask: function(r, g, b, a, modifier = "rgba(0, 0, 0, 255)") {
        if (a > 0) {
            return modifier;
        }
        return "rgba(255, 255, 255, 0)";
    },
    grayScale: function(r, g, b, a) {
        const avg = (r + g + b) / 3;
        return `rgba(${avg}, ${avg}, ${avg}, ${a})`;
    },
};

function imageFilter(canvas, type, modifier = "rgba(0, 0, 0, 255)") {
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply the selected filter
    for (let i = 0; i < data.length; i += 4) {
        let col = parseRgba(filters[type](data[i], data[i + 1], data[i + 2], data[i + 3], modifier));
        data[i] = col.r;
        data[i + 1] = col.g;
        data[i + 2] = col.b;
        data[i + 3] = col.a;
    }

    // Create a new canvas and context to apply the filtered image data
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const newContext = newCanvas.getContext('2d');

    // Put the modified image data onto the new canvas
    newContext.putImageData(imageData, 0, 0);

    return newCanvas;
}

export { imageFilter }
