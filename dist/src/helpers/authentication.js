import jwt from "jsonwebtoken";
import { getJwtSecret } from "./env";
const { sign, verify } = jwt;
export function signJwt(payload) {
    return sign(payload, getJwtSecret(), { expiresIn: "3d" });
}
export function verifyJwt(token) {
    return verify(token, getJwtSecret());
}
