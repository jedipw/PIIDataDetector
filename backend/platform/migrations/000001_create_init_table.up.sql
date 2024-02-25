-- Create users table
CREATE TABLE users(
    user_id CHAR(28) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL
);

-- Create texts table
CREATE TABLE texts(
    text_id UUID DEFAULT gen_random_uuid (),
    user_id CHAR(28) REFERENCES users(user_id),
    text_title VARCHAR(255),
    text_content TEXT,
    last_edited_on timestamp default current_timestamp
);