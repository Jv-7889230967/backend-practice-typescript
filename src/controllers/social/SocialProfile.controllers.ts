import { NextFunction, Request, Response } from "express";
import { SocialProfile } from "../../models/profile.model";
import { SendMessage } from "../../services/SendMessage";
import { asyncHandler } from "../../utils/AsyncHandler";
import { getUserFromRequest } from "../../utils/AttachUser";
import { ApiError } from "../../utils/ApiError";
import { CheckProfile } from "../../services/CheckProfile";


class SocialProfileController extends SendMessage {
    profileModel: typeof SocialProfile;
    constructor(profileModel: typeof SocialProfile) {
        super(0, '');
        this.profileModel = profileModel;
    }

    createSocialProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const currentUser = getUserFromRequest(req);
        if (!currentUser) {
            throw new ApiError("Please login", 401);
        }
        const { coverImage, firstName, lastName, bio, DOB, location, countryCode } = req.body;

        if (!firstName || !lastName || !bio || !DOB || !countryCode) {
            throw new ApiError("please fill all required fields", 401);
        }
        const checkProfle = new CheckProfile(currentUser?._id);
        const profileExists: boolean = await checkProfle.getProfile();

        if (profileExists) {
            throw new ApiError("Social Profile Already exist", 409);
        }
        const profileData = {
            ...req.body,
            owner: currentUser?._id,
        };
        const socialProfile: InstanceType<typeof this.profileModel> = await this.profileModel.create(profileData);
        const populatedData = await socialProfile.populate("owner");

        return res
            .status(201).json({
                message: "your social profile has been created",
                profile: populatedData
            })

    })
}
export const socialProfileController = new SocialProfileController(SocialProfile)