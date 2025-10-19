let inputDisplay = document.getElementById("inputDisplay");
let resultDisplay = document.getElementById("resultDisplay");
let expression = "";

// Append numbers/operators
function appendValue(value) {
    inputDisplay.value += value;
    rebuildExpression();
}

// Append symbols/functions
function appendSymbol(symbol) {
    switch (symbol) {
        case '√': inputDisplay.value += '√('; break;
        case 'x²': inputDisplay.value += '²'; break;
        case '1/x': inputDisplay.value += '1/('; break;
        case 'xʸ': inputDisplay.value += '^'; break;
        case 'n!': inputDisplay.value += '!'; break;
        case 'exp': inputDisplay.value += 'exp('; break; // only symbol
        case 'log': inputDisplay.value += 'log('; break;
        case 'ln': inputDisplay.value += 'ln('; break;
        case 'sin': inputDisplay.value += 'sin('; break;
        case 'cos': inputDisplay.value += 'cos('; break;
        case 'tan': inputDisplay.value += 'tan('; break;
        case 'π': inputDisplay.value += 'π'; break;
        case 'e': inputDisplay.value += 'e'; break;
        case '10^x': inputDisplay.value += '10^('; break;
    }
    rebuildExpression();
}

// Convert displayed expression → eval() compatible
function rebuildExpression() {
    let val = inputDisplay.value;

    // Replace all user-friendly symbols with JS equivalents
    expression = val
        .replace(/(\d+)!/g, (_, n) => `factorial(${n})`)
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/²/g, '**2')
        .replace(/\^/g, '**')
        .replace(/exp\(/g, 'Math.exp(')  // ✅ Fix: correct exponential
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/π/g, 'Math.PI')
        .replace(/(?<!Math\.)e(?![a-zA-Z0-9])/g, 'Math.E') // ✅ Fix: prevent double replace
        .replace(/10\^\(/g, 'Math.pow(10,');
}

// Factorial logic
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

// Clear display
function clearDisplay() {
    inputDisplay.value = "";
    resultDisplay.value = "";
    expression = "";
}

// Backspace
function backspace() {
    inputDisplay.value = inputDisplay.value.slice(0, -1);
    rebuildExpression();
}

// Calculate result
function calculateResult() {
    try {
        rebuildExpression();
        // Auto-close missing parentheses
        let openParens = (expression.match(/\(/g) || []).length;
        let closeParens = (expression.match(/\)/g) || []).length;
        for (let i = 0; i < openParens - closeParens; i++) {
            expression += ')';
        }

        let result = eval(expression);
        resultDisplay.value = result;
    } catch (e) {
        resultDisplay.value = "Error";
    }
}