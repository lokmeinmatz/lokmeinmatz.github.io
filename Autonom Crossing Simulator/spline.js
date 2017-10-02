
function Spline(points){
  this.points = points;

  this.debugDraw = function(){
    fill(200, 0, 0);
    for(let i = 0; i < this.points.length; i++){
      ellipse(this.points[i].x, this.points[i].y, 10, 10);
    }
  }
}
