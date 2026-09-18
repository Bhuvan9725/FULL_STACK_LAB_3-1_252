const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const USERS_FILE = path.join(__dirname, "users.json");
const TRANSACTIONS_FILE = path.join(__dirname, "transactions.json");

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: "Too many login attempts. Please try again later."
    }
});

app.use(session({
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, "public")));

function readJSON(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
        return [];
    }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateAccountNumber(users) {
    let accountNumber;
    do {
        accountNumber =
            "BST" + Math.floor(1000000000 + Math.random() * 9000000000);
    } while (users.some(u => u.accountNumber === accountNumber));
    return accountNumber;
}

function generateTransactionId() {
    return "TXN" + Date.now() + Math.floor(Math.random() * 1000);
}

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Please login first."
        });
    }
    next();
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* REGISTER */
app.post("/api/register", async (req, res) => {
    try {
        const {
            name, dob, gender, email, mobile,
            username, password, address
        } = req.body;

        if (!name || !dob || !gender || !email || !mobile ||
            !username || !password || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid email address."
            });
        }

        const mobilePattern = /^[6-9]\d{9}$/;
        if (!mobilePattern.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit mobile number."
            });
        }

        const users = readJSON(USERS_FILE);
        const existingUser = users.find(user =>
            user.username.toLowerCase() === username.toLowerCase() ||
            user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Username or email already registered."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = {
            id: Date.now().toString(),
            name,
            dob,
            gender,
            email,
            mobile,
            username,
            passwordHash,
            address,
            accountNumber: generateAccountNumber(users),
            balance: 10000,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        writeJSON(USERS_FILE, users);

        res.status(201).json({
            success: true,
            message: "BST Bank account created successfully.",
            accountNumber: newUser.accountNumber
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

/* LOGIN */
app.post("/api/login", loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const users = readJSON(USERS_FILE);
        const user = users.find(u =>
            u.username.toLowerCase() === username.toLowerCase() ||
            u.email.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password."
            });
        }

        req.session.userId = user.id;

        res.json({ success: true, message: "Login successful." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

/* CURRENT USER */
app.get("/api/me", requireLogin, (req, res) => {
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    res.json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            username: user.username,
            accountNumber: user.accountNumber,
            balance: user.balance,
            dob: user.dob,
            gender: user.gender,
            address: user.address
        }
    });
});

/* LOGOUT */
app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({
            success: true,
            message: "Logged out successfully."
        });
    });
});

/* TRANSACTIONS */
app.get("/api/transactions", requireLogin, (req, res) => {
    const transactions = readJSON(TRANSACTIONS_FILE);
    const userTransactions = transactions.filter(
        txn => txn.userId === req.session.userId
    );

    res.json({ success: true, transactions: userTransactions });
});

/* CHANGE PASSWORD */
app.post("/api/change-password", requireLogin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required."
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters."
            });
        }

        const users = readJSON(USERS_FILE);
        const user = users.find(u => u.id === req.session.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        const valid = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 12);
        writeJSON(USERS_FILE, users);

        res.json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});

/* DEPOSIT */
app.post("/api/deposit", requireLogin, (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid deposit amount."
        });
    }

    const users = readJSON(USERS_FILE);
    const transactions = readJSON(TRANSACTIONS_FILE);
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Account not found."
        });
    }

    user.balance += amount;

    const transaction = {
        transactionId: generateTransactionId(),
        userId: user.id,
        type: "DEPOSIT",
        amount,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    writeJSON(USERS_FILE, users);
    writeJSON(TRANSACTIONS_FILE, transactions);

    res.json({
        success: true,
        message: `₹${amount.toFixed(2)} deposited successfully.`,
        transaction
    });
});

/* WITHDRAW */
app.post("/api/withdraw", requireLogin, (req, res) => {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid withdrawal amount."
        });
    }

    const users = readJSON(USERS_FILE);
    const transactions = readJSON(TRANSACTIONS_FILE);
    const user = users.find(u => u.id === req.session.userId);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Account not found."
        });
    }

    if (amount > user.balance) {
        return res.status(400).json({
            success: false,
            message: "Insufficient account balance."
        });
    }

    user.balance -= amount;

    const transaction = {
        transactionId: generateTransactionId(),
        userId: user.id,
        type: "WITHDRAW",
        amount,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    writeJSON(USERS_FILE, users);
    writeJSON(TRANSACTIONS_FILE, transactions);

    res.json({
        success: true,
        message: `₹${amount.toFixed(2)} withdrawn successfully.`,
        transaction
    });
});

/* TRANSFER */
app.post("/api/transfer", requireLogin, (req, res) => {
    const amount = Number(req.body.amount);
    const receiverAccount = String(req.body.receiverAccount || "").trim();

    if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid transfer amount."
        });
    }

    if (!receiverAccount) {
        return res.status(400).json({
            success: false,
            message: "Receiver account is required."
        });
    }

    const users = readJSON(USERS_FILE);
    const transactions = readJSON(TRANSACTIONS_FILE);

    const sender = users.find(u => u.id === req.session.userId);

    if (!sender) {
        return res.status(404).json({
            success: false,
            message: "Sender account not found."
        });
    }

    const receiver = users.find(u => u.accountNumber === receiverAccount);

    if (!receiver) {
        return res.status(404).json({
            success: false,
            message: "Receiver account not found."
        });
    }

    if (sender.accountNumber === receiver.accountNumber) {
        return res.status(400).json({
            success: false,
            message: "You cannot transfer money to yourself."
        });
    }

    if (amount > sender.balance) {
        return res.status(400).json({
            success: false,
            message: "Insufficient account balance."
        });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    const transactionId = generateTransactionId();

    const senderTransaction = {
        transactionId,
        userId: sender.id,
        type: "TRANSFER",
        amount,
        receiverAccount: receiver.accountNumber,
        date: new Date().toISOString()
    };

    const receiverTransaction = {
        transactionId: transactionId + "-R",
        userId: receiver.id,
        type: "RECEIVED",
        amount,
        senderAccount: sender.accountNumber,
        date: new Date().toISOString()
    };

    transactions.push(senderTransaction, receiverTransaction);

    writeJSON(USERS_FILE, users);
    writeJSON(TRANSACTIONS_FILE, transactions);

    res.json({
        success: true,
        message: `₹${amount.toFixed(2)} transferred successfully.`,
        transaction: senderTransaction
    });
});

/* SERVER - KEEP THIS AT THE VERY END */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`BST Bank running at http://localhost:${PORT}`);
});
