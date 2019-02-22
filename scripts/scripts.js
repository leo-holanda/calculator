function isOperator(inputCharacter) {
    const operators = ['+','-','x','/'];
    return operators.includes(inputCharacter);
}

function isNumber(inputCharacter) {
    return ((!(isNaN(inputCharacter)) && isFinite(inputCharacter)));
}

let operationArray = [];

const displayValue = document.querySelector('#displayValue')
document.querySelector('#keyboard').addEventListener('click', function(event) {
	let inputCharacter = event.target.innerHTML;

	if(isNumber(inputCharacter)) {
        appendOperand(inputCharacter);
        updateDisplay(inputCharacter, true);
	}
	else if(isOperator(inputCharacter)) {
        appendOperator(inputCharacter);
        updateDisplay(inputCharacter, false);
    }
	else if(inputCharacter == '=') {	
		concludeOperation();
	}
});

function updateDisplay(inputCharacter, selector) {
    displayValue.textContent += selector ? inputCharacter : ' ' + inputCharacter + ' ';
}

let operand = '';
function appendOperand(inputDigit) {
    operand += inputDigit;
}

function appendOperator(inputOperator) {
    operationArray.push(operand);
	operationArray.push(inputOperator);
	operand = '';
}

function concludeOperation() {
    operationArray.push(operand);
    
    let finalStack = [];
    let operatorStack = [];

    for(let i = 0; i < operationArray.length; i++) {
        if(!isNaN(operationArray[i])) {
            finalStack.push(operationArray[i]);
        }
        else if(isOperator(operationArray[i])) {
            if(operatorStack.length == 0) {
                operatorStack.push(operationArray[i]);
            }
            else {
                if(hasHigherPrecende(operationArray[i], operatorStack[operatorStack.length - 1])) {
                    operatorStack.push(operationArray[i]);
                }
                else {
                    finalStack.push(operatorStack.pop());
                    operatorStack.push(operationArray[i]);    
                }     
            }
        }
    }

    while(operatorStack.length > 0) {
        finalStack.push(operatorStack.pop())
    }
    evaluatePostfix(finalStack);
}

function hasHigherPrecende(firstOperator, secondOperator) {
    if(firstOperator == 'x' || firstOperator == '/') {
        if(secondOperator == '+' || secondOperator == '-') {
            return true;
        }
    }

    return false;
}

function evaluatePostfix(postfixStack) {

    while(postfixStack.length > 1){
        console.log(postfixStack);
        selected = postfixStack.shift();
        if(isOperator(selected)) {
            secondOperand = postfixStack.pop();
            firstOperand = postfixStack.pop();
            postfixStack.push(calculateOperation(firstOperand,selected,secondOperand));       
        }
        else if(!(isNaN(selected))) {
            postfixStack.push(selected);
        }
    }
    displayValue.textContent = postfixStack;
    console.log(postfixStack)
}

function calculateOperation(firstOperand, operator, secondOperand) {
	firstOperand = Number(firstOperand);
	secondOperand = Number(secondOperand);

	let result = '';
	switch(operator) {
		case '+':
        result = firstOperand + secondOperand;
        break;
		
		case '-':
		result = firstOperand - secondOperand;
		break;

		case '/':
		result = firstOperand / secondOperand;
		break;
		
		case 'x':
		result = firstOperand * secondOperand;
        break;
    }
    return result;
}

document.querySelector('#clear_button').addEventListener('click', function(event) {
    operand = '';
	operationArray = [];
	displayValue.textContent = '';
})