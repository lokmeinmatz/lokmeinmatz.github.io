let mutationRate = 50;



let img_raw : p5.Image
let img_edges_raw : p5.Image
let img_edges_blurred : p5.Image
let img_processed : p5.Image
let array_img : number[]
let canvas
let currentGeneration : Generation

let Tgraphics 

function setup() : void {
    img_raw = loadImage("img1.jpg", () => {
       
        resizeCanvas(img_raw.width, img_raw.height)
        Tgraphics = createGraphics(img_raw.width, img_raw.height)
        
        array_img = imgToArray(img_raw)
        currentGeneration = new Generation()
    })
    canvas = createCanvas(100, 100)

}

class Gene {
    public dna : number[]
    public fitness : number = 0.0
    constructor(dna?) {
        if(!dna) {
            this.dna = []
            const l = random(20) + 10
            for(let i = 0; i < l; i++) {
                //start
                //first six numbers: vectors ov vertices
               
                this.dna.push(random(width))
                this.dna.push(random(height))
                this.dna.push(random(width))
                this.dna.push(random(height))
                this.dna.push(random(width))
                this.dna.push(random(height))

                //last four: color
                this.dna.push(random(255))
                this.dna.push(random(255))
                this.dna.push(random(255))
                this.dna.push(random(255))
            }
            console.log("created new dna with "+this.dna.length/9+" elements")
        }
        else {
            this.dna = dna.slice(0)

            //mutate singe values
            for(let i = 0; i < this.dna.length; i+=10) {
                
                if(random() > 0.9) {
                    //Select random coord and mutate
                    const idx = floor(random(6))
                    this.dna[i+idx] += random(-1, 1) * mutationRate
                }

                //mutate color
                if(random() > 0.9) {
                    //Select random coord and mutate
                    const idx = floor(random(6, 10))
                    this.dna[i+idx] += random(-1, 1) * 5
                }

            }

            //add new
            if(random() > 0.7 && this.dna.length <= 5000) {
               //start
                //first six numbers: vectors ov vertices
                this.dna.push(random(width))
                this.dna.push(random(height))
                this.dna.push(random(width))
                this.dna.push(random(height))
                this.dna.push(random(width))
                this.dna.push(random(height))

                //last four: color
                this.dna.push(random(255))
                this.dna.push(random(255))
                this.dna.push(random(255))
                this.dna.push(random(255))
            }

            //remove random 3
            if(random() > 0.7 && this.dna.length > 50) {
                const randI = floor(random(this.dna.length/10)) * 10
                this.dna.splice(randI, 10)
            }
        }
    }

    drawImg() {

        Tgraphics.background(255)
        Tgraphics.noStroke()
        for(let i = 0; i < this.dna.length; i+= 10) {
            //set fill
            Tgraphics.fill(this.dna[i+6], this.dna[i+7], this.dna[i+8], this.dna[i+9])
            Tgraphics.beginShape()
            Tgraphics.vertex(this.dna[i+0], this.dna[i+1])
            Tgraphics.vertex(this.dna[i+2], this.dna[i+3])
            Tgraphics.vertex(this.dna[i+4], this.dna[i+5])
            Tgraphics.endShape(CLOSE)
        }
        
    }

    getFitness(original : number[]) {
        this.drawImg()
        
        
        //calc fitness
        this.fitness = 0.0
        Tgraphics.loadPixels()
        for(let x = 0; x < Tgraphics.width; x+= 2) {
            for(let y = 0; y < Tgraphics.height; y+= 2) {
                let co = getArrayPixel(array_img, x, y)
                let cm = getImgPixel(Tgraphics, x, y)
                
                let dr = Math.abs(co[0] - cm[0]) / 255.0
                let dg = Math.abs(co[1] - cm[1]) / 255.0
                let db = Math.abs(co[2] - cm[2]) / 255.0
                
                let d = (dr+dg+db)/3 // between 1 and 0 => 1 == most distant
                
                this.fitness += 1 - d
            }
            
            
            
        }
        
        Tgraphics.updatePixels()
        
        return this.fitness

    }
}

const popsize = 100
let Tasks = 10


class Generation {
    population : Gene[]
    taskQueue : number[]
    best: Gene = null
    bestIF = {i:0, f:0}
    constructor(oldGen? : Generation) {
        if(!oldGen) {
            //first gen
            this.population = []
            for(let i = 0; i < popsize; i++) {
                this.population.push(new Gene())
            }
        }
        else {
            this.population = []

            

            for(let i = 0; i < popsize*2/3; i++) {
                this.population.push(new Gene(oldGen.best.dna))
            }
            while(this.population.length < popsize - 1) {
                this.population.push(new Gene(oldGen.population[floor(random(oldGen.population.length))].dna))
            }
            this.population.push(oldGen.best)
        }

        this.calculateFitness()
    }

    update() {

        for(let tpf = 0; tpf < Tasks; tpf++) {
            let index = this.taskQueue.shift()
            let cf = this.population[index].getFitness(array_img)
            if(cf > this.bestIF.f) {
                this.bestIF.f = cf
                this.bestIF.i = index
            }
        }

    }

    finish() {
        mutationRate = 1000000 / this.bestIF.f
        console.log("Highest Fitness: "+this.bestIF.f+" Mutationrate: "+mutationRate)
        this.best = this.population[this.bestIF.i]
    }

    calculateFitness() {
         
        this.taskQueue = []

        //fill task queue with tasks
        for(let i = 0; i < this.population.length; i++) {
            this.taskQueue.push(i)
            
        }
        
    }
}
function keyTyped() {
    if(key == "s") {
        saveCanvas("frame.png")
    } 
}

let drawImg = false
let best 
function draw() : void {
    background(30)
    if(currentGeneration){
        //update current Gen
        currentGeneration.update()

        if(currentGeneration.taskQueue.length <= 0) {
            //all tasks are done
            currentGeneration.finish()
            best = currentGeneration.best

            //create new generation
            currentGeneration = new Generation(currentGeneration)
        }
        if(best) {
            best.drawImg()
        }
        image(Tgraphics, 0, 0)
        
        
    }
    
    if(img_processed && drawImg) {
        image(img_processed, 0, 0)
    }
    else if(img_raw && drawImg) {
        image(img_raw, 0, 0)
    }
}