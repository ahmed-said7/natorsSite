import mongoose, { Query } from 'mongoose';
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    duration: {
        type: Number,
        required: true
    },
    maxGroupSize: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'difficult']
    },
    ratingsAverage: {
        type: Number,
        min: 1,
        max: 5
    },
    ratingsQuantity: Number,
    price: Number,
    priceDiscount: Number,
    imageCover: String,
    secretTour: {
        type: Boolean,
        default: false
    }
},{
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.set('versionKey','version');

export const Tour =mongoose.model('Tour',tourSchema)
