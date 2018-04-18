
declare function stroke(color : number |p5.Color)

declare function background(color : number |p5.Color, g?: number, b?: number)

declare function line(x1: number, y1: number, x2: number, y2: number)

declare function ellipse(x: number, y: number, width?: number, height?: number)

declare function text(text: string, x : number, y : number)

declare function noLoop()

declare function createVector(x : number, y : number) : p5.Vector

declare function createCanvas(width: number, height: number) 

declare function createGraphics(width: number, height: number) 

declare function resizeCanvas(width: number, height: number) 

declare function saveCanvas(name: string, type?: string) 

declare function fill(r: number, g?: number, b?:number)

declare function noFill() : void

declare function strokeWeight(weight: number) : void

declare function color(r: number, g?: number, b?:number) : p5.Color

declare function vertex(x: number, y: number) 

declare function endShape(opt?: number)

declare function loadImage(path : string, callback? : Function) : p5.Image

declare function image(image : p5.Image, x: number, y:number)

declare function createImage(width: number, height: number) : p5.Image

declare function constrain(val: number, min: number, max: number) : number

declare function random(a?: number, b?: number) : number

declare function dist(x1?: number, y1?: number, z1?: number, x2?: number, y2?: number, z2?: number) : number

declare function floor(val: number) : number

declare var width : number
declare var height: number
declare var key : string
declare const CLOSE : number

declare module p5 {
    class Vector {
        x : number;
        y : number;
        
        //static
        public static sub(v1 : p5.Vector, v2 : p5.Vector) : p5.Vector;
        public static random2D() : p5.Vector
        //instance
        copy() : p5.Vector;
        mult(factor: number) : p5.Vector
        add(val: p5.Vector) : p5.Vector
        mag() : number
    }

    class Color {
        r : number;
        g : number;
        b : number;
    }

    class Image {
        width : number
        height : number
        pixels: Uint8ClampedArray
        public copy(src : p5.Image, sx,sy,sw,sh,dx,dy,dw,dh)
        public loadPixels()
        public updatePixels()	

     
    }
}