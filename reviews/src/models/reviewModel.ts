import mongoose from 'mongoose';
import {Tour} from './tourModel';

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
        },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });


reviewSchema.statics.calcAverageRatings = async function(tourId:mongoose.Types.ObjectId) {
    const stats = await this.aggregate([{$match: { tour: tourId } },
    { $group: { _id: '$tour', nums: { $sum: 1 } ,average: { $avg: '$rating' } } } ]);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nums,
            ratingsAverage: stats[0].average
        });
    } 
};


reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.tour);
});
export interface ReviewDoc extends mongoose.Document  {
    review?:string;
    rating?:number;
    user: mongoose.Types.ObjectIdstring;
    tour: mongoose.Types.ObjectIdstring;
};

reviewSchema.post('deleteOne',{document:true,query:false}, async function() {
    this.constructor.calcAverageRatings(this.tour);
});

export const Review = mongoose.model('Review', reviewSchema);

