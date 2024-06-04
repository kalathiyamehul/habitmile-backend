const Survey1 = require('../models/Survey1');

// Utility function to convert income allocation ranges to percentages
function convertIncomeAllocationToPercentage(range) {
    let percentage;
    const rangeParts = range.split('-');
    if (rangeParts.length === 1) {
        if (range.includes('Less than')) {
            const value = parseFloat(range.replace('Less than ', '').replace('%', ''));
            percentage = value - 5;
        } else if (range.includes('More than')) {
            const value = parseFloat(range.replace('More than ', '').replace('%', ''));
            percentage = value;
        } else {
            percentage = parseFloat(range.replace('%', ''));
        }
    } else {
        const lowerBound = parseFloat(rangeParts[0]);
        const upperBound = parseFloat(rangeParts[1].replace('%', ''));
        percentage = (lowerBound + upperBound) / 2;
    }
    return percentage;
}
exports.calculateFinanceScore = async (req, res) => {
    const { age_group, income_range, income_allocation_needs, income_allocation_wants, income_allocation_investments } = req.body;

    // Convert income allocation ranges to percentages
    const needsPercentage = convertIncomeAllocationToPercentage(income_allocation_needs);
    const wantsPercentage = convertIncomeAllocationToPercentage(income_allocation_wants);
    const investmentsPercentage = convertIncomeAllocationToPercentage(income_allocation_investments);

    // Check if percentages add up to 100%
    if (needsPercentage + wantsPercentage + investmentsPercentage > 100) {
        return res.status(400).json({ error: "The sum of need, want, and investment percentages must equal 100." });
    }

    try {
        let idealPercentages;

        // Determine age group
        if (age_group === 'Under 18') {
            if (income_range === 'Less than ₹3 lakh') {
                idealPercentages = { need: 50, want: 20, investment: 30 };
            } else if (income_range === '₹3 - 5 lakh' || income_range === '₹5 - 9 lakh') {
                idealPercentages = { need: 50, want: 25, investment: 25 };
            } else {
                idealPercentages = { need: 50, want: 30, investment: 20 };
            }
        }
        else if (age_group === '18-29') {
            if (income_range === 'Less than ₹3 lakh') {
                idealPercentages = { need: 50, want: 20, investment: 30 };
            } else if (income_range === '₹3 - 5 lakh' || income_range === '₹5 - 9 lakh') {
                idealPercentages = { need: 50, want: 25, investment: 25 };
            } else {
                idealPercentages = { need: 50, want: 30, investment: 20 };
            }
        } else if (age_group === '30-39') {
            if (income_range === 'Less than ₹3 lakh') {
                idealPercentages = { need: 50, want: 15, investment: 35 };
            } else if (income_range === '₹3 - 5 lakh' || income_range === '₹5 - 9 lakh') {
                idealPercentages = { need: 50, want: 20, investment: 30 };
            } else {
                idealPercentages = { need: 50, want: 30, investment: 20 };
            }
        } else {
            if (income_range === 'Less than ₹3 lakh') {
                idealPercentages = { need: 50, want: 10, investment: 40 };
            } else if (income_range === '₹3 - 5 lakh' || income_range === '₹5 - 9 lakh') {
                idealPercentages = { need: 50, want: 15, investment: 35 };
            } else {
                idealPercentages = { need: 50, want: 25, investment: 25 };
            }
        }

        // Calculate scores
        const needScore = Math.abs(idealPercentages.need - needsPercentage);
        const wantScore = Math.abs(idealPercentages.want - wantsPercentage);
        const investmentScore = Math.abs(idealPercentages.investment - investmentsPercentage);

        // Calculate overall score
        const Score = 100 - (needScore + wantScore + investmentScore);

        // Calculate 70% of finance score
        const FinanceScore = Score * 0.7;

        // Store finance data in MongoDB
        const user = new User({
            age_group,
            income_range,
            income_allocation_needs,
            income_allocation_wants,
            income_allocation_investments,
            FinanceScore
        });
        await user.save();

        res.status(200).json({ Score, FinanceScore });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.saveSurvey1 = async (req, res) => {
    try {
        const survey = new Survey1({
            ...req.body
        });
        await survey.save();
        res.status(200).json({
            user: survey,
            score: 10
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getSurvey1 = async (req, res) => {
    try {
        const data = await Survey1.find();
        res.status(200).json({ data: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};