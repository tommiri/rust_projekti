// @generated automatically by Diesel CLI.

diesel::table! {
    emails (id) {
        id -> Integer,
        #[max_length = 16]
        user -> Binary,
        #[max_length = 255]
        email -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        #[max_length = 16]
        id -> Binary,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 100]
        first_name -> Varchar,
        #[max_length = 100]
        last_name -> Varchar,
        #[max_length = 255]
        password_hash -> Varchar,
        email_verified -> Bool,
        #[max_length = 255]
        verification_token -> Nullable<Varchar>,
        verification_expires -> Nullable<Timestamp>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(emails -> users (user));

diesel::allow_tables_to_appear_in_same_query!(
    emails,
    users,
);
