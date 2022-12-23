#[macro_use]
extern crate rbatis;
#[macro_use]
extern crate rocket;
extern crate dlopen;
#[macro_use]
extern crate dlopen_derive;


mod user;
mod utils;
mod iorecord;
mod discussionroom;
mod bookload_record;
mod book;
mod plugin;

use std::sync::Arc;

use rbatis::rbatis::Rbatis;
use rocket::fairing::AdHoc;

use crate::iorecord::urls as iorecord_urls;
use crate::user::models::User;
use crate::user::urls as user_urls;
use crate::discussionroom::urls as dis_urls;
use crate::bookload_record::urls as book_urls;

use deadpool_redis::{redis::{cmd, FromRedisValue}, Config, Runtime, Pool};
use rocket_cors::{AllowedHeaders, AllowedOrigins};
use rocket::http::Method;
use std::error::Error;

use postgres::{Client, NoTls};

async fn check_redis(pool: &Pool) {
    if pool.get().await.is_err() {
        panic!("Redis Server Error!");
    }
}

#[rocket::main]
async fn main() -> Result<(), Box<dyn Error>> {
    fast_log::init(fast_log::config::Config::new().console());
    log::info!("linking database...");
    
    // let mut client = Client::connect("postgresql://cs309_proj:123456@10.24.206.44:5432/postgres", NoTls)?;
    
    // client.batch_execute("
    //     DROP TABLE IF EXISTS status;
    //     create table status (
    //         id int8 primary key ,
    //         user_id varchar,
    //         user_name varchar,
    //         reading bool,
    //         student_type varchar,
    //         department_id varchar,
    //         department_name varchar,
    //         special_id varchar,
    //         special_name varchar,
    //         sex bool,
    //         college_id varchar,
    //         college_name varchar,
    //         grade_year int,
    //         email varchar
    //     );
    // ")?;

    let rb = Rbatis::new();

    rb.link("postgresql://cs309_proj:123456@10.24.206.44:5432/postgres").await.unwrap();
    // rb.link("sqlite:///home/satan/Desktop/library/db.sqlite3").await.unwrap();
    let rb = Arc::new(rb);
    let mut cfg = Config::from_url("redis://127.0.0.1/");
    let pool = cfg.create_pool(Some(Runtime::Tokio1)).unwrap();
    check_redis(&pool).await;
    let allowed_origins = AllowedOrigins::some_exact(&["http://10.24.206.44:3000"]);

    // You can also deserialize this
    let cors = rocket_cors::CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::some(&["Authorization", "Accept"]),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()?;

    rocket::build()
        .mount("/api", user_urls::routes())
        .mount("/api", iorecord_urls::routes())
        .mount("/api", dis_urls::routes())
        .mount("/api", book_urls::routes())
        .attach(AdHoc::on_ignite("Rbatis Database", |rocket| async move {
            rocket.manage(rb)
        }))
 //       .attach(cors)
        .manage(pool)
        .launch()
        .await;

    Ok(())
}
