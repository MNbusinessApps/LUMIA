// SHIELD PRO - Professional Insurance Agent Suite
// Complete JavaScript functionality for asset calculation, liability assessment, and agent resources

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeShieldPro();
});

function initializeShieldPro() {
    console.log('L.U.M.I.A initialized');
    
    // Load any saved client data
    loadClientData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show welcome page by default
    showPage('welcome');
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Auto-calculate as user types
    const inputFields = [
        'home-value', 'car-value', 'annual-income', 'savings', 'life-insurance',
        'update-home-value', 'update-car-value', 'update-annual-income', 'update-savings', 'update-life-insurance'
    ];
    
    inputFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', autoCalculate);
        }
    });
}

// Mobile Navigation Functions
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu && mobileMenuToggle) {
        navMenu.classList.toggle('active');
        
        // Toggle hamburger icon
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    }
}

function showPage(pageId) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page-content');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation
    updateNavigation(pageId);
    
    // Close mobile menu if open
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.remove('active'));
        }
    }
}

function updateNavigation(activePage) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[onclick="showPage('${activePage}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Asset Calculation Functions
function autoCalculate() {
    // Auto-calculate for new client
    const homeValue = parseFloat(document.getElementById('home-value')?.value || 0);
    const carValue = parseFloat(document.getElementById('car-value')?.value || 0);
    const annualIncome = parseFloat(document.getElementById('annual-income')?.value || 0);
    const savings = parseFloat(document.getElementById('savings')?.value || 0);
    const lifeInsurance = parseFloat(document.getElementById('life-insurance')?.value || 0);
    
    if (homeValue > 0 || carValue > 0 || annualIncome > 0 || savings > 0 || lifeInsurance > 0) {
        updateAssetSummary('new-client', {
            homeValue,
            carValue,
            annualIncome,
            savings,
            lifeInsurance
        });
    }
    
    // Auto-calculate for current client
    const updateHomeValue = parseFloat(document.getElementById('update-home-value')?.value || 0);
    const updateCarValue = parseFloat(document.getElementById('update-car-value')?.value || 0);
    const updateAnnualIncome = parseFloat(document.getElementById('update-annual-income')?.value || 0);
    const updateSavings = parseFloat(document.getElementById('update-savings')?.value || 0);
    const updateLifeInsurance = parseFloat(document.getElementById('update-life-insurance')?.value || 0);
    
    if (updateHomeValue > 0 || updateCarValue > 0 || updateAnnualIncome > 0 || updateSavings > 0 || updateLifeInsurance > 0) {
        updateAssetSummary('current-client', {
            homeValue: updateHomeValue,
            carValue: updateCarValue,
            annualIncome: updateAnnualIncome,
            savings: updateSavings,
            lifeInsurance: updateLifeInsurance
        });
    }
}

function updateAssetSummary(clientType, assets) {
    const summaryDiv = document.getElementById(`${clientType}-asset-summary`);
    if (!summaryDiv) return;
    
    const totalAssets = assets.homeValue + assets.carValue + assets.savings + assets.lifeInsurance;
    const annualLiability = assets.annualIncome * 20; // 20x annual income rule
    
    summaryDiv.innerHTML = `
        <div class="asset-summary-card">
            <h3>Asset Summary</h3>
            <div class="asset-breakdown">
                <div class="asset-item">
                    <span>Home Value:</span>
                    <span>$${assets.homeValue.toLocaleString()}</span>
                </div>
                <div class="asset-item">
                    <span>Car Value:</span>
                    <span>$${assets.carValue.toLocaleString()}</span>
                </div>
                <div class="asset-item">
                    <span>Savings:</span>
                    <span>$${assets.savings.toLocaleString()}</span>
                </div>
                <div class="asset-item">
                    <span>Life Insurance:</span>
                    <span>$${assets.lifeInsurance.toLocaleString()}</span>
                </div>
                <div class="asset-item total">
                    <span>Total Assets:</span>
                    <span>$${totalAssets.toLocaleString()}</span>
                </div>
                <div class="asset-item liability">
                    <span>Recommended Liability Coverage:</span>
                    <span>$${annualLiability.toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
}

// New Client Functions
function calculateNewClient() {
    const clientData = getClientData('new-client');
    if (!validateClientData(clientData)) return;
    
    const liabilityAnalysis = calculateLiability(clientData);
    displayLiabilityAnalysis('new-client-results', liabilityAnalysis, clientData);
    
    // Save client data
    saveClientData('new-client', clientData);
    
    // Show results page
    showPage('new-client-results');
}

function getClientData(clientType) {
    const prefix = clientType === 'current-client' ? 'update-' : '';
    
    return {
        name: document.getElementById(`${prefix}client-name`)?.value || '',
        email: document.getElementById(`${prefix}client-email`)?.value || '',
        phone: document.getElementById(`${prefix}client-phone`)?.value || '',
        homeValue: parseFloat(document.getElementById(`${prefix}home-value`)?.value || 0),
        carValue: parseFloat(document.getElementById(`${prefix}car-value`)?.value || 0),
        annualIncome: parseFloat(document.getElementById(`${prefix}annual-income`)?.value || 0),
        savings: parseFloat(document.getElementById(`${prefix}savings`)?.value || 0),
        lifeInsurance: parseFloat(document.getElementById(`${prefix}life-insurance`)?.value || 0),
        timestamp: new Date().toISOString(),
        type: clientType
    };
}

function validateClientData(clientData) {
    if (!clientData.name) {
        alert('Please enter client name');
        return false;
    }
    
    if (clientData.homeValue <= 0 && clientData.carValue <= 0) {
        alert('Please enter at least home value or car value');
        return false;
    }
    
    if (clientData.annualIncome <= 0) {
        alert('Please enter annual income');
        return false;
    }
    
    return true;
}

function calculateLiability(clientData) {
    const totalAssets = clientData.homeValue + clientData.carValue + clientData.savings + clientData.lifeInsurance;
    const annualIncome = clientData.annualIncome;
    
    // Liability calculation based on multiple factors
    const incomeMultiplier = annualIncome * 20; // Standard 20x income rule
    const assetMultiplier = totalAssets * 1.5; // 1.5x total assets rule
    const riskScore = calculateRiskScore(clientData);
    
    // Recommended liability coverage
    const recommendedCoverage = Math.max(incomeMultiplier, assetMultiplier);
    
    // Umbrella policy recommendations
    const umbrellaCoverage = Math.ceil(recommendedCoverage / 1000000) * 1000000; // Round to nearest million
    
    return {
        totalAssets,
        annualIncome,
        recommendedCoverage,
        umbrellaCoverage,
        riskScore,
        breakdown: {
            incomeBasis: incomeMultiplier,
            assetBasis: assetMultiplier,
            riskAdjustment: riskScore * 0.1 // 10% adjustment for risk factors
        }
    };
}

function calculateRiskScore(clientData) {
    let riskScore = 0;
    
    // Home value risk (higher value = higher risk)
    if (clientData.homeValue > 1000000) riskScore += 3;
    else if (clientData.homeValue > 500000) riskScore += 2;
    else if (clientData.homeValue > 250000) riskScore += 1;
    
    // Car value risk
    if (clientData.carValue > 100000) riskScore += 2;
    else if (clientData.carValue > 50000) riskScore += 1;
    
    // Income risk (higher income = higher lawsuit target)
    if (clientData.annualIncome > 200000) riskScore += 3;
    else if (clientData.annualIncome > 100000) riskScore += 2;
    else if (clientData.annualIncome > 75000) riskScore += 1;
    
    // Professional risk factors
    const highRiskProfessions = ['doctor', 'lawyer', 'engineer', 'architect', 'accountant', 'consultant'];
    const profession = document.getElementById(clientData.type === 'current-client' ? 'update-client-profession' : 'client-profession')?.value?.toLowerCase() || '';
    
    if (highRiskProfessions.some(prof => profession.includes(prof))) {
        riskScore += 2;
    }
    
    return Math.min(riskScore, 10); // Cap at 10
}

function displayLiabilityAnalysis(containerId, analysis, clientData) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const coverageRecommendations = generateCoverageRecommendations(analysis, clientData);
    
    container.innerHTML = `
        <div class="liability-analysis">
            <div class="analysis-header">
                <h2>Liability Analysis for ${clientData.name}</h2>
                <p class="analysis-date">Analysis Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="asset-summary">
                <h3>Asset Overview</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="label">Total Assets:</span>
                        <span class="value">$${analysis.totalAssets.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Annual Income:</span>
                        <span class="value">$${analysis.annualIncome.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Risk Score:</span>
                        <span class="value risk-${analysis.riskScore <= 3 ? 'low' : analysis.riskScore <= 6 ? 'medium' : 'high'}">${analysis.riskScore}/10</span>
                    </div>
                </div>
            </div>
            
            <div class="coverage-recommendations">
                <h3>Coverage Recommendations</h3>
                ${coverageRecommendations}
            </div>
            
            <div class="next-steps">
                <h3>Recommended Action Plan</h3>
                <div class="action-items">
                    ${generateActionPlan(analysis, clientData)}
                </div>
            </div>
            
            <div class="analysis-footer">
                <button onclick="showPage('agent-resource')" class="btn-primary">View Agent Scripts</button>
                <button onclick="saveAnalysis()" class="btn-success">Save Analysis</button>
            </div>
        </div>
    `;
}

function generateCoverageRecommendations(analysis, clientData) {
    const primaryCoverage = Math.max(analysis.breakdown.incomeBasis, analysis.breakdown.assetBasis);
    const umbrellaCoverage = analysis.umbrellaCoverage;
    
    return `
        <div class="recommendation-grid">
            <div class="recommendation-card primary">
                <h4>Primary Auto/Home Liability</h4>
                <div class="coverage-amount">$${primaryCoverage.toLocaleString()}</div>
                <p>Minimum recommended coverage for primary policies</p>
                <ul>
                    <li>Each Person: $${(primaryCoverage / 2).toLocaleString()}</li>
                    <li>Each Accident: $${primaryCoverage.toLocaleString()}</li>
                    <li>Property Damage: $${Math.round(primaryCoverage * 0.3).toLocaleString()}</li>
                </ul>
            </div>
            
            <div class="recommendation-card umbrella">
                <h4>Umbrella Policy</h4>
                <div class="coverage-amount">$${umbrellaCoverage.toLocaleString()}</div>
                <p>Additional protection above primary limits</p>
                <ul>
                    <li>Extra $${umbrellaCoverage.toLocaleString()} protection</li>
                    <li>Covers legal defense costs</li>
                    <li>Broader coverage than primary</li>
                </ul>
            </div>
            
            <div class="recommendation-card premium">
                <h4>Estimated Annual Premium</h4>
                <div class="coverage-amount">$${Math.round((primaryCoverage / 100000) * 150 + (umbrellaCoverage / 1000000) * 300).toLocaleString()}</div>
                <p>Combined premium for recommended coverage</p>
                <ul>
                    <li>Primary policies: ~$150 per $100K</li>
                    <li>Umbrella policy: ~$300 per $1M</li>
                    <li>Potential discounts available</li>
                </ul>
            </div>
        </div>
    `;
}

function generateActionPlan(analysis, clientData) {
    const actions = [];
    
    if (analysis.riskScore >= 7) {
        actions.push(`
            <div class="action-item high-priority">
                <span class="priority">HIGH PRIORITY</span>
                <p>Consider immediate umbrella policy due to high risk score (${analysis.riskScore}/10)</p>
            </div>
        `);
    }
    
    if (analysis.totalAssets > 1000000) {
        actions.push(`
            <div class="action-item">
                <span class="priority">RECOMMENDED</span>
                <p>Assets exceed $1M - Umbrella policy strongly recommended for asset protection</p>
            </div>
        `);
    }
    
    if (clientData.annualIncome > 150000) {
        actions.push(`
            <div class="action-item">
                <span class="priority">IMPORTANT</span>
                <p>High income ($150K+) increases lawsuit risk - Consider maximum available coverage</p>
            </div>
        `);
    }
    
    actions.push(`
        <div class="action-item">
            <span class="priority">NEXT STEPS</span>
            <p>Review current policies and compare limits to recommendations</p>
        </div>
    `);
    
    return actions.join('');
}

// Current Client Functions
function updateClientAnalysis() {
    const clientData = getClientData('current-client');
    if (!validateClientData(clientData)) return;
    
    const liabilityAnalysis = calculateLiability(clientData);
    displayLiabilityAnalysis('current-client-results', liabilityAnalysis, clientData);
    
    // Save client data
    saveClientData('current-client', clientData);
    
    // Show results page
    showPage('current-client-results');
}

// Data Management Functions
function saveClientData(clientType, clientData) {
    let allClients = JSON.parse(localStorage.getItem('shield_clients') || '[]');
    
    // Check if client already exists
    const existingIndex = allClients.findIndex(client => 
        client.email === clientData.email && client.type === clientType
    );
    
    if (existingIndex >= 0) {
        allClients[existingIndex] = clientData;
    } else {
        allClients.push(clientData);
    }
    
    localStorage.setItem('shield_clients', JSON.stringify(allClients));
    
    // Show success message
    showNotification('Client data saved successfully!', 'success');
}

function loadClientData() {
    const clients = JSON.parse(localStorage.getItem('shield_clients') || '[]');
    console.log(`Loaded ${clients.length} saved clients`);
    
    // You could populate a client list here if needed
    return clients;
}

function saveAnalysis() {
    showNotification('Analysis saved to client profile!', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Agent Resource Scripts
const agentScripts = {
    'new-client-opening': {
        title: "New Client Opening Script",
        content: `Good morning/afternoon [Client Name], thank you for taking the time to meet with me today. 

I want to start by asking you a few important questions about your current situation. Protecting what you've worked so hard to build isn't just smart planning—it's essential peace of mind.

Let me ask you this: If someone were to accidentally injure you or damage your property today, what would happen to your home, your car, your savings, and your family's future security?

Many people don't realize that their standard auto and home policies might leave them exposed to lawsuits that could cost hundreds of thousands—or even millions—of dollars. That's why I'm here today. I don't want to scare you, but I do want to make sure you're properly protected.

The good news is that comprehensive liability protection is more affordable than most people think, and it can mean the difference between financial security and financial disaster.

Would you like me to show you exactly what coverage you have now, and what you're really protected against?`
    },
    
    'asset-protection': {
        title: "Asset Protection Script",
        content: `[Client Name], let me share something that might surprise you. 

You've worked incredibly hard to build your assets—your home worth $[X], your car worth $[Y], your savings of $[Z]. But here's the thing: without proper liability coverage, all of these assets are at risk.

Think about it this way: If someone were to slip and fall on your property and get seriously injured, or if you were involved in a car accident that resulted in major medical bills and lost wages, you could be sued for everything you own.

But here's the beautiful part: with the right umbrella policy—which typically costs just $[X] per year—you can protect up to $[Y] in additional assets beyond what your auto and home policies cover.

That $[X] annual investment could mean the difference between keeping everything you've worked for and losing it all to a lawsuit.

The question isn't whether you can afford umbrella coverage—it's whether you can afford NOT to have it.`

    },
    
    'liability-education': {
        title: "Liability Education - The High-Profile Doctor Example",
        content: `Let me tell you about a case that really illustrates why liability coverage matters.

Dr. Sarah Mitchell was driving home from the hospital when she was involved in a multi-car accident. The accident wasn't her fault, but one of the other drivers—a construction worker—was seriously injured and unable to work for over a year.

Here's what most people don't know: even when you're not at fault, you can still be named in a lawsuit. The other driver's attorney argued that Dr. Mitchell, being a high-earning surgeon, should have been more cautious and could afford to pay for the injured worker's medical bills and lost income.

Dr. Mitchell's auto insurance had $300,000 in liability coverage, but the total claim was $1.2 million for medical bills, lost wages, and pain and suffering.

Lucky for Dr. Mitchell, she had a $2 million umbrella policy that picked up the additional $900,000 after her auto insurance was exhausted.

The legal fees alone would have been over $100,000, and without the umbrella policy, she would have lost her home, her savings, and had to change her entire lifestyle.

The accident happened in 2.3 seconds, but it could have lasted a lifetime without proper coverage.

This could happen to any of us. The question is: are you protected?`
    },
    
    'current-client-review': {
        title: "Current Client Review Script",
        content: `[Client Name], I hope you're doing well! I know we met [time period] ago, and I wanted to reach out because so much can change in our lives.

You've got [list current coverage], which is great. But I want to make sure you're still as protected as you need to be.

Since we last spoke, have you:
• Made any major purchases or investments?
• Changed jobs or received a raise?
• Made any home improvements that increased your property value?
• Had any life changes—new family members, marriage, or other significant events?

These changes can affect your insurance needs. What might have been adequate coverage last year might not be enough for today's circumstances.

I don't want you to worry, but I do want you to be prepared. Insurance isn't something you set and forget—it's something that needs to grow and change with your life.

Would you have 15 minutes for me to review your current coverage and see if we can optimize your protection?`
    },
    
    'wealth-building': {
        title: "Wealth Building Script",
        content: `[Client Name], let me ask you something: what's the ultimate goal of insurance?

Most people think it's just to protect against loss. But that's only half the story.

Insurance is actually one of the most powerful wealth-building tools available. Here's how:

When you're properly insured, you can:
• Sleep peacefully at night instead of worrying about lawsuits
• Focus on growing your business and investments instead of financial anxiety  
• Take calculated risks that lead to greater opportunities
• Leave a legacy for your family instead of leaving them with debt

Think about the most successful people you know. Do you think they just "wing it" when it comes to protecting their assets? No—they build their wealth ON TOP OF a solid foundation of insurance protection.

The person who can sleep well at night because they're properly protected is the person who can take the risks necessary to build real wealth.

Your umbrella policy isn't just protection—it's permission to dream bigger and take the chances that create real prosperity.

Are you ready to build your wealth on a foundation of rock-solid protection?`
    },
    
    'urgent-closing': {
        title: "Urgent Closing Script",
        content: `[Client Name], I need to be direct with you: every day you wait to get proper umbrella coverage is another day you're completely exposed to lawsuits that could destroy everything you've built.

I don't want to sound dramatic, but think about this: 
• Your home could be taken in a lawsuit
• Your car could be repossessed
• Your savings could be wiped out
• Your future income could be garnished

This isn't about if something will happen—accidents and lawsuits are statistics. It's about whether you'll be protected when they do.

The good news is that umbrella coverage is incredibly affordable. Typically less than a dollar per day for millions in protection.

But here's the catch: umbrella policies require you to have certain minimums on your auto and home insurance. If you wait too long to get those set up, it could delay your umbrella coverage.

I have availability this week to get all your policies aligned and your umbrella in place. The question is: do you want to sleep peacefully tonight knowing you're protected, or do you want to go home and worry about what could happen tomorrow?

What questions do you have so we can get this taken care of today?`
    },
    
    'value-close': {
        title: "Value-Based Closing Script",
        content: `[Client Name], let me put this in perspective for you.

Right now, you're spending approximately:
• $[X] per month on your cell phone
• $[Y] per month on your morning coffee
• $[Z] per month on entertainment

For just $[monthly premium] per month—that's less than you probably spend on coffee—you can have $2 million in additional protection on top of your auto and home coverage.

What does $2 million buy you?
• Peace of mind every time you get in your car
• Confidence when guests visit your home
• Security knowing your family's future is protected
• Freedom to focus on what really matters

The question isn't whether you can afford umbrella coverage—it's whether you can afford to go without it.

Would you rather spend $[monthly premium] per month on protection, or would you rather risk losing everything to a lawsuit?

I believe you and your family are worth that protection. What do you think?`
    },
    
    'follow-up-consultation': {
        title: "Follow-Up Consultation Script",
        content: `Hi [Client Name], this is [Your Name] from [Insurance Company].

I wanted to follow up on our conversation about your insurance coverage. I know you said you'd like to think about it, which I completely understand—this is an important decision.

However, I want to make sure you have all the information you need to make the best choice for your family.

I've been thinking about our conversation, and I realized there was one point I didn't emphasize enough: time is actually a factor here.

Our umbrella policy rates are based on your current auto and home coverage levels. If we wait too long and you need to increase your primary coverage first, it could actually end up costing you more in the long run.

I have about 15 minutes available this [day/time] to answer any final questions you might have and help you decide what makes the most sense for your situation.

Would that work for you? I want to make sure you have everything you need to make the right decision.`
    },
    
    'follow-up-email': {
        title: "Follow-Up Email Template",
        content: `Subject: Your Insurance Protection Review - Important Update

Dear [Client Name],

I hope this email finds you well. I wanted to follow up on our recent conversation about your insurance coverage and protection strategy.

As we discussed, proper liability protection isn't just about having insurance—it's about having the RIGHT insurance in the right amounts to protect what you've worked so hard to build.

Key Points from Our Discussion:
• Current asset exposure: $[Amount]
• Recommended umbrella coverage: $[Amount]
• Estimated monthly premium: $[Amount]
• Potential savings through bundling: $[Amount]

Here's what I didn't mention in our meeting: insurance rates tend to increase annually, and coverage becomes more expensive as we get older. The coverage we discussed today might actually cost more if we revisit this in 6 months or a year.

I believe in protecting families, and I think you do too. The question is whether you want to take action now while rates are favorable, or wait and potentially pay more later.

I'm here to answer any questions you might have. Please don't hesitate to call or email me directly.

Your family's security is worth a conversation.

Best regards,
[Your Name]
[Your Contact Information]

P.S. - If you know anyone who could benefit from a similar protection review, I'd be happy to help them as well.`
    }
};

function copyScript(scriptId) {
    const script = agentScripts[scriptId];
    if (!script) {
        showNotification('Script not found', 'error');
        return;
    }
    
    // Create text content for copying
    const textContent = `${script.title}\n\n${script.content}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(textContent).then(() => {
        showNotification(`${script.title} copied to clipboard!`, 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = textContent;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification(`${script.title} copied to clipboard!`, 'success');
        } catch (err) {
            showNotification('Failed to copy script', 'error');
        }
        document.body.removeChild(textArea);
    });
}

// Initialize the L.U.M.I.A application
initializeShieldPro();