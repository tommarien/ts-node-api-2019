import { RequestHandler } from 'express';
import { v4 } from 'uuid';

const REQ_ID_HEADER_NAME = 'X-Request-Id';

const requestId: RequestHandler = (req, res, next) => {
  req.id = req.get(REQ_ID_HEADER_NAME) || v4();
  res.setHeader(REQ_ID_HEADER_NAME, req.id);
  next();
};

export default requestId;
