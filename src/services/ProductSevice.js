const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, countInStock, price, rating, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                })
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                countInStock: Number(countInStock),
                price,
                rating,
                description,
                discount: Number(discount),
            })
            if (newProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}


// const getAllProduct = (limit = 10, page = 0, sort = [], filter = []) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const totalProduct = await Product.count();
            
//             // Initialize query object
//             let query = {};
//             let sortOptions = { createdAt: -1, updatedAt: -1 };
            
//             // Apply filtering if provided
//             if (filter.length) {
//                 const [label, value] = filter;
//                 query[label] = { '$regex': value, '$options': 'i' }; // Added '$options': 'i' for case-insensitive search
//             }
            
//             // Apply sorting if provided
//             if (sort.length) {
//                 const [order, field] = sort;
//                 sortOptions = { [field]: order, ...sortOptions }; // Merge with default sorting
//             }
            
//             // Fetch products with filtering and sorting
//             const allProduct = await Product.find(query)
//                 .limit(limit)
//                 .skip(page * limit)
//                 .sort(sortOptions);
            
//             resolve({
//                 status: 'OK',
//                 message: 'Success',
//                 data: allProduct,
//                 total: totalProduct,
//                 pageCurrent: Number(page + 1),
//                 totalPage: Math.ceil(totalProduct / limit)
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };


const getAllProduct = async (limit = 10, page = 0, sort = [], filter = []) => {
    try {
        const query = {};
        const sortOptions = { createdAt: -1, updatedAt: -1 };

        // Apply product filter (e.g., type, name, etc.)
        if (Array.isArray(filter) && filter.length === 2) {
            const [label, value] = filter;
            if (label && value) {
                query[label] = { '$regex': value, '$options': 'i' };
            }
        }

        // Apply sort options
        if (Array.isArray(sort) && sort.length === 2) {
            const [direction, field] = sort;
            if (['asc', 'desc'].includes(direction) && field) {
                sortOptions[field] = direction === 'asc' ? 1 : -1;
            }
        }
        // Calculate the total number of products after filtering
        const totalProduct = await Product.countDocuments(query);
        // Retrieve the filtered products with pagination and sorting
        const allProduct = await Product.find(query)
            .limit(limit)
            .skip(page * limit)
            .sort(sortOptions);

        return {
            status: 'OK',
            message: 'Success',
            data: allProduct,
            total: totalProduct,
            pageCurrent: Number(page)+1,
            totalPage: Math.ceil(totalProduct / (limit || 1)),
        };
    } catch (e) {
        console.error('Error fetching products:', e.message);
        throw new Error(e.message); // Rethrow the error for proper error handling upstream
    }
};


const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}