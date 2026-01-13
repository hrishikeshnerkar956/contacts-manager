const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contacts");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});