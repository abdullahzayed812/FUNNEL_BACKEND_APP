export function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("Missing Jwt secret!");
        process.exit(1);
    }
    return secret;
}
export function getSalt() {
    const salt = process.env.PASSWORD_SALT;
    if (!salt) {
        console.error("Missing password salt!");
        process.exit(1);
    }
    return salt;
}
