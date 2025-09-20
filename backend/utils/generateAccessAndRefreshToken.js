import jwt from 'jsonwebtoken'


export const generateAccessToken=async(userId,email,fullName)=>{
    try {
        const accessToken=jwt.sign({
            id:userId,
            email,
            fullName
        },
        process.env.ACCESSTOKENSECRET,
       { 
        expiresIn:process.env.ACCESSTOKENEXPIRY
        }
    )
    return accessToken;

        
    } catch (error) {
        throw new error(401,"Error generating Token");
    }
}

export const generateRefreshToken=async(userId)=>{
   try {
     const refreshToken=jwt.sign(
         {
             id:userId
         },
         process.env.REFRESHTOKENSECRET,
         {
             expiresIn:process.env.REFRESHTOKENEXPIRY
         }
     )
     return refreshToken;
   } catch (error) {
    console.log("Error generating Token",error);
    
   }
}