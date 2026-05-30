import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { db } from '../../firebase';
import 'dotenv/config';

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as { email: string };

  try {
    const transportOptions: nodemailer.TransportOptions = {
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 2525,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      ...(process.env.NODE_ENV === 'development' && {
        tls: { rejectUnauthorized: false },
      }),
    } as nodemailer.TransportOptions;

    const transporter = nodemailer.createTransport(transportOptions);

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      res.status(404).json({ error: 'User with this email does not exist.' });
      return;
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(resetCode, 10);
    const tokenExpiry = Date.now() + 3_600_000; // 1 hour

    await usersRef.doc(userId).update({ resetToken: hashedCode, tokenExpiry });

    const mailOptions = {
      from: `"Cube Flow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <p>Your password reset code is:</p>
        <h2 style="letter-spacing: 4px;">${resetCode}</h2>
        <p>This code is valid for 1 hour. Do not share it with anyone.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Reset code emailed successfully.' });
  } catch (error) {
    res.status(500).json({ error: `Server error processing request: ${(error as Error).message}` });
  }
};

export default forgotPassword;
