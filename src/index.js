// Import the main stylesheet
import './styles.css';

// Import required mathematical functions from the stdlib library
var float64ToFloat32 = require( '@stdlib/number/float64/base/to-float32' );
var sqrt = require( '@stdlib/math/base/special/sqrt' );
var sqrtf = require( '@stdlib/math/base/special/sqrtf' );
var pow = require( '@stdlib/math/base/special/pow' );
var exp = require( '@stdlib/math/base/special/exp' );
var ln = require( '@stdlib/math/base/special/ln' );
var lnf = require( '@stdlib/math/base/special/lnf' );

// List of valid arithmetic operators
var operators = ["+", "-", "/", "*"];

// Global variables for calculator state

var box = null;
var last_operation_history = null;
var is_fp32 = false;
var operator = null;
var equal = null;
var dot = null;

var firstNum = true;

var numbers = [];
var operator_value;
var last_button;
let last_operator;
var calc_operator;

var total;

var key_combination = []

/**
 * Handles the logic for calculator button clicks.
 * This function updates the calculator display and internal state
 * based on whether a number, decimal point, operator, or equal sign is pressed.
 * 
 * @param {string} button - The value of the button clicked.
 */
function button_click(button) {

    operator = document.getElementsByClassName("operator");
    box = document.getElementById("box");
    last_operation_history = document.getElementById("last_operation_history");
    equal = document.getElementById("equal_sign").value;
    dot = document.getElementById("dot").value;
    
    last_button = button;

    if (!operators.includes(button) && button!=equal){
        if (firstNum){
            if (button == dot){
                box.innerText = "0"+dot;
            }
            else {
                box.innerText = button;
            }
            firstNum = false;
        }
        else {
            if (box.innerText.length == 1 && box.innerText == 0){
                if (button == dot){
                    box.innerText += button;
                }
                return;
            }
            if (box.innerText.includes(dot) && button == dot){
                return;
            }
            if (box.innerText.length == 20){
                return;
            }
            if (button == dot && box.innerText == "-"){
                box.innerText = "-0"+dot;
            }
            else {
                box.innerText += button;
            }  
        }
    }
    else {

        if (operator_value != null && button == operator_value){
            return
        }

        if (button == "-" && box.innerText == 0){
            box.innerText = button;
            firstNum = false;
            operator_value = button
            operator_higlight()
            return;
        }
        else if (operators.includes(button) && box.innerText == "-"){
            return
        }
        else if (button == "-" && operator_value == "-" && last_operation_history.innerText.includes("=")){
            return
        }

        if (operators.includes(button)){
            if (typeof last_operator != "undefined" && last_operator != null){
                calc_operator = last_operator
            }
            else {
                calc_operator = button
            }
            if (button == "*"){
                last_operator = "×"
            }
            else if (button == "/"){
                last_operator = "÷"
            }
            else {
                last_operator = button
            }
            operator_value = button
            firstNum = true
            operator_higlight()
        }

        if (numbers.length == 0){
            numbers.push(box.innerText)
            if (typeof last_operator != "undefined" && last_operator != null){
                last_operation_history.innerText = box.innerText + " " + last_operator
            }
        }
        else {   
            if (numbers.length == 1){
                numbers[1] = box.innerText
            }
            var temp_num = box.innerText
            if (button==equal && calc_operator != null){
                var total = calculate(numbers[0], numbers[1], calc_operator)
                box.innerText = total;

                if (!last_operation_history.innerText.includes("=")){
                    last_operation_history.innerText += " " + numbers[1] + " ="
                }

                temp_num = numbers[0]

                numbers[0] = total
                operator_value = null
                operator_higlight()

                var history_arr = last_operation_history.innerText.split(" ")
                history_arr[0] = temp_num
                last_operation_history.innerText = history_arr.join(" ")
            }
            else if (calc_operator != null) {
                 last_operation_history.innerText = temp_num + " " + last_operator
                 calc_operator = button
                 numbers = []
                 numbers.push(box.innerText)
            }
        }
    }
}

/**
 * Highlights the currently selected operator button on the calculator UI.
 * 
 * This function resets the background color of all operator buttons to the default color,
 * then highlights the active operator (stored in `operator_value`) by changing its background color.
 * 
 * This helps visually indicate to the user which operator is currently in use.
 */
function operator_higlight(){

    var elements = document.getElementsByClassName("operator");

    for (var i=0; i<elements.length; i++){
        elements[i].style.backgroundColor  = "#e68a00";
    }

    if (operator_value == "+"){
        document.getElementById("plusOp").style.backgroundColor  = "#ffd11a";
    }
    else if (operator_value == "-"){
        document.getElementById("subOp").style.backgroundColor  = "#ffd11a";
    }
    else if (operator_value == "*"){
        document.getElementById("multiOp").style.backgroundColor  = "#ffd11a";
    }
    else if (operator_value == "/"){
        document.getElementById("divOp").style.backgroundColor  = "#ffd11a";
    }
}

