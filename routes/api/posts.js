const express = require('express');
const router = express.Router();


//@route GET api/users
//@desc Test Route
//@accss Public

router.post('/', (req, res) => {res.send('Post Route')})

module.exports = router