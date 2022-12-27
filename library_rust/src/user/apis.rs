use std::collections::HashMap;
use std::string::String;
use std::sync::Arc;

use rbatis::crud::CRUD;
use rbatis::rbatis::Rbatis;
// use redis::AsyncCommands;
use rocket::{Request, State};
use rocket::form::{Form, Strict};
use rocket::http::{Cookie, SameSite,CookieJar};
use rocket::response::{content, Redirect, status};
use rocket::response::content::Json;
use serde::de::value::StrDeserializer;

use crate::utils::guards::{IsLogin, RateLimitGuard};

use super::forms;
use super::models::{StaticInfo, User};
use super::responses::StaticResponse;

use deadpool_redis::Pool;
// use  redis::aio::Connection;
use redis::AsyncCommands;
use rocket_governor::RocketGovernor;
use crate::user::forms::{CASResponse, CASResponseForm};
use crate::utils::session::Session;

use postgres::{Client, NoTls};


#[get("/login?<ticket>")]
pub async fn login(ticket: String, _r: RocketGovernor<'_, RateLimitGuard>, rb: &State<Arc<Rbatis>>, cookies: &CookieJar<'_>)
                   -> Redirect {
    // let ticket = ticket.into_inner().ticket.clone();
    let client = reqwest::Client::new();
    let cas_form = [
        // ("service", "http%3A%2F%2F172.18.24.158%3A8002%2Fapi%2Flogin"),
        ("service", "http://172.18.24.158:8002/api/login"),
        ("format", "JSON"),
        ("ticket", &ticket)
    ];
    log::info!("{}",&ticket);
    let info = client.get("https://cas.sustech.edu.cn/cas/p3/serviceValidate")
        .query(&cas_form)
        // .form(&cas_form)
        // .json(&cas_map)
        .send()
        .await
        .unwrap()
        .text()
        .await
        .unwrap()
    ;
    log::info!("{}",&info);
    log::info!("--------------------------------------");    
    if let Ok(info) = serde_json::from_str::<CASResponseForm>(&info) {
        log::info!("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");    
    
        if let CASResponse::authenticationSuccess(info) = info.serviceResponse {
            let uid = info.attributes.sid[0].clone();
            let result: Option<User> = rb.fetch_by_column("user_id", &uid)
            .await.unwrap();
            log::info!("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
            if result.is_none() {
                return Redirect::to(uri!("http://10.24.206.44:3000/500"));
            }
            let res=result.unwrap();
            let x = serde_json::to_string(&res).unwrap();
            log::info!("token is {}",x);
            cookies.add(Cookie::new("token", x.clone()));
            for c in cookies.iter() {
                log::info!("Name: {:?}, Value: {:?}", c.name(), c.value());
            }
            let userinfo=cookies.get_pending("token");
            match userinfo {
                Some(x) => log::info!("add token !: {}",x.value()),
                None => log::info!("add fail !"),
            }

            log::info!("before insert !");
            let mut client = Client::connect("postgresql://cs309_proj:123456@10.24.206.44:5432/postgres", NoTls).unwrap();
            
            client.batch_execute("truncate table status").unwrap();
    

            let a1:i32=res.id;
            let a2=res.user_id;
            let a3=res.user_name;
            let a4=res.reading;
            let a5=res.student_type;
            let a6=res.department_id;
            let a7=res.department_name;
            let a8=res.special_id;
            let a9=res.special_name;
            let a10=res.sex;
            let a11=res.college_id;
            let a12=res.college_name;
            let a13=res.grade_year;
            let a14=res.email;
            
            client.execute("insert into status (id, user_id, user_name, reading, student_type, department_id, department_name, special_id, special_name, sex, college_id, college_name, grade_year, email) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)",
                            &[&a1,&a2,&a3,&a4,&a5,&a6,&a7,&a8,&a9,&a10,&a11,&a12,&a13,&a14],
            ).unwrap();
            // let valu
            // client.batch_execute("insert into status (id, user_id, user_name, reading, student_type, department_id, department_name, special_id, special_name, sex, college_id, college_name, grade_year, email) values ('0','12011206','谢绍康','true','0','0','0','0','0','true','0','0','0','0');");
            log::info!("after insert !");

            // let userinfo_=userinfo.value();
        return Redirect::to(uri!("http://10.24.206.44:3000"));
        }
        if let CASResponse::authenticationFailure(info) = info.serviceResponse {
            let code = info.code.clone();
            let description = info.description.clone();
            log::info!("{}",code);
            log::info!("{}",description);
            
        }
    }

    return Redirect::to(uri!("http://10.24.206.44:3000/500"));
}


#[post("/userinfo")]
pub async fn userinfo(userinfo: IsLogin) -> status::Accepted<content::Json<String>> {
    let user = userinfo.0;
    let info = serde_json::to_string(&user).unwrap();
    status::Accepted(Some(content::Json(info)))
}

#[post("/static-info/<type>")]
pub async fn static_info(rb: &State<Arc<Rbatis>>, r#type: String, userinfo: IsLogin) -> status::Accepted<content::Json<String>> {
    let user = userinfo.0;
    let info: Option<StaticInfo> = rb.fetch_by_column("user_id", user.user_id).await.unwrap();
    let mut ans = StaticResponse { count: 0, length: 0, r#type: 0, percentage: 0.0 };
    if info.is_none() {
        return status::Accepted(Some(Json(serde_json::to_string(&ans).unwrap())));
    }
    let info = info.unwrap();
    match &r#type[..] {
        "book" => {
            ans.count = info.loadbook_count;
            ans.r#type = info.loadbook_type;
            if let Some(p) = info.loadbook_percentage {
                ans.percentage = p;
            }
        }
        "library" => {
            ans.count = info.librarytime_count;
            ans.length = info.librarytime_length;
            if let Some(p) = info.librarytime_percentage {
                ans.percentage = p;
            }
        }
        "discussion-room" => {
            ans.count = info.discussroom_count;
            ans.length = info.discussroom_length;
            if let Some(p) = info.discussroom_percentage {
                ans.percentage = p;
            }
        }
        _ => {}
    };
    return status::Accepted(Some(Json(serde_json::to_string(&ans).unwrap())));
}

#[post("/user-tag")]
pub async fn user_tag(rb: &State<Arc<Rbatis>>, userinfo: IsLogin)
                      -> status::Accepted<content::Json<String>> {
    let user = userinfo.0;
    let info: Option<StaticInfo> = rb.fetch_by_column("user_id", user.user_id).await.unwrap();
    log::info!("info fetched !!");
    let mut ans = HashMap::new();
    if info.is_none() {
        ans.insert("tag", "无闻者".to_string());
        ans.insert("title", "花开别处，亦是芬芳".to_string());
        ans.insert("comment", "图书馆等着你的到来！".to_string());
        return status::Accepted(Some(content::Json(serde_json::to_string(&ans).unwrap())));
    }
    let info = info.unwrap();
    // log::info!("info is not none !!");
    // if info.librarytime_length == 0 {
    if info.user_tag == 1 {
        ans.insert("tag", "爱思考的自习者".to_string());
        ans.insert("comment", " 轻轻的你走了，正如你轻轻的来，不带走一本书".to_string());
        ans.insert("title", "长路漫漫，上下求索 ".to_string());
    } else if info.user_tag == 2 {
        ans.insert("tag", "爱思考的图书馆常住人口".to_string());
        ans.insert("comment", format!("你一共在图书馆学习了{}小时，超越了{}%的南科人！",info.librarytime_length / 60, info.librarytime_percentage.unwrap()));
        ans.insert("title", "业精于勤，行成于思".to_string());
    } else if info.user_tag == 3 {
        ans.insert("tag", "爱思考的无名者".to_string());
        ans.insert("comment", "图书馆等着你的到来！".to_string());
        ans.insert("title", "花开别处，亦是芬芳".to_string());
    } else if info.user_tag == 4 {
        ans.insert("tag", "爱阅读的自习者".to_string());
        ans.insert("comment", format!("你在图书馆借阅了{}本书籍，超越了{}%的南科人！", info.loadbook_count, info.loadbook_percentage.unwrap()));
        ans.insert("title", "上知天文，下知地理".to_string());
    } else if info.user_tag == 5 {
        ans.insert("tag", "爱阅读的图书馆常住人口".to_string());
        ans.insert("comment", format!("你在图书馆借阅了{}本书籍，超越了{}%的南科人！", info.loadbook_count, info.loadbook_percentage.unwrap()));
        ans.insert("comment", format!("你一共在图书馆学习了{}小时，超越了{}%的南科人！",info.librarytime_length / 60, info.librarytime_percentage.unwrap()));
        ans.insert("title", "书山有路勤为径".to_string());
    } else {
        ans.insert("tag", "爱阅读的无名者".to_string());
        ans.insert("comment", format!("你在图书馆借阅了{}本书籍，超越了{}%的南科人！", info.loadbook_count, info.loadbook_percentage.unwrap()));
        ans.insert("comment", "博闻强识，学富五车".to_string());    
    }

    status::Accepted(Some(content::Json(serde_json::to_string(&ans).unwrap())))
}

#[post("/test")]
pub async fn test(_r: RocketGovernor<'_, RateLimitGuard>) -> String {
    "hello".to_string()
}
