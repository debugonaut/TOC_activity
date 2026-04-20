document.addEventListener('DOMContentLoaded', () => {
    const resumeForm = document.getElementById('resumeForm');
    const demoBtn = document.getElementById('demoBtn');
    const parseBtn = document.getElementById('parseBtn');
    const resultsWrapper = document.getElementById('results');

    // === TOC REGEX PATTERNS (Formal Language Definitions) ===
    const REGEX_PATTERNS = {
        fullName: /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/, // Proper Capitalized Name
        prn: /^\d{12}$/, // 12-digit PRN
        email: /^[a-zA-Z0-9.]+@mitaoe\.ac\.in$/, // Institutional Domain
        linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/, // Prof. Profile
        cgpa: /^([0-9](\.\d{1,2})?|10(\.0{1,2})?)$/, // 0.00 to 10.00
        skills: /^([a-zA-Z0-9+# ]+,?\s?)+$/ // CSV Skill list
    };

    // === FIELD MAPPING ===
    const fields = [
        { id: 'fullName', pattern: REGEX_PATTERNS.fullName, group: 'nameGroup' },
        { id: 'prn', pattern: REGEX_PATTERNS.prn, group: 'prnGroup' },
        { id: 'email', pattern: REGEX_PATTERNS.email, group: 'emailGroup' },
        { id: 'linkedin', pattern: REGEX_PATTERNS.linkedin, group: 'linkedinGroup' },
        { id: 'cgpa', pattern: REGEX_PATTERNS.cgpa, group: 'cgpaGroup' }
    ];

    // === VALIDATION LOGIC ===
    const validateField = (fieldId, pattern, groupId) => {
        const input = document.getElementById(fieldId);
        const group = document.getElementById(groupId);
        const isValid = pattern.test(input.value.trim());

        if (input.value.trim() === '') {
            group.classList.remove('error', 'success');
            return false;
        }

        if (isValid) {
            group.classList.remove('error');
            group.classList.add('success');
        } else {
            group.classList.remove('success');
            group.classList.add('error');
        }
        return isValid;
    };

    // Real-time validation
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.addEventListener('input', () => {
            validateField(field.id, field.pattern, field.group);
        });
    });

    // === SKILL ANALYZER (Rule-Based Extraction) ===
    const analyzeSkills = (skillsText) => {
        const skills = skillsText.toLowerCase();
        let expertise = "General Engineering";
        let tier = "Standard Tier";

        // Logic based on keywords
        if (skills.match(/react|vue|angular|css|html|tailwind/)) {
            expertise = "Frontend Development";
        } else if (skills.match(/node|express|python|django|flask|golang/)) {
            expertise = "Backend Development";
        } else if (skills.match(/aws|azure|gcp|docker|kubernetes/)) {
            expertise = "DevOps & Cloud";
        } else if (skills.match(/tensorflow|pytorch|pandas|numpy|scikit/)) {
            expertise = "Data Science/ML";
        }

        // Tiering based on depth (number of skills)
        const skillCount = skills.split(',').length;
        if (skillCount > 5) {
            tier = "Premium Tier (Product-based)";
        } else if (skillCount >= 3) {
            tier = "High Tier (Service+Consultancy)";
        }

        return { expertise, tier };
    };

    // === FORM SUBMISSION ===
    resumeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formIsValid = true;
        fields.forEach(field => {
            if (!validateField(field.id, field.pattern, field.group)) {
                formIsValid = false;
            }
        });

        if (formIsValid) {
            // Show loading state
            parseBtn.classList.add('loading');
            
            setTimeout(() => {
                const skillsVal = document.getElementById('skills').value;
                const analysis = analyzeSkills(skillsVal);

                // Update results
                document.getElementById('resExpertise').textContent = analysis.expertise;
                document.getElementById('resPool').textContent = analysis.tier;
                
                // Show results card
                resultsWrapper.classList.remove('hidden');
                resultsWrapper.scrollIntoView({ behavior: 'smooth' });
                
                parseBtn.classList.remove('loading');
            }, 1200);
        } else {
            alert('Please fix the errors in the form before submitting.');
        }
    });

    // === DEMO DATA GENERATOR ===
    demoBtn.addEventListener('click', () => {
        const demoProfiles = [
            {
                name: "Aadesh Khande",
                prn: "202401100090",
                email: "aadesh.k@mitaoe.ac.in",
                linkedin: "https://www.linkedin.com/in/aadeshkhande",
                cgpa: "9.25",
                skills: "React, Node.js, TypeScript, AWS, Docker, Python"
            },
            {
                name: "Sankalp Dabhade",
                prn: "202401100135",
                email: "sankalp.d@mitaoe.ac.in",
                linkedin: "https://www.linkedin.com/in/sankalpd",
                cgpa: "8.80",
                skills: "Java, Spring Boot, MySQL, Git, Jenkins"
            },
            {
                name: "Anvith Shetty",
                prn: "202401100138",
                email: "anvith.s@mitaoe.ac.in",
                linkedin: "https://www.linkedin.com/in/anvithshetty",
                cgpa: "9.50",
                skills: "TensorFlow, PyTorch, Python, Pandas, Scikit-learn"
            },
            {
                name: "Chetan Satkar",
                prn: "202401100114",
                email: "chetan.s@mitaoe.ac.in",
                linkedin: "https://www.linkedin.com/in/chetans",
                cgpa: "8.50",
                skills: "Angular, HTML5, CSS3, JavaScript, Bootstrap"
            },
            {
                name: "Priya Sharma",
                prn: "202401100201",
                email: "priya.s@mitaoe.ac.in",
                linkedin: "https://www.linkedin.com/in/priya-sharma",
                cgpa: "9.10",
                skills: "GCP, Kubernetes, Go, Bash, Terraform"
            }
        ];

        const randomProfile = demoProfiles[Math.floor(Math.random() * demoProfiles.length)];

        document.getElementById('fullName').value = randomProfile.name;
        document.getElementById('prn').value = randomProfile.prn;
        document.getElementById('email').value = randomProfile.email;
        document.getElementById('linkedin').value = randomProfile.linkedin;
        document.getElementById('cgpa').value = randomProfile.cgpa;
        document.getElementById('skills').value = randomProfile.skills;

        // Trigger validation visuals
        fields.forEach(field => validateField(field.id, field.pattern, field.group));
    });
});
