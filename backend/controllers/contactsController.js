const db = require("../db");

// CREATE
exports.createContact = (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone)
        return res.status(400).json({ message: "All fields are required" });

    if (!/^\S+@\S+\.\S+$/.test(email))
        return res.status(400).json({ message: "Invalid email format" });

    if (phone.length < 10)
        return res.status(400).json({ message: "Phone must be at least 10 digits" });

    const query = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
    db.run(query, [name, email, phone], function (err) {
        if (err)
            return res.status(400).json({ message: "Email already exists" });

        res.status(201).json({ id: this.lastID });
    });
};

// READ ALL
exports.getContacts = (req, res) => {
    db.all(`SELECT * FROM contacts`, [], (err, rows) => {
        res.json(rows);
    });
};

// READ ONE
exports.getContactById = (req, res) => {
    db.get(`SELECT * FROM contacts WHERE id = ?`, [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ message: "Contact not found" });
        res.json(row);
    });
};

// UPDATE
exports.updateContact = (req, res) => {
    const { name, email, phone } = req.body;

    const query = `
    UPDATE contacts
    SET name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

    db.run(query, [name, email, phone, req.params.id], function () {
        if (this.changes === 0)
            return res.status(404).json({ message: "Contact not found" });

        res.json({ message: "Contact updated" });
    });
};

// DELETE
exports.deleteContact = (req, res) => {
    db.run(`DELETE FROM contacts WHERE id = ?`, [req.params.id], function () {
        res.json({ message: "Contact deleted" });
    });
};