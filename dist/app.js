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
    console.log(reminders);
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
app.get('/', (req, res) => {
    res.send('Hello ');
});
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
