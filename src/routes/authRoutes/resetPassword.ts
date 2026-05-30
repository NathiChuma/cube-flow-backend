import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../../firebase';

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, code, password } = req.body as {
    email: string;
    code: string;
    password: string;
  };

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      res.status(404).json({ error: 'User with this email does not exist.' });
      return;
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (Date.now() > (userData['tokenExpiry'] as number)) {
      res.status(400).json({ error: 'Reset code has expired.' });
      return;
    }

    const isValid = await bcrypt.compare(code, userData['resetToken'] as string);
    if (!isValid) {
      res.status(400).json({ error: 'Invalid verification code.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await usersRef.doc(userDoc.id).update({
      passwordHash,
      resetToken: FieldValue.delete(),
      tokenExpiry: FieldValue.delete(),
    });

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: `Server error updating password: ${(error as Error).message}` });
  }
};

export default resetPassword;
