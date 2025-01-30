import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const AlcoholConsumption = () => {
    const [consumptionData, setConsumptionData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/alcohol-consumption');
            setConsumptionData(response.data);
            
            // Extract unique countries
            const uniqueCountries = [...new Set(response.data.map(item => item.Countries))];
            setCountries(uniqueCountries);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCountryChange = async (event) => {
        const country = event.target.value;
        setSelectedCountry(country);
        
        try {
            if (country) {
                const response = await axios.get(`http://localhost:5000/api/alcohol-consumption/country/${country}`);
                setConsumptionData(response.data);
            } else {
                fetchData(); // Reset to show all data
            }
        } catch (error) {
            console.error('Error fetching country data:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom component="div">
                Global Alcohol Consumption Data
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Country</InputLabel>
                    <Select
                        value={selectedCountry}
                        label="Filter by Country"
                        onChange={handleCountryChange}
                    >
                        <MenuItem value="">
                            <em>All Countries</em>
                        </MenuItem>
                        {countries.map((country) => (
                            <MenuItem key={country} value={country}>
                                {country}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="alcohol consumption table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Gender</TableCell>
                            <TableCell align="right">Count</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Country Code</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {consumptionData.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.Gender}
                                </TableCell>
                                <TableCell align="right">{row.Count}</TableCell>
                                <TableCell>{row.Countries}</TableCell>
                                <TableCell>{row.CountriesCode}</TableCell>
                                <TableCell>{new Date(row.Date).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AlcoholConsumption;
