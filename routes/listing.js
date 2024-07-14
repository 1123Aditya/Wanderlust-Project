const express= require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");//wrapAsync Error
const {isloggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//INDEX ROUTE
//CREATE ROUTE
router
  .route("/",)
  .get(wrapAsync(listingController.index))
  .post(
    isloggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

//NEW ROUTE
router
   .get("/new",
   isloggedIn, listingController.renderNewForm);

//SHOW ROUTE
//UPDATE ROUTE
//DELETE ROUTE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isloggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
    .delete(
        isloggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
);

//EDIT ROUTE
router.get("/:id/edit",
    isloggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));


module.exports = router;