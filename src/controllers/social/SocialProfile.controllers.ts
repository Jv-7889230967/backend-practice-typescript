import { Request, Response } from "express";
import { SocialProfile } from "../../models/social/profile.model";
import { asyncHandler } from "../../utils/AsyncHandler";
import { getUserFromRequest } from "../../utils/AttachUser";
import { ApiError } from "../../utils/ApiError";
import { ProfileType } from "../../../types/profile";
import { CheckProfile } from "../../services/social/CheckProfile";
import { SendMessage } from "../../services/shared/SendMessage";


class SocialProfileController extends SendMessage {
    profileModel: typeof SocialProfile;
    constructor(profileModel: typeof SocialProfile) {
        super(0, '');
        this.profileModel = profileModel;
    }


    /**
     * @param reqObject
     * @description function to create a social profile for a logined user by accessing the set user details in the req object 
     */
    createSocialProfile = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
        const currentUser = getUserFromRequest(req);
        if (!currentUser) {
            throw new ApiError("Please login", 401);
        }
        const { coverImage, firstName, lastName, bio, DOB, location, countryCode } = req.body;

        if (!firstName || !lastName || !bio || !DOB || !countryCode) {
            throw new ApiError("please fill all required fields", 401);
        }
        const checkProfle = new CheckProfile(currentUser?._id);
        const profileExists: boolean = await checkProfle.checkProfile();

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


    /**
     * @param req object to get the currnt user id
     * @description function to get the social profile of the logged in user.
     */
    getSocialProfile = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
        const currentUser = getUserFromRequest(req);
        const Checkprofile = new CheckProfile(currentUser?.id);
        const profile: ProfileType | null = await Checkprofile.getProfile();
        if (!profile) {
            throw new ApiError("Social Profile does not exists", 404);
        }
        return res.status(200).json({
            message: "your social profil",
            profile: profile
        })
    })
}
export const socialProfileController = new SocialProfileController(SocialProfile)