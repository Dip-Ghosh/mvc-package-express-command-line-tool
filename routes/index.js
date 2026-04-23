const router = require('express').Router();

const { urlencoded, json } = require('body-parser');

const productRoute = require('./product');
const cookieRoute = require('./tryCookie');

router.use(urlencoded({ extended: false }));
router.use(json());

router.use(productRoute);
router.use(cookieRoute);

module.exports = router;
