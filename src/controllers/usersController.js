import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import User from '../models/user.js';

const { isValidObjectId } = mongoose;

const mapUserToPublicDto = (userDoc) => ({
  id: userDoc._id.toString(),
  name: userDoc.name,
  avatarUrl: userDoc.avatarUrl || '',
});

export const getPublicUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      throw createHttpError(400, 'Invalid user id');
    }

    const user = await User.findById(userId).select('name avatarUrl').lean();

    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const responseBody = mapUserToPublicDto(user);

    res.status(200).json(responseBody);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(createHttpError(401, 'Not authenticated'));
    }

    const userId = user._id;

    res.status(200).json({
      success: true,
      data: {
        id: userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
