import { Types } from 'mongoose';
import Product, { ProductDocument } from '../models/product.model';
import { IProduct, ProductStatus } from '../types/models/product.interface';
import { ApiError } from '../utils/errors/api.error';
import { FileService } from './file.service';

interface ProductQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  artisanId?: string;
  search?: string;
  status?: ProductStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ProductService {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  public async createProduct(productData: Partial<IProduct>, artisanId: string): Promise<ProductDocument> {
    const product = new Product({
      ...productData,
      artisanId,
      status: ProductStatus.ACTIVE,
      averageRating: 0
    });
    
    return await product.save();
  }

  public async getProducts(options: ProductQueryOptions = {}) {
    const {
      page = 1,
      limit = 20,
      category,
      subcategory,
      minPrice,
      maxPrice,
      artisanId,
      search,
      status = ProductStatus.ACTIVE,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    // Build query
    const query: any = { status };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (artisanId) query.artisanId = new Types.ObjectId(artisanId);
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Count total matching documents
    const total = await Product.countDocuments(query);
    
    // Execute query with pagination
    const products = await Product.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('artisanId', 'firstName lastName businessName');
    
    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  public async getProductById(id: string): Promise<ProductDocument> {
    const product = await Product.findById(id)
      .populate('artisanId', 'firstName lastName businessName profileImage');
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    return product;
  }

  public async updateProduct(id: string, artisanId: string, updateData: Partial<IProduct>): Promise<ProductDocument> {
    const product = await Product.findOne({ _id: id, artisanId });
    
    if (!product) {
      throw new ApiError(404, 'Product not found or you do not have permission to update it');
    }
    
    // Update product fields
    Object.keys(updateData).forEach((key) => {
      if (key !== '_id' && key !== 'artisanId') {
        (product as any)[key] = (updateData as any)[key];
      }
    });
    
    return await product.save();
  }

  public async deleteProduct(id: string, artisanId: string): Promise<void> {
    const product = await Product.findOne({ _id: id, artisanId });
    
    if (!product) {
      throw new ApiError(404, 'Product not found or you do not have permission to delete it');
    }
    
    // Soft delete - change status instead of actually deleting
    product.status = ProductStatus.DELETED;
    await product.save();
  }

  public async uploadProductImage(productId: string, artisanId: string, file: Express.Multer.File): Promise<string> {
    const product = await Product.findOne({ _id: productId, artisanId });
    
    if (!product) {
      throw new ApiError(404, 'Product not found or you do not have permission to update it');
    }
    
    // Upload file to storage
    const imageUrl = await this.fileService.uploadFile(file, `products/${productId}`);
    
    // Add image to product
    product.images.push(imageUrl);
    await product.save();
    
    return imageUrl;
  }

  public async removeProductImage(productId: string, artisanId: string, imageUrl: string): Promise<void> {
    const product = await Product.findOne({ _id: productId, artisanId });
    
    if (!product) {
      throw new ApiError(404, 'Product not found or you do not have permission to update it');
    }
    
    // Remove image from product
    product.images = product.images.filter(img => img !== imageUrl);
    await product.save();
    
    // Delete file from storage
    await this.fileService.deleteFile(imageUrl);
  }

  public async updateProductInventory(productId: string, adjustment: number): Promise<number> {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    // Update inventory
    product.inventory += adjustment;
    
    // Ensure inventory doesn't go negative
    if (product.inventory < 0) {
      throw new ApiError(400, 'Insufficient inventory');
    }
    
    await product.save();
    return product.inventory;
  }
}