const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Even if we do have a req, it needs to have roles.
    if (!req?.roles) return res.sendStatus(401); // 401 unauthorize
    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    // These roles are comming from the JWT
    console.log(req.roles);
    // Retruns true if includes a role that is in the req.rolesd. include returns true or false
    const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
    // If we don't find true results
    if (!result) return res.sendStatus(401);
    next();
  }
}

module.exports = verifyRoles