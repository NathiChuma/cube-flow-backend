import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../../firebase';

const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const snapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, user['passwordHash'] as string);

    if (!passwordMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: user['username'],
        email: user['email'],
        country: user['country'],
      },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default signin;
