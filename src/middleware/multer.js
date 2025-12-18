import multer from 'multer';
import createHttpError from 'http-errors';

// Налаштування multer
const storage = multer.memoryStorage(); // Зберігаємо файл у пам'яті (буфер)

const limits = {
  fileSize: 1 * 1024 * 1024, // 1MB
  files: 5, // Max 5 files
};

// Фільтр для перевірки типу файлу
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // Дозволяємо файл
  } else {
    // Відхиляємо файл
    cb(
      createHttpError(400, 'Only JPEG, PNG, WebP and GIF images allowed'),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
