// @generated automatically by Diesel CLI.

diesel::table! {
    emails (id) {
        id -> Integer,
        #[max_length = 255]
        user -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        created -> Timestamp,
        updated -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        #[max_length = 255]
        id -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        first_name -> Nullable<Varchar>,
        #[max_length = 255]
        last_name -> Nullable<Varchar>,
        #[max_length = 255]
        password_hash -> Varchar,
        created -> Timestamp,
        updated -> Timestamp,
    }
}

diesel::joinable!(emails -> users (user));

diesel::allow_tables_to_appear_in_same_query!(
    emails,
    users,
);
