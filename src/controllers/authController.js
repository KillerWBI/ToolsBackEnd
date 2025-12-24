import createHttpError from "http-errors";
import { User } from '../models/user.js';
import bcrypt from "bcryptjs";
import { createSession, setSessionCookies  } from "../services/auth.js";
import { Session } from "../models/session.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/sendEmail.js";
import Handlebars from "handlebars";
import path from 'node:path';
import fs from 'node:fs/promises';

//registration
export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(createHttpError(400, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);

    res.status(201).json(newUser);
};

//login
export const loginUser = async (req, res, next) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(createHttpError(401, 'Invalid credentials'));
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return next(createHttpError(401, 'Invalid credentials'));
        }
        await Session.deleteOne({ userId: user._id });

        const newSession = await createSession(user._id);
        setSessionCookies(res, newSession);

        res.status(200).json({
            name: user.name,
            email: user.email,
            _id: user._id,
        });
};

//logout
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//оновлення сессії
export const refreshUserSession = async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    return next(createHttpError(401, 'Session token expired'));
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

//reset password
export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({
      message: 'If this email exists, a reset link has been sent',
    });
  }
  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
  res.status(200).json({
    message: 'If this email exists, a reset link has been sent',
  });
};