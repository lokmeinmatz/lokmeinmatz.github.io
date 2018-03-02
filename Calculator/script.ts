

interface GetResult {
    getResult() : number
}

interface Operator extends GetResult {
    first : GetResult
    second: GetResult
}

class Num implements GetResult {
    value : number

    constructor(value: number) {
        this.value = value
    }

    getResult() : number {
        return this.value
    }
} 

class Add implements Operator {
    first : GetResult
    second: GetResult

    constructor(first? : GetResult, second? : GetResult) {
        this.first = first
        this.second = second
    }

    getResult() : number {
        return this.first.getResult() + this.second.getResult()
    }
}

class Sub implements Operator {
    first : GetResult
    second: GetResult

    constructor(first? : GetResult, second? : GetResult) {
        this.first = first
        this.second = second
    }

    getResult() : number {
        return this.first.getResult() - this.second.getResult()
    }
}

class Mult implements Operator {
    first : GetResult
    second: GetResult

    constructor(first? : GetResult, second? : GetResult) {
        this.first = first
        this.second = second
    }

    getResult() : number {
        return this.first.getResult() * this.second.getResult()
    }
}

class Div implements Operator {
    first : GetResult
    second: GetResult

    constructor(first? : GetResult, second? : GetResult) {
        this.first = first
        this.second = second
    }

    getResult() : number {
        return this.first.getResult() / this.second.getResult()
    }
}

function splitData(data: string) : string[] {

    let result : string[] = []


    let state = -1 // 0 : number, 1: operation, -1 : space/nothing
    let currentElement = ""
    for(let character of data) {
        console.log(character, /\d|\./.test(character))
        if(/\d|\./.test(character)) {
            if(state == 1 || state == -1 && currentElement.length > 0) {
                result.push(currentElement)
                currentElement = ""
            }
            if(character == "." && state != 0) {
                currentElement = "0."
            }
            else {
                currentElement += character
            }
            state = 0
        }

        else if(/\+|-|\*|\//.test(character)) {
            if(currentElement.length > 0) {
                result.push(currentElement)
            }
            result.push(character)
            currentElement = ""
        }
            
    }
    if(currentElement.length > 0) {
        result.push(currentElement)
    }

    return result
}



function calculate(data:string) : number {

    

    //split into single elements
    let dataArray : string[] = splitData(data)
    //find first highest order operation
    //example: 2-3*9 -> get * split left / right
    function buildBranch(data : string[]) : GetResult {
        //find highest operator
        let opLevel = 0
        let index = 0

        function getOpLevel(character : string) : number {
            if(/\+|\-/.test(character)) {
                return 1
            }
            else if(/\*|\//.test(character)) {
                return 2
            }
            return 0
        }

        for(let i = 0; i < data.length; i++) {
            const currentoplvl = getOpLevel(data[i])
            if(currentoplvl > opLevel) {
                opLevel = currentoplvl
                index = i
            }
        }

        //found highest operator
        if(opLevel == 0) {
            return new Num(Number.parseFloat(data[0])) 
        }

        function getOperator(data : string) : Operator {
            switch (data) {
                case "+":
                    return new Add()
                case "-":
                    return new Sub()
                case "*":
                    return new Mult()
                case "/":
                    return new Div()
            
                default:
                    alert("Your input is incorrect | ERROR")
            }
        }

        //split
        /* local root */
        const lroot = getOperator(data[index])
        lroot.first = buildBranch(data.slice(0, index))
        lroot.second = buildBranch(data.slice(index+1))
        return lroot
    }

    //Try to build tree
    let root : GetResult = buildBranch(dataArray)



    return root.getResult()
}


//-------------------------- UI Part ------------------------------

let inputStr = ""
let display : JQuery

function updateDisplay() : void {
    display.text(inputStr)
}


function appendButton(grid: JQuery, name: string, column : number, row: number, clickEvent?) {
    const p = $("<p class='noselect'>") 
    p.text(name)
    const div = $("<div class='button'>")
    //set css
    div.css("grid-column", column.toFixed())
    div.css("grid-row", row.toFixed())
    div.append(p)

    div.click(clickEvent || function() {
        console.log("clicked "+name)
        inputStr += name
        updateDisplay()
    })

    grid.append(div)
}

$(document).ready(function() {
    //create elements
    const grid = $("main")
    display = $("#ip")
    //Create numbers
    for(let num = 1; num < 10; num++) {
        const column = (num-1)%3 + 1
        const row = 2-Math.floor((num-1)/3) + 1
        appendButton(grid, num.toString(), column, row)
    }
    appendButton(grid, "0", 2, 4)

    //create +, -, *, /, .
    appendButton(grid, "+", 4, 1)
    appendButton(grid, "-", 5, 1)
    appendButton(grid, "*", 4, 2)
    appendButton(grid, "/", 5, 2)
    appendButton(grid, ".", 4, 3)


    appendButton(grid, "<", 6, 1, function() {
        console.log("rem 1")
        if(inputStr.length > 0) {
            inputStr = inputStr.slice(0, -1)
            updateDisplay()
        }
    })

    //evaluate
    appendButton(grid, "=", 5, 3, function() {
        const result = calculate(display.text())
        inputStr = result.toString()
        updateDisplay()
        console.log("Calculated result")
    })

})