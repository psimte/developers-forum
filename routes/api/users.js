const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/Users')

//@route POST api/users
//@desc Test Route
//@accss Public

router.post('/',[
    check('name','Name is required.')
    .not()
    .isEmpty(),

    check('email', 'Please provide a valid email')
    .isEmail(),
    check('password','Please provide a valid password').
    isLength({ min : 6 })
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body;

    try{

        //See if user exist
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({errors: [{msg: 'User already Exist'}] });
        }

        //Get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //Return jsonwebtoken
        const payload = {
            id: user.id
        }

        jwt.sign(payload, 
            config.get('jwtToken'), 
            {expiresIn: '360000'},
            (err, token) => {
                    if(err) {throw err};
                    res.json({ token })
                }
            );
    }
    catch(err) {
        console.error(err.message);
        res.sratus(500).send('Server Error');
    }
});

module.exports = router; 