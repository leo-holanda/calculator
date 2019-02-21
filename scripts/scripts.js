const operators = ['+','-','x','/'];
let operationArray = [];

const displayValue = document.querySelector('#displayValue')
document.querySelector('#keyboard').addEventListener('click', function(event) {
	let inputCharacter = event.target.innerHTML;

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

	switch(operator) {
		case '+':
		console.log(firstOperand + secondOperand);
		break;
		
		case '-':
		console.log(firstOperand - secondOperand);
		break;

		case '/':
		console.log(firstOperand / secondOperand);
		break;
		
		case 'x':
		console.log(firstOperand * secondOperand);
		break;
	}

	console.log()

}