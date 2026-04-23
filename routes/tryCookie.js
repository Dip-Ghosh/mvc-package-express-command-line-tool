const router = require('express').Router();

router.get('/tryCookie', (req, res) => {
  const expDate = new Date(Date.now() + 5e3);
  res.cookie('isLoggedIn', 'true', {
    expires: expDate,
    httpOnly: true,
    sameSite: 'strict',
  });
  res.send('Save');
});

// router.post('/d', (req,res) => {
//   res.cookie('isHello', true);
//   res.send("Cookie Send")
// })

module.exports = router;
