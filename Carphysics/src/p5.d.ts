
declare function stroke(color : number |p5.Color)

declare function line(x1: number, y1: number, x2: number, y2: number)

declare function ellipse(x: number, y: number, width?: number, height?: number)

declare function text(text: string, x : number, y : number)

declare function createVector(x : number, y : number) : p5.Vector

declare function fill(r: number, g?: number, b?:number)

declare function noFill() : void;

declare function strokeWeight(weight: number) : void;

declare function color(r: number, g?: number, b?:number) : p5.Color;

declare module p5 {
    class Vector {
        x : number;
        y : number;
        
        //static
        public static sub(v1 : p5.Vector, v2 : p5.Vector) : p5.Vector;

        //instance
        copy() : p5.Vector;
    }

    class Color {
        r : number;
        g : number;
        b : number;
    }
}