import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1
        const filterOptios = {}
        if (req.query.stock) filterOptios.stock = req.query.stock
        if (req.query.category) filterOptios.category = req.query.category
        const paginateOptios = { limit, page }
        if (req.query.sort === 'asc') paginateOptios.sort = { price: 1 }
        if (req.query.sort === 'desc') paginateOptios.sort = { price: -1 }
        const result = await productModel.paginate(filterOptios, paginateOptios)
        console.log(result)
        res.status(200).json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.prevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${result.nextPage}` : null

        })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findById(id).lean().exec()
        if (result == null) {
            res.status(404).json({ status: 'error', error: 'Not found' })
        }
        res.status(200).json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const result = await productModel.create(product)
        res.json({ status: 'success', payload: result })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid
        const data = req.body
        const result = await productModel.findByIdAndUpdate(id, data, { returnDocument: 'after' })
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
        const result = await productModel.findByIdAndDelete(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'not found' })
        }
        res.json({ status: 'success', payload: result })
    } catch (err) {
        return res.status(500).json({ status: 'error', error: err.message })
    }
})

export default router