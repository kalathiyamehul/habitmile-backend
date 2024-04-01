// controllers/FinanceController.js
const FinanceData = require('../models/finance.model');

exports.calculateFinanceScore = async (req, res) => {
    const { age, salary, userNeed, userWant, userInvestment } = req.body;

    // Check if percentages add up to 100%
    if (userNeed + userWant + userInvestment !== 100) {
        return res.status(400).json({ error: "The sum of need, want, and investment percentages must equal 100." });
    }

    try {
        let idealPercentages;

        // Determine age group
        if (age >= 20 && age <= 29) {
            if (salary < 300000) {
                idealPercentages = { need: 50, want: 20, investment: 30 };
            } else if (salary >= 300000 && salary <= 900000) {
                idealPercentages = { need: 50, want: 25, investment: 25 };
            } else {
                idealPercentages = { need: 50, want: 30, investment: 20 };
            }
        } else if (age >= 30 && age <= 39) {
            if (salary < 300000) {
                idealPercentages = { need: 50, want: 15, investment: 35 };
            } else if (salary >= 300000 && salary <= 900000) {
                idealPercentages = { need: 50, want: 20, investment: 30 };
            } else {
                idealPercentages = { need: 50, want: 30, investment: 20 };
            }
        } else {
            if (salary < 300000) {
                idealPercentages = { need: 50, want: 10, investment: 40 };
            } else if (salary >= 300000 && salary <= 900000) {
                idealPercentages = { need: 50, want: 15, investment: 35 };
            } else {
                idealPercentages = { need: 50, want: 25, investment: 25 };
            }
        }

        // Calculate scores
        const needScore = Math.abs(idealPercentages.need - userNeed);
        const wantScore = Math.abs(idealPercentages.want - userWant);
        const investmentScore = Math.abs(idealPercentages.investment - userInvestment);

        // Calculate overall score
        const financeScore = 100 - (needScore + wantScore + investmentScore);

        // Store finance data in MongoDB
        const financeData = new FinanceData({
            age,
            salary,
            userNeed,
            userWant,
            userInvestment
        });
        await financeData.save();

        res.status(200).json({ financeScore });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
