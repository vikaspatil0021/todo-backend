import * as express from 'express';
import { ObjectId } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: ObjectId;
        email: string;
      };
    }
  }
}
