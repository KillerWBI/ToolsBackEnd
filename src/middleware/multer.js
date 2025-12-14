import multer from 'multer';
import createHttpError from 'http-errors';

// Налаштування multer
const storage = multer.memoryStorage(); // Зберігаємо файл у пам'яті (буфер)

const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

// Фільтр для перевірки типу файлу
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Дозволяємо файл
  } else {
    // Відхиляємо файл
    cb(createHttpError(400, 'Only images allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
