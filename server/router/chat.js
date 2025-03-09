const Router = require("express").Router;
const router = new Router();

router.get("/rooms", (req, res) => {
  res.send(
    "<h1 style='height: 100%; color: white; background-color: black;'>ROOMS<h1>"
  );
});

module.exports = router;
