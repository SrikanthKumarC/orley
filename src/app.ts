const express = require('express');
const app = express();
import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {verify} from './middleware/verify';
app.use(express.json());

const prisma = new PrismaClient();

app.use(verify);

app.get('/reminders', async (req: Request, res: Response) => {
  const reminders = await prisma.reminder.findMany();
  res.json(reminders);
});

app.get('/reminders/:userId', async (req: Request, res: Response) => {
  const reminders = await prisma.reminder.findMany({
    where: {userId: req.params.userId},
  });
  res.json(reminders);
});

app.get('/set-complete/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const reminder = await prisma.reminder.update({
    where: {id},
    data: {complete: true},
  });
  res.json(reminder);
});

app.post('/reminder', async (req: Request, res: Response) => {
  const {title, body, time, userId} = req.body;
  const reminder = await prisma.reminder.create({
    data: {
      userId,
      title,
      body,
      time,
    },
  });
  res.json(reminder);
});

app.get('/reminder/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const reminders = await prisma.reminder.findMany({
    where: {
      userId,
    },
  });
  console.log(reminders);
  res.json(reminders);
});

app.get('/transfer-expired-reminders', async (req: Request, res: Response) => {
  // get all reminders that are expired
  const reminders = await prisma.reminder.findMany({
    where: {
      complete: true,
    },
  });
  // Transfer to new table
  for (const reminder of reminders) {
    await prisma.expiredReminders.create({
      data: {
        userId: reminder.userId,
        title: reminder.title,
        body: reminder.body,
        time: reminder.time,
      },
    });
  }
  await prisma.reminder.deleteMany({
    where: {
      complete: true,
    },
  });
  res.json({message: 'Expired reminders transferred and deleted'});
});

app.get('/sync-today-reminders', async () => {
  // get all reminders that are due today
  const reminders = await prisma.reminder.findMany({
    where: {
      time: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
      complete: false,
    },
  });
  // delete everything from todaysReminders
  await prisma.todaysReminders.deleteMany();
  // Transfer to new table
  for (const reminder of reminders) {
    await prisma.todaysReminders.create({
      data: {
        userId: reminder.userId,
        title: reminder.title,
        body: reminder.body,
        time: reminder.time,
      },
    });
  }
});

app.get('/reset-reminders', async (req: Request, res: Response) => {
  await prisma.reminder.deleteMany();
  await prisma.expiredReminders.deleteMany();
  await prisma.todaysReminders.deleteMany();
  res.json({message: 'All reminders deleted'});
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello ');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
