const express = require("express");
const auth = require("../middleware/auth");
const {
  getBookList,
  rentBook,
  getMyRentList,
  returnBook,
} = require("../controller/book");

const router = express.Router();

router.route("/").get(getBookList);
router.route("/").post(auth, rentBook);
router.route("/getRent").get(auth, getMyRentList);
router.route("/").delete(auth, returnBook);

module.exports = router;
