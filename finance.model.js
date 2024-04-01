const mongoose = require('mongoose');

const FinanceDataSchema = new mongoose.Schema({
    age: {
        type: Number,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    userNeed: {
        type: Number,
        required: true
    },
    userWant: {
        type: Number,
        required: true
    },
    userInvestment: {
        type: Number,
        required: true
    }
});

const FinanceData = mongoose.model('FinanceData', FinanceDataSchema);

module.exports = FinanceData;
