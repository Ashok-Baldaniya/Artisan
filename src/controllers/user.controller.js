import { User } from "../models/user.model";
import { sendResponse } from "../utils/apiResponse"

export const getCurrentUserProfile = async (req, res) => {
    try {
        const currentUser = await User.findOne({ email: req.user.email });

        if (!currentUser) {
            return sendResponse(res, 404, 'User not found');
        }

        return sendResponse(res, 200, 'User retrieved successfully', { currentUser })
    } catch (error) {
        return sendResponse(res, 500, 'Failed to retrieve user', null, error);
    }
}