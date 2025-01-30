const mongoose = require('mongoose');

const alcoholConsumptionSchema = new mongoose.Schema({
    Gender: {
        type: String,
        required: true
    },
    Count: {
        type: Number,
        required: true
    },
    Countries: {
        type: String,
        required: true
    },
    CountriesCode: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('AlcoholConsumption', alcoholConsumptionSchema);
