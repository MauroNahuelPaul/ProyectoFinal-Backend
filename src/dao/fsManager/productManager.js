import fs from 'fs'
class ProductManager {
    #format
    #path
    #error
    constructor(path) {
        this.#path = path
        if (!fs.existsSync(this.#path)) {
            fs.writeFileSync(this.#path, '[{"id":0}]')
        }
        this.#error
        this.#format = 'utf-8'
    }

    getProducts = async () => {
        return JSON.parse(await fs.promises.readFile(this.#path, this.#format))
    }

    getElementById = async (id) => {
        const products = await this.getProducts()
        return products.find(item => item.id === id)
    }

    updateProduct = async (id, title, description, code, price, status = true, stock, category, thumbnails) => {
        const products = await this.getProducts()
        const objeto = products.find(item => item.id === id)
        const indice = products.indexOf(objeto)
        if (indice == -1) {
            console.log("No se encontro del objeto")
        }
        else {
            id = objeto.id
            if (this.#isValid(products, title, description, code, price, stock, category) != undefined)
                return this.#isValid(products, title, description, code, price, stock, category)
                
            products[indice] = ({ id, title, description, code, price, status, stock, category, thumbnails })
            await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))
        }

    }
    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const objeto = products.find(item => item.id === id)
        const indice = products.indexOf(objeto)

        if (indice == -1) {
            return false
        }
        else {
            products.splice(indice, 1)
            await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))

        }
    }

    #isValid = (products, title, description, code, price, stock, category) => {
        if (!title || !description || !code || !price || !stock || !category) {
            return `[${title}]: campos incompletos`
        } else {
            const found = products.find(item => item.code === code)
            if (found) return `[${title}]: el code ya existe`
        }

    }
    #generateCode = (products) => {

        return (products.length === 0) ? 1 : products[products.length - 1].id + 1
    }
    async addProduct(title, description, code, price, status = true, stock, category, thumbnails = []) {
        const products = await this.getProducts()
        if (this.#isValid(products, title, description, code, price, stock, category) != undefined)
            return (this.#isValid(products, title, description, code, price, stock, category))

        products.push({
            id: this.#generateCode(products),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        })

        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, '\t'))
        return false
    }
}

const manager = new ProductManager('src/data/productos.json')
export { manager }