import { checkSchema } from 'express-validator';

export const validateEventSchema = {
    title: {
        notEmpty: {
            errorMessage: "Title is required"
        },
    },
    date: {
        isISO8601: {
            errorMessage: "Date must be in ISO 8601 format (YYYY-MM-DD)"
        },
    },
    location: {
        notEmpty: {
            errorMessage: "Location is required"
        },
    },
    imageUrl: {
        optional: true
    },
    company: {
        notEmpty: {
            errorMessage: "Company is required"
        },
    },
    price: {
        isFloat: {
            options: { gt: 0 },
            errorMessage: "Price must be a positive number"
        }
    }
};

export const validateEvent = checkSchema(validateEventSchema);
