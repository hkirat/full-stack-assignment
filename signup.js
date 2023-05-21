const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
        <form method = 'POST' action="/signup">
            <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Sign Up</button>
        </form>
`);
});

module.exports = router;
