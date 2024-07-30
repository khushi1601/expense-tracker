 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// In-memory store for expenses
let expenses = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the homepage
app.get('/', (req, res) => {
    res.render('index', { expenses });
});

// Add an expense
app.post('/add-expense', (req, res) => {
    const { description, amount, date, category } = req.body;
    expenses.push({ description, amount, date, category });
    res.redirect('/');
});

// Delete an expense
app.post('/delete-expense', (req, res) => {
    const index = req.body.index;
    expenses.splice(index, 1);
    res.redirect('/');
});

// Calculate expenses between two dates
app.post('/calculate-expenses', (req, res) => {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= start && expDate <= end;
    });

    const totalExpenses = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
        return acc;
    }, {});

    res.render('index', { expenses, totalExpenses });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
