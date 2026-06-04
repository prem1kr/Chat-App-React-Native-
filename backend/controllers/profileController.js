import profileModel from "../models/profileModel.js";

export const ProfileEdit = async (req, res) => {
    try {
        const { userId, name, email, phone, address, bio, profileImage } = req.body;

        let profile = await profileModel.findOne({ userId });
        if (!profile) {
            profile = await profileModel.create({
                userId,
                name,
                email,
                phone,
                address,
                bio,
                profileImage,
            });
            return res.status(201).json({ success: true, message: 'Profile created successfully', profile });
        }

        const updatedProfile = await profileModel.findOneAndUpdate({ userId },
            {
                name,
                phone,
                address,
                bio,
                profileImage,
            },
            { new: true }
        );
        return res.status(200).json({ success: true, message: 'Profile updated successfully', profile: updatedProfile });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


export const GetProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const profile = await profileModel.findOne({userId});
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        return res.status(200).json({ success: true, message: 'profile fetched successfully', profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        console.log(error);

    }
}

export const GetAllProfile = async (req, res) => {
    try {
        const profile = await profileModel.find();
        if (profile.length === 0) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        return res.status(200).json({ success: true, message: 'profile fetched successfully', profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Error', error: error.message });
        console.log(error);

    }
}