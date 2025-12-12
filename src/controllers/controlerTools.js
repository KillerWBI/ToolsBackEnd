import { Tool } from "../models/tool.js";



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
export default getAllTools;
