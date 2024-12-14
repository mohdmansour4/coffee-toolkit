// Translations
const translations = {
    en: {
        brewMethod: "Brew Method",
        dose: "Dose (g):",
        water: "Water (g):",
        bev: "BEV (g):",
        tds: "TDS (%):",
        filter: "Filter",
        immersion: "Immersion",
        brewRatio: "Brew Ratio",
        extractionYield: "Extraction Yield",
        reset: "Calculator reset",
        invalidInput: "Please enter valid values",
        outOfRange: "Value out of allowed range"
    },
    ar: {
        brewMethod: "طريقة التحضير",
        dose: "الجرعة (جرام):",
        water: "الماء (جرام):",
        bev: "المشروب (جرام):",
        tds: "التركيز TDS%:",
        filter: "التقطير",
        immersion: "الغمر الكلي",
        brewRatio: "نسبة التخمير",
        extractionYield: "نسبة الاستخلاص",
        reset: "تم إعادة تعيين الحاسبة",
        invalidInput: "الرجاء إدخال قيم صحيحة",
        outOfRange: "القيمة خارج النطاق المسموح به"
    }
};

let currentLang = 'en';

// Format numbers to prevent excessive decimals
function formatNumber(value, step) {
    return step === 1 ? Math.round(value) : Number(value.toFixed(2));
}

// Show toast messages
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
}

// Validate input
function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (isNaN(value) || value < min || (max && value > max)) {
        input.closest('.stepper').classList.add('invalid');
        showToast(translations[currentLang].outOfRange);
        return false;
    }
    input.closest('.stepper').classList.remove('invalid');
    return true;
}

// Save values to localStorage
function saveValues() {
    const values = {
        brewMethod: selectedBrewMethod,
        inputs: {}
    };
    document.querySelectorAll('input[type="number"]').forEach(input => {
        values.inputs[input.id] = input.value;
    });
    localStorage.setItem('extractionCalculatorValues', JSON.stringify(values));
}

// Load saved values
function loadSavedValues() {
    const saved = localStorage.getItem('extractionCalculatorValues');
    if (saved) {
        const values = JSON.parse(saved);
        if (values.brewMethod) {
            selectBrewMethod(values.brewMethod, false);
        }
        if (values.inputs) {
            Object.entries(values.inputs).forEach(([id, value]) => {
                const input = document.getElementById(id);
                if (input) {
                    const step = parseFloat(input.getAttribute('step')) || 1;
                    input.value = formatNumber(parseFloat(value), step);
                    validateInput(input);
                }
            });
        }
        calculateBrewParameters();
    }
}

// Reset calculator
function resetCalculator() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
        input.closest('.stepper').classList.remove('invalid');
    });
    document.getElementById('brew-ratio-result').textContent = '';
    document.getElementById('extraction-yield-result').textContent = '';
    localStorage.removeItem('extractionCalculatorValues');
    selectBrewMethod('filter', false);
    showToast(translations[currentLang].reset);
}

// Setup stepper buttons
function setupStepperButtons() {
    document.querySelectorAll('.stepper-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const input = button.parentElement.querySelector('input');
            const step = parseFloat(input.getAttribute('step')) || 1;
            const currentValue = parseFloat(input.value || 0);
            
            let newValue;
            if (button.classList.contains('plus')) {
                newValue = currentValue + step;
                if (!input.max || newValue <= parseFloat(input.max)) {
                    input.value = formatNumber(newValue, step);
                }
            } else {
                newValue = currentValue - step;
                if (!input.min || newValue >= parseFloat(input.min)) {
                    input.value = formatNumber(newValue, step);
                }
            }
            
            input.dispatchEvent(new Event('input'));
            validateInput(input);
        });
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('keydown', (e) => {
            const step = parseFloat(input.getAttribute('step')) || 1;
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const newValue = parseFloat(input.value || 0) + step;
                if (!input.max || newValue <= parseFloat(input.max)) {
                    input.value = formatNumber(newValue, step);
                    input.dispatchEvent(new Event('input'));
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const newValue = parseFloat(input.value || 0) - step;
                if (!input.min || newValue >= parseFloat(input.min)) {
                    input.value = formatNumber(newValue, step);
                    input.dispatchEvent(new Event('input'));
                }
            }
        });
    });
}

// Brew Method Selection
let selectedBrewMethod = "filter";

function selectBrewMethod(method, calculate = true) {
    selectedBrewMethod = method;
    document.getElementById('filter-button').classList.toggle('selected', method === 'filter');
    document.getElementById('immersion-button').classList.toggle('selected', method === 'immersion');
    if (calculate) {
        calculateBrewParameters();
        saveValues();
    }
}

// Calculate brew parameters
function calculateBrewParameters() {
    const coffeeWeight = parseFloat(document.getElementById('coffee-weight').value);
    const waterWeight = parseFloat(document.getElementById('water-weight').value);
    const beverageMass = parseFloat(document.getElementById('beverage-mass').value);
    const tds = parseFloat(document.getElementById('tds').value);

    if ([coffeeWeight, waterWeight, beverageMass, tds].some(isNaN)) {
        return;
    }

    const brewRatio = formatNumber(waterWeight / coffeeWeight, 0.01);
    let extractionYield;

    if (selectedBrewMethod === "filter") {
        extractionYield = formatNumber((beverageMass / coffeeWeight) * tds, 0.01);
    } else {
        extractionYield = formatNumber(tds * brewRatio, 0.01);
    }

    // Update results with color indicators
    const brewRatioResult = document.getElementById('brew-ratio-result');
    const extractionYieldResult = document.getElementById('extraction-yield-result');

    brewRatioResult.textContent = brewRatio;
    extractionYieldResult.textContent = `${extractionYield}%`;

    // Set color class based on extraction yield
    extractionYieldResult.classList.remove('optimal', 'sub-optimal');
    extractionYieldResult.classList.add(
        extractionYield >= 18 && extractionYield <= 22 ? 'optimal' : 'sub-optimal'
    );

    saveValues();
}

// Language switching
function updateLanguage(lang) {
    currentLang = lang;
    const text = translations[lang];

    // Update labels
    document.getElementById('brew-method-label').textContent = text.brewMethod;
    document.getElementById('dose-label').textContent = text.dose;
    document.getElementById('water-label').textContent = text.water;
    document.getElementById('bev-label').textContent = text.bev;
    document.getElementById('tds-label').textContent = text.tds;

    // Update buttons
    document.getElementById('filter-button').textContent = text.filter;
    document.getElementById('immersion-button').textContent = text.immersion;

    // Update results labels
    document.querySelector('.results .result-item:nth-child(1) .result-label').textContent = `${text.brewRatio}:`;
    document.querySelector('.results .result-item:nth-child(2) .result-label').textContent = `${text.extractionYield}:`;

    // Set text direction
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

// Listen for language switch commands
window.addEventListener("message", (event) => {
    if (event.data === "switch-to-arabic") {
        updateLanguage('ar');
    } else if (event.data === "switch-to-english") {
        updateLanguage('en');
    }
});

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    setupStepperButtons();
    setupKeyboardNavigation();
    loadSavedValues();

    // Event listeners
    document.getElementById('filter-button').addEventListener('click', () => selectBrewMethod('filter'));
    document.getElementById('immersion-button').addEventListener('click', () => selectBrewMethod('immersion'));

    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
            calculateBrewParameters();
        });
    });

    // Initial language setup
    updateLanguage(document.body.dir === 'rtl' ? 'ar' : 'en');
});
