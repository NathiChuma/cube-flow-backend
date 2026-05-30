import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../../firebase';

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, country } = req.body as {
      username: string;
      email: string;
      password: string;
      country: string;
    };

    const existingUser = await db.collection('users').where('email', '==', email).get();

    if (!existingUser.empty) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userRef = db.collection('users').doc();

    await userRef.set({ username, email, country, passwordHash, createdAt: new Date() });

    res.status(201).json({
      message: 'User created successfully',
      user: { id: userRef.id, username, email, country },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default signup;
