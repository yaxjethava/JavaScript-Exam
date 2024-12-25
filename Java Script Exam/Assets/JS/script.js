// Initialize Fake Database
let fakeDatabase = {
    users: [
        {
            name: "Yax",
            email: "jethavayax99@gmail.com",
            password: "123456",
            expenses: [
                { name: "Groceries", amount: 50, date: "2024-12-01", category: "Food" },
                { name: "Gas", amount: 30, date: "2024-12-03", category: "Transport" }
            ],
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            password: "securepass456",
            expenses: [],
        },
    ],
};

// Save Database to Local Storage
const saveToLocalStorage = () => {
    localStorage.setItem("fakeDatabase", JSON.stringify(fakeDatabase));
};

// Load Database from Local Storage
const loadFromLocalStorage = () => {
    const data = localStorage.getItem("fakeDatabase");
    if (data) {
        fakeDatabase = JSON.parse(data);
    }
};

// Initialize Database on Page Load
loadFromLocalStorage();
let expenses = JSON.parse(localStorage.getItem("loggedInUser")) || [];
// Get Logged-In User
const getLoggedInUser = () => {
    const user = localStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
};

// Save Logged-In User
const saveLoggedInUser = (user) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
};

// Clear Logged-In User
const clearLoggedInUser = () => {
    localStorage.removeItem("loggedInUser");
};

// Signup Functionality
document.getElementById("signupForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Check if Email Exists
    if (fakeDatabase.users.some((user) => user.email === email)) {
        alert("Email already exists.");
        return;
    }

    // Add New User
    fakeDatabase.users.push({ name, email, password, expenses: [] });
    saveToLocalStorage();
    alert("Signup successful! Please log in.");
    window.location.href = "login.html";
});

// Login Functionality
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Authenticate User
    const user = fakeDatabase.users.find(
        (user) => user.email === email && user.password === password
    );

    if (user) {
        alert("Login successful!");
        saveLoggedInUser(user);
        window.location.href = "tracker.html";
    } else {
        alert("Invalid email or password.");
    }
});

// Add Expense
document.getElementById("expenseForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("expenseName").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const date = document.getElementById("expenseDate").value;
    const category = document.getElementById("expenseCategory").value;

    if (!name || !amount || !date || !category) {
        alert("All fields are required.");
        return;
    }

    const loggedInUser = getLoggedInUser();

    if (loggedInUser) {
        // Add Expense to User
        loggedInUser.expenses.push({ name, amount, date, category });
        saveLoggedInUser(loggedInUser);

        // Update in Fake Database
        const userIndex = fakeDatabase.users.findIndex(
            (user) => user.email === loggedInUser.email
        );
        fakeDatabase.users[userIndex] = loggedInUser;
        saveToLocalStorage();
        window.location.reload()

        displayExpenses();
        document.getElementById("expenseForm").reset();
    } else {
        alert("You must log in to add expenses.");
    }
});

// Display Expenses
const displayExpenses = () => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
        alert("You must log in to view expenses.");
        return;
    }

    const expenseTable = document.getElementById("expenseList");
    expenseTable.innerHTML = ""; // Clear existing expenses
    loggedInUser.expenses.forEach((expense, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td id="btn-box">
                <button onclick="deleteExpense(${index})" class="dlt-btn">Delete</button>
                <button onclick="editExpense(${index})">Edit</button>

            </td>
        `;
        expenseTable.appendChild(row);
    });
};

displayExpenses();


// Delete Expense
const deleteExpense = (index) => {
    const loggedInUser = getLoggedInUser();

    if (loggedInUser) {
        loggedInUser.expenses.splice(index, 1); // Remove expense
        saveLoggedInUser(loggedInUser);

        // Update in Fake Database
        const userIndex = fakeDatabase.users.findIndex(
            (user) => user.email === loggedInUser.email
        );
        fakeDatabase.users[userIndex] = loggedInUser;
        saveToLocalStorage();

        displayExpenses();
    } else {
        alert("You must log in to delete expenses.");
    }
};

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    clearLoggedInUser();
    alert("Logged out successfully!");
    window.location.href = "login.html";
});

// Edit Expense
function editExpense(index) {
    const expense = expenses.expenses[index];
    document.getElementById("expenseName").value = expense.name;
    document.getElementById("expenseAmount").value = expense.amount;
    document.getElementById("expenseDate").value = expense.date;
    document.getElementById("expenseCategory").value = expense.category;
    document.getElementById("editIndex").value = index; // Save index of expense being edited
    window.location.reload();

    displayExpenses();
}
