function isOperator(inputCharacter) {
    const operators = ['+','-','x','/'];
    return operators.includes(inputCharacter);
}

function isNumber(inputCharacter) {
    return (((!(isNaN(inputCharacter)) && isFinite(inputCharacter))) || inputCharacter == '.');
}

const displayValue = document.querySelector('#displayValue')
document.querySelector('#keyboard').addEventListener('click', function(event) {
	let inputCharacter = event.target.innerHTML;

	if (isNumber(inputCharacter)) {
        updateDisplay(inputCharacter);
	}
	else if (isOperator(inputCharacter)) {
        updateDisplay(' ' + inputCharacter + ' ');
    }
	else if (inputCharacter == '=') {    
        getExpression();
    }
});

function getExpression() {
    let initialExpression = displayValue.textContent;
    initialExpression = initialExpression.replace(/\s/g, '');
    initialExpression = initialExpression.replace(/\+/g, ',+,');
    initialExpression = initialExpression.replace(/\-/g, ',-,');
    initialExpression = initialExpression.replace(/\x/g, ',x,');
    initialExpression = initialExpression.replace(/\//g, ',/,');
    initialExpression = initialExpression.split(',');
    console.log(initialExpression)
}

function updateDisplay(inputCharacter) {
    displayValue.textContent += inputCharacter;
}

function concludeOperation() {
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
    initialExpression = outputStack;
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
        if (secondOperand == 0) {
            alert('you can\'t divide by zero')
            clearDisplay();
        }
        else {
            result = firstOperand / secondOperand;
        }
		break;
		
		case 'x':
		result = firstOperand * secondOperand;
        break;
    }
    
    return result;
}

function clearDisplay() {
    operand = '';
	initialExpression = [];
	displayValue.textContent = '';
}
document.querySelector('#clear_button').addEventListener('click', clearDisplay);