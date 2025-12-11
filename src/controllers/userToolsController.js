import { Tool } from '../models/tool.js';
import { User } from '../models/user.js';
import mongoose from 'mongoose';

export const getUserTools = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Невірний userId' });
    }

    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    // Преобразуем userId в ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const tools = await Tool.find({ owner: userObjectId }).lean();

    res.status(200).json({
      message: 'Список инструментов пользователя получен',
      data: tools,
    });
  } catch (error) {
    next(error);
  }
};

export default getUserTools;
