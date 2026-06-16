let transactions = [];
let editId = null;

const data = localStorage.getItem("transactions");

if (data) {
    transactions = JSON.parse(data);
}

function saveStorage() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function saveTransaction() {
    let desc = document.getElementById("desc").value;
    let amount = Number(document.getElementById("amount").value);
    let date = document.getElementById("date").value;
    let type = document.getElementById("type").value;

    if (desc === "" || amount <= 0 || date === "") {
        alert("Fill all fields");
        return;
    }

    if (editId !== null) {
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id === editId) {
                transactions[i].desc = desc;
                transactions[i].amount = amount;
                transactions[i].date = date;
                transactions[i].type = type;
                break;
            }
        }
        editId = null;
        document.getElementById("title").innerHTML = "Add Transaction";
    } else {
        transactions.push({
            id: String(Date.now()), 
            desc: desc,
            amount: amount,
            date: date,
            type: type
        });
    }

    saveStorage();
    clearForm();
    showTransactions();
}

function editTransaction(id) {
    const targetId = String(id); 

    for (let i = 0; i < transactions.length; i++) {
        if (String(transactions[i].id) === targetId) {
            document.getElementById("desc").value = transactions[i].desc;
            document.getElementById("amount").value = transactions[i].amount;
            document.getElementById("date").value = transactions[i].date;
            document.getElementById("type").value = transactions[i].type;

            editId = transactions[i].id; 
            document.getElementById("title").innerHTML = "Edit Transaction";
            break;
        }
    }
}

function deleteTransaction(id) {
    const targetId = String(id);
    transactions = transactions.filter(t => String(t.id) !== targetId);

    saveStorage();
    showTransactions();
}

function clearForm() {
    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("type").value = "income";
    document.getElementById("date").value = new Date().toISOString().split("T")[0];
}

function showTransactions() {
    let income = 0;
    let expense = 0;
    let html = "";

    for (let i = 0; i < transactions.length; i++) {
        let t = transactions[i];

        if (t.type === "income") {
            income += t.amount;
        } else {
            expense += t.amount;
        }

        html += `
        <div class="tx ${t.type}">
            <div>
                <b>${t.desc}</b>
                <span class="tx-date">${t.date}</span>
            </div>

            <div>
                <span class="amount">${t.type === "income" ? "+" : "-"} ₹${t.amount}</span>
                <button class="edit" onclick="editTransaction('${t.id}')">Edit</button>
                <button class="delete" onclick="deleteTransaction('${t.id}')">Delete</button>
            </div>
        </div>
        `;
    }

    document.getElementById("list").innerHTML = html || "<p>No Transactions</p>";
    document.getElementById("income").innerHTML = `₹${income}`;
    document.getElementById("expense").innerHTML = `₹${expense}`;
    document.getElementById("balance").innerHTML = `₹${income - expense}`;
}

window.onload = function () {
    document.getElementById("date").value = new Date().toISOString().split("T")[0];
    showTransactions();
};