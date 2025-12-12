import createHttpError from 'http-errors';
import { Tool } from '../models/tool.js';

export const getAllTools = async (req, res) => {
  const { search, category } = req.query;
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 16;
  const filter = {};

  const skip = (page - 1) * limit;

  


  if(search) {
    toolsQuery.where({ $text: { $search: search } });
  }

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

export const updateTool = async (req, res, next) => {
      try {
        const {toolId} = req.params;
        const userid = req.user._id;

        const tool = await Tool.findById(toolId);

        if(!tool){
          next(createHttpError(404, 'Tool not found'));
        return;
        }

        if(tool.owner.toString() !== userid.toString()){
          next(createHttpError(403, 'You are not the owner of this tool'));
          return;
        }

        Object.assign(tool, req.body);
        const UpdateTool = await tool.save();


        res.status(200).json(UpdateTool);
      } catch (err) {
          next(err);
      }
};

export const DeleteTool = async (req,res,next) => {
    try {
        const { toolId } = req.params;
        const userId = req.user._id;

        const tool = await Tool.findById(toolId);
        if(!tool) {
          next(createHttpError(404, 'Tool not found'));
        return;
        }

        if(tool.owner.toString() !== userId.toString()){
          next(createHttpError(403, 'You are not the owner of this tool'));
        return;
        }

        await Tool.findOneAndDelete({ _id: toolId });
        res.status(200).json({message: 'Tool deleted successfully',deleted: tool});
      } catch (err) {
        next(err);
      }
};



