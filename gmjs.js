// Helper functions to make drawing on screens easier
class DrawFn {
    constructor(surface) {
        this.canvas = surface.canvas;
        this.ctx = surface.ctx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    
        // Style properties
        this.strokeColor = "rgba(0, 0, 0, 1)"; // Default stroke color
        this.fillColor = "rgba(255, 255, 255, 1)"; // Default fill color
        this.strokeWeightVal = 1; // Stroke weight
        this.fontSize = 16; // Default font size
        this.fontFamily = 'Arial'; // Default font family
        this.textAlign = 'left'; // Default text alignment
        this.textBaseline = 'alphabetic'; // Default text baseline
        // Cached styles
        this.lastStrokeColor = null; // Last applied stroke color
        this.lastFillColor = null; // Last applied fill color
        this.lastStrokeWeight = null; // Last stroke weight
        this.lastFontSize = null; // Last applied font size
        this.lastFontFamily = null; // Last applied font family
        this.lastTextAlign = null; // Last text alignment
        this.lastTextBaseline = null; // Last text baseline
    }

    // Drawing functions
    rect(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.applyStyles();
    }
    circle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.applyStyles();
    }
    ellipse(x, y, w, h) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, w, h, 0, 360);
        this.applyStyles();
    }
    line(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.applyStyles(true); // Only stroke for lines
    }
    polygon(x, y, radius, sides) {
        const angle = Math.PI * 2 / sides;
        this.ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const nx = x + radius * Math.cos(i * angle);
            const ny = y + radius * Math.sin(i * angle);
            if (i === 0) this.ctx.moveTo(nx, ny);
            else this.ctx.lineTo(nx, ny);
        }
        this.ctx.closePath();
        this.applyStyles();
    }
    // Text drawing function
    text(txt, x, y) {
        this.ctx.beginPath();
        this.applyStyles();
        this.applyTextStyles();
        if (this.fillColor !== null) this.ctx.fillText(txt, x, y);
        if (this.strokeColor !== null) this.ctx.strokeText(txt, x, y);
    }
    bezierCurve(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.ctx.beginPath();
    this.ctx.moveTo(cp1x, cp1y);
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    this.applyStyles();
    }
    quadraticCurve(cp1x, cp1y, x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(cp1x, cp1y);
        this.ctx.quadraticCurveTo(cp1x, cp1y, x, y);
        this.applyStyles();
    }
    background(r, g, b, a = 255) {
        this.ctx.beginPath();
        this.clear();
        this.ctx.fillStyle = this.parseColor(r, g, b, a);
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // Image and pixels
    setPixel(x, y, r, g, b, a = 255) {
        const imageData = this.ctx.createImageData(1, 1);
        imageData.data[0] = r;
        imageData.data[1] = g;
        imageData.data[2] = b;
        imageData.data[3] = a;
        this.ctx.putImageData(imageData, x, y);
    }
    

    // Style functions
    fill(r, g, b, a = 255) {
        this.fillColor = this.parseColor(r, g, b, a);
    }
    noFill() {
        this.fillColor = null;
    }
    stroke(r, g, b, a = 255) {
        this.strokeColor = this.parseColor(r, g, b, a);
    }
    noStroke() {
        this.strokeColor = null;
    }
    strokeWeight(weight) {
        this.strokeWeightVal = weight;
    }
    textSize(size) {
        this.fontSize = size;
    }
    textAlign(align = 'left') {
        this.textAlign = align;
    }
    textBaseline(baseline = 'alphabetic') {
        this.textBaseline = baseline;
    }

    // Transformation functions
    scale(w, h) {
        if (h === undefined) {
            this.ctx.scale(w, w);
    		return;
        }
        this.ctx.scale(w, h);
    }
    translate(x, y) {
        this.ctx.translate(x, y);
    }
    rotate(angle) {
        // Input should be in radians
        this.ctx.rotate(angle);
    }
    // In case I forget...
    pushMatrix() {
        this.ctx.save();
    }
    popMatrix() {
        this.ctx.restore();
    }

    // Utility functions
    getKeys() {
        return this.keys;
    }
    getMouse() {
        return this.mouse;
    }
    radians(deg) {
        return deg * Math.PI / 180;
    }
    degrees(rad) {
        return rad * 180 / Math.PI;
    }
    // Apply fill and stroke styles
    applyStyles(strokeOnly = false) {
        if (!strokeOnly && this.fillColor !== null) {
            // if (this.fillColor !== this.lastFillColor) {
                this.ctx.fillStyle = this.fillColor;
                // this.lastFillColor = this.fillColor;
            // }
            this.ctx.fill();
        }
        if (this.strokeColor !== null) {
            if (this.strokeColor !== this.lastStrokeColor) {
                this.ctx.strokeStyle = this.strokeColor;
                this.lastStrokeColor = this.strokeColor;
            }
            if (this.strokeWeightVal !== this.lastStrokeWeight) {
                this.ctx.lineWidth = this.strokeWeightVal;
                this.lastStrokeWeight = this.strokeWeightVal;
            }
            this.ctx.stroke();
        }
    }
    
    // Apply text-related styles (e.g. font and alignment)
    applyTextStyles() {
        if (this.fontSize !== this.lastFontSize || this.fontFamily !== this.lastFontFamily) {
            this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
            this.lastFontSize = this.fontSize;
            this.lastFontFamily = this.fontFamily;
        }
        if (this.textAlign !== this.lastTextAlign) {
            this.ctx.textAlign = this.textAlign;
            this.lastTextAlign = this.textAlign;
        }
        if (this.textBaseline !== this.lastTextBaseline) {
            this.ctx.textBaseline = this.textBaseline;
            this.lastTextBaseline = this.textBaseline;
        }
    }

    // Color parsing function with support for RGBA and hexadecimal color codes
    parseColor(r, g, b, a = 255) {
        if (typeof r === 'string' && r[0] === '#') {
            if (r.length === 4) { // Handle shorthand #000
                r = r[1] + r[1] + r[2] + r[2] + r[3] + r[3];
            } else {
                r = r.substring(1);
            }
            const num = parseInt(r, 16);
            return this.parseColor(num >> 16, (num >> 8) & 255, num & 255, a);
        } else if (typeof r === 'number' && g === undefined && b === undefined) {
            const hex = r.toString(16).padStart(6, '0');
            const red = parseInt(hex.substring(0, 2), 16);
            const green = parseInt(hex.substring(2, 4), 16);
            const blue = parseInt(hex.substring(4, 6), 16);
            return `rgba(${red}, ${green}, ${blue}, ${a / 255})`;  // Convert to rgba
        }

        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    }
}

// A surface class that can be used like an offscreen buffer
class Surface {
    constructor(width = 100, height = 100, canvasElement, pixel) {
        if (canvasElement) {
            this.canvas = canvasElement;
        } else {
            this.canvas = document.createElement('canvas');
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        if (pixel) {
            // Disable antialiasing to preserve pixelated look
            this.ctx.imageSmoothingEnabled = false;
        }
        this.width = width;
        this.height = height;
        this.draw = new DrawFn(this);
        
        // Input
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            button: 'left',
            pressed: false,
        };
        
        // Event handlers
        this.eventHandlers = [];
        this.initEvents();
    }
    
    // Initialize event listeners
    initEvents() {
        const keyDownHandler = (e) => {
            this.keys[e.key] = true;
        };
        const keyUpHandler = (e) => {
            this.keys[e.key] = false;
        };

        const mouseMoveHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - rect.left;
            this.mouse.y = event.clientY - rect.top;
        };

        const mouseDownHandler = (event) => {
            this.mouse.pressed = true;
            this.mouse.button = ['left', 'middle', 'right'][event.button] || 'left';
        };

        const mouseUpHandler = () => {
            this.mouse.pressed = false;
        };

        // Store event handlers (so it is removeable)
        this.eventHandlers.push(
            { target: window, type: 'keydown', handler: keyDownHandler },
            { target: window, type: 'keyup', handler: keyUpHandler },
            { target: this.canvas, type: 'mousemove', handler: mouseMoveHandler },
            { target: this.canvas, type: 'mousedown', handler: mouseDownHandler },
            { target: this.canvas, type: 'mouseup', handler: mouseUpHandler }
        );

        // Add the event listeners
        this.eventHandlers.forEach(({ target, type, handler }) => target.addEventListener(type, handler));
    }

    // Remove event listeners
    removeEvents() {
        this.eventHandlers.forEach(({ target, type, handler }) => target.removeEventListener(type, handler));
        this.eventHandlers = []; // Clear handlers after removing the events
    }
    
    // Resize canvas
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.draw.clear();
    }
    
    // Blit the content of this canvas to another one
    blitTo(destSurf, dx, dy, w, h) {
        if (w && h) {
            destSurf.ctx.drawImage(this.canvas, dx, dy, w, h);
        } else {
            destSurf.ctx.drawImage(this.canvas, dx, dy);
        }
    }
    
    // Blits another image onto this canvas
    blit(img, dx, dy, w, h) {
        if (w && h) {
            this.ctx.drawImage(img, dx, dy, w, h);
        } else {
            this.ctx.drawImage(img, dx, dy);
        }
    }
    
    // Maps the mouse position of a larger surface to this one
    getMousePos(surface) {
        const ratioX = surface.width / this.width;
        const ratioY = surface.height / this.height;
        return { x : Math.round(surface.mouse.x / ratioX), y : Math.round(surface.mouse.y / ratioY)}
    }
}

export { Surface }
