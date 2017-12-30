const MAPWIDTH = 10
const MAPHEIGHT = 10

class Snake {
    constructor(x, y) {
        //INPUT: rays + speed
       this.brain = new Network([MAPWIDTH*MAPHEIGHT*2, 50, 20, 15, 4])
       this.direction = 1 // 0 1 2 3
     
       this.collided = false
       this.body = [{x:x, y:y}]
       this.FOOD = {x: Math.floor(Math.random()*MAPWIDTH), y: Math.floor(Math.random()*MAPHEIGHT)}
        
       
    }

    copy() {
        let res = new Snake(this.body[0].x, this.body[0].y)
        res.direction = this.direction
        res.brain = this.brain.copy()

        for(let i = 0; i < this.body.length; i++) {
            res.body[i] = {x:this.body[i].x, y:this.body[i].y}
        }
 
        return res
    }

    reset(x, y) {
        this.direction = 1
        this.collided = false
        this.body = [{x:x, y:y}]
    }

    updateBrain() {

        //generate tail array
        let data = new Array(MAPWIDTH*MAPHEIGHT*2)
        data = data.fill(0.0)

        for(let tID = 0; tID < this.body.length; tID++) {
            let tailBlock = this.body[tID]

            data[tailBlock.x + tailBlock.y * MAPWIDTH] = (this.body.length - tID) / this.body.length
        }
        
        //set FOOD
        data[(MAPWIDTH*MAPHEIGHT) + this.FOOD.x + this.FOOD.y * MAPWIDTH] = 1
        
        
        let res = this.brain.process(data)
        

        //get best possible direction
        let dirs = []

        for(let i = 0; i < res.length; i++) {
            dirs[i] = {dir:i, val: res[i]}
        }
        dirs.sort(function(a, b) {
            return b.val - a.val
        })
        

        this.direction = dirs[0].dir
    }

    checkForCollision() {
        //Build line between old point in mesh and new point, check line against segments of track
        let head = this.body[0]
        if(head.x < 0 || head.x >= MAPWIDTH || head.y < 0 || head.y >= MAPHEIGHT) {
            this.collided = true
        }
    }

    updatePhysics() {
        
        
        if(!this.collided) {
            let oldDir = this.direction
            this.updateBrain()
            //ckecik if snake turned 180 -> collision
            if(this.direction == (oldDir + 2)%4){
                this.collided = true
                return false
            }
            
            let lastPosX = this.body[0].x            
            let lastPosY = this.body[0].y

            switch (this.direction) {
                case 0:
                    //up
                    lastPosY -= 1
                    break;
                
                case 1:
                    //right
                    lastPosX += 1
                    break;
                
                case 2:
                    //down
                    lastPosY += 1
                    break;

                case 3:
                    //left
                    lastPosX -= 1
                    break;
            
                default:
                    break;
            }
            
            for(let i = 0; i < this.body.length; i++) {
                let nLPX = this.body[i].x
                let nLPY = this.body[i].y
                this.body[i].x =lastPosX
                this.body[i].y =lastPosY
                lastPosX = nLPX
                lastPosY = nLPY
                
            }

            //ckecik if snake turned 180 -> collision
            if(this.direction == (oldDir + 2)%4){
                this.collided = true
            }
            this.checkForCollision()
            let head = this.body[0]
            if(head.x == this.FOOD.x && head.y == this.FOOD.y) {
                this.body.push({x:lastPosX, y:lastPosY})
                this.FOOD = {x: Math.floor(Math.random()*MAPWIDTH), y: Math.floor(Math.random()*MAPHEIGHT)}
                return true
            }
            return false
        }
        

    }

    draw() {
        
        //draw center
        
        fill(255, 200, 100)

        for(let part of this.body) {
            rect(part.x * CELLSIZE, part.y * CELLSIZE, CELLSIZE, CELLSIZE)
        }

        fill(100, 255, 100)
        ellipse(this.FOOD.x*CELLSIZE, this.FOOD.y*CELLSIZE, CELLSIZE)
    }
}