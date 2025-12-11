import createHttpError from 'http-errors';

export const getUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(createHttpError(401, 'Not authenticated'));
    }

    const userId = user._id;

    res.status(200).json({
      success: true,
      data: {
        id: userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
