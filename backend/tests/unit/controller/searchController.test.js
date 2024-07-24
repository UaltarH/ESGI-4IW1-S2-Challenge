// const SearchController = require('../../../src/controllers/SearchController');
// const MongoProduct = require('../../../src/mongo/models/MongoProduct');

// jest.mock('../../../src/mongo/models/MongoProduct');

// describe('SearchController', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//     describe('getProducts', () => {
//         it('should return products matching search term in name or description', async () => {
//             const mockProducts = [
//                 { _id: '1', name: 'Product 1', description: 'Description 1' },
//                 { _id: '2', name: 'Product 2', description: 'Description 2' }
//             ];

//             MongoProduct.find.mockResolvedValue(mockProducts);

//             const req = {
//                 query: { search: 'Product' }
//             };
//             const res = { json: jest.fn() };

//             await SearchController.getProducts(req, res);

//             expect(MongoProduct.find).toHaveBeenCalledWith({
//                 $or: [
//                     { name: { $regex: 'Product', $options: 'i' } },
//                     { description: { $regex: 'Product', $options: 'i' } }
//                 ]
//             });
//             expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
//         });

//         it('should filter products by category', async () => {
//             const mockProducts = [
//                 { _id: '1', name: 'Product 1', description: 'Description 1', categoryName: 'Category1' }
//             ];

//             MongoProduct.find.mockResolvedValue(mockProducts);

//             const req = {
//                 query: { search: 'Product', category: 'Category1' }
//             };
//             const res = { json: jest.fn() };

//             await SearchController.getProducts(req, res);

//             expect(MongoProduct.find).toHaveBeenCalledWith({
//                 $or: [
//                     { name: { $regex: 'Product', $options: 'i' } },
//                     { description: { $regex: 'Product', $options: 'i' } }
//                 ],
//                 categoryName: 'Category1'
//             });
//             expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
//         });

//         it('should filter products by stock availability', async () => {
//             const mockProducts = [
//                 { _id: '1', name: 'Product 1', description: 'Description 1', stock: 10 }
//             ];

//             MongoProduct.find.mockResolvedValue(mockProducts);

//             const req = {
//                 query: { search: 'Product', stock: 'true' }
//             };
//             const res = { json: jest.fn() };

//             await SearchController.getProducts(req, res);

//             expect(MongoProduct.find).toHaveBeenCalledWith({
//                 $or: [
//                     { name: { $regex: 'Product', $options: 'i' } },
//                     { description: { $regex: 'Product', $options: 'i' } }
//                 ],
//                 stock: { $gt: 0 }
//             });
//             expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
//         });

//         it('should handle errors', async () => {
//             const error = new Error('Error fetching products');
//             MongoProduct.find.mockRejectedValue(error);

//             const req = { query: {} };
//             const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

//             await SearchController.getProducts(req, res);

//             expect(res.status).toHaveBeenCalledWith(500);
//             expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching products' });
//         });

//         it('should handle empty search and return all products if no filters are applied', async () => {
//             const mockProducts = [
//                 { _id: '1', name: 'Product 1', description: 'Description 1' },
//                 { _id: '2', name: 'Product 2', description: 'Description 2' }
//             ];

//             MongoProduct.find.mockResolvedValue(mockProducts);

//             const req = { query: {} };
//             const res = { json: jest.fn() };

//             await SearchController.getProducts(req, res);

//             expect(MongoProduct.find).toHaveBeenCalledWith({
//                 $or: [
//                     { name: { $regex: '', $options: 'i' } },
//                     { description: { $regex: '', $options: 'i' } }
//                 ]
//             });
//             expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
//         });
//     });
// });
