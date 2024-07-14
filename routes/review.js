const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");//wrapAsync Error
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isloggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/reviews.js");


// REVIEW POST ROUTE
router.post("/",
    isloggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

   //DELETE REVIEW ROUTE
   router.delete(
       "/:reviewID",
       isloggedIn,
       isReviewAuthor,
       wrapAsync(reviewController.destroyReview));
   
  module.exports = router;