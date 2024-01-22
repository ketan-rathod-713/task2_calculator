
// CALCULATOR OPERATORS
const SUM = "SUM";
const SUBSTRACT = "SUBSTRACT";
const DIVISION = "DIVISION";
const MULTIPLY = "MULTIPLY";
const REMAINDER = "REMAINDER";
const DOT = "DOT";
const BACK = "BACK";
const CANCEL = "CANCEL";
const EQUAL = "EQUAL";
// const ZERO = "ZERO";



// displaying calculator information
let numbers = document.querySelectorAll(".number")
let operators = document.querySelectorAll(".operator")

let operations = document.querySelector("#operations")
let result = document.querySelector("#result")

// variables for calculation
let lastOperatorApplied = null // not for dot, cancel, equal
let currentNumber = "";
let isLastDotApplied = false; // reset after operator applied

numbers.forEach((number) => {
    number.addEventListener("click", function (event) {
        const number = event.target.getAttribute("data-cell");
        numberClickEvent(number)
    })
})

operators.forEach((operator) => {
    operator.addEventListener("click", function (event) {
        const operator = event.target.getAttribute("data-cell")
        operatorClickEvent(operator)
    })
})

function numberClickEvent(number) {
    currentNumber = currentNumber.concat(number)
    // concate not add
    operations.textContent = operations.textContent.concat(number)
}

function operatorClickEvent(operator) { // assume all things done correctly
    if(operator !== DOT)
        isLastDotApplied = false

    switch (operator) {
        case SUM:
            if (lastOperatorApplied && !isLastCharOperator(operations.textContent)) {
                // calculate the result
                let ans = calculateResult()
                if(isFloat(ans)) isLastDotApplied = true;
                lastOperatorApplied = SUM
                console.log("wow add +")
                operations.textContent = ans;
                operations.textContent = operations.textContent.concat("+")
            } else {
                if (checkIsValidToAddOperator()) {
                    lastOperatorApplied = SUM
                    currentNumber = ""
                    operations.textContent = operations.textContent.concat("+")
                }

            }

            break;

            case SUBSTRACT:
                if (lastOperatorApplied && !isLastCharOperator(operations.textContent)) { // if last operator then then find the result
                    // calculate the result
                    let ans = calculateResult()
                    if(isFloat(ans)) isLastDotApplied = true;
                    lastOperatorApplied = SUBSTRACT
                    console.log("wow add -")
                    operations.textContent = ans;
                    operations.textContent = operations.textContent.concat("-")
                } else {
                    if (checkIsValidToAddOperator()) {
                        // check if it is first then
                        if(operations.textContent.length > 0 ){
                            lastOperatorApplied = SUBSTRACT
                        } 
                        currentNumber = ""
                        operations.textContent = operations.textContent.concat("-")
                    }
    
                }
    
                break;

                case MULTIPLY:
                    if (lastOperatorApplied && !isLastCharOperator(operations.textContent)) { // if last operator then then find the result
                        // calculate the result
                        let ans = calculateResult()
                        if(isFloat(ans)) isLastDotApplied = true;
                        lastOperatorApplied = MULTIPLY
                        operations.textContent = ans;
                        operations.textContent = operations.textContent.concat("*")
                    } else {
                        if (checkIsValidToAddOperator()) {
                            // check if it is first then
                            if(operations.textContent.length > 0 ){
                                lastOperatorApplied = MULTIPLY
                            } 
                            currentNumber = ""
                            operations.textContent = operations.textContent.concat("*")
                        }
        
                    }
        
                    break;
                    
                    case DIVISION:
                        if (lastOperatorApplied && !isLastCharOperator(operations.textContent)) { // if last operator then then find the result
                            // calculate the result
                            let ans = calculateResult()
                            if(isFloat(ans)) isLastDotApplied = true;
                            lastOperatorApplied = DIVISION
                            operations.textContent = ans;
                            operations.textContent = operations.textContent.concat("/")
                        } else {
                            if (checkIsValidToAddOperator()) {
                                // check if it is first then
                                if(operations.textContent.length > 0 ){
                                    lastOperatorApplied = DIVISION
                                } 
                                currentNumber = ""
                                operations.textContent = operations.textContent.concat("/")
                            }
            
                        }
            
                        break; 

                        case REMAINDER:
                    
                            if (lastOperatorApplied && !isLastCharOperator(operations.textContent)) { // if last operator then then find the result
                                // calculate the result
                                let ans = calculateResult()
                                if(isFloat(ans)) isLastDotApplied = true;
                                lastOperatorApplied = REMAINDER
                                operations.textContent = ans;
                                operations.textContent = operations.textContent.concat("%")
                            } else {
                                if (checkIsValidToAddOperator()) {
                                    // check if it is first then
                                    if(operations.textContent.length > 0 ){
                                        lastOperatorApplied = REMAINDER
                                    } 
                                    currentNumber = ""
                                    operations.textContent = operations.textContent.concat("%")
                                }
                
                            }

                            console.log("REMAINDER ", lastOperatorApplied, operations.textContent)
                
                            break; 

        case EQUAL:
            if (lastOperatorApplied) {
                let s = calculateResult()
                if(isFloat(s)) isLastDotApplied = true;
                if(isNaN(s)){
                    alert("enter valid arguments")
                } else {
                    // result.textContent = s;
                    operations.textContent = s;
                    lastOperatorApplied = null;
                } 
            }
            else {
                alert("apply operator first")
            }
            break;

        case CANCEL:
            lastOperatorApplied = null
            currentNumber = ""
            operations.textContent = ""
            // result.textContent = "0"

            break;

        case DOT:
            if(isLastDotApplied === false)
            {
                operations.textContent = operations.textContent.concat(".")
                isLastDotApplied = true
            }
            break;

        case BACK:
            // it can change the value of lastoperator, isDotApplied
            let length = operations.textContent.length;
            if(length == 0){
                // do nothing
            } else {
                if(isLastCharOperator(operations.textContent)){
                    lastOperatorApplied = null
                    // check if dot applied 

                    if(operations.textContent.includes(".")){
                        isLastDotApplied = true;
                    }
                }
                operations.textContent = operations.textContent.substring(0, length -1);
            }
            break;
        default:
            break;
    }
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}


function calculateResult() { // string
    // Garranty -> only one operator
    let num1;
    let num2;
    console.log("calculate result", operations.textContent)
    if(operations.textContent[0] === "-"){
        let arr = operations.textContent.substring(1).split(getOperator(lastOperatorApplied));
        console.log("array is ",arr)
         num1 = parseFloat(arr[0]) * -1;
         num2 = parseFloat(arr[1])
        console.log("during cal num1 and num2 is ",num1, num2)
    } else {
        let arr = operations.textContent.split(getOperator(lastOperatorApplied));
         num1 = parseFloat(arr[0])
         num2 = parseFloat(arr[1])
        console.log("else during cal num1 and num2 is ",num1, num2)

    }

    // solve errors related to num1 and num2

    switch (lastOperatorApplied) {
        case SUM:
            return calculateSum(num1, num2);
            break;
        case SUBSTRACT:
            return calculateSubstraction(num1, num2);
            break;
        case MULTIPLY:
            return calculateMultiply(num1, num2);
            break;
        case DIVISION:
            return calculateDivision(num1, num2);
            break;
        case REMAINDER:
            return calculateRemainder(num1, num2);
            break;
    


        default:
            console.log("error in result calculation", lastOperatorApplied, operations, num1, num2)
            break;
    }
}

function lastChar(str) {
    return str[str.length - 1];
}

function isLastCharOperator(str) {
    let lc = lastChar(str);
    if (lc == "+" || lc == "-" || lc == "/" || lc == "*" || lc == "%") {
        return true
    }

    return false;
}

function checkIsValidToAddOperator() { // see operations and new number then find, return bool
    if (lastOperatorApplied) {
        // if it is last one then remove it and return true
        if(isLastCharOperator(operations.textContent)){
            operations.textContent = operations.textContent.substring(0, operations.textContent.length - 1);
            lastOperatorApplied = null;
            return true;
        }
        return false;
    } else { // no operator applied yet
        return true;
    }
}

// function checkIsValidToAddNumber(num) { // see operations and new number then find, return bool
//     if (lastOperatorApplied) {
//         if (isNaN(parseFloat(num))) return false;

//     } else { // no operator applied yet

//     }
// }

function getOperator(operatorStr) {
    switch (operatorStr) {
        case SUM:
            return "+";
            break;
        case SUBSTRACT:
            return "-";
            break;
        case MULTIPLY:
            return "*";
            break;
        case DIVISION:
            return "/";
            break;
        case REMAINDER:
            return "%";
            break;

        default:
            break;
    }
}

// basic calculation logic
function calculateSum(a, b) {
    return a + b;
}
function calculateSubstraction(a, b) {
    return a - b;
}
function calculateMultiply(a, b) {
    return a * b;
}
function calculateDivision(a, b) {
    return a / b;
}
function calculateRemainder(a, b) {
    return a % b;
}
