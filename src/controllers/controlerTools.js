import { celebrate, Joi } from 'celebrate';
import { Tool } from '../models/tool.js';

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

export const createTool = celebrate({
  body: Joi.object().keys({
    owner: Joi.string().required(),
    category: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    pricePerDay: Joi.number().positive().required(),
    images: Joi.string().required(),
    specifications: Joi.object().optional(),
    rentalTerms: Joi.string().optional(),
  }),
})(async (req, res, next) => {
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
});

export default getAllNotes;
