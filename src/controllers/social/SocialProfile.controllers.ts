import { NextFunction, Request, Response } from "express";
import { SocialProfile } from "../../models/profile.model";
import { SendMessage } from "../../services/SendMessage";
import { socialProfileType } from "../../types/profile";
import { asyncHandler } from "../../utils/asyncHandler";


class SocialProfileController extends SendMessage {
    profileModel: typeof SocialProfile;
    constructor(profileModel: typeof SocialProfile) {
        super(0,'');
        this.profileModel = profileModel;
    }

    createSocialProfile=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
      
    })
}
export const socialProfileController = new SocialProfileController(SocialProfile)