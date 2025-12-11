import { Tool } from '../models/tool.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    // выполнить запрос и получить массив документов
    const tools = await Tool.find().lean();

    res.status(200).json({
      tools,
    });
  } catch (error) {
    next(error);
  }
};

export const createTool = async (req, res, next) => {
  try {
    const {
      owner,
      category,
      name,
      description,
      pricePerDay,
      images,
      specifications,
      rentalTerms,
    } = req.body;

    const newTool = await Tool.create({
      owner,
      category,
      name,
      description,
      pricePerDay,
      images,
      specifications: specifications || {},
      rentalTerms: rentalTerms || '',
    });

    res.status(201).json({
      tool: newTool,
    });
  } catch (error) {
    next(error);
  }
};

export default getAllNotes;

export const getToolById = async (req, res, next) => {
  const { toolId } = req.params;
  const tool = await Tool.findOne({
    _id: toolId,
    userId: req.user._id,
  });

  if (!tool) {
    next(createHttpError(404, 'Tool not found'));
    return;
  };

  res.status(200).json(tool);
};