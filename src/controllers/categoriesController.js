// import { Category } from '../models/category.js';

// export const getCategories = async (req, res, next) => {
//   try {
//     const categories = await Category.find();

//     res.status(200).json({
//       status: 'success',
//       code: 200,
//       data: categories,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

//Виправлено контролер категорій — повертається масив без обгортки

import { Category } from '../models/category.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
