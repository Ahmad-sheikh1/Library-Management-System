const { connection } = require("../config/db");
const { v4: uuidv4 } = require("uuid");



const ReturnBookController = async (req, res) => {
    try {
        const { user_id, book_id } = req.body;

        if (!user_id || !book_id) {
            return res.status(400).json({ message: "user_id and book_id are required" });
        }

        // Check if the book has been borrowed by the user
        const [borrow] = await connection.promise().query(`SELECT * FROM Borrows WHERE user_id = ? AND book_id = ?`, [user_id, book_id]);

        if (borrow.length === 0) {
            return res.status(404).json({ message: "Borrow record not found" });
        }

        // Increase the book's quantity by 1
        await connection.promise().query(`UPDATE BooksM SET quantity = quantity + 1 WHERE id = ?`, [book_id]);

        await connection.promise().query(`
            DELETE FROM Borrows 
            WHERE user_id = ? AND book_id = ?`,
            [user_id, book_id]
        );

        return res.status(200).json({ message: "Book returned successfully" });

    } catch (error) {
        console.error("Error in ReturnBookController:", error.message);
        return res.status(500).json({ message: "An error occurred while returning the book" });
    }
};

const GetAllBorrowsController = async (req, res) => {
    try {
        // Query to get all rows from the Borrows table along with associated user and book details
        const [rows] = await connection.promise().query(`
            SELECT 
                Borrows.id AS borrow_id,
                Users.fullname AS user_name,
                BooksM.title AS book_title,
                BooksM.id AS book_id,
                Borrows.borrow_date,
                Borrows.return_date,
                Users.id AS user_id
            FROM 
                Borrows
            JOIN 
                Users ON Borrows.user_id = Users.id
            JOIN 
                BooksM ON Borrows.book_id = BooksM.id
        `);

        // Check if rows exist
        if (rows.length === 0) {
            return res.status(404).json({ message: "No borrow records found." });
        }

        // Send the result as JSON
        res.status(200).json({
            status: "success",
            data: rows
        });

    } catch (error) {
        console.error("Error in GetAllBorrowsController:", error.message);
        return res.status(500).json({ message: "An error occurred while fetching borrow records." });
    }
};

const BorrowRequestsController = async (req, res) => {
    try {
        const { user_id, book_id } = req.body;

        if (!user_id || !book_id) {
            return res.status(400).json({ message: "user_id and book_id are required" });
        }

        // Check if the book exists and its quantity is greater than 0
        const [book] = await connection.promise().query(`SELECT * FROM BooksM WHERE id = ?`, [book_id]);

        if (book.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book[0].quantity <= 0) {
            return res.status(400).json({ message: "Book is out of stock" });
        }

        // Check if this user has already requested this book
        const [existingRequest] = await connection.promise().query(`
            SELECT * FROM BorrowRequests WHERE user_id = ? AND book_id = ? `
            , [user_id, book_id]);

        if (existingRequest.length > 0) {
            return res.status(400).json({ message: "You have already requested to borrow this book" });
        }

        // Generate a unique ID for the borrow request (if needed)
        const borrow_request_id = uuidv4();

        // Insert a record in the BorrowRequests table
        await connection.promise().query(`
            INSERT INTO BorrowRequests (book_id, user_id, request_date, updated_at) 
            VALUES (?, ?, NOW(), NOW())
        `, [book_id, user_id]);

        return res.status(200).json({ message: "Borrow request sent successfully", borrow_request_id });

    } catch (error) {
        console.error("Error in BorrowRequestsController:", error.message);
        return res.status(500).json({ message: "An error occurred while sending the borrow request" });
    }
}


const getAllBorrowRequests = async (req, res) => {
    try {
        const [rows] = await connection.promise().query(`
        SELECT br.id, br.book_id, br.user_id, br.status, br.request_date, br.updated_at,
               b.title AS book_title, u.fullname AS user_name
        FROM BorrowRequests br
        JOIN BooksM b ON br.book_id = b.id
        JOIN Users u ON br.user_id = u.id
        ORDER BY br.request_date DESC
      `);

        res.status(200).json({
            success: true,
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching borrow requests:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch borrow requests',
            error: error.message,
        });
    }
};

const AdminApproveBorrowRequestesController = async (req, res) => {
    const { id } = req.params; // Get the borrow request ID from the params
    const { status } = req.body; // Get the status from the request body

    try {
        // Check if the borrow request exists
        const [request] = await connection.promise().query(
            'SELECT * FROM BorrowRequests WHERE id = ?',
            [id]
        );

        // If request not found, return a 404 error
        if (request.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Borrow request not found',
            });
        }

        // If status is approved, proceed with deleting the request and adding the book
        if (status === 'approved') {
            const borrowRequest = request[0];

            // First, add the book to the BorrowedBooks table
            // Generate a unique ID for the borrow record
            const borrow_id = uuidv4();

            // Insert a record in the Borrows table
            await connection.promise().query(`
            INSERT INTO Borrows (id, user_id, book_id, borrow_date) 
            VALUES (?, ?, ?, NOW())
        `, [borrow_id, borrowRequest.user_id, borrowRequest.book_id]);

            // Then, delete the request from BorrowRequests
            await connection.promise().query(
                'DELETE FROM BorrowRequests WHERE id = ?',
                [id]
            );

            return res.status(200).json({
                success: true,
                message: 'Borrow request approved and book added to BorrowedBooks',
            });
        }

        // If status is rejected, delete the request but don't add to BorrowedBooks
        if (status === 'rejected') {
            await connection.promise().query(
                'DELETE FROM BorrowRequests WHERE id = ?',
                [id]
            );

            return res.status(200).json({
                success: true,
                message: 'Borrow request rejected',
            });
        }

        // If status is not recognized, return an error
        return res.status(400).json({
            success: false,
            message: 'Invalid status provided',
        });
    } catch (error) {
        console.error('Error updating borrow request status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update borrow request status',
            error: error.message,
        });
    }
};


module.exports = {
    ReturnBookController,
    GetAllBorrowsController,
    BorrowRequestsController,
    getAllBorrowRequests,
    AdminApproveBorrowRequestesController,
};
