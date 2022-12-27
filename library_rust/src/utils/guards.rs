use rocket::http::CookieJar;
use rocket::http::Status;
use rocket::outcome::IntoOutcome;
use rocket::Request;
use rocket::request::{FromRequest, Outcome};
use rocket::State;
use rocket_governor::{Method, Quota, RocketGovernable, RocketGovernor};
use postgres::{Client, NoTls};

use crate::user::models::User;


#[derive(Debug)]
pub enum AuthError {
    Missing,
    Invalid,
}

pub struct IsLogin(
    pub(crate) User
);

#[rocket::async_trait]
impl<'r> FromRequest<'r> for IsLogin {
    type Error = AuthError;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        log::info!("In FromRequest !");
        let mut client = Client::connect("postgresql://cs309_proj:123456@10.24.206.44:5432/postgres", NoTls).unwrap();
        let t = 0;
        let row = client.query_one("""select id, user_id, user_name, reading, 
                                    student_type, department_id, department_name, 
                                    special_id, special_name, sex, college_id, 
                                    college_name, grade_year, email from status""",&[]);
        match row {
            Ok(r) => {
                // let user_id:String = r.get(1);
                // log::info!("user_id is :{}",user_id);
                // let user_name:String = r.get(2);
                // log::info!("user_name is :{}",user_name);
                let test_user = User {
                    id: r.get(0),
                    user_id: r.get(1),
                    user_name: r.get(2),
                    reading: r.get(3),
                    student_type: r.get(4),
                    department_id: r.get(5),
                    department_name: r.get(6),
                    special_id: r.get(7),
                    special_name: r.get(8),
                    sex: r.get(9),
                    college_id: r.get(10),
                    college_name: r.get(11),
                    grade_year: r.get(12),
                    email: r.get(13),
                };
                return Outcome::Success(IsLogin(test_user));
            }
            Err(e) => {
                log::info!("Query Not Found !");
                Outcome::Failure((Status::Unauthorized, AuthError::Missing))
            }
        }
        
        

        // match request.cookies().get("token") {
        // // match test {
        //     Some(userinfo) => {
        //         log::info!("{}",userinfo);
        //         let userinfo = userinfo.value();
        //         log::info!("{}",userinfo);
        //         if let Ok(userinfo) = serde_json::from_str::<User>(userinfo) {
        //             return Outcome::Success(IsLogin(userinfo));
        //         }
        //         Outcome::Failure((Status::Unauthorized, AuthError::Invalid))
        //     }
        //     None => {
        //         // Outcome::Failure((Status::Unauthorized, AuthError::Missing))
        //     }
        // }
    }
}

pub struct RateLimitGuard;

impl<'r> RocketGovernable<'r> for RateLimitGuard {
    fn quota(_method: Method, _route_name: &str) -> Quota {
        Quota::per_minute(Self::nonzero(20u32))
    }
}
