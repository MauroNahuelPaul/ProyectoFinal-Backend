
import { Router } from 'express'
import { cartModel } from '../dao/models/cart.model.js'
const router = Router()

router.post('/', async (req, res) => {
    try {
        const user = req.body
        const result = await cartModel.create(user)
        res.json({ status: 'success', payload: result })
    }
    catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }

})

router.get('/', async (req, res) => {
    try {
        const result = await cartModel.find().lean().exec()
        res.status(200).json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/:cid', async (req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).lean().exec()
        if (result == null) {
            res.status(404).json({ status: 'error', error: 'Not found' })
        }
        res.status(200).json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})
router.put('/:cid', async (req, res) => {
    try {
        const id = req.params.cid
        const products = req.body
        const result = await cartModel.findByIdAndUpdate(id, products, { returnDocument: 'after' })
        if (result == null) {
            return res.status(404), json({ status: 'error', error: 'Not found' })
        }
        res.status(200).json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const result = await cartModel.findByIdAndDelete(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'not found' })
        }
        res.json({ status: 'success', payload: result })
    } catch (err) {
        return res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router