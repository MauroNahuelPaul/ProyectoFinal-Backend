import { Router } from "express";
import { messageModel } from "../dao/models/message.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await messageModel.find()
        res.json({ status: 'success', payload: messages })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.post('/', async (req, res) => {
    const message = req.body;
    try {
        let result = await messageModel.create(message)
        res.json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }

})

export default router
