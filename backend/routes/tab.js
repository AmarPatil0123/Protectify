import express from 'express';
const tabRouter = express.Router();
import Tab from '../models/Tab.js';

tabRouter.get("/addnewtab/:userId", async (req, res, next) => {
    try {

        const {userId} = req.params;
        const newTab = new Tab({
            title: "Empty Tab",
            data: "",
            owner: userId || req.user._id
        });
        await newTab.save();
        res.status(200).json(newTab);
    } catch (error) {
        next(error)
    }
});

tabRouter.put("/saveTabData/:tabId/:ownerId", async (req, res) => {
    try {
        const { tabId, ownerId } = req.params;
        const { title, data } = req.body;

        const tab = await Tab.findOneAndUpdate(
            { _id: tabId, owner: ownerId  },
            { title, data },
            { new: true }
        );
        res.json(tab);
    } catch (error) {
        res.json(error);
    }
});

tabRouter.delete("/deleteTab/:tabId/:ownerId", async (req, res, next) => {
    try {
        const { tabId, ownerId } = req.params;

        const deletedTab = await Tab.findOneAndDelete({ _id: tabId, owner: ownerId });
        res.status(200).json(deletedTab);
    } catch (error) {
        next(error)
    }
});

export default tabRouter;