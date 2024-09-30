require("colors");
const dotenv = require("dotenv").config({ path: '../../.env' });
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


const ConnectionMySql = connection.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log(`DB Connected Successfully`.green.bold);
    }
})

connection.query(`
    CREATE TABLE IF NOT EXISTS Users (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        fullname VARCHAR(25) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAccept TINYINT(1) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user' 
    )
`, (error, result) => {
    if (error) throw error;
    console.log("Users table created or already exists.");
});

connection.query(`
    create table if not exists BooksM (
    id varchar(50) not null primary key,
    title varchar(50) not null ,
    author varchar(50) not null ,
    publisher varchar(50) not null,
    genre varchar(50) not null,
    language varchar(50) not null,
    pages int not null,
    quantity int not null ,
    description varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp on update current_timestamp
    )
    `, (error, result) => {
    if (error) throw error;
    console.log("Book Managment table created or already exists.");
})

connection.query(`
  CREATE TABLE IF NOT EXISTS BorrowRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(50),
    user_id VARCHAR(50),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- This will capture the date of request
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Update this on row changes
    FOREIGN KEY (book_id) REFERENCES BooksM(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

`, (error, result) => {
    if (error) throw error;
    console.log("Borrow Request  table created or already exists.");
});

connection.query(`
    CREATE TABLE IF NOT EXISTS Borrows (
        id VARCHAR(50) NOT NULL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        book_id VARCHAR(50) NOT NULL,
        borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        return_date TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (book_id) REFERENCES BooksM(id)
    )
`, (error, result) => {
    if (error) throw error;
    console.log("Borrow Management table created or already exists.");
});


module.exports = {
    ConnectionMySql,
    connection
}