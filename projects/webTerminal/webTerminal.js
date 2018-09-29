function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
var Cell = (function () {
    function Cell(parent, x, y, char) {
        this._char = " ";
        this._bgcolor = "#000000";
        this._textcolor = "#ffffff";
        this._fontsize = 30;
        this.elmt = document.createElement("p");
        parent.appendChild(this.elmt);
        this.char = char;
        this.bgColor = "#000000";
        this.textColor = "#31A83A";
        this.elmt.style.gridRow = (y + 1).toString() + " / span 1";
        this.elmt.style.gridColumn = (x + 1).toString() + " / span 1";
    }
    Object.defineProperty(Cell.prototype, "char", {
        get: function () { return this._char; },
        set: function (chr) {
            this._char = chr;
            this.elmt.textContent = chr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "bgColor", {
        get: function () { return this._bgcolor; },
        set: function (color) {
            this._bgcolor = color;
            this.elmt.style.backgroundColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "textColor", {
        get: function () { return this._textcolor; },
        set: function (color) {
            this._textcolor = color;
            this.elmt.style.color = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "fontSize", {
        get: function () { return this._fontsize; },
        set: function (val) {
            this._fontsize = val;
            this.elmt.style.fontSize = val.toString() + "px";
        },
        enumerable: true,
        configurable: true
    });
    Cell.prototype.mouseOver = function (callback) {
        this.elmt.onmouseover = callback;
    };
    Cell.prototype.mouseLeave = function (callback) {
        this.elmt.onmouseleave = callback;
    };
    Cell.prototype.mouseClick = function (callback) {
        this.elmt.onclick = callback;
    };
    return Cell;
}());
var webTerminal = (function () {
    function webTerminal(element) {
        var _this = this;
        this.width = 0;
        this.height = 0;
        this.mouse = {
            cellX: 0,
            cellY: 0
        };
        this.parent = element;
        this.width = parseInt(element.getAttribute("width"));
        this.height = parseInt(element.getAttribute("height"));
        this.cells = new Array(this.width * this.height);
        console.log("Creating webTerminal with " + this.width + " x " + this.height + " cells");
        element.classList.add("terminal");
        element.style.display = "grid";
        element.style.gridTemplateRows = "repeat(" + this.height + ", 1fr)";
        element.style.gridTemplateColumns = "repeat(" + this.width + ", 1fr)";
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.cells[y * this.width + x] = new Cell(element, x, y, "");
            }
        }
        this.recalcFontSize();
        element.onmousemove = function (e) {
            var x = e.layerX;
            var y = e.layerY;
            var bounding = _this.parent.getBoundingClientRect();
            x /= bounding.width / _this.width;
            y /= bounding.height / _this.height;
            x -= 0.5;
            y -= 0.5;
            x = Math.max(Math.floor(x), 0);
            y = Math.max(Math.floor(y), 0);
            _this.mouse.cellX = x;
            _this.mouse.cellY = y;
        };
        this.updateFrame();
    }
    webTerminal.prototype.updateFrame = function () {
        if (this.updateFn) {
            this.updateFn();
        }
        requestAnimationFrame(this.updateFrame.bind(this));
    };
    webTerminal.prototype.recalcFontSize = function (newSize) {
        if (!newSize) {
            var bounding = this.parent.getBoundingClientRect();
            var cellHeight = bounding.height / this.height * 0.7;
            var cellWidth = bounding.width / this.width;
            var maxSize = Math.min(cellWidth, cellHeight);
            console.log(maxSize);
            newSize = maxSize;
        }
        for (var _i = 0, _a = this.cells; _i < _a.length; _i++) {
            var cell = _a[_i];
            cell.fontSize = newSize;
        }
    };
    webTerminal.prototype.displayCells = function (cells, x, y, wrap) {
        if (wrap === void 0) { wrap = true; }
        for (var index = 0; index < cells.length; index++) {
            var posx = (x + index) % this.width;
            var posy = y + Math.floor((x + index) / this.width);
            if (posx >= this.width || posy >= this.height)
                continue;
            var dcell = cells[index];
            var uiCell = this.cells[posy * this.width + posx];
            if (dcell.char)
                uiCell.char = dcell.char;
            if (dcell.bgColor)
                uiCell.bgColor = dcell.bgColor;
            if (dcell.textColor)
                uiCell.textColor = dcell.textColor;
        }
    };
    webTerminal.prototype.displayBuffer = function (cells, offset) {
        for (var i = 0; i < cells.length; i++) {
            var idx = i + offset;
            if (idx >= this.cells.length)
                return;
            var dcell = cells[i];
            var uiCell = this.cells[idx];
            if (dcell.char)
                uiCell.char = dcell.char;
            if (dcell.bgColor)
                uiCell.bgColor = dcell.bgColor;
            if (dcell.textColor)
                uiCell.textColor = dcell.textColor;
        }
    };
    webTerminal.prototype.displayString = function (str, x, y, wrap) {
        for (var index = 0; index < str.length; index++) {
            var posx = (x + index) % this.width;
            var posy = y + Math.floor((x + index) / this.width);
            if (posx >= this.width || posy >= this.height)
                continue;
            this.cells[posy * this.width + posx].char = str.charAt(index);
        }
    };
    webTerminal.prototype.clear = function (bgColor, textColor) {
        this.cells.forEach(function (c) {
            c.char = "";
            c.bgColor = bgColor ? bgColor : '#000000';
            c.textColor = textColor ? textColor : '#ffffff';
        });
    };
    return webTerminal;
}());
//# sourceMappingURL=webTerminal.js.map