import jwt from 'jsonwebtoken'

const isAuth = async (req,res,next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }
        const decodeToken = await jwt.verify(token,process.env.JWT_SECRET)
        if(!decodeToken){
            return res.status(401).json({message: "Unauthorized"})
        }
        req.userId = decodeToken.userId
        next()
    } catch (error) {
        return res.status(500).json({message: "IsAuth error"})
    }
}

export default isAuth