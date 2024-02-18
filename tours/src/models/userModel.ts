import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    photo: String,
    role: {
        type: String,
        enum: [ 'user' , 'guide' , 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt:Date
},{timestamps:true});


userSchema.set('versionKey','version');
export interface UserDoc extends mongoose.Document{
    email: string;
    name: string;
    role:string;
    photo?: string;
    active:boolean;
    version:number;
    passwordChangedAt?:Date
}

interface UserModel extends mongoose.Model<UserDoc>{};

export const User=mongoose.model<UserDoc,UserModel>('User',userSchema);