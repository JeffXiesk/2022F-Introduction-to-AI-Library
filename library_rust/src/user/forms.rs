use rocket::form::Form;
use rocket::form::FromForm;
use serde;
use serde::Deserialize;
use serde::Serialize;
use serde_json;

#[derive(FromForm, Deserialize, Serialize)]
pub struct UserLoginForm {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize, Serialize)]
pub struct  CASResponseForm {
    pub serviceResponse: CASResponse
}

#[derive(Deserialize, Serialize)]
pub enum CASResponse {
    authenticationSuccess(CASSuccess),
    authenticationFailure(CASFailure)
}

#[derive(Deserialize, Serialize)]
pub struct CASSuccess {
    user: String,
    pub attributes: CASAttributes
}

#[derive(Deserialize, Serialize)]
pub struct CASAttributes {
    id: Vec<String>,
    name: Vec<String>,
    pub sid: Vec<String>
}

#[derive(Deserialize, Serialize)]
pub struct CASFailure {
    pub code: String,
    pub description: String
}

