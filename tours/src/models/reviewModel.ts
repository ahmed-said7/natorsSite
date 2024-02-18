import mongoose , {Model,Document} from "mongoose";
const reviewSchema = new mongoose.Schema({
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
reviewSchema.set('versionKey','version');
export interface ReviewDoc extends Document {
    review: string;
    rating: number;
    tour: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId
};

interface ReviewModel extends Model<ReviewDoc> {
    review: string;
    rating: number;
    tour: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId
};
export const Review = mongoose.model<ReviewDoc,ReviewModel>('Review', reviewSchema);
