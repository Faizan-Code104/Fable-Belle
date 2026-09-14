import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Shoulder Bags",
        "Handbags",
        "Tote Bags",
        "Crossbody Bags",
        "Hobo Bags",
      ],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    material: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    weight: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return (
            Array.isArray(value) &&
            value.length >= 1 &&
            value.length <= 4
          );
        },
        message: "A product must have between 1 and 4 images.",
      },
    },

    // Featured product
    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Low Stock",
        "Out of Stock",
      ],
      default: "Active",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/*
  Automatically calculate product status
  before saving the product.
*/
productSchema.pre("save", function () {
  if (this.stock === 0) {
    this.status = "Out of Stock";
  } else if (this.stock <= 5) {
    this.status = "Low Stock";
  } else {
    this.status = "Active";
  }
});

/*
  Automatically calculate status
  when product is updated.
*/
productSchema.pre(
  "findOneAndUpdate",
  function () {
    const update = this.getUpdate();

    if (
      update &&
      update.stock !== undefined
    ) {
      const stock = Number(update.stock);

      if (stock === 0) {
        update.status = "Out of Stock";
      } else if (stock <= 5) {
        update.status = "Low Stock";
      } else {
        update.status = "Active";
      }

      this.setUpdate(update);
    }
  }
);

const Product =
  mongoose.model(
    "Product",
    productSchema
  );

export default Product;