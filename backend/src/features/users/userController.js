import createHttpError from 'http-errors';
import userModal from './userModel.js';
import bcrypt from 'bcrypt';
import { checkRequiredFields, generateToken } from '../../utils/helperFunctions.js';


export const registerUser = async (req, res, next) => {
    try {
        const data = req.body;

        // 🔹 Step 1: Define required fields dynamically
        const commonFields = ["name", "email", "password", "role"];
        const studentFields = [
            "rollNo", "cnic", "dob", "department", "year",
            "idImage", "cnicImage", "phoneNumber", "guardianContact", "address"
        ];
        const driverFields = [
            "policeClearance", "age", "cnic", "cnicImage", "licence", "address"
        ];

        // 🔹 Step 2: Select required fields based on role
        let requiredFields = [...commonFields];
        if (data.role === "student") requiredFields.push(...studentFields);
        if (data.role === "driver") requiredFields.push(...driverFields);

        // 🔹 Step 3: Validate
        checkRequiredFields(data, requiredFields);

        // 🔹 Step 4: Continue logic
        const hashed = await bcrypt.hash(data.password, 10);
        const newUser = await userModal.create({ ...data, password: hashed });
        const token = generateToken(newUser._id, newUser.role);

        const user = { ...newUser.toObject(), token };
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(createHttpError(400, "Email and password are required"));
    }
    const user = await userModal.findOne({ email });
    if (!user) {
        return next(createHttpError(404, "Invalid email and password"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(createHttpError(401, "Invalid email and password"));
    }
    const token = generateToken(user._id, user.role);
    res.status(200).json({
        message: "User login successfully", user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            year: user.year,
            gender: user.gender,
            rollNo: user.rollNo,
            phoneNumber: user.phoneNumber,
            address: user.address,
            dob: user.dob,
            cnic: user.cnic,
            guardianContact: user.guardianContact,
            cnicImage: user.cnicImage,
            idImage: user.idImage,
            token
        }
    });
}

export const getAllUsers = async (req, res, next) => {
    try {
        const { role } = req.query;
        const users = await userModal.find({ role }).select('-password -__v').lean();
        res.status(200).json({ message: `${role} fetched successfully`, users });
    } catch (error) {
        next(error);
    }
}