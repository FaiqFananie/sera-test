const ProductPayload = require('../../../Domains/products/entities/ProductPayload')
const ProductsTableTestHelper = require('../../../tests/ProductsTableTestHelper')
// const pool = require('../../database/postgres/pool')
const ProductRepositoryPostgres = require('../ProductRepositoryPostgres')
const chai = require('chai')
const pool = require('../../database/postgres/pool')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
chai.use(chaiAsPromised)

describe('ProductRepositoryPostgres', () => {
  afterEach(async () => {
    await ProductsTableTestHelper.cleanTable()
  })

  describe('addProduct', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const payload = new ProductPayload({
        name: 'Macbook PRO 13',
        qty: 1,
        price: 130000000
      })
      const fakeIdGenerator = () => '123' // stub!
      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await productRepositoryPostgres.addProduct(payload)

      // Assert
      const product = await ProductsTableTestHelper.findProductById('product-123')
      expect(product).to.have.length(1)
    })
  })

  describe('editProduct Function', () => {
    it('should throw error with statuscode 404 when product is not found', async () => {
      // Arrange
      const payload = new ProductPayload({
        name: 'Macbook PRO 14',
        qty: 1,
        price: 14000000
      })
      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action and Assert
      return expect(productRepositoryPostgres.editProduct('product-123', payload))
        .to.be.rejectedWith(NotFoundError, 'Produk gagal diperbarui, Id tidak ditemukan')
    })

    it('should persist product update payload correctly', async () => {
      // Arrange
      const productId = await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Macbook PRO 13', price: 14000000 })
      const payload = new ProductPayload({
        name: 'Macbook PRO 14',
        qty: 1,
        price: 14000000
      })

      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action
      await productRepositoryPostgres.editProduct(productId, payload)

      // Assert
      const product = await ProductsTableTestHelper.findProductById(productId)
      expect(product).to.have.length(1)
      expect(product[0].name).to.equal(payload.name)
      expect(product[0].price).to.equal(payload.price)
    })
  })

  describe('getProduct Function', () => {
    it('should throw error with statuscode 404 when product is not found', async () => {
      // Arrange
      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action and Assert
      return expect(productRepositoryPostgres.getProduct('product-123'))
        .to.be.rejectedWith(NotFoundError, 'Id tidak ditemukan')
    })

    it('should persist product get payload correctly', async () => {
      // Arrange
      const payload = {
        id: 'product-123',
        name: 'Macbook PRO 13',
        qty: 1,
        price: 14000000
      }
      const productId = await ProductsTableTestHelper.addProduct(payload)

      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action
      const product = await productRepositoryPostgres.getProduct(productId)

      // Assert
      expect(product.name).to.equal(payload.name)
      expect(product.qty).to.equal(payload.qty)
      expect(product.price).to.equal(payload.price)
      expect(product.createdAt).to.exist
      expect(product.updatedAt).to.exist
    })
  })

  describe('getAllProduct Function', () => {
    it('should show all products', async () => {
      // Arrange
      await ProductsTableTestHelper.addProduct({ id: 'product-123' })
      await ProductsTableTestHelper.addProduct({ id: 'product-124' })

      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action
      const products = await productRepositoryPostgres.getAllProducts()

      // Assert
      expect(products).to.have.length(2)
      expect(products[0].id).to.equal('product-123')
      expect(products[0].name).to.exist
      expect(products[0].qty).to.exist
      expect(products[0].price).to.exist
      expect(products[0].createdAt).to.exist
      expect(products[0].updatedAt).to.exist
      expect(products[1].id).to.equal('product-124')
      expect(products[1].name).to.exist
      expect(products[1].qty).to.exist
      expect(products[1].price).to.exist
      expect(products[1].createdAt).to.exist
      expect(products[1].updatedAt).to.exist
    })

    it('should show empty array when product is empty', async () => {
      // Arrange
      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action
      const products = await productRepositoryPostgres.getAllProducts()

      // Assert
      expect(Array.isArray(products)).to.equal(true)
      expect(products).to.have.length(0)
    })
  })

  describe('deleteProduct Function', () => {
    it('should throw error with statuscode 404 when product is not found', async () => {
      // Arrange
      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action and Assert
      return expect(productRepositoryPostgres.deleteProduct('product-123'))
        .to.be.rejectedWith(NotFoundError, 'Produk gagal dihapus, Id tidak ditemukan')
    })

    it('should persist product update payload correctly', async () => {
      // Arrange
      const productId = await ProductsTableTestHelper.addProduct({ id: 'product-123', name: 'Macbook PRO 13', price: 14000000 })

      const productRepositoryPostgres = new ProductRepositoryPostgres(pool, {})

      // Action
      await productRepositoryPostgres.deleteProduct(productId)

      // Assert
      const product = await ProductsTableTestHelper.findProductById(productId)
      expect(product).to.have.length(0)
    })
  })
})
