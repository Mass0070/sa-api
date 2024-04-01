module.exports = {
    requiredAuthenticated: (req, res, next) => {
      
      if (req.headers.authorization === "4gJrnA9Yw9ZB2yXWKmzzH8AT") {
        return next();
      }
      res.json({error: "Not authorized."});         
    }
  };