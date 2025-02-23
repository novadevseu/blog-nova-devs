export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
        return "Email is required";
    }
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }
    return "";
};

export const validatePassword = (password: string) => {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }
    return "";
};
