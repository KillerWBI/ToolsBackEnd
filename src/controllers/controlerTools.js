import { Tool } from "../models/tool.js";





export const getAllTools = async (req, res) => {
  const { search, page, perPage } = req.query;
  const skip = (page - 1) * perPage;

  const toolsQuery = Tool.find();

  if(search) {
    toolsQuery.where({ $text: { $search: search } });
  }

  const [totalTools, tools] = await Promise.all([
    toolsQuery.clone().countDocuments(),
    toolsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalTools / perPage);

  res.status(200).json({
    page,
    perPage,
    totalPages,
    totalTools,
    tools: [...tools],
  });

};
export default getAllTools;
