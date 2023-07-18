import fs from 'fs'
class CartManager {
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
    getCarts = async () => {
        return JSON.parse(await fs.promises.readFile(this.#path, this.#format))
    }
    getElementById = async (id) => {
        const carts = await this.getCarts()
        return carts.find(item => item.id === id)
    }
    async addProductCart(idCart, idProduct) {
        const carts = await this.getCarts()
        const cart = carts.find(item => item.id === idCart)
        const indice = carts.indexOf(cart)
        if (indice == -1) {
            console.log("No se encontro del carrito")
        }
        else {
            const product = cart["products"].find(elem => elem.product == idProduct)
            if (product !== undefined) {
                const indice = cart["products"].indexOf(product)
                cart["products"][indice] = { product: idProduct, quantity: product.quantity + 1 }
            }
            else {
                cart["products"].push({ product: idProduct, quantity: 1 })
            }

            carts[indice] = cart
            await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'))
        }
    }
    #generateCode = (carts) => {
        return (carts.length === 0) ? 1 : carts[carts.length - 1].id + 1
    }
    async addCart() {
        const carts = await this.getCarts()

        carts.push({
            id: this.#generateCode(carts),
            products: []
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, '\t'))
    }
}

const manager = new CartManager('src/data/carrito.json')
export { manager }
