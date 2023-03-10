const ProductRepository = require('../../../Domains/products/ProductRepository')
const GetProductUseCase = require('../GetProductUseCase')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const ProductDetail = require('../../../Domains/products/entities/ProductDetail')

describe('GetProductUseCase', () => {
  it('should orchestrating the get product action correctly', async () => {
    // Arrange
    const productId = 'product-123'

    const stubProductRepository = new ProductRepository()

    const stub = sinon.stub(stubProductRepository, 'getProduct').returns({
      id: 'product-123',
      name: 'Macbook PRO 13',
      qty: 1,
      price: 13000000,
      createdAt: new Date(2023, 1, 2),
      updatedAt: new Date(2023, 1, 2)
    })

    const getProductUseCase = new GetProductUseCase({
      productRepository: stubProductRepository
    })

    // Action
    const result = await getProductUseCase.execute(productId)

    // Assert
    expect(stub.calledWith(productId)).to.be.equal(true)
    expect(result).to.eql(new ProductDetail({
      id: 'product-123',
      name: 'Macbook PRO 13',
      qty: 1,
      price: 13000000,
      createdAt: new Date(2023, 1, 2),
      updatedAt: new Date(2023, 1, 2)
    }))
  })
})
