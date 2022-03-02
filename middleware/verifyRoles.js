const verifyRoles = (...allowedRoles) => {
  // Because the verifyJWT.js middleware is runing before this one, and that is adding username 
  // and roles in the request, then we have access to these values here
  return (req, res, next) => {
    // Even if we do have a req, it needs to have roles for this to be valid.
    if (!req?.roles) return res.sendStatus(401); // 401 unauthorize
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    // These roles are comming from the JWT Access Token that is created when the authController 
    // or refreshTokenController endpoints are hitted
    console.log(req.roles);
    // We have access to the roles from the req, because the verifyJWT.js middleware is runing before this middleware
    // Retruns true if includes a role that is in the req.roles. include returns true or false
    // We just need one true, that's why we filter with find to find just the 1st true in the array.
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    // If we don't find true results
    if (!result) return res.sendStatus(401);
    next();
  }
}

module.exports = verifyRoles