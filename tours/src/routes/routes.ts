import express from "express";
const router= express.Router();
import * as tour from "../controller/tourController";
import {protect,allowedTo} from "@natour/common";


router.use(protect);
router.route('/')
    .get(allowedTo('admin',"user"),tour.getAllTours)
    .post(allowedTo('admin','user'),tour.createTour);



router.route('/:id')
    .delete(allowedTo('admin',"user") , tour.deleteTour)
    .get(allowedTo('admin',"user") , tour.getTour)
    .patch(allowedTo('admin',"user") , tour.updateTour);

router.route("/distance/:distance/center/:latlng/unit/:unit")
    .get(allowedTo('admin',"user"),tour.getTourWithin);


router.route("/year/:year")
    .get(allowedTo('admin',"user"),tour.getMonthlyPlans);

router.route("/stats/:stats")
    .get(allowedTo('admin',"user"),tour.getTourStats);

router.route("/center/:latlng/unit/:unit")
    .get(allowedTo('admin',"user"),tour.getToursDistance);
export {router};