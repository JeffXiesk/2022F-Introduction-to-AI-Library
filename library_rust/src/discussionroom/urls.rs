use super::apis::{discussionroom_info, heatmap};

pub fn routes() -> Vec<rocket::Route> {
    routes![discussionroom_info, heatmap]
}