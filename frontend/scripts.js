const API = "http://localhost:3000/api/contacts";
const table = document.getElementById("contactsTable");
const form = document.getElementById("contactForm");

let allContacts = [];
let sortOrder = 1;

function showMessage(messages, type = "error") {
    let div = document.getElementById("message");

    if (!div) {
        div = document.createElement("div");
        div.id = "message";
        form.prepend(div);
    }

    if (Array.isArray(messages)) {
        div.innerHTML = messages.map(m => `• ${m}`).join("<br>");
    } else {
        div.textContent = messages;
    }

    div.className = type;

    setTimeout(() => {
        div.innerHTML = "";
        div.className = "";
    }, 4000);
}

function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9]{10,15}$/.test(phone);
}

function isDuplicateEmail(email, id = null) {
    return allContacts.some(c =>
        c.email.toLowerCase() === email.toLowerCase() &&
        c.id != id
    );
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = contactId.value;
    const nameVal = name.value.trim();
    const emailVal = email.value.trim();
    const phoneVal = phone.value.trim();

    let errors = [];

    // Required fields
    if (!nameVal) errors.push("Name is required");
    if (!emailVal) errors.push("Email is required");
    if (!phoneVal) errors.push("Phone number is required");

    // Email format
    if (emailVal && !isValidEmail(emailVal)) {
        errors.push("Invalid email format");
    }

    // Phone validation
    if (phoneVal && !isValidPhone(phoneVal)) {
        errors.push("Phone number must be 10–15 digits");
    }

    // Duplicate email
    if (emailVal && isDuplicateEmail(emailVal, id)) {
        errors.push("Email already exists");
    }

    // If any validation failed
    if (errors.length > 0) {
        showMessage(errors, "error");
        return;
    }

    const data = {
        name: nameVal,
        email: emailVal,
        phone: phoneVal
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API}/${id}` : API;

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.json();
        showMessage(err.message || "Operation failed", "error");
        return;
    }

    showMessage("Saved successfully", "success");
    form.reset();
    contactId.value = "";
    loadContacts();
});

async function loadContacts() {
    const res = await fetch(API);
    allContacts = await res.json();
    renderTable(allContacts);
}

function renderTable(data) {
    table.innerHTML = "";
    data.forEach(c => {
        table.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td>
          <button onclick="editContact(${c.id})">Edit</button>
          <button onclick="deleteContact(${c.id})">Delete</button>
        </td>
      </tr>
    `;
    });
}

async function editContact(id) {
    const res = await fetch(`${API}/${id}`);
    const c = await res.json();

    contactId.value = c.id;
    name.value = c.name;
    email.value = c.email;
    phone.value = c.phone;
}

async function deleteContact(id) {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadContacts();
}

function filterContacts() {
    const value = searchInput.value.toLowerCase();
    const filtered = allContacts.filter(c =>
        c.name.toLowerCase().includes(value) ||
        c.email.toLowerCase().includes(value)
    );
    renderTable(filtered);
}

function sortBy(field) {
    sortOrder *= -1;
    const sorted = [...allContacts].sort((a, b) =>
        a[field].localeCompare(b[field]) * sortOrder
    );
    renderTable(sorted);
}

loadContacts();