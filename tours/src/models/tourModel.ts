import mongoose, { Query } from 'mongoose';
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 40,
        minlength: 10
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
        default: 4.5,
        min: 1,
        max: 5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: String,
    images: [String],
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },

    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations:[{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    }],
    guides: [{ type: mongoose.Types.ObjectId , ref: 'User' } ]
},{
    timestamps:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});



tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.set('versionKey','version');

export interface TourDoc extends mongoose.Document {
    name: string;
    duration: number;
    maxGroupSize: number,
    difficulty: string,
    ratingsAverage: number,
    ratingsQuantity: number,
    price: number,
    priceDiscount?: number,
    summary?: string,
    description?: string,
    imageCover?: string,
    images?: string[],
    startDates: Date[],
    secretTour: boolean
    version:number;
    startLocation?: {
        type: "Point",
        coordinates: [number, number],
        address: string,
        description: string
    },
    locations?: [{
        type: "Point",
        coordinates: [number, number],
        address: string,
        description: string
    }],
    guides?: mongoose.Types.ObjectId []
};

tourSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:"tour"
});

interface TourModel extends mongoose.Model<TourDoc>{};
tourSchema.index({ startLocation : '2dsphere' });

tourSchema.pre(/^find/, function(next) {
    ( this as mongoose.Query< TourDoc[] | TourDoc , TourDoc > ).find({ secretTour: false });
    next();
});

tourSchema.pre(/^find/, function(next) {
    (this as Query< TourDoc[] | TourDoc ,TourDoc> ).populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });
});



export const Tour =mongoose.model<TourDoc,TourModel>('Tour',tourSchema)
