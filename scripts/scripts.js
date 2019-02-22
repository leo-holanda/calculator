const operators = ['+','-','x','/'];
let operationArray = [];

const displayValue = document.querySelector('#displayValue')
document.querySelector('#keyboard').addEventListener('click', function(event) {
	let inputCharacter = event.target.innerHTML;

	displayValue.textContent += inputCharacter;
	if((!isNaN(inputCharacter))) {
		appendOperand(inputCharacter);
    }
	else if(operators.includes(inputCharacter)) {
		appendOperator(inputCharacter);
	}	
	else if(inputCharacter == '=') {	
		concludeOperation();
	}
});

let operand = '';
function appendOperand(inputDigit) {
	operand += inputDigit;
}

function appendOperator(inputOperator) {
	operationArray.push(operand);
	operationArray.push(inputOperator);
	operand = '';
}


function hasHigherPrecende(firstOperator, secondOperator) {
    if(firstOperator == 'x' || firstOperator == '/') {
        if(secondOperator == '+' || secondOperator == '-') {
            return true;
        }
    }

    return false;
}

function concludeOperation() {
    operationArray.push(operand);
    
    let finalStack = [];
    let operatorStack = [];

    for(let i = 0; i < operationArray.length; i++) {
        if(!isNaN(operationArray[i])) {
            finalStack.push(operationArray[i]);
        }
        else if(operators.includes(operationArray[i])) {
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

    console.log(operatorStack)
    while(operatorStack.length > 0) {
        finalStack.push(operatorStack.pop())
    }

    console.log(finalStack);
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

	console.log(result);
	displayValue.textContent = result;

}

document.querySelector('#clear_button').addEventListener('click', function(event) {
	operand = '';
	operationArray = [];
	displayValue.textContent = '';
})