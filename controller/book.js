const connection = require("../db/mysql_connection");
const moment = require("moment");

// @desc    모든 책 목록 불러오기
// @route   GET     /api/v1/book
// @parameters  limit, offset
exports.getBookList = async (req, res, next) => {
  let offset = req.query.offset;
  let limit = req.query.limit;

  if (!offset || !limit) {
    res.status(400).json({ message: "파라미터 에러" });
    return;
  }

  let query = `select * from book limit ${offset}, ${limit};`;

  try {
    [rows] = await connection.query(query);
    let cnt = rows.length;
    res.status(200).json({ success: true, items: rows, cnt: cnt });
    return;
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
};

// @desc    책 한권 을 선택하여 대여
// @route   GET     /api/v1/book
// @parameters  limit, offset
exports.rentBook = async (req, res, next) => {
  let book_id = req.body.book_id;
  let user_id = req.user.id;

  var today = new Date();
  let limit_date = new Date(Date.parse(today) + 1000 * 86400 * 7);
  limit_date = moment(limit_date).utc().format("YYYY-MM-DD HH:mm:ss");

  let query = `insert book_rental ( book_id, limit_date, user_id) 
  values (${book_id}, "${limit_date}", ${user_id});`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
};
// @desc    내가 대여한 책 목록 보기
// @route   GET     /api/v1/book
// @parameters  limit, offset
exports.getMyRentList = async (req, res, next) => {
  let user_id = req.user.id;
  let offset = req.query.offset;
  let limit = req.query.limit;

  let query = `select b.id, b.title, r.rent_date, r.limit_date 
  from book_rental as r 
  join book as b 
  on r.book_id = b.id 
  where user_id = ${user_id} 
  limit ${offset}, ${limit}`;

  try {
    [rows] = await connection.query(query);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
};

// @desc    내가 대여한 책 반납
// @route   delete  /api/v1/book
// @parameters
exports.returnBook = async (req, res, next) => {
  let book_id = req.body.book_id;

  let query = `delete from book_rental where book_id = ?`;
  let data = [book_id];

  try {
    [rows] = await connection.query(query, data);
    res.status(200).json({ success: true, items: rows, cnt: rows.length });
    return;
  } catch (e) {
    res.status(500).json({ error: e });
    return;
  }
};
