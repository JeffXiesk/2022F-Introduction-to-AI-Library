use std::collections::HashMap;
use std::ops::Sub;
use std::string::String;
use std::sync::Arc;

use chrono::{DateTime, Duration, NaiveDate};
use rbatis::crud::CRUD;
use rbatis::{DateTimeNative, DateNative, DateUtc};
use rbatis::rbatis::Rbatis;
use rocket::{Request, State};
use rocket::form::Form;
use rocket::response::{content, status};
use serde::de::Unexpected::Option;

use crate::User;
use crate::utils::guards::IsLogin;
use crate::iorecord::forms::IOQueryForm;

use super::models::DiscussionRoom;

#[post("/discussionroom-heatmap", data = "<query>")]
pub async fn heatmap(rb: &State<Arc<Rbatis>>, query: Form<IOQueryForm>, userinfo: IsLogin)
                    -> status::Accepted<content::Json<String>> {
    let user = userinfo.0;
    let query = query.into_inner();
    let mut fmt = "%Y-%m-%d";
    let start = DateUtc::from_str(&format!("{}-01-01", query.year)).unwrap();
    let end = DateUtc::from_str(&format!("{}-12-31", query.year)).unwrap();

    let w = rb.new_wrapper()
        .ge("reserve_date", start)
        .le("reserve_date", end)
        .eq("which_library", &query.library)
        .eq("user_id", &user.user_id)
        ;
    let mut io_records: Vec<DiscussionRoom> = rb
        .fetch_list_by_wrapper(w)
        .await
        .unwrap();
    let mut ans: HashMap<_, _> = io_records
        .iter()
        .map(|x| { (x.reserve_date.format(&fmt).to_string(), 0) })
        .collect();
    for i in io_records {
        let mut x = ans.get_mut(&i.reserve_date.format(&fmt).to_string()[..]);
        if let Some(cnt) = x {
            *cnt += 1;
        }
    }
    status::Accepted(Some(content::Json(serde_json::to_string(&ans).unwrap())))
}

#[post("/discussionroom-info")]
pub async fn discussionroom_info(rb: &State<Arc<Rbatis>>, userinfo: IsLogin)
                    -> status::Accepted<content::Json<String>> {
    let user = userinfo.0;
    let mut fmt = "%Y年%m月%d日";
    let w = rb.new_wrapper()
        .eq("user_id", &user.user_id)
        .order_by(true, &["reserve_begin"])
        ;
    let mut records: Vec<DiscussionRoom> = rb
        .fetch_list_by_wrapper(w)
        .await
        .unwrap();
    let mut ans = HashMap::new();
    if records.len() == 0usize {
        return status::Accepted(Some(content::Json(serde_json::to_string(&ans).unwrap())));
    }
    ans.insert("first_name", records[0].dev_name.clone());
    ans.insert("first_time", records[0].reserve_begin.format(&fmt).to_string());
    let mut count: HashMap<_, _> = records
        .iter()
        .map(|x| {(x.dev_name.clone(), 0)})
        .collect();
    let mut max_cnt = 0;
    for i in records {
        let mut cnt = count.get_mut(&i.dev_name[..]).unwrap();
        *cnt += 1;
        if *cnt > max_cnt {
            max_cnt = *cnt;
            ans.insert("room", i.dev_name.clone());
            ans.insert("library", i.which_library.clone());
        }
    }
    status::Accepted(Some(content::Json(serde_json::to_string(&ans).unwrap())))
}