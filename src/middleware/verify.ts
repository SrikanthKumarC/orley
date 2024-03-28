import {Request, Response, NextFunction} from 'express';

const verify = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({error: 'Token is required'});
  } else if (token === process.env.ADMIN_TOKEN) {
    return next();
  } else {
    res.status(401).json({error: 'Unauthorized'});
  }
};

export {verify};
