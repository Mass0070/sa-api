module.exports = {
    requiredAuthenticated: (req, res, next) => {
      
      if (req.headers.authorization === "") {
        return next();
      }
      res.json({error: "Not authorized."});         
    }
  };