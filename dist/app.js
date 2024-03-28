"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const client_1 = require("@prisma/client");
const verify_1 = require("./middleware/verify");
app.use(express.json());
const prisma = new client_1.PrismaClient();
app.use(verify_1.verify);
app.get('/reminders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reminders = yield prisma.reminder.findMany();
    res.json(reminders);
}));
app.get('/reminders/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reminders = yield prisma.reminder.findMany({
        where: { userId: req.params.userId },
    });
    res.json(reminders);
}));
app.get('/set-complete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const reminder = yield prisma.reminder.update({
        where: { id },
        data: { complete: true },
    });
    res.json(reminder);
}));
app.post('/reminder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, time, userId } = req.body;
    const reminder = yield prisma.reminder.create({
        data: {
            userId,
            title,
            body,
            time,
        },
    });
    res.json(reminder);
}));
app.get('/reminder/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const reminders = yield prisma.reminder.findMany({
        where: {
            userId,
        },
    });
    console.log(reminders);
    res.json(reminders);
}));
app.get('/transfer-expired-reminders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get all reminders that are expired
    const reminders = yield prisma.reminder.findMany({
        where: {
            complete: true,
        },
    });
    // Transfer to new table
    for (const reminder of reminders) {
        yield prisma.expiredReminders.create({
            data: {
                userId: reminder.userId,
                title: reminder.title,
                body: reminder.body,
                time: reminder.time,
            },
        });
    }
    yield prisma.reminder.deleteMany({
        where: {
            complete: true,
        },
    });
    res.json({ message: 'Expired reminders transferred and deleted' });
}));
app.get('/sync-today-reminders', () => __awaiter(void 0, void 0, void 0, function* () {
    // get all reminders that are due today
    const reminders = yield prisma.reminder.findMany({
        where: {
            time: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
            complete: false,
        },
    });
    // delete everything from todaysReminders
    yield prisma.todaysReminders.deleteMany();
    // Transfer to new table
    for (const reminder of reminders) {
        yield prisma.todaysReminders.create({
            data: {
                userId: reminder.userId,
                title: reminder.title,
                body: reminder.body,
                time: reminder.time,
            },
        });
    }
}));
app.get('/reset-reminders', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.reminder.deleteMany();
    yield prisma.expiredReminders.deleteMany();
    yield prisma.todaysReminders.deleteMany();
    res.json({ message: 'All reminders deleted' });
}));
app.get('/', (req, res) => {
    res.send('Hello ');
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
