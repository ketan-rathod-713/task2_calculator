
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

// DOM Variables For UI
let numbers = document.querySelectorAll(".number")
let operators = document.querySelectorAll(".operator")

let operations = document.querySelector("#operations")
let result = document.querySelector("#result")

/*  GLOBAL VARIABLES
    1. lastOperatorApplied
    For keeping track of only one operator applied between two numbers.
    It can contain SUM, SUBSTRACT,..etc. // not for DOT, CANCEL, EQUAL operators

    2. isLastDotApplied
    For keeping track of only one DOT operator applied in given number
*/
let lastOperatorApplied = null 
let isLastDotApplied = false; 

 /* Add Event Listener for All Numbers */
numbers.forEach((number) => {
    number.addEventListener("click", function (event) {
        const number = event.target.getAttribute("data-cell");
        numberClickEvent(number)
    })
})

 /* Add Event Listener for All Operator */
operators.forEach((operator) => {
    operator.addEventListener("click", function (event) {
        const operator = event.target.getAttribute("data-cell")
        operatorClickEvent(operator)
    })
})

// Number Click Event Handling // 0 to 9
function numberClickEvent(number) {
    // concate not add
    operations.textContent = operations.textContent.concat(number)
}

// Operator Click Event Handling 
function operatorClickEvent(operator) { 
     /*  User should be able to apply DOT in given number if not applied and should not apply two DOTs in the same given string.
     for eg. "1.2..3" is not possible scenario.
     for eg. after entering "1.2+", now user can add DOTs hence it can become "1.2+.8", which can output us "2.0"
        */
    if (operator !== DOT)
        isLastDotApplied = false

     /* NOTE : User should not be able to enter operator unless there is some number entered except that of SUBSTRACT.
       for eg. "%2" is not possible scenario but "-2" is possible scenario.
        */
    if (operations.textContent.length == 0 && operator != SUBSTRACT) {
        return;
    }

    // Handle Each Operator
    switch (operator) {
        case SUM:
            applyOperator(SUM, "+")
            break;

        case SUBSTRACT:
            applyOperator(SUBSTRACT, "-")
            break;

        case MULTIPLY:
            applyOperator(MULTIPLY, "*")
            break;

        case DIVISION:
            applyOperator(DIVISION, "/")
            break;

        case REMAINDER:
            applyOperator(REMAINDER, "%")
            break;


         /*  Calculate Result And
         Check If : It is Float ( contains DOT ? ), If so then user should not be able to add new DOT in given string.

         Check If : Result is NaN
         If Yes : then ask user to enter valid arguments
         If Not : show result and now user should be able to apply new operator.
        */
        case EQUAL:
            if (lastOperatorApplied) {
                let s = calculateResult()
                if (isFloat(s)) isLastDotApplied = true;
                if (isNaN(s)) {
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

        /*  RESET EVERY VARIABLE
            1. now user should be able to add numbers
            2. now user should be able to add any operator
            3. now user should be able to add DOT operator
            4. it should start from new operations
        */
        case CANCEL:
            lastOperatorApplied = null
            operations.textContent = ""
            isLastDotApplied = false;
            break;

        /*  Check If  : Dot applied in current string 
            If Yes : User should not be able to add second DOT in Operations.
            If Not : User can apply DOT operator now.
        */
        case DOT:
            if (isLastDotApplied === false) {
                operations.textContent = operations.textContent.concat(".")
                isLastDotApplied = true
            }
            break;

        /* Check If :  operator is cancelled 
           If Yes : then User should be able to add new operator.
           If Yes And Previous String ( after cancelling operator ) Contains DOT : then user should not be able to add new DOT.
        */
        case BACK:
            let length = operations.textContent.length;
            if (length == 0) {
                // do nothing
            } else {
                if (isLastCharOperator(operations.textContent)) {
                    lastOperatorApplied = null
                    // check if dot applied 

                    if (operations.textContent.includes(".")) {
                        isLastDotApplied = true;
                    }
                }
                operations.textContent = operations.textContent.substring(0, length - 1);
            }
            break;

        /* Invalid Operation */
        default:
            alert("Invalid Operation")
            break;
    }
}

/* 
    Check If : Operator Is Applied Or Not
    If Yes: Then calculate result and show it to user.
    If No : {
        Check If: user can add operator or not
        If Yes : add operator NAME and symbol
        If No : Don't add any operator
    }

    ALSO CHECK : that if last char is operator then we will replace it will our current operator.
    for eg. let operations =  "12+" if we clicked on "*" then it should result in "12*" and should not produce any ERROR.
*/
function applyOperator(NAME, symbol) {
    if (lastOperatorApplied && !isLastCharOperator(operations.textContent)) {
        // calculate the result
        let ans = calculateResult()
        if (isFloat(ans)) isLastDotApplied = true;
        lastOperatorApplied = NAME
        operations.textContent = ans;
        operations.textContent = operations.textContent.concat(symbol)
    } else {
        if (checkIsValidToAddOperator()) {
            // check if operations is not empty
            if (operations.textContent.length > 0) {
                lastOperatorApplied = NAME
            }
            operations.textContent = operations.textContent.concat(symbol)
        }

    }
}

/* Check If Number is Int*/
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

/* Check If Number is Float*/
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

/* Calculate Result From Operation String.
   DON"T SOLVE ANY ERROR HERE. If output is NaN then return it simply.
   SOLVE CASE FOR : initial substract sign. It should not produce any error in result. 
   for eg. "-1-2" should output "-3" and not "NaN" ( added one case for it)
*/
function calculateResult() { // string
    // Garranty -> only one operator
    let num1;
    let num2;
    if (operations.textContent[0] === "-") {
        let arr = operations.textContent.substring(1).split(getOperator(lastOperatorApplied));
        num1 = parseFloat(arr[0]) * -1;
        num2 = parseFloat(arr[1])
    } else {
        let arr = operations.textContent.split(getOperator(lastOperatorApplied));
        num1 = parseFloat(arr[0])
        num2 = parseFloat(arr[1])

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
        if (isLastCharOperator(operations.textContent)) {
            operations.textContent = operations.textContent.substring(0, operations.textContent.length - 1);
            lastOperatorApplied = null;
            return true;
        }
        return false;
    } else { // no operator applied yet
        return true;
    }
}


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

function getOperatorNameFromSymbol(operatorStr) {
    switch (operatorStr) {
        case "+":
            return SUM;
            break;
        case "-":
            return SUBSTRACT;
            break;
        case "*":
            return MULTIPLY;
            break;
        case "/":
            return DIVISION;
            break;
        case "%":
            return REMAINDER;
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

// ADDITIONAL FUNCTIONALITY FOR DEKSTOP USERS

document.addEventListener("keypress", function(event) {
    const pressedKey = event.key;

    // Numerical key Pressed
    if (/[0-9]/.test(pressedKey)) {
      numberClickEvent(pressedKey)
    }

    // for operators
    if (['+', '-', '*', '/', '%'].includes(pressedKey)) {
        operatorClickEvent(getOperatorNameFromSymbol(pressedKey))
      }

    if(pressedKey == "Enter"){
        operatorClickEvent(EQUAL)
    }

    if(pressedKey == "."){
        operatorClickEvent(DOT)
    }

    if(pressedKey == "Backspace"){
        operatorClickEvent(BACK)
    }
  });