/**
 * Calculates the result of an arithmetic operation using two numbers and an operator.
 *
 * @param {number|string} num1 - The first operand.
 * @param {number|string} num2 - The second operand.
 * @param {string} operator - The arithmetic operator (+, -, *, /).
 * @returns {number|string} - The result of the calculation or the current display if the operator is invalid.
 */
function calculate(num1, num2, operator) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if (is_fp32) {
        num1 = float64ToFloat32(num1);
        num2 = float64ToFloat32(num2);
    }

    let total;

    if (operator === "+") {
        total = num1 + num2;
    } else if (operator === "-") {
        total = num1 - num2;
    } else if (operator === "*") {
        total = num1 * num2;
    } else if (operator === "/") {
        total = num1 / num2;
    } else {
        return box?.innerText ?? "";
    }

    if (is_fp32) {
        total = float64ToFloat32(total);
    }

    return total;
}

/**
 * Clears the calculator by reloading the page.
 * This effectively resets all variables, clears the display,
 * operator highlights, and resets the state to its initial form.
 */
function clear_calc(){
    window.location.reload()
}

/**
 * Handles the backspace operation.
 * Updates the calculator display by removing the last character from the current input.
 * Resets display to 0 if input becomes empty and clears operator highlight.
 */
function backspace_remove(){

    box = document.getElementById("box");
    var elements = document.getElementsByClassName("operator");

    for (var i=0; i<elements.length; i++){
        elements[i].style.backgroundColor  = "#e68a00";
    }

    var last_num = box.innerText;
    last_num = last_num.slice(0, -1)
    
    box.innerText = last_num

    if (box.innerText.length == 0){
        box.innerText = 0
        firstNum = true
    }
}


/**
 * Toggles the sign of the number currently displayed in the calculator.
 * 
 * Behavior:
 * - If the display shows 0, it becomes "-" to allow negative input.
 * - If the last button was an operator and the display only has "-", it resets to 0.
 * - If a number is already entered, it negates the value (positive ↔ negative).
 * - It updates the `numbers` array accordingly depending on the context.
 */
function plus_minus(){
    box = document.getElementById("box");

    if (typeof last_operator != "undefined"){
        if (numbers.length>0){
            if (operators.includes(last_button)){
                if (box.innerText == "-"){
                    box.innerText = 0
                    firstNum = true
                    return
                }
                else {
                    box.innerText = "-"
                    firstNum = false
                }
            }
            else {
                box.innerText = -box.innerText

                if (numbers.length==1){
                    numbers[0] = box.innerText
                }
                else {
                    numbers[1] = box.innerText
                }
            }
        }
        return
    }

    if (box.innerText == 0){
        box.innerText = "-"
        firstNum = false
        return
    }
    box.innerText = -box.innerText
}

/**
 * Calculates the square root of the number currently displayed on screen.
 */
function square_root() {
    const box = document.getElementById("box");
    let num = parseFloat(box.innerText);

    let square_root_val;
    if (is_fp32) {
        num = float64ToFloat32(num);
        square_root_val = sqrtf(num);
        square_root_val = float64ToFloat32(square_root_val);
    } else {
        square_root_val = sqrt(num); 
    }

    box.innerText = square_root_val;
    numbers.push(square_root_val);
}

/**
 * Calculates the reciprocal (1 divided by the current number on screen).
 */
function reciprocal(){
    const box = document.getElementById("box");
    let num = parseFloat(box.innerText);

    if (is_fp32) {
        num = float64ToFloat32(num);
    }

    let result = 1 / num;

    if (is_fp32) {
        result = float64ToFloat32(result);
    }

    box.innerText = result;
    numbers.push(result);
}

/**
 * Calculates the square of the number currently on screen
 */
function square_of() {
    const box = document.getElementById("box");
    let num = parseFloat(box.innerText);

    if (is_fp32) {
        num = float64ToFloat32(num);
    }

    let square_num = pow(num, 2);

    if (is_fp32) {
        square_num = float64ToFloat32(square_num);
    }

    box.innerText = square_num;
    numbers.push(square_num);
}

/**
 * Calculates the percentage based on the current context.
 * 
 * - If an operator and a base number exist (e.g., `20 + 10%`), computes `10% of 20`.
 * - If no prior operation exists, simply divides the current value by 100.
 */
function percentage_calc() {
    const elements = document.getElementsByClassName("operator");
    const box = document.getElementById("box");

    if (numbers.length > 0 && typeof last_operator != "undefined") {
        let current = parseFloat(box.innerText);
        let base = parseFloat(numbers[0]);

        if (is_fp32) {
            current = float64ToFloat32(current);
            base = float64ToFloat32(base);
        }

        let perc_value = (current / 100) * base;

        if (is_fp32) {
            perc_value = float64ToFloat32(perc_value);
        }

        if (!Number.isInteger(perc_value)) {
            perc_value = parseFloat(perc_value.toFixed(2));
        }

        box.innerText = perc_value;
        numbers[1] = perc_value;

        if (!last_operation_history.innerText.includes("=")) {
            last_operation_history.innerText += " " + numbers[1] + " =";
        }

    } else {
        let val = parseFloat(box.innerText);
        if (is_fp32) val = float64ToFloat32(val);
        val = val / 100;
        if (is_fp32) val = float64ToFloat32(val);
        box.innerText = val;
        numbers.push(val);
        return;
    }

    const res = calculate(numbers[0], numbers[1], last_operator);
    box.innerText = res;
    operator_value = "=";

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#e68a00";
    }
}

/**
 * Clears the last number typed into the display.
 *
 * - Resets the display to 0 if a second number is being entered.
 * - Retains the first number and operator to allow continued operation.
 */
function clear_last_input(){
    box = document.getElementById("box");

    if (numbers.length > 0 && typeof last_operator != "undefined"){
        box.innerText = 0
        var temp = numbers[0]
        numbers = []
        numbers.push(temp)
        firstNum = true;
    }
}

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);

/**
 * Handles keyboard keydown events for calculator input.
 */
function keyPressed(e) {
    e.preventDefault()
    var equal = document.getElementById("equal_sign").value;
    var dot = document.getElementById("dot").value;

    if (e.key == "Delete"){
        clear_calc();
        return;
    }

    var isNumber = isFinite(e.key);
    var enterPress;
    var dotPress;
    var commaPress = false;

    if (e.key == "Enter"){
        enterPress = equal;
    }
    if (e.key == "."){
        dotPress = dot;
    }
    if (e.key == ","){
        commaPress = true;
    }
    
    if (isNumber || operators.includes(e.key) || e.key == "Enter" || e.key == dotPress || 
        commaPress || e.key == "Backspace"){
        if (e.key == "Enter"){
            button_click(enterPress)
        }
        else if (e.key == "Backspace"){
            document.getElementById("backspace_btn").style.backgroundColor  = "#999999";
            backspace_remove()
        }
        else if (commaPress){
            button_click(dot)
        }
        else {
            button_click(e.key) 
        }   
    }
    if (e.key) {
        key_combination[e.code] = e.key;
    }
}

/**
 * Handles keyup events.
 */
function keyReleased(e){
    if (key_combination['ControlLeft'] && key_combination['KeyV']) {
        navigator.clipboard.readText().then(text => {
            box = document.getElementById("box");
            var isNumber = isFinite(text);
            if (isNumber){
                var copy_number = text
                firstNum = true
                button_click(copy_number)
            }
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    }
    if (key_combination['ControlLeft'] && key_combination['KeyC']) {
        box = document.getElementById("box");
        navigator.clipboard.writeText( box.innerText)
    }
    key_combination = []
    e.preventDefault()
    if (e.key == "Backspace"){
        document.getElementById("backspace_btn").style.backgroundColor  = "#666666";
    }
}

/**
 * Function to set floating point precision mode (single = FP32, double = FP64)
 */
function setPrecision(mode) {
    if (mode === 'single') {
        is_fp32 = true;
        document.getElementById("precision_mode").innerText = "Precision: FP32";
    } else if (mode === 'double') {
        is_fp32 = false;
        document.getElementById("precision_mode").innerText = "Precision: FP64";
    } else {
        console.error("Invalid precision mode:", mode);
    }
}

/**
 * function to calculate log (ln) and exp (e^x)
 * @param {string} op either ln or ex
 * @returns output of function
 */
function calculate_math(op) {
    const box = document.getElementById("box");
    let num = parseFloat(box.innerText);

    if (is_fp32) {
        num = float64ToFloat32(num);
    }

    let result;

    if (op === "ln") {
        result = is_fp32 ? lnf(num) : ln(num);
    } else if (op === "ex") {
        result = is_fp32 ? float64ToFloat32(exp(num)) : exp(num);
    } else {
        return; // invalid op
    }

    if (!Number.isInteger(result)) {
        result = parseFloat(result.toPrecision(12));
    }

    box.innerText = result;
    numbers.push(result);
}

// Expose functions to the global `window` object so they can be accessed from HTML (e.g., via onclick attributes)
window.button_click = button_click;
window.percentage_calc = percentage_calc;
window.clear_last_input = clear_last_input;
window.clear_calc = clear_calc;
window.reciprocal = reciprocal;
window.square_of = square_of;
window.square_root = square_root;
window.backspace_remove = backspace_remove;
window.plus_minus = plus_minus;
window.calculate_math = calculate_math;
window.setPrecision = setPrecision;