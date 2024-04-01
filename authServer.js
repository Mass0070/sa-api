module.exports = {
  serverAuthenticated: (req, res, next) => {
      const allowedIPs = [
        ""
      ]; // Add your allowed IP addresses here
  
      const clientIP = req.ip.split(":").pop(); // Extract the IPv4 address
      const clientHeaders = req.headers;
  
      if (
        (clientHeaders.authorization === "" || clientHeaders.authorization === "") &&
        allowedIPs.includes(clientIP)
      ) {
        return next();
      }
  
      res.json({ error: "Not authorized." });
    },
};
  