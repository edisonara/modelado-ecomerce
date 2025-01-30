const express = require('express');
const router = express.Router();
const AlcoholConsumption = require('../models/alcoholConsumption');

// Get all alcohol consumption data
router.get('/', async (req, res) => {
    try {
        const consumptionData = await AlcoholConsumption.find();
        res.json(consumptionData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get consumption data by country
router.get('/country/:country', async (req, res) => {
    try {
        const countryData = await AlcoholConsumption.find({ Countries: req.params.country });
        res.json(countryData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new consumption data
router.post('/', async (req, res) => {
    const consumptionData = new AlcoholConsumption({
        Gender: req.body.Gender,
        Count: req.body.Count,
        Countries: req.body.Countries,
        CountriesCode: req.body.CountriesCode,
        Date: new Date(req.body.Date)
    });

    try {
        const newConsumptionData = await consumptionData.save();
        res.status(201).json(newConsumptionData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update consumption data
router.patch('/:id', async (req, res) => {
    try {
        const updatedData = await AlcoholConsumption.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete consumption data
router.delete('/:id', async (req, res) => {
    try {
        await AlcoholConsumption.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted consumption data' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
