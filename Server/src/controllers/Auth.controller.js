require("dotenv").config({path : '../../.env'})
require("colors")
const { connection } = require("../config/db")
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');


const createSendToken = (NewUser, StatusCode, res) => {

    if (!NewUser.email || !NewUser.id) {
        throw new Error("Invalid user object - email or id is missing.");
    }

    const token = jwt.sign({ email: NewUser.email, id: NewUser.id , role : NewUser.role }, process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN 
    })


    res.status(StatusCode).json({
        status: "success",
        token,
        data: NewUser
    })

}

const RegisterUserController = async (req, res, next) => {
    try {
        const { fullname, email, password, isAccept, role } = req.body;

        // Ensure all required fields are present
        if (!fullname || !email || !password || !isAccept) {
            return res.status(404).json({ message: "Require ALL Fields!" });
        }

        // Check if the user already exists
        const [existingUser] = await connection.promise().query(`SELECT * FROM Users WHERE email = ?`, [email]);
        if (existingUser.length > 0) {
            return res.json({ message: "Email Already Exists" });
        }

        // Generate a UUID and hash the password
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Debug log the values before inserting them
        console.log("Generated UUID:", userId);
        console.log("Hashed Password:", hashedPassword);
        console.log("IsAccept Value:", isAccept);

        // Prepare the INSERT query
        let insertQuery = `INSERT INTO Users (id, fullname, email, password, isAccept${role ? ', role' : ''}) VALUES (?, ?, ?, ?, ?${role ? ', ?' : ''})`;
        const values = [userId, fullname, email, hashedPassword, isAccept ? 1 : 0];

        // Include role in values if it exists
        if (role) {
            values.push(role);
        }

        // Insert the new user into the database
        const [result] = await connection.promise().query(insertQuery, values);

        // Return the new user information and token
        const NewUser = {
            id: userId,
            fullname,
            email,
            isAccept
        };

        createSendToken(NewUser, 200, res);

    } catch (error) {
        console.log("Error in RegisterUserController:", error.message.red.bold);
        res.status(420).json({ message: error.message });
    }
};


const LoginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Require ALL Fields" })
        }

        const [user] = await connection.promise().query(`select * from users where email = ?`, [email])

        if (!user.length > 0) return res.status(404).json({ message: "Email Does not Exists" });

        const foundUser = user[0];
        const hashedPassword = foundUser.password;

        const isPasswordValid = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        createSendToken(foundUser, 200, res)


    } catch (error) {
        console.log("Error Logging In", error.message.red.bold);
    }
}

const VerifyTokenController = async (req, res) => {
    try {
        const { token } = req.body;
        console.log(token);

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const verify = jwt.verify(token, process.env.JWT_SECRET , async (err, data) => {
            if (err) return res.status(401).json({ message: "Invalid token" });
            console.log(data);
            try {
                const [user] = await connection.promise().query(`select * from users where email = ?`, [data.email])
                if (user.length == 0) return res.status(404).json({ message: "User Not Found" })
                return res.json({ user, message: "success" })
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }

        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}

const GetAllUsersController = async (req, res) => {
    try {
        // Fetch all rows from the Users table
        const [users] = await connection.promise().query(`SELECT * FROM Users`);

        // Check if there are no users in the table
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Send the retrieved users as a response
        res.status(200).json({
            status: "success",
            data: users
        });

    } catch (error) {
        console.error("Error in GetAllUsersController:", error.message);
        res.status(500).json({ error: "An error occurred while fetching users." });
    }
};

const DeleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the user exists before attempting to delete
        const [user] = await connection.promise().query(`SELECT * FROM Users WHERE id = ?`, [id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user from the Users table
        await connection.promise().query(`DELETE FROM Users WHERE id = ?`, [id]);

        // Return a success message
        res.status(200).json({
            status: "success",
            message: `User with id ${id} has been deleted`
        });

    } catch (error) {
        console.error("Error in DeleteUserController:", error.message);
        res.status(500).json({ error: "An error occurred while deleting the user." });
    }
};

const UpdateUserController = async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from the request parameters
        const { fullname, email, password, isAccept } = req.body; // Destructure the fields to be updated

        // Check if the user exists
        const [existingUser] = await connection.promise().query(`SELECT * FROM Users WHERE id = ?`, [id]);
        if (existingUser.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update query with only the fields provided
        const updatedFields = [];
        const values = [];

        if (fullname) {
            updatedFields.push("fullname = ?");
            values.push(fullname);
        }
        if (email) {
            updatedFields.push("email = ?");
            values.push(email);
        }
        if (password) {
            updatedFields.push("password = ?");
            values.push(password); // Ideally, you should hash the password here using bcrypt
        }
        if (typeof isAccept !== 'undefined') {
            updatedFields.push("isAccept = ?");
            values.push(isAccept);
        }

        // If no fields were provided, return an error
        if (updatedFields.length === 0) {
            return res.status(400).json({ message: "No fields provided to update" });
        }

        // Push the user id for the WHERE clause
        values.push(id);

        // Update the user in the database
        const query = `UPDATE Users SET ${updatedFields.join(', ')} WHERE id = ?`;
        await connection.promise().query(query, values);

        // Fetch the updated user details
        const [updatedUser] = await connection.promise().query(`SELECT * FROM Users WHERE id = ?`, [id]);

        // Return the updated user details
        res.status(200).json({
            status: "success",
            message: `User with id ${id} has been updated`,
            data: updatedUser[0] // Send the updated user info
        });

    } catch (error) {
        console.error("Error in UpdateUserController:", error.message);
        res.status(500).json({ error: "An error occurred while updating the user." });
    }
};

module.exports = {
    RegisterUserController,
    LoginUserController,
    VerifyTokenController,
    GetAllUsersController,
    DeleteUserController,
    UpdateUserController,
}