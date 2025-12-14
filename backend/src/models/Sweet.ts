import mongoose, { Document, Schema } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISweetInput {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface ISweetUpdate {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export interface ISearchParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}

export interface ISweetMethods {
  updateAvailability(): Promise<ISweet>;
}

type SweetModel = mongoose.Model<ISweet, {}, ISweetMethods>;

const sweetSchema = new Schema<ISweet, SweetModel, ISweetMethods>(
  {
    name: {
      type: String,
      required: [true, 'Sweet name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Sweet name must be at least 2 characters'],
      maxlength: [100, 'Sweet name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Chocolate', 'Candy', 'Biscuit', 'Cake', 'Pastry', 'Ice Cream', 'Traditional', 'Other'],
        message: '{VALUE} is not a valid category'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [10000, 'Price is too high'],
      set: (val: number) => parseFloat(val.toFixed(2))
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer'
      }
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret: any) {
        if (ret.__v !== undefined) {
          delete ret.__v;
        }
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function(doc, ret: any) {
        if (ret.__v !== undefined) {
          delete ret.__v;
        }
        return ret;
      }
    }
  }
);

// Virtual field to check if sweet is in stock
sweetSchema.virtual('inStock').get(function() {
  return this.quantity > 0;
});

// Method to update availability
sweetSchema.methods.updateAvailability = async function(): Promise<ISweet> {
  this.isAvailable = this.quantity > 0;
  return this.save();
};

// Pre-save middleware to update isAvailable
sweetSchema.pre('save', function(next) {
  this.isAvailable = this.quantity > 0;
  next();
});

// Create compound indexes for better search performance
sweetSchema.index({ category: 1, price: 1 });
sweetSchema.index({ price: 1 });
sweetSchema.index({ quantity: 1 });
sweetSchema.index({ isAvailable: 1 });
sweetSchema.index({ name: 'text', description: 'text' });
sweetSchema.index({ createdAt: -1 });

export const Sweet = mongoose.model<ISweet, SweetModel>('Sweet', sweetSchema);