use chrono::{Date, NaiveDate, TimeZone};
use rocket::form::{Errors, Form};
use rocket::form;
use rocket::form::{Error, FromForm};
use rocket::serde::{Deserialize, Serialize};

// use rocket::tokio::time::error::Error;

#[derive(FromForm, Deserialize, Serialize)]
pub struct IOQueryForm {
    #[field(validate = check_cell())]
    pub year: i32,
    pub library: String,
}

fn check_cell<'v>(year: &i32) -> form::Result<'v, ()> {
    if *year < 2017 || *year > 2022 {
        return Err(Error::validation("Invalid Time"))?;
    }
    Ok(())
}