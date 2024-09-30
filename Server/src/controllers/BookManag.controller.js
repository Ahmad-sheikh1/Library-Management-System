require("dotenv").config({path : '../../.env'});
require("colors");
const { connection } = require("../config/db")
const { v4: uuidv4 } = require('uuid');
const cloudinary = require("../config/cloudinary.config");

const AddBookController = async (req, res) => {
    try {
        const {
            title,
            author,
            publisher,
            genre,
            language,
            pages,
            quantity,
            description
        } = req.body;
        console.log(req.body);

        // Validate all fields
        if (!title || !author || !publisher || !genre || !language || !pages || !quantity || !description) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required." });
        }

        console.log(process.env.CLOUD_NAME, "llll");


        // Generate a unique ID for the book
        const bookId = uuidv4();

        // Upload image to Cloudinary
        const uploadImage = () => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(req.file.path, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        };

        const imageUploadResult = await uploadImage();

        console.log(imageUploadResult.secure_url , "url");
        

        // Insert the book into the database
        const [results] = await connection.promise().query(
            `INSERT INTO BooksM (id, title, author, publisher, genre, language, pages, quantity, description, imageurl) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [bookId, title, author, publisher, genre, language, pages, quantity, description, imageUploadResult.secure_url]
        );

        // Retrieve the newly inserted book details
        const [newBook] = await connection.promise().query(
            `SELECT * FROM BooksM WHERE id = ?`,
            [bookId]
        );

        // Respond with success message and the new book's ID
        res.status(201).json({
            status: "success",
            message: "Book added successfully",
            data: newBook[0]
        });

    } catch (error) {
        console.error("Error in AddBookController:", error);
        res.status(500).json({ error: "An error occurred while adding the book." });
    }
};


const UpdatebookController = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            author,
            publisher,
            genre,
            language,
            pages,
            quantity,
            description
        } = req.body;
        console.log(req.body);

        // Check if the book exists before updating
        const [existingBook] = await connection.promise().query(`SELECT * FROM BooksM WHERE id = ?`, [id]);

        if (existingBook.length === 0) {
            return res.status(404).json({ message: "Book not found." });
        }

        // Update the book fields in the database
        await connection.promise().query(
            `UPDATE BooksM 
             SET title = ?, author = ?, publisher = ?, genre = ?, language = ?, pages = ?, quantity = ?, description = ?
             WHERE id = ?`,
            [title, author, publisher, genre, language, pages, quantity, description, id]
        );

        // Retrieve the updated book details
        const [updatedBook] = await connection.promise().query(`SELECT * FROM BooksM WHERE id = ?`, [id]);

        // Send updated book details as a response
        res.status(200).json({
            status: "success",
            message: "Book updated successfully",
            data: updatedBook[0]
        });
    } catch (error) {
        console.error("Error in UpdateBookController:", error.message);
        res.status(500).json({ error: "An error occurred while Updating the book." });
    }
}

const GetAllBooksController = async (req, res) => {
    try {
        // Query the database to get all books
        const [books] = await connection.promise().query(`SELECT * FROM BooksM`);

        // Check if there are any books in the table
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found." });
        }

        // Send the retrieved books as the response
        res.status(200).json({
            status: "success",
            results: books.length,
            data: books
        });

    } catch (error) {
        console.error("Error in GetAllBooksController:", error.message);
        res.status(500).json({ error: "An error occurred while retrieving the books." });
    }
};

const DeleteBookController = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Received ID for deletion:", id); // Debug log

        // Check if the id is provided
        if (!id) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        // Check if the book exists before attempting to delete
        const [book] = await connection.promise().query(`SELECT * FROM BooksM WHERE id = ?`, [id]);
        console.log("Book found:", book); // Debug log

        if (book.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Delete the book
        await connection.promise().query(`DELETE FROM BooksM WHERE id = ?`, [id]);

        // Return success response
        res.status(200).json({
            status: "success",
            message: "Book deleted successfully",
            data: { id }
        });

    } catch (error) {
        console.error("Error in DeleteBookController:", error.message);
        res.status(500).json({ error: "An error occurred while deleting the book." });
    }
};


module.exports = {
    AddBookController,
    UpdatebookController,
    GetAllBooksController,
    DeleteBookController,
}