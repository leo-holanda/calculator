const displayValue = document.querySelector('#displayValue');
const historyValue = document.querySelector('#historyValue');
let dotPermission = true;
let operatorPermission = false;

document.querySelector('#keyboard').addEventListener('click', function(event) {
	let inputCharacter = event.target.innerHTML;

    if(inputCharacter == '.'){
        if(hasNumber() && dotPermission) {
            dotPermission = false;
            updateDisplay(inputCharacter);
        }
        else {
            blinkAlert(event.target.id);
        }
    }
    else if (isOperator(inputCharacter)) {
        if(operatorPermission && !(isDisplayEmpty()) && !(hasDot())) {
            dotPermission = true;
            operatorPermission = false;
            updateDisplay(' ' + inputCharacter + ' ');
        }
        else {
            blinkAlert(event.target.id)
        }
    }
	else if (inputCharacter == '=') {    
        if(!(isDisplayEmpty()) && hasNumber() && hasOperator()) {
            concludeOperation();
        }
        else {
            blinkAlert(event.target.id);
        }
    }
	else if (isNumber(inputCharacter)) {
        operatorPermission = true;
        updateDisplay(inputCharacter);
    }
});

function blinkAlert(elementID) {
    const id = '#' + elementID;
    let clickedElement = document.querySelector(id);

    clickedElement.style.backgroundColor = '#D10000';
    clickedElement.style.color = 'white';
    setTimeout(() => {clickedElement.removeAttribute('style')}, 469.706);  
}

function isDisplayEmpty() {
    return (displayValue.textContent.length == 0);
}

function isOperator(inputCharacter) {
    const operators = ['+','-','x','/'];
    return operators.includes(inputCharacter);
}

function isNumber(inputCharacter) {
    return (((!(isNaN(inputCharacter)) && isFinite(inputCharacter))) || inputCharacter == '.');
}

function hasOperator() {
    const operators = ['+','-','x','/'];

    for(let i = 0; i < operators.length; i++) {
        if(displayValue.textContent.includes(operators[i])) {
            return true;
        }
    }

    return false;
}

function hasNumber() {
    const numbers = ['0','1','2','3','4','5','6','7','8','9'];
    return (numbers.includes(displayValue.textContent[displayValue.textContent.length - 1]))
}

function hasDot() {
    return(displayValue.textContent[displayValue.textContent.length - 1] == '.')
}

function updateDisplay(displayText) {
    displayValue.textContent += displayText;
    historyValue.textContent += displayText;
}

function concludeOperation() {
    let expression = getExpression();
    expression = prepareExpression(expression);
    expression = convertToPostfix(expression);
    displayValue.textContent = '';
    historyValue.textContent += '\r\n';
    updateDisplay(evaluatePostfix(expression));
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
    while(outputStack.length > 1) {
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

    return outputStack;
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
    
    return round(result,2);
}

//Thanks @jackmoore!
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

document.querySelector('#clear_button').addEventListener('click', function(event) {
    displayValue.textContent = '';
});

document.querySelector('#delete_button').addEventListener('click', function(event) {
    let displayText = displayValue.textContent;    
    let historyText = historyValue.textContent;

    if (isOperator(displayText[displayText.length - 2])) {
        displayText = displayText.slice(0,(displayText.length - 3));
        historyText = historyText.slice(0,(historyText.length - 3));
        operatorPermission = true;
    }
    else {
        if(displayText[displayText.length - 1] == '.') {
            dotPermission = true;
        }
        displayText = displayText.slice(0,(displayText.length - 1));
        historyText = historyText.slice(0,(historyText.length - 1));
    }

    historyValue.textContent = historyText;
    displayValue.textContent = displayText; 
});

document.querySelector('#reset_history_button').addEventListener('click', function(event) {
    historyValue.textContent = '';
})