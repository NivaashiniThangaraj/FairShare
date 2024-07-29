// script.js

let numFriends;
let expenses = [];

function setNumberOfFriends() {
    numFriends = parseInt(document.getElementById('num-friends').value);
    if (isNaN(numFriends) || numFriends <= 0) {
        alert('Please enter a valid number of friends.');
        return;
    }
    document.getElementById('initial-form').style.display = 'none';
    document.getElementById('expense-form').style.display = 'block';
    generateExpenseInputs();
}

function generateExpenseInputs() {
    const container = document.getElementById('friends-container');
    container.innerHTML = '';
    for (let i = 0; i < numFriends; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <input type="text" placeholder="Name" id="name-${i}">
            <input type="number" placeholder="Amount Spent" id="spent-${i}">
        `;
        container.appendChild(div);
    }
}

function calculateExpenses() {
    expenses = [];
    for (let i = 0; i < numFriends; i++) {
        const name = document.getElementById(`name-${i}`).value;
        const spent = parseFloat(document.getElementById(`spent-${i}`).value);
        if (name && !isNaN(spent)) {
            expenses.push({ name, spent });
        } else {
            alert('Please fill out all fields correctly.');
            return;
        }
    }
    document.getElementById('expense-form').style.display = 'none';
    calculateSummary();
}

function calculateSummary() {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.spent, 0);
    const share = totalSpent / numFriends;

    const balances = expenses.map(expense => ({
        name: expense.name,
        balance: expense.spent - share
    }));

    displaySummary(balances);
}

function displaySummary(balances) {
    document.getElementById('summary').style.display = 'block';
    const summaryList = document.getElementById('summary-list');
    summaryList.innerHTML = '';

    balances.forEach(person => {
        const li = document.createElement('li');
        li.textContent = `${person.name} ${person.balance >= 0 ? 'should receive' : 'owes'} Rs.${Math.abs(person.balance).toFixed(2)}`;
        summaryList.appendChild(li);
    });

    displayDebts(balances);
}

function displayDebts(balances) {
    const debtsList = document.createElement('ul');

    balances.sort((a, b) => a.balance - b.balance);
    let i = 0;
    let j = balances.length - 1;

    while (i < j) {
        if (balances[i].balance < 0 && balances[j].balance > 0) {
            const debt = Math.min(-balances[i].balance, balances[j].balance);
            const li = document.createElement('li');
            li.textContent = `${balances[i].name} owes ${balances[j].name} Rs.${debt.toFixed(2)}`;
            debtsList.appendChild(li);

            balances[i].balance += debt;
            balances[j].balance -= debt;

            if (balances[i].balance === 0) i++;
            if (balances[j].balance === 0) j--;
        }
    }

    document.getElementById('summary').appendChild(debtsList);
}


