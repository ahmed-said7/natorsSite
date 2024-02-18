import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

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
    emailVertified:{
        type: Boolean,
        default: false
    },
    photo: String,
    role: {
        type: String,
        enum: [ 'user' , 'guide' , 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetTokenVertified: Boolean,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
},{timestamps:true});

userSchema.set('versionKey','version');
export interface UserDoc extends mongoose.Document{
    email: string;
    name: string;
    password: string;
    role:string;
    photo?: string;
    active:boolean;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpiresIn?: Date;
    passwordResetTokenVertified?: boolean;
    createResetToken():string;
    version:number;
}

interface UserModel extends mongoose.Model<UserDoc>{
    comparePassword(bodyPassword:string,userPassword:string):Promise<boolean>;
};
userSchema.set('versionKey','version');
userSchema.statics.comparePassword = async function( bodyPassword:string , userPassword:string) {
    return bcrypt.compare( bodyPassword, userPassword );
};



userSchema.methods.createResetToken=function(){
    const randomCode=crypto.randomBytes(3).toString('hex');
    this.passwordResetToken=
        crypto
        .createHash('sha256')
        .update(randomCode)
        .digest('hex');
    this.passwordResetExpiresIn=Date.now() + 10*60*1000;
    this.passwordResetTokenVertified=false;
    return randomCode;
};










userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


userSchema.pre(/^find/, function(next) {
    (this as mongoose.Query< UserDoc[] | UserDoc , UserDoc> ).find({ active: true });
    return next();
});



export const User=mongoose.model<UserDoc,UserModel>('User',userSchema);