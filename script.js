document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm');
    const results = document.getElementById('results');
    const analyzeBtn = document.getElementById('analyzeBtn');

    // REGEX PATTERNS (Core Theory Component)
    const patterns = {
        utr: /^[A-Z]{4}[0-9]{11}$/,
        ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
        account: /^[0-9]{9,18}$/,
        amount: /^\d+(\.\d{1,2})?$/,
        date: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/
    };

    // Category Detectors (Rule-Based Analyzer)
    const categories = [
        { name: 'Income/Salary', regex: /SALARY|PAYROLL|WAGES|CREDIT/i },
        { name: 'Housing/Rent', regex: /RENT|LEASE|MAINTENANCE/i },
        { name: 'Utilities', regex: /ELECTRICITY|WATER|GAS|INTERNET|WIFI|BROADBAND/i },
        { name: 'Dining/Food', regex: /SWIGGY|ZOMATO|RESTAURANT|DINING|FOOD/i },
        { name: 'Entertainment', regex: /NETFLIX|AMAZON|HOTSTAR|SUBSCRIPTION|GOOGLE/i },
        { name: 'Shopping', regex: /FLIPKART|AMAZON|MYNTRA|RETAIL|SHOP/i }
    ];

    const validateField = (id, pattern) => {
        const input = document.getElementById(id);
        const group = document.getElementById(`${id}Group`);
        const value = input.value.trim();

        if (pattern.test(value)) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const isUtrValid = validateField('utr', patterns.utr);
        const isIfscValid = validateField('ifsc', patterns.ifsc);
        const isAccountValid = validateField('account', patterns.account);
        const isAmountValid = validateField('amount', patterns.amount);
        const isDateValid = validateField('date', patterns.date);

        if (isUtrValid && isIfscValid && isAccountValid && isAmountValid && isDateValid) {
            // Show loading state
            analyzeBtn.classList.add('loading');
            analyzeBtn.disabled = true;

            setTimeout(() => {
                analyzeBtn.classList.remove('loading');
                analyzeBtn.disabled = false;

                // Simple Analyzer Logic
                const narration = document.getElementById('narration').value.trim();
                let detectedCategory = 'General Transfer';
                
                for (const cat of categories) {
                    if (cat.regex.test(narration)) {
                        detectedCategory = cat.name;
                        break;
                    }
                }

                // Update UI
                document.getElementById('resCategory').textContent = detectedCategory;
                
                // Deterministic Risk Analysis
                const amount = parseFloat(document.getElementById('amount').value);
                const riskElem = document.getElementById('resRisk');
                
                if (amount > 100000) {
                    riskElem.textContent = 'High (Compliance Review)';
                    riskElem.className = 'value high-risk';
                    riskElem.style.color = '#ef4444';
                } else if (amount > 20000) {
                    riskElem.textContent = 'Medium';
                    riskElem.className = 'value medium-risk';
                    riskElem.style.color = '#f59e0b';
                } else {
                    riskElem.textContent = 'Low';
                    riskElem.className = 'value low-risk';
                    riskElem.style.color = '#10b981';
                }

                results.classList.remove('hidden');
                results.scrollIntoView({ behavior: 'smooth' });
            }, 800);
        }
    });

    // Real-time validation
    const inputs = ['utr', 'ifsc', 'account', 'amount', 'date'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            validateField(id, patterns[id]);
        });
    });
});
