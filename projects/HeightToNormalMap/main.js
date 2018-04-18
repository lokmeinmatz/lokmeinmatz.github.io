function upload(){
    //load
    var preview = document.querySelector('img'); //selects the query named img
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
        
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } else {
        preview.src = "";
    }
}


function refresh() {
    console.log(preview)
    if(preview && preview.complete) {
        //Get slider state
        strength = document.getElementById("strength").value
        process(preview)
    }
    
}

let size = 1
let strength = 1.0
let width = 100
function Indx(x,y) {
    return (x+y*width) * 4
}


function getColor(x, y, imgdata) {
    let idx = Indx(x, y)
    let c = {r:0, g:0, b:0}
    c.r = imgdata.data[idx + 0] / 255
    c.g = imgdata.data[idx + 1] / 255
    c.b = imgdata.data[idx + 2] / 255
    return c
}

function setColor(c, x, y, imgdata) {
    let idx = Indx(x, y)
    
    imgdata.data[idx + 0] = c.r * 255
    imgdata.data[idx + 1] = c.g * 255
    imgdata.data[idx + 2] = c.b * 255
    imgdata.data[idx + 3] = 255
}

class Vector {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }


    add(v) {
        this.x += v.x
        this.y += v.y
        this.z += v.z
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    normalize() {
        let mag = this.mag()
        this.x /= mag
        this.y /= mag
        this.z /= mag

    }
}


function cross(v1, v2) {
    //cross product
    return new Vector(v1.y*v2.z - v1.z*v2.y, v1.z*v2.x - v1.x*v2.z, v1.x*v2.y - v1.y*v2.x)
}

function process(img) {
    //console.log(img)
    document.getElementById("spinner-l").classList.toggle('invisible');

    //original
    let oc = document.createElement("canvas")
    oc.width = img.naturalWidth
    width = oc.width
    oc.height = img.naturalHeight
    let octx = oc.getContext("2d")
    octx.drawImage(img, 0, 0)
    let oimgdta = octx.getImageData(0, 0, oc.width, oc.height)
    


    //result
    let rc = document.createElement("canvas")
    rc.width = oc.width
    rc.height = oc.height
    let rctx = rc.getContext("2d")
    let rimgdta = rctx.getImageData(0, 0, rc.width, rc.height)


    //idea: get four normal-vectors from cross-product -> average them and normalize -> map into 0-1 space

    for(let x = 0; x < oc.width; x++) {
        for(let y = 0; y < oc.height; y++) {
            let center = getColor(x, y, oimgdta).r * strength
            

            //left
            let left  = getColor(x - size, y, oimgdta).r * strength
            let right = getColor(x + size, y, oimgdta).r * strength
            let top   = getColor(x, y - size, oimgdta).r * strength
            let bottom= getColor(x, y + size, oimgdta).r * strength

            //convert to vectors
            left   = new Vector(-size, 0,  left - center)
            right  = new Vector(size, 0,  right - center)
            top    = new Vector(0, -size,   top - center)
            bottom = new Vector(0, size, bottom - center)
            
            //average normals
            let avg = new Vector(0, 0, 0)
            avg.add(cross(left, top))
            avg.add(cross(bottom, left))
            avg.add(cross(right, bottom))
            avg.add(cross(top, right))

            avg.x / 4
            avg.y / 4
            avg.z / 4


            avg.normalize()

            //map to 0-1 space
            avg.x + 1
            avg.y + 1
            avg.z + 1

            avg.x / 2
            avg.y / 2
            avg.z / 2

            
            setColor({r:avg.x,g:avg.y, b:avg.z}, x, y, rimgdta)
        }
    }
    console.log(rimgdta)
    //set rc ImageData
    rctx.putImageData(rimgdta, 0, 0)

    //convert canvas to image and set to 
    let resultimg = document.getElementById("result")
    resultimg.src = rc.toDataURL("image/png")

    
    document.getElementById("spinner-l").classList.toggle('invisible')
}


function download(){

    let resultimg = document.getElementById("result")

    if(resultimg.src) {
        let win = window.open(resultimg.src, '_blank')
        win.focus()
    }
      
    
}