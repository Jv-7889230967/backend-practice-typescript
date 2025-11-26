import { NextFunction, Request, Response } from "express";
import prisma from "../../DB/prisma-client"
import { ApiError } from "../../utils/ApiError";


class SearchController {
    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const usersData = await prisma.user.findMany({
                orderBy: {
                    id: "asc"
                }
            });
            res.status(200).json(usersData);

        } catch (error: any) {
            throw new ApiError(error, 500);
        }
    }
}


export const searchController = new SearchController();
