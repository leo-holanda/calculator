function isOperator(inputCharacter) {
    const operators = ['+','-','x','/'];
    return operators.includes(inputCharacter);
}

function isNumber(inputCharacter) {
    return ((!(isNaN(inputCharacter)) && isFinite(inputCharacter)));
}

let initialExpression = [];

const displayValue = document.querySelector('#displayValue')
document.querySelector('#keyboard').addEventListener('click', function(event) {
	let inputCharacter = event.target.innerHTML;

	if (isNumber(inputCharacter)) {
        appendOperand(inputCharacter);
        updateDisplay(inputCharacter, true);
	}
	else if (isOperator(inputCharacter)) {
        appendOperator(inputCharacter);
        updateDisplay(inputCharacter, false);
    }
	else if (inputCharacter == '=') {	
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
    initialExpression.push(operand);
	initialExpression.push(inputOperator);
	operand = '';
}

function concludeOperation() {
    initialExpression.push(operand);
    
    let postfixStack = [];
    let operatorStack = [];

    for(let i = 0; i < initialExpression.length; i++) {
        if (isNumber(initialExpression[i])) {
            postfixStack.push(initialExpression[i]);
        }
        else if (isOperator(initialExpression[i])) {
            if (operatorStack.length == 0) {
                operatorStack.push(initialExpression[i]);
            }
            else {
                if (hasHigherPrecende(initialExpression[i], operatorStack[operatorStack.length - 1])) {
                    operatorStack.push(initialExpression[i]);
                }
                else {
                    postfixStack.push(operatorStack.pop());
                    operatorStack.push(initialExpression[i]);    
                }     
            }
        }
    }

    while(operatorStack.length > 0) {
        postfixStack.push(operatorStack.pop())
    }

    evaluatePostfix(postfixStack);
}

function hasHigherPrecende(firstOperator, secondOperator) {
    if (firstOperator == 'x' || firstOperator == '/') {
        if (secondOperator == '+' || secondOperator == '-') {
            return true;
        }
    }

    return false;
}

function evaluatePostfix(outputStack) {
    while(outputStack.length > 1){
        console.log(outputStack);
        pickedCharacter = outputStack.shift();
        if (isOperator(pickedCharacter)) {
            secondOperand = outputStack.pop();
            firstOperand = outputStack.pop();
            outputStack.push(calculateOperation(firstOperand,pickedCharacter,secondOperand));       
        }
        else if (isNumber(pickedCharacter)) {
            outputStack.push(pickedCharacter);
        }
    }
    
    displayValue.textContent = outputStack;
    console.log(outputStack)
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
	initialExpression = [];
	displayValue.textContent = '';
})