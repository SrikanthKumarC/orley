import nodemailer from 'nodemailer';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// query all todays reminders and send email and then mark them as sent
const sendReminders = async () => {
  const reminders = await prisma.todaysReminders.findMany({
    where: {
      complete: false,
      time: {
        lte: new Date(),
      },
    },
  });

  for (const reminder of reminders) {
    await sendEmail(
      reminder.userId,
      `Reminder - ${reminder.title}`,
      `
      Dear ${reminder.userId},
      
      This is a friendly reminder about ${
        reminder.title
      }. We wanted to make sure you don't miss out on it.
      
      Details:
      - Title: ${reminder.title}
      - Date: ${new Date(reminder.time).toDateString()}
      - Time: ${reminder.time}
      - Description: ${reminder.body}
      
      Please take note of this and make necessary arrangements if needed.
      
      If you have any questions or concerns, feel free to reach out to us.
      
      Best regards,
      
      Orley.
      `
    );
    await prisma.reminder.update({
      where: {
        id: reminder.reminderId,
      },
      data: {
        complete: true,
      },
    });
    await prisma.todaysReminders.delete({
      where: {
        id: reminder.id,
      },
    });
  }
};

export const sendEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions);
};

export {sendReminders};
