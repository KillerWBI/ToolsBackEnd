import createHttpError from "http-errors";
import { User } from '../models/user.js';
import bcrypt from "bcryptjs";
import { createSession, setSessionCookies  } from "../services/auth.js";
import { Session } from "../models/session.js";

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