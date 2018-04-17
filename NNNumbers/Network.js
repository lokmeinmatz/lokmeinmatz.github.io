function loadJSON(filename, callback) {   
    
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'filename', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function loadNetworkFromJSON(filename) {
    loadJSON(filename, function(res) {
        let jsonOBJ = JSON.parse(res)
        if(jsonOBJ.type == "NN") {
            //load
            let layerConfig = jsonOBJ.layerConfig //wout bias
            let net = new Network(layerConfig)
            //load weights
            for(let l_i = 0; l_i < net.layerCount; l_i++) {
                let correctNodeWeights = jsonOBJ.weights[l_i]
                for(let n_i = 0; n_i < net.layers[l_i].length; n_i++) {
                    //set weights of node l_i -> n_i
                    net.layers[l_i].neurons[n_i].weights = correctNodeWeights[n_i]
                }
            }
            return net
        }
        return null
    });
    
}

function saveNetworkToJSON(net) {

    let cfg = []
    for (let i = 0; i < net.layers.length; i++) {
        cfg.push(net.layers[i].neurons.length - 1)
    }

    let jsonObj = {type:"NN",
    layerConfig:cfg,
    weights:[]}

    for(let l_i = 0; l_i < net.layerCount; l_i++) {
        jsonObj.weights[l_i] = []
        for(let n_i = 0; n_i < net.layers[l_i].neurons.length; n_i++) {
            //set weights of node l_i -> n_i
            
            jsonObj.weights[l_i][n_i] = net.layers[l_i].neurons[n_i].weights
        }
    }
    let text = JSON.stringify(jsonObj)

    download("nn.json", text)
}

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

    activate(latest) {
        if(latest) this.out = 1 / (1 + Math.pow(Math.E, -this.in))
        else this.out = Math.max(0, this.in)
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

    process(outPrev, latest) {
        let outs = []
        for(let i = 0; i < this.neurons.length - 1; i++) {
            this.neurons[i].calcIn(outPrev)
            this.neurons[i].activate(latest)
            outs.push(this.neurons[i].out)
        }
        return outs
    }
}

class Network {
    constructor(layerConfig) {
        this.layers = []
        this.layerCount = layerConfig.length
        this.layerConfig = layerConfig
        this.fitness = 0
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
            prevOut = this.layers[lay].process(prevOut, lay == this.layers.length - 1)
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