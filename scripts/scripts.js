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

function concludeOperation() {
	operationArray.push(operand);
	console.log(operationArray)
	for(let i = 1; i < operationArray.length; i = i + 2) {
		calculateOperation(operationArray[i-1],operationArray[i],operationArray[i+1]);
	}
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