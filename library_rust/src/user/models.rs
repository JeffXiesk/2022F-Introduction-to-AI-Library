use rbatis::crud::CRUDTable;

#[crud_table(table_name: user_user)]
pub struct User {
    pub(crate) id: i32,
    pub user_id: String,
    pub user_name: String,
    pub reading: bool,
    pub student_type: String,
    pub department_id: String,
    pub department_name: String,
    pub special_id: String,
    pub special_name: String,
    pub sex: bool,
    pub college_id: Option<String>,
    pub college_name: Option<String>,
    pub grade_year: Option<i32>,
    pub email: String,
}

#[crud_table(table_name: "user_statistics_data_userstatisticsdata")]
pub struct StaticInfo {
    id: i32,
    pub user_id: String,
    pub discussroom_count: i32,
    pub discussroom_length: i32,
    pub discussroom_percentage: Option<f32>,
    pub loadbook_count: i32,
    pub loadbook_type: i32,
    pub loadbook_percentage: Option<f32>,
    pub librarytime_count: i32,
    pub librarytime_length: i32,
    pub librarytime_percentage: Option<f32>,
    pub user_tag: i32,
}