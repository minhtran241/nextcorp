import passwordValidator from 'password-validator';

// Create a schema
export const pvSchema = new passwordValidator()
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(['Passw0rd', 'Password123']);

export const invalidMessages = (validate) => {
    const messages = {
        min: 'be at least 8 characters long',
        max: 'be less than 100 characters long',
        uppercase: 'contain at least one uppercase letter',
        lowercase: 'contain at least one lowercase letter',
        digits: 'contain at least two digits',
        spaces: 'not contain spaces',
        oneOf: 'not be a common password',
    };
    const m = validate.map((item) => messages[item]);
    const errorString =
        'Password must ' + m.slice(0, -1).join(', ') + ' and ' + m.slice(-1);
    return errorString;
};

// export const hashPassword = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
// };

// export const comparePassword = async (password, hashedPassword) => {
//     const result = await bcrypt.compare(password, hashedPassword);
//     return result;
// };
