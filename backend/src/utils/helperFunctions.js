import jsonwebtoken  from "jsonwebtoken";
import createHttpError from "http-errors";
import _config from "../config/config.js";

export const generateToken = (userId, role) => jsonwebtoken.sign({sub: userId,role},_config.jwt_secret );

export const checkRequiredFields = (data, requiredFields ) => {
    for (const field of requiredFields) {
        const value = data[field];

        if (value === undefined || value === null || value.toString().trim() === "") {
            throw createHttpError(400, `Missing required field: ${field}`);
        }
    }
};
