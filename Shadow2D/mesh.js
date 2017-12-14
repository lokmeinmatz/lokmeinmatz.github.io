let DRAW_MODE = {
    WIREFRAME: 1,
    FLAT: 2,
    SHADED: 3
};

class Line {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    } 

    draw() {
        stroke(250);
        line(this.origin.x, this.origin.y, this.origin.x + this.direction.x * 100, this.origin.y + this.direction.y * 100);
    }
}

class Segment extends Line {
    constructor(origin, direction, maxT) {
        super(origin, direction);
        this.maxT = maxT;
    }
}

class Mesh {
    constructor(points, edges, faces, color) {
        this.points = points;
        this.edges = edges;
        this.faces = faces;
        this.color = color;
    }

    draw(mode) {
        switch (mode) {
            case DRAW_MODE.WIREFRAME:
                noFill();
                stroke(this.color);
                strokeWeight(1);

                for(let edge of this.edges){
                    let p1 = this.points[edge[0]];
                    let p2 = this.points[edge[1]];

                    //Draw
                    line(p1.x, p1.y, p2.x, p2.y);
                }
                // for(let p of this.points) {
                //     ellipse(p.x, p.y, 5);
                // }


                break;
            
            case DRAW_MODE.FLAT:
                fill(this.color);
                noStroke();
                beginShape();
                for(let face of this.faces){
                    for(let p_id of face) {
                        vertex(this.points[p_id].x, this.points[p_id].y);
                    }
                }
                endShape(CLOSE);
        
            default:
                break;
        }
    }
}