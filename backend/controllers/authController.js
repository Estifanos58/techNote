const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// @desc Login
// @route POST /auth
// @access Public
const login = async(req, res) => {
    try{
        const { username, password } = req.body
        
        if(!username || !password) {
            return res.status(400).json({ message: 'All field are required'})
        }

        const foundUser = await User.findOne({username}).exec()

        if(!foundUser || !foundUser.active) {
            return res.status(401).json({ message: 'Unauthorized '})
        }

        const match = await bcrypt.compare(password, foundUser.password)

        if(!match) return res.status(401).json({message : 'Unauthorized'})

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username" : foundUser.username,
                    "roles": foundUser.roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d'}
        )

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d'}
        )

        // Create secure cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server
            secure: true, //https
            sameSite: 'None', // cross-site cookie
            maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expire: set to match 
        })

        // Send accessToken containing username and roles
        res.json({ accessToken})

    }catch(error){
        console.log(error.message)
    }
}

// @desc Refresh
// @router GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookie = req.cookie

    if (!cookie?.jwt) return res.status(401).json({ message: 'Unauthorized'})

    const refreshToken = cookie.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            try{
                if(err) return res.status(403).json({message: 'Forbidden'})
                const foundUser = await User.findOne({ username: decoded.username})

                if(!foundUser) return res.status(401).json({ message: 'Unautherized'})
                
                const accessToken = jwt.sign(
                    {
                        "UserInfo" : {
                            "username": foundUser.username,
                            "roles": foundUser.roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d'}
                )

                res.json({ accessToken })
            }catch(error) {
                console.log(error.message)
            }
        }
    )
} 

// @desc Logout
// @route GET /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true})
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}