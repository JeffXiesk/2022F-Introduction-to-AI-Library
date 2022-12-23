use std::collections::HashSet;
use rbatis::crud::CRUDTable;
use rbatis::{DateTimeNative, DateNative};
use rbatis::py_sql;
use rbatis::rbatis::Rbatis;
use crate::book::models::Book;
use rocket::serde::{Deserialize, Serialize};

#[crud_table(table_name: bookloadrecord_bookloadrecord)]
pub struct Bookloadrecord {
    id: i32,
    user_id: String,
    pub book_id: i32,
    pub(crate) which_library: String,
    pub loan_date: DateNative,
    return_date: Option<DateNative>,
    patron_group: String,
    barcode: String,
    loans: i32
}

#[py_sql("select * from book_book join
(select book_id from bookloadrecord_bookloadrecord where user_id =#{id} group by book_id order by count(book_id)) as record
 on book_book.id = record.book_id;")]
pub async fn get_types(rbatis:&Rbatis, id: &String, limit: &usize) -> Vec<Book> {}

#[py_sql("select * from book_book join
(select book_id from bookloadrecord_bookloadrecord where user_id = #{id} group by book_id order by count(book_id)) as record on book_book.id = record.book_id limit #{limit};")]
pub async fn get_words(rbatis:&Rbatis, id: &String, limit: &usize) -> Vec<Book> {}