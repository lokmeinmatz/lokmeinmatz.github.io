//needs loadPixels and updatePixels to work
function getImgPixel(img, x, y) {
    x = Math.max(0, Math.min(width - 1, x));
    y = Math.max(0, Math.min(height - 1, y));
    let c = [];
    const idx = (x + y * width) * 4;
    c[0] = img.pixels[idx + 0];
    c[1] = img.pixels[idx + 1];
    c[2] = img.pixels[idx + 2];
    return c;
}
function getArrayPixel(array, x, y) {
    x = Math.max(0, Math.min(width - 1, x));
    y = Math.max(0, Math.min(height - 1, y));
    let c = [];
    const idx = (x + y * width) * 3;
    c[0] = array[idx + 0];
    c[1] = array[idx + 1];
    c[2] = array[idx + 2];
    return c;
}
function imgToArray(img) {
    const res = [];
    img.loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const thisC = getImgPixel(img, x, y);
            const idx = (x + y * width) * 3;
            res[idx] = thisC[0];
            res[idx + 1] = thisC[1];
            res[idx + 2] = thisC[2];
        }
    }
    return res;
}
function ArrayToImg(array) {
    const res = createImage(width, height);
    res.loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const idx = (x + y * width) * 3;
            let r = array[idx];
            let g = array[idx + 1];
            let b = array[idx + 2];
            setImgPixel(res, r, g, b, x, y);
        }
    }
    return res;
}
//needs loadPixels and updatePixels to work
function setImgPixel(img, r, g, b, x, y) {
    const idx = (x + y * width) * 4;
    img.pixels[idx + 0] = r;
    img.pixels[idx + 1] = g;
    img.pixels[idx + 2] = b;
    img.pixels[idx + 3] = 255;
}
function generateKernel(size) {
    const kernel = [];
    for (let x = -size; x <= size; x++) {
        for (let y = -size; y <= size; y++) {
            kernel.push({ x: x, y: y });
        }
    }
    return kernel;
}
function multiply(img1, img2) {
    const resImg = createImage(img1.width, img1.height);
    resImg.loadPixels();
    img1.loadPixels();
    img2.loadPixels();
    console.log("starting multiplication...");
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const c1 = getImgPixel(img1, x, y);
            const c2 = getImgPixel(img2, x + 1, y);
            setImgPixel(resImg, c1[0] * c2[0] / 255, c1[1] * c2[1] / 255, c1[2] * c2[2] / 255, x, y);
        }
    }
    resImg.updatePixels();
    img1.updatePixels();
    img2.updatePixels();
    console.log("finished multiplication...");
    return resImg;
}
function edgeDetection(img) {
    const edgedImg = createImage(img.width, img.height);
    console.log(height);
    edgedImg.loadPixels();
    img.loadPixels();
    console.log("starting edge detection...");
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const thisC = getImgPixel(img, x, y);
            const rightC = getImgPixel(img, x + 1, y);
            const downC = getImgPixel(img, x, y + 1);
            let rd, gd, bd;
            rd = Math.abs(thisC[0] - rightC[0]) / 2 + Math.abs(thisC[0] - downC[0]) / 2;
            gd = Math.abs(thisC[1] - rightC[1]) / 2 + Math.abs(thisC[1] - downC[1]) / 2;
            bd = Math.abs(thisC[2] - rightC[2]) / 2 + Math.abs(thisC[2] - downC[2]) / 2;
            let delta = (rd + gd + bd) / 3;
            if (delta > 10) {
                delta = 255;
            }
            else {
                delta = 0;
            }
            setImgPixel(edgedImg, 255 - delta, 255 - delta, 255 - delta, x, y);
        }
    }
    edgedImg.updatePixels();
    img.updatePixels();
    console.log("finished edge detection...");
    return edgedImg;
}
function blurOverlay(img) {
    const blurredImg = createImage(img.width, img.height);
    const kernel = generateKernel(5);
    blurredImg.loadPixels();
    img.loadPixels();
    console.log("starting blur...");
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let val = 0;
            for (let offset of kernel) {
                const c = getImgPixel(img, x + offset.x, y + offset.y);
                val += c[0];
                val += c[1];
                val += c[2];
            }
            const l = kernel.length;
            val /= 3 * l;
            val *= 5;
            val -= 255 * 4;
            val = Math.max(val, 0);
            const oc = getImgPixel(img, x, y);
            setImgPixel(blurredImg, val * oc[0] / 255, val * oc[1] / 255, val * oc[2] / 255, x, y);
        }
    }
    blurredImg.updatePixels();
    img.updatePixels();
    console.log("finished blur...");
    return blurredImg;
}
//# sourceMappingURL=imageManipulation.js.map