import createHttpError from 'http-errors';
import { Tool } from '../models/tool.js';
import { uploadMultipleImagesToCloudinary } from '../services/cloudinary.js';

export const getAllTools = async (req, res) => {
  const { search, category } = req.query;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 16;
  const filter = {};
  const skip = (page - 1) * limit;

  // Add text search to filter
  if (search) {
    filter.$text = { $search: search };
  }

  // Add category filter
  if (category) {
    const categoryIds = category.split(',');
    filter.category = { $in: categoryIds };
  }

  const toolsQuery = Tool.find(filter);

  const [totalTools, tools] = await Promise.all([
    toolsQuery.clone().countDocuments(),
    toolsQuery.skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalTools / limit);

  res.status(200).json({
    page,
    totalPages,
    limit,
    totalTools,
    tools: [...tools],
  });
};

export const createTool = async (req, res, next) => {
  try {
    // reject empty request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(createHttpError(400, 'Request body is empty'));
    }

    let {
      owner,
      category,
      name,
      description,
      pricePerDay,
      specifications,
      rentalTerms,
    } = req.body;

    // Parse specifications if it's a JSON string (from multipart/form-data)
    if (typeof specifications === 'string') {
      try {
        specifications = JSON.parse(specifications);
      } catch {
        return next(
          createHttpError(400, 'Invalid JSON format for specifications')
        );
      }
    }

    // Проверка обязательных полей
    if (!owner || !category || !name || !description || !pricePerDay) {
      return next(createHttpError(400, 'Missing required fields'));
    }

    const toolName = String(name).trim();
    if (!toolName) {
      return next(createHttpError(400, 'Name cannot be empty'));
    }

    // helper to escape regex special chars
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // check existing tool by name (case-insensitive exact match)
    const existing = await Tool.findOne({
      name: { $regex: `^${escapeRegExp(toolName)}$`, $options: 'i' },
    });

    if (existing) {
      return next(createHttpError(409, 'Tool with this name already exists'));
    }

    // Обработка загруженных фотографий
    let images = [];
    if (req.files && req.files.length > 0) {
      try {
        images = await uploadMultipleImagesToCloudinary(req.files);
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        return next(createHttpError(400, 'Error uploading images'));
      }
    }

    // Если нет загруженных файлов, используем изображение из body (если было)
    if (images.length === 0 && req.body.imageUrl) {
      images = [req.body.imageUrl];
    }

    // Минимум одна фотография
    if (images.length === 0) {
      return next(createHttpError(400, 'At least one image is required'));
    }

    const newTool = await Tool.create({
      owner,
      category,
      name: toolName,
      description,
      pricePerDay,
      images, // массив URL
      specifications: specifications || {},
      rentalTerms: rentalTerms || '',
    });

    res.status(201).json({
      tool: newTool,
    });
  } catch (error) {
    console.error('createTool error:', error);
    if (error && error.name === 'ValidationError') {
      return next(createHttpError(400, error.message));
    }
    next(error);
  }
};

// Получить инструмент по ID (публичный)
export const getToolById = async (req, res, next) => {
  try {
    const { toolId } = req.params;

    const tool = await Tool.findById(toolId)
      .populate('category feedbacks')
      .lean();

    if (!tool) {
      return next(createHttpError(404, 'Tool not found'));
    }

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
};

// Получить инструмент по ID (только владелец)
export const getUserToolById = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const userId = req.user._id;

    const tool = await Tool.findOne({
      _id: toolId,
      owner: userId,
    });

    if (!tool) {
      return next(createHttpError(404, 'Tool not found'));
    }

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
};

export const updateTool = async (req, res) => {
  const { toolId } = req.params;
  const body = { ...req.body };

  if (body.images != null) {
    if (typeof body.images === 'string') {
      body.images = [body.images];
    } else if (Array.isArray(body.images)) {
      body.images = body.images.filter(Boolean).slice(0, 5);
    } else {
      return createHttpError(400, 'Invalid images format');
    }
  }

  const tool = await Tool.findOneAndUpdate({ _id: toolId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tool) {
    throw createHttpError(404, 'Tool not found');
  }

  res.status(200).json(tool);
};

export const DeleteTool = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const userId = req.user._id;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      next(createHttpError(404, 'Tool not found'));
      return;
    }

    if (tool.owner.toString() !== userId.toString()) {
      next(createHttpError(403, 'You are not the owner of this tool'));
      return;
    }

    await Tool.findOneAndDelete({ _id: toolId });
    res
      .status(200)
      .json({ message: 'Tool deleted successfully', deleted: tool });
  } catch (err) {
    next(err);
  }
};
