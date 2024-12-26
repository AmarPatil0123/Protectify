import express from 'express';
const userRouter = express.Router();
import User from '../models/User.js';
import Tab from '../models/Tab.js';
import passport from "passport";


userRouter.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.register({ username }, password);

        req.logIn(user, async (err) => {
            if (err) return res.json(err.message);

            const newTab = new Tab({
                title: "Empty Tab",
                data: "",
                owner: req.user._id,
            });
            await newTab.save();
            res.locals.user = req.user;
            const tabs = await Tab.find({ owner: user._id });
            res.json({ username: req.user.username, tabs: tabs });
        });
    } catch (error) {
        res.status(400).json({ message: error.message || "Something went wrong" });
    }
});

userRouter.post("/login", passport.authenticate("local"), async (req, res) => {
    const tabs = await Tab.find({ owner: req.user._id });

    let user = req.user._id;
    if (tabs.length === 0) {
        const newTab = new Tab({
            title: "Empty Tab",
            data: "",
            owner: req.user._id || user,
        });
        await newTab.save();
    }
    res.json({ username: req.user.username, tabs });
});

userRouter.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.json(err);
        res.status(200).json({ message: "Logout successful" });
    });
});

userRouter.post("/changePassword/:ownerId", async (req, res) => {
    const { newPassword } = req.body;
    const { ownerId } = req.params;

    try {
        const user = await User.findById(ownerId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.setPassword(newPassword);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

userRouter.get("/deleteAccount/:ownerId", async (req, res, next) => {
    try {
        let { ownerId } = req.params;

        let user = await User.findById(ownerId);

        if (!user) {
            return res.json("User not found");
        }

        await Tab.deleteMany({owner : ownerId});

        await User.findByIdAndDelete(ownerId);

        res.status(200).json({ message: "user deleted successfully" });

    } catch (error) {
        res.status(400).json({ error: "Something went wrong" });
    }
});

export default userRouter;