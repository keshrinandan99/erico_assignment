import jwt from 'jsonwebtoken'
import prisma from '../db.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || 
                     req.headers["authorization"]?.replace("Bearer ", "") || 
                     req.header("Authorization")?.replace("Bearer ", "");
                     
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access - no token found" });
        }
        console.log("token: ",token);
        
        const decodeToken = jwt.verify(token, process.env.ACCESSTOKENSECRET)
        console.log(decodeToken);
        
        
        const user = await prisma.user.findUnique({
            where: {
                id: decodeToken.id
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) {
            return res.status(401).json({ error: "Invalid Token" });
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ error: `Error validating token: ${error.message}` });
    }
}