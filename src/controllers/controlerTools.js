import { Tool } from "../models/tool.js";



export const getAllNotes = async (req, res, next) => {
  try {
    // выполнить запрос и получить массив документов
    const tools = await Tool.find().lean();

    res.status(200).json({
      tools
    });
  } catch (error) {
    next(error);
  }
};
export default getAllNotes;
