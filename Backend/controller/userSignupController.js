const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const signUp = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Information missing',
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password atleast need to be 6 characters',
            })
        }
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 11-digit phone number',
            });
        }

        const phoneExists = await User.findOne({ phone })
        if (phoneExists) {
            return res.status(400).json({
                success: false,
                message: "Phone number already registered"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            phone,
            password: hashPassword
        })

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        res.status(201).json({
            success: true,
            message: 'Signup  successful',
            token,
            user: {
                id: user._id,
                phone: user.phone,
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { signUp }