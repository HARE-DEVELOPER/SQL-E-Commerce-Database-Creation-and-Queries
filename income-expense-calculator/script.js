document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entry-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const entriesList = document.getElementById('entries-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const netBalance = document.getElementById('net-balance');
    const resetBtn = document.getElementById('reset-btn');
    const filters = document.querySelectorAll('input[name="filter"]');

    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Render entries
    const renderEntries = (filter = 'all') => {
        entriesList.innerHTML = '';
        const filteredEntries = filter === 'all' ? entries : entries.filter(entry => entry.type === filter);
        filteredEntries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${entry.description} (${entry.type}): $${entry.amount}</span>
                <button onclick="editEntry(${index})">Edit</button>
                <button onclick="deleteEntry(${index})">Delete</button>
            `;
            entriesList.appendChild(li);
        });
        updateSummary();
    };

    // Update summary
    const updateSummary = () => {
        const totalIncomeAmount = entries
            .filter(entry => entry.type === 'income')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const totalExpenseAmount = entries
            .filter(entry => entry.type === 'expense')
            .reduce((sum, entry) => sum + entry.amount, 0);
        totalIncome.textContent = totalIncomeAmount;
        totalExpense.textContent = totalExpenseAmount;
        netBalance.textContent = totalIncomeAmount - totalExpenseAmount;
    };

    // Add entry
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;
        if (description && amount) {
            entries.push({ description, amount, type });
            localStorage.setItem('entries', JSON.stringify(entries));
            renderEntries();
            form.reset();
        }
    });

    // Edit entry
    window.editEntry = (index) => {
        const entry = entries[index];
        descriptionInput.value = entry.description;
        amountInput.value = entry.amount;
        typeInput.value = entry.type;
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
    };

    // Delete entry
    window.deleteEntry = (index) => {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
    };

    // Reset form
    resetBtn.addEventListener('click', () => {
        form.reset();
    });

    // Filter entries
    filters.forEach(filter => {
        filter.addEventListener('change', (e) => {
            renderEntries(e.target.value);
        });
    });

    // Initial render
    renderEntries();
});