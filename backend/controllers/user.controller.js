import prisma from '../db.js'
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from '../utils/generateAccessAndRefreshToken.js';

const generateAccessAndRefreshToken=async(userId)=>{
    const user=await prisma.user.findFirst({
        where:{
            id:userId
        }
    })
    if(!user){
        return res.status(401).json("User not found")
    }
    const accessToken=await generateAccessToken(user.id,user.email,user.fullName)
    const refreshToken=await generateRefreshToken(user.id)
    user.refreshToken=refreshToken
    await prisma.user.update({
        where:{
            id:user.id
        },
        data:{
            refreshToken:refreshToken
        }
    })
    return {accessToken,refreshToken}

}
export const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
if ([fullName, email, password].some((field) => !field || field.trim() === "")) {
    return res.status(400).json({ error: "All fields are required!" });
}

const existingUser = await prisma.user.findFirst({
    where: {
        OR: [
            { email: email },
            { fullName: fullName }
        ]
    }
});
if (existingUser) {
    return res.status(401).json({ error: "User already exists!" });
}
const encryptedPassword=await bcrypt.hash(password,10);


const user = await prisma.user.create({
    data: {
        fullName: fullName,
        email: email,
        password: encryptedPassword,
        refreshToken:null
    }
});
const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user.id)

const createdUser=await prisma.user.findFirst({
    where:{
        id:user.id
    },
    select:{
        id:true,
        fullName:true,
        email:true,
        updatedAt:true,
        createdAt:true
    }
})
if(!createdUser){
    return res.status(401).json("Error while creating user")
}
const options={
    httpOnly:true,
    secure:true
}


return res.status(201)
.cookie("accessToken", accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json({
    message:"User registered successfully",
    user:
        createdUser,
        accessToken,
        refreshToken,

});
};

export const loginUser=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.send(401).json("Email and password is required")
    }
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    if(!user){
        return res.send(401).json("User doesn't exist please register")
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json("Incorrect password")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user.id);
    const loggedInUser= await prisma.user.findFirst({
        where:{
            id:user.id
        },
        select:{
            id:true,
            email:true,
            fullName:true,
            createdAt:true,
            updatedAt:true
        }
    })
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json({
        user:loggedInUser,
        accessToken,
        refreshToken
    },
    "User LoggedIn successfully"
)

}

export const logoutUser=async(req,res)=>{
    const User=await prisma.user.findFirst({
        where:{
            id:req.user?.id
        }
    })
    if(!User){
        return res.status(401).json("Unauthorized")
    }
    await prisma.user.update({
        where:{
            id:User.id
        },
        data:{
            refreshToken:null
        }
    })
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(201)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json("User logged Out successfully!")
}
export const fetchCurrentUser=async(req,res)=>{
    try {
        const User=req.user
        if(!User){
            return res.status(401).json("Unauthorized: user not found")
        }
       
        return res.status(201)
        .json({
            message:"User fetched successfully!",
            user:User

        })
    } catch (error) {
        return res.status(401).json("Error fetching User")
    }
}

