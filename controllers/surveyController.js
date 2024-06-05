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

// Define the scoring system based on the provided scoring logic
const scoringSystem = {
    age: {
      "Below 18 years": 0,
      "18-24 years old": 0,
      "25-34 years old": 0,
      "35-44 years old": 0,
      "45-54 years old": 0,
      "55-64 years old": 0,
      "65 years old and above": 0
    },
    gender: {
      "Male": 0,
      "Female": 0,
      "Other": 0
    },
    occupation: {
        "Student": 0,
        "Employed - Full-time": 0,
        "Employed - Part-time": 0,
        "Self-employed / Entrepreneur": 0,
        "Office worker (e.g., administrative assistant, clerk)": 0,
        "Professional (e.g., Doctor, Lawyer, Engineer)": 0,
        "Homemaker": 0,
        "Retired": 0,
        "Other": 0
    },
    habitTracking: {
      "Yup!": 10,
      "Hmm, Mostly not": 0
    },
    habitTrackingMethods: {
        "Pen and paper" :5,
        "Mobile apps" :10,
        "Spreadsheets" : 7,
        "Wearable devices (e.g., fitness trackers)":10,
        "Other" : 5
    },
    habitTrackingFrequency: {
        "Nope, never" : 0,
        "Daily" : 10,
        "Weekly" : 7,
        "Monthly" : 5,  
        "Occasionally" : 3 
    },
    disciplineLevel: {
        "Not disciplined" : 0,  
        "Somewhat disciplined":3,
        "Moderately disciplined" :5,
        "Very disciplined" : 7,  
        "Extremely disciplined":10 
    },
    goalSettingMethods: {
        "Writing them down": 10,
        "Discussing with a friend/family member": 5,
        "Using a goal-setting app/tool": 10,
        "Other": 5
    },
    progressTrackingMethods: {
        "Regularly reviewing my goals" :10,
        "Using a progress tracker (e.g. checklists, journal)" :10 , 
        "Seeking feedback from others" :7  ,
        "Other" :5
    },
    disciplineStrategies: {
        "Creating routines/schedules" :10,  
        "Setting reminders" :7  ,
        "Rewarding myself for accomplishments" :7 ,
        "Seeking support from friends/family" :5  ,
        "Other" :5
    },
    challenges: {
        "Lack of motivation" :0,
        "Procrastination" :0,
        "Time management":3,
        "Distractions" :3,
        "Overcommitting" :3,
        "Other" :3
    },
    personalGrowthImportance: {
        "Not important" :0,
        "Slightly important" :3  ,
        "Moderately important" :5,
        "Very important" :7  ,
        "Extremely important" :10
    },
    personalGrowthSatisfaction: {
        "1": 0,
        "2": 3,
        "3": 5,
        "4": 7,
        "5": 10
    },
    personalGrowthHabits: {
        "Regular exercise/Fitness": 10,
        "Meditation/mindfulness": 10,
        "Reading/self-education": 10,
        "Spending time with loved ones": 5,
        "Finance": 5,
        "Work related": 5,
        "Hobbies": 5,
        "Other": 5
    },
    virtualHangout: {
        "Yes": 0,
        "No": 0
    }
  };
  
  // Function to calculate total score and percentage
  const calculateScoreAndPercentage = (surveyData) => {
    let totalScore = 0;
  
    // Calculate total score based on the selected choices for multi-select questions
    const selectedHabitTrackingMethods = surveyData.habitTrackingMethods; // Assuming habitTrackingMethods is an array of selected options
    selectedHabitTrackingMethods.forEach((option) => {
        totalScore += (scoringSystem.habitTrackingMethods[option] || 0);
    });
    const selectedgoalSettingMethods = surveyData.goalSettingMethods; 
    selectedgoalSettingMethods.forEach((option) => {
        totalScore += (scoringSystem.goalSettingMethods[option] || 0);
    });
    const selectedprogressTrackingMethods = surveyData.progressTrackingMethods; 
    selectedprogressTrackingMethods.forEach((option) => {
        totalScore += (scoringSystem.progressTrackingMethods[option] || 0);
    });
    const selectedDisciplineStrategies = surveyData.disciplineStrategies; 
    selectedDisciplineStrategies.forEach((option) => {
        totalScore += (scoringSystem.disciplineStrategies[option] || 0);
    });
    const selectedChallenges = surveyData.challenges; 
    selectedChallenges.forEach((option) => {
        totalScore += (scoringSystem.challenges[option] || 0);
    });
    const selectedPersonalGrowthHabits = surveyData.personalGrowthHabits; 
    selectedPersonalGrowthHabits.forEach((option) => {
        totalScore += (scoringSystem.personalGrowthHabits[option] || 0);
    });
    // Calculate total score based on the selected choices
      totalScore += (scoringSystem.habitTracking[surveyData.habitTracking] || 0);
      totalScore += (scoringSystem.habitTrackingFrequency[surveyData.habitTrackingFrequency] || 0);
      totalScore += (scoringSystem.disciplineLevel[surveyData.disciplineLevel] || 0);
      totalScore += (scoringSystem.personalGrowthImportance[surveyData.personalGrowthImportance] || 0);
      totalScore += (scoringSystem.personalGrowthSatisfaction[surveyData.personalGrowthSatisfaction] || 0);
    // Calculate percentage from the total score
      const maximumPossibleScore = 200;
    let percentage = ((totalScore / maximumPossibleScore) * 100).toFixed(2); // Calculate percentage based on the maximum possible score
    percentage = Math.min(Math.max(percentage, 0), 100);
    return percentage;
  };
  
exports.saveSurvey1 = async (req, res) => {
    try {
        const percentageScore = calculateScoreAndPercentage(req.body);
        const survey = new Survey1({
            ...req.body,
            score: percentageScore
        });
        await survey.save();
        res.status(200).json({  
            user: survey,
            score: percentageScore
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