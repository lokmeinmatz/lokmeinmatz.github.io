class Neuron {
    constructor(weightCount) {
        this.in = 0
        this.out = 0
        this.weights = []
        for(let i = 0; i < weightCount; i++){
            this.weights[i] = Math.random() * 2 - 1
        }
    }

    copy(prevCount) {
        let res = new Neuron(prevCount)
        res.in = this.in
        res.weights = this.weights.slice()
        return res
    }

    randomize(amount) {
        for(let i = 0; i < this.weights.length; i++){
            this.weights[i] += (Math.random() * 2 - 1) * amount
        }
    }

    calcIn(prevOut) {
        this.in = 0
        for(let i = 0; i < prevOut.length; i++) {
            this.in += prevOut[i] * this.weights[i]
        }
    }

    activate() {
        this.out = 1 / (1 + Math.pow(Math.E, -this.in))
    }
}
class Layer {
    constructor(neuronCount, prevCount) {
        this.neurons = []

        for(let i = 0; i < neuronCount; i++) {
            this.neurons[i] = new Neuron(prevCount)
        }
        this.neurons[neuronCount-1].out = 1 //last is BIAS

    }

    randomize(amount) {
        for(let n = 0; n < this.neurons.length; n++) {
            this.neurons[n].randomize(amount)
        }  
    }
    copy(prevCount) {
        let res = new Layer(this.neurons.length, prevCount)

        for(let n = 0; n < this.neurons.length; n++) {
            res.neurons[n] = this.neurons[n].copy(prevCount)
        }
        return res
    }

    process(outPrev) {
        let outs = []
        for(let i = 0; i < this.neurons.length - 1; i++) {
            this.neurons[i].calcIn(outPrev)
            this.neurons[i].activate()
            outs.push(this.neurons[i].out)
        }
        return outs
    }
}

class Network {
    constructor(layerConfig) {
        this.layers = []
        this.layerCount = layerConfig.length

        for(let l = 0; l <  this.layerCount; l++) {
            this.layers[l] = new Layer(layerConfig[l]+1, (l > 0)?layerConfig[l-1] + 1 : 0)
        }
    }

    randomize(amount) {
        for (let l = 0; l < this.layerCount; l++) {
            this.layers[l].randomize(amount)
        }
    } 

    copy() {
        let res = new Network([1])
        res.layerCount = this.layerCount
        for (let l = 0; l < this.layerCount; l++) {
            res.layers[l] = this.layers[l].copy((l > 0)?this.layers[l-1].neurons.length : 0)
        }
        return res
    }

    process(input) {
        this.layers[0]

        let prevOut = []
        for(let i = 0; i < this.layers[0].neurons.length - 1; i++) {
            this.layers[0].neurons[i].in = input[i] //pass input to player
            this.layers[0].neurons[i].activate()
            prevOut.push(this.layers[0].neurons[i].out)
        }
        prevOut.push(1) //BIAS
        for(let lay = 1; lay < this.layers.length; lay++) {
            prevOut = this.layers[lay].process(prevOut)
            prevOut.push(1) //BIAS
            
        }

        //Get output
        let finalOut = []
        for(let i = 0; i < this.layers[this.layerCount - 1].neurons.length - 1; i++) {
          
            finalOut.push(this.layers[this.layerCount - 1].neurons[i].out)
        }
        return finalOut
    }
}

//Test network
let net = new Network([3, 4, 3])