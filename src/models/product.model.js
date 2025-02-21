import mongoose from "mongoose";
import { ProductStatus } from "../types/models/product.interface";

const productSchema = new mongoose.Schema({
  artisanId: {
    type: mongoose.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  category: {
    type: [String],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  materials: {
    type: [String],
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  isCustomizable: {
    type: Boolean,
    required: true
  },
  customizationOptions: {
    type: [Object],
    required: true
  },
  shippingTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0
  },
  dimensions: {
    length: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  weight: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);