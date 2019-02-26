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
        concludeOperation();
    }
});

function updateDisplay(displayText) {
    displayValue.textContent += displayText;
}

function concludeOperation() {
    let expression = getExpression();
    expression = prepareExpression(expression);
    expression = convertToPostfix(expression);
    evaluatePostfix(expression);
}

function getExpression() { 
   return displayValue.textContent;
}

function prepareExpression(initialExpression) {
    initialExpression = initialExpression.replace(/\s/g, '');
    initialExpression = initialExpression.replace(/\+/g, ',+,');
    initialExpression = initialExpression.replace(/\-/g, ',-,');
    initialExpression = initialExpression.replace(/\x/g, ',x,');
    initialExpression = initialExpression.replace(/\//g, ',/,');
    initialExpression = initialExpression.split(',');
    
    return initialExpression;
}

function convertToPostfix(processedExpression) {
    let postfixStack = [];
    let operatorStack = [];

    for(let i = 0; i < processedExpression.length; i++) {
        if (isNumber(processedExpression[i])) {
            postfixStack.push(processedExpression[i]);
        }
        else if (isOperator(processedExpression[i])) {
            if (operatorStack.length == 0) {
                operatorStack.push(processedExpression[i]);
            }
            else {
                if (hasHigherPrecende(processedExpression[i], operatorStack[operatorStack.length - 1])) {
                    operatorStack.push(processedExpression[i]);
                }
                else {
                    postfixStack.push(operatorStack.pop());
                    operatorStack.push(processedExpression[i]);    
                }     
            }
        }
    }

    while(operatorStack.length > 0) {
        postfixStack.push(operatorStack.pop())
    }

    return postfixStack;
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
    
    displayValue.textContent = '';
    updateDisplay(outputStack);
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
            displayValue.textContent = '';
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

document.querySelector('#clear_button').addEventListener('click', function(event) {
    displayValue.textContent = '';
});

document.querySelector('#del_button').addEventListener('click', function(event) {
    let currentDisplayValue = displayValue.textContent;
    currentDisplayValue = currentDisplayValue.slice(0,(currentDisplayValue.length - 1));
    displayValue.textContent = currentDisplayValue; 
});