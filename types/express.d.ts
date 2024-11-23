import { Request, Response } from 'express';
import { UserType } from './user';


export type authRequest = Request<{}, {}, { user: UserType }, QueryString.ParsedQs, Record<string, any>>;
