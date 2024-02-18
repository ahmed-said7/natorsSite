import express from "express";
const router= express.Router();
import * as auth from "../controller/auth";
import * as user from "../controller/user";
import {protect,allowedTo} from "@natour/common";


router.route('/login').post(auth.login);
router.route('/signup').post(auth.signup);
router.route('/forget-pass').post(auth.forgetPassword);
router.route('/vertify-code').post(auth.vertifyResetToken);
router.route('/reset-pass').post(auth.resetPassword);



// router.use(protect);
router.route('/')
    .get(protect,allowedTo('admin',"user"),user.getAllUsers)
    .post(protect,allowedTo('admin'),user.createUser);






router.route('/update-logged-user').
    patch(protect,allowedTo('admin',"user"),user.updateLoggedUser);
router.route('/delete-logged-user').
    delete(protect,allowedTo('admin',"user"),user.deleteLoggedUser);
router.route('/get-logged-user').
    get(protect,allowedTo('admin',"user"),user.getLoggedUser);
router.route('/update-logged-user-pass')
    .patch(protect,allowedTo('admin',"user"),user.updateLoggedUserPassword);

router.route('/:id')
    // .delete(protect,allowedTo('admin') , user.deleteUser)
    .get(protect,allowedTo('admin') , user.getUser)
    .patch(protect,allowedTo('admin') , user.updateUser);



export {router};