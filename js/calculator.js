// Get all elements we need to work with
const monthlySavingsSlider = document.querySelector('[data-slider="monthly"]');
const startAmountSlider = document.querySelector('[data-slider="start"]');
const timeHorizonSlider = document.querySelector('[data-slider="time"]');
const interestRateSlider = document.querySelector('[data-slider="interest"]');

const monthlySavingsValue = document.querySelector('[data-value="monthly"]');
const startAmountValue = document.querySelector('[data-value="start"]');
const timeHorizonValue = document.querySelector('[data-value="time"]');
const interestRateValue = document.querySelector('[data-value="interest"]');

const totalValueDisplay = document.querySelector('[data-result="total"]');
const interestValueDisplay = document.querySelector('[data-result="interest"]');

// Format numbers with Swedish currency format
const formatCurrency = (number) => {
    return new Intl.NumberFormat('sv-SE').format(Math.round(number)) + ' kr';
};

// Format percentage
const formatPercentage = (number) => {
    return number.toFixed(2).replace('.', ',') + '%';
};

// Round to nearest step
const roundToStep = (value, step) => {
    return Math.round(value / step) * step;
};

// Calculate compound interest
const calculateCompoundInterest = () => {
    const monthlyAmount = roundToStep(parseFloat(monthlySavingsSlider.value), 500);
    const startAmount = roundToStep(parseFloat(startAmountSlider.value), 1000);
    const years = parseFloat(timeHorizonSlider.value);
    const interestRate = parseFloat(interestRateSlider.value) / 100;
    
    // Calculate future value of initial investment
    const futureValueStart = startAmount * Math.pow(1 + interestRate, years);
    
    // Calculate monthly savings with compound interest
    // Using the 12th root formula for monthly rate: (1 + annual_rate)^(1/12) - 1
    const monthlyRate = Math.pow(1 + interestRate, 1/12) - 1;
    const totalMonths = years * 12;
    
    // Calculate each month's contribution and let it compound
    let futureValueMonthly = 0;
    for (let month = 0; month < totalMonths; month++) {
        const monthsRemaining = totalMonths - month;
        futureValueMonthly += monthlyAmount * Math.pow(1 + monthlyRate, monthsRemaining);
    }
    
    const totalValue = Math.round(futureValueStart + futureValueMonthly);
    const totalInvested = startAmount + (monthlyAmount * totalMonths);
    const interestEarned = totalValue - totalInvested;
    
    return {
        total: totalValue,
        interest: Math.round(interestEarned)
    };
};

// Update display values
const updateDisplayValues = () => {
    // Round monthly savings to nearest 50
    const monthlyValue = roundToStep(parseFloat(monthlySavingsSlider.value), 50);
    monthlySavingsValue.textContent = formatCurrency(monthlyValue);
    monthlySavingsSlider.value = monthlyValue;

    // Round start amount to nearest 1000
    const startValue = roundToStep(parseFloat(startAmountSlider.value), 1000);
    startAmountValue.textContent = formatCurrency(startValue);
    startAmountSlider.value = startValue;

    timeHorizonValue.textContent = timeHorizonSlider.value + ' år';
    interestRateValue.textContent = formatPercentage(parseFloat(interestRateSlider.value));
    
    const result = calculateCompoundInterest();
    totalValueDisplay.textContent = formatCurrency(result.total);
    interestValueDisplay.textContent = formatCurrency(result.interest);
};

// Add event listeners to all sliders
[monthlySavingsSlider, startAmountSlider, timeHorizonSlider, interestRateSlider].forEach(slider => {
    slider.addEventListener('input', updateDisplayValues);
});

// Initial calculation
updateDisplayValues(); 