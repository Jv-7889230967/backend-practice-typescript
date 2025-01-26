import { Request, Response } from 'express';
import { UserType } from './user';
import { Server } from "socket.io";
import { Application } from "express";

export type authRequest = Request<{}, {}, { user: UserType }, QueryString.ParsedQs, Record<string, any>>;

declare module "express-serve-static-core" {
  interface Application {
    io?: Server;
  }

  interface Request {
    app?: Application; // Add this line to include the app property
  }
}
