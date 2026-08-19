const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Information missing',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password atleast need to be 6 characters',
            });
        }

        const phoneRegex = /^01[3-9]\d{8}$/;

        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid phone number',
            });
        }

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password',
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid phone number or password',
            });
        }

        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { login };