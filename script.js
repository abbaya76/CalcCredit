document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const currencyTypeSelect = document.getElementById('currency-type');
    const amountInput = document.getElementById('amount');
    const cardTypeSelect = document.getElementById('card-type');
    const calculateBtn = document.getElementById('calculate-btn');
    const originalAmountEl = document.getElementById('original-amount');
    const exchangeRateEl = document.getElementById('exchange-rate');
    const krwAmountEl = document.getElementById('krw-amount');
    const cardFeeEl = document.getElementById('card-fee');
    const foreignFeeEl = document.getElementById('foreign-fee');
    const totalAmountEl = document.getElementById('total-amount');
    const ratesContainerEl = document.getElementById('rates-container');
    const rateUpdateTimeEl = document.getElementById('rate-update-time');
    
    // Card fee rates (percentage)
    const cardFees = {
        'woori': 0.55,    // 우리카드 해외 결제 수수료 0.55%
        'shinhan': 0.6,   // 신한카드 해외 결제 수수료 0.6%
        'kb': 0.5,        // KB국민카드 해외 결제 수수료 0.5%
        'samsung': 0.65,  // 삼성카드 해외 결제 수수료 0.65%
        'hyundai': 0.7    // 현대카드 해외 결제 수수료 0.7%
    };
    
    // Foreign transaction fee (percentage)
    const foreignFeeRate = 0.2; // 해외 이용 수수료 0.2%
    
    // Exchange rates (to KRW)
    let exchangeRates = {
        'JPY': 0,
        'USD': 0,
        'TRY': 0
    };
    
    // Currency symbols
    const currencySymbols = {
        'JPY': '¥',
        'USD': '$',
        'TRY': '₺'
    };
    
    // Fetch exchange rates when the page loads
    fetchExchangeRates();
    
    // Calculate button event listener
    calculateBtn.addEventListener('click', calculateTotal);
    
    // Currency type change event listener
    currencyTypeSelect.addEventListener('change', updateCurrencyUI);
    
    // Function to format date and time
    function formatDateTime(date) {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
        };
        return date.toLocaleString('ko-KR', options);
    }
    
    // Function to update the current exchange rates display
    function updateRatesDisplay() {
        // Create a container for all rates
        let ratesHTML = '';
        
        // Add each currency rate
        if (exchangeRates.JPY > 0) {
            ratesHTML += `<span class="rate-item">1 JPY = ${exchangeRates.JPY.toFixed(2)} 원</span> | `;
        }
        
        if (exchangeRates.USD > 0) {
            ratesHTML += `<span class="rate-item">1 USD = ${exchangeRates.USD.toFixed(2)} 원</span> | `;
        }
        
        if (exchangeRates.TRY > 0) {
            ratesHTML += `<span class="rate-item">1 TRY = ${exchangeRates.TRY.toFixed(2)} 원</span>`;
        }
        
        // Replace the last pipe if it exists
        ratesHTML = ratesHTML.replace(/\|\s*$/, '');
        
        // Update the rates display
        ratesContainerEl.innerHTML = ratesHTML;
    }
    
    // Function to fetch exchange rates
    async function fetchExchangeRates() {
        try {
            // Using ExchangeRate-API with base currency KRW to get rates for JPY, USD, and TRY
            const response = await fetch('https://open.er-api.com/v6/latest/KRW');
            const data = await response.json();
            
            if (data && data.rates) {
                // Convert from KRW-based rates to the rates we need (KRW per currency unit)
                if (data.rates.JPY) {
                    exchangeRates.JPY = 1 / data.rates.JPY;
                }
                
                if (data.rates.USD) {
                    exchangeRates.USD = 1 / data.rates.USD;
                }
                
                if (data.rates.TRY) {
                    exchangeRates.TRY = 1 / data.rates.TRY;
                }
                
                // Update the exchange rates display
                updateRatesDisplay();
                
                // Update the exchange rate timestamp
                const currentTime = new Date();
                rateUpdateTimeEl.textContent = formatDateTime(currentTime);
            } else {
                throw new Error('환율 정보를 가져올 수 없습니다.');
            }
        } catch (error) {
            console.error('환율 정보 가져오기 실패:', error);
            alert('환율 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
            
            // Fallback to recent average exchange rates
            exchangeRates.JPY = 9.80;  // 약 9.8원/엔 (2023년 기준)
            exchangeRates.USD = 1350;  // 약 1,350원/달러 (2023년 기준)
            exchangeRates.TRY = 42;    // 약 42원/리라 (2023년 기준)
            
            // Update with fallback rates
            updateRatesDisplay();
            
            rateUpdateTimeEl.textContent = "환율 정보 로드 실패";
        }
    }
    
    // Function to update UI based on selected currency
    function updateCurrencyUI() {
        const selectedCurrency = currencyTypeSelect.value;
        const symbol = currencySymbols[selectedCurrency];
        
        // Update placeholder with the correct currency symbol
        amountInput.placeholder = `${symbol} 금액을 입력하세요`;
    }
    
    // Initialize the UI with the default currency
    updateCurrencyUI();
    
    // Function to calculate the total amount
    function calculateTotal() {
        // Get the input values
        const amount = parseFloat(amountInput.value);
        const currencyType = currencyTypeSelect.value;
        const cardType = cardTypeSelect.value;
        
        // Validate input
        if (isNaN(amount) || amount <= 0) {
            alert('올바른 금액을 입력해주세요.');
            return;
        }
        
        // Get the current exchange rate for the selected currency
        const currentRate = exchangeRates[currencyType];
        
        // Get the card fee rate
        const cardFeeRate = cardFees[cardType];
        
        // Calculate the KRW amount
        const krwAmount = amount * currentRate;
        
        // Calculate the card fee
        const cardFeeAmount = krwAmount * (cardFeeRate / 100);
        
        // Calculate the foreign transaction fee
        const foreignFeeAmount = krwAmount * (foreignFeeRate / 100);
        
        // Calculate the total amount
        const totalAmount = krwAmount + cardFeeAmount + foreignFeeAmount;
        
        // Get the currency symbol
        const symbol = currencySymbols[currencyType];
        
        // Update the UI
        originalAmountEl.textContent = `${amount.toLocaleString()} ${symbol}`;
        exchangeRateEl.textContent = `1 ${currencyType} = ${currentRate.toFixed(2)} 원`;
        krwAmountEl.textContent = Math.round(krwAmount).toLocaleString() + ' 원';
        cardFeeEl.textContent = Math.round(cardFeeAmount).toLocaleString() + ' 원 (' + cardFeeRate + '%)';
        foreignFeeEl.textContent = Math.round(foreignFeeAmount).toLocaleString() + ' 원 (' + foreignFeeRate + '%)';
        totalAmountEl.textContent = Math.round(totalAmount).toLocaleString() + ' 원';
    }
}); 