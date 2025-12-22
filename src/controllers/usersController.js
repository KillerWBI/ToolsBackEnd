import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

const { isValidObjectId } = mongoose;

const mapUserToPublicDto = (user) => ({
  id: user._id.toString(),
  name: user.name,
  avatarUrl: user.avatarUrl || '',
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
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    // Перевіряємо, чи був завантажений файл
    if (!req.file) {
      throw createHttpError(400, 'No file');
    }

    // Зберігаємо файл у Cloudinary
    const result = await saveFileToCloudinary(req.file.buffer);

    // Оновлюємо URL аватара користувача в базі даних
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: result.secure_url },
      { new: true }
    );

    // Повертаємо оновлений URL
    res.status(200).json({ url: user.avatarUrl });
  } catch (error) {
    next(error);
  }
};
