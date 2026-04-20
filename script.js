document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm');
    const results = document.getElementById('results');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const demoBtn = document.getElementById('demoBtn');

    // REGEX PATTERNS (Core Theory Component)
    const patterns = {
        utr: /^[A-Z]{4}[A-Z0-9][0-9]{10,11}$/,
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

    // Demo Button Logic with multiple sets
    let currentDemoIndex = 0;
    const demoSets = [
        {
            utr: 'SBIN12345678901',
            ifsc: 'BARB0KOTHAR',
            account: '9192939495',
            amount: '45000',
            date: '21/02/24',
            narration: 'RENT PAYMENT FOR APRIL'
        },
        {
            utr: 'HDFCR9912233445',
            ifsc: 'HDFC0001234',
            account: '501004455667',
            amount: '125000',
            date: '01/04/2026',
            narration: 'MONTHLY SALARY CREDIT - HR DEPT'
        },
        {
            utr: 'ICICR0088776655',
            ifsc: 'ICIC0000011',
            account: '001122334455',
            amount: '840',
            date: '15/04/2026',
            narration: 'SWIGGY ORDER #88291'
        },
        {
            utr: 'AXISR1122334455',
            ifsc: 'UTIB0000210',
            account: '912010001234',
            amount: '3200',
            date: '18/04/2026',
            narration: 'ELECTRICITY BILL PAYMENT'
        },
        {
            utr: 'KKBKR0001112223',
            ifsc: 'KKBK0000958',
            account: '123456789012',
            amount: '12500',
            date: '19/04/2026',
            narration: 'AMAZON ONLINE SHOPPING'
        }
    ];

    demoBtn.addEventListener('click', () => {
        const data = demoSets[currentDemoIndex];
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            el.value = data[id];
            validateField(id, patterns[id] || /.*/);
        });

        // Loop through the sets
        currentDemoIndex = (currentDemoIndex + 1) % demoSets.length;
        
        // Visual feedback for cycle
        demoBtn.textContent = `Demo: ${data.narration.split(' ')[0]}...`;
        setTimeout(() => { demoBtn.textContent = 'Fill Next Demo'; }, 1000);
    });
});
