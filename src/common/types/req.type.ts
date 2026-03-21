import { Request } from 'express';

export type Req<T = any> = Request & T;
