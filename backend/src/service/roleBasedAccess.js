const roleBasedMiddleware = require("./validation/rbacMiddleware");

const superAdminMiddleware = roleBasedMiddleware(["SUPERADMIN"]);
const spMiddleware = roleBasedMiddleware(["SP"]);
const dspMiddleware = roleBasedMiddleware(["DSP"]);
const ciMiddleware = roleBasedMiddleware(["CI"]);
const shoMiddleware = roleBasedMiddleware(["SHO"]);
const siMiddleware = roleBasedMiddleware(["SI"]);
const asiMiddleware = roleBasedMiddleware(["ASI"]);
const constableMiddleware = roleBasedMiddleware(["CONSTABLE"]);
const controlRoomMiddleware = roleBasedMiddleware(["CONTROLROOM"]);
const adminMiddleware = roleBasedMiddleware(["SUPERADMIN", "SP", "DSP", "CI", "SHO"]);
const fieldOfficerMiddleware = roleBasedMiddleware(["SI", "ASI", "CONSTABLE"]);
const emergencyAccessMiddleware = roleBasedMiddleware(["CONTROLROOM", "SHO", "SP"]);
const allMiddleware = roleBasedMiddleware([
    "SUPERADMIN", "SP", "DSP", "CI", "SHO", "SI", "ASI", "CONSTABLE", "CONTROLROOM"
]);

module.exports = {
    superAdminMiddleware,
    spMiddleware,
    dspMiddleware,
    ciMiddleware,
    shoMiddleware,
    siMiddleware,
    asiMiddleware,
    constableMiddleware,
    controlRoomMiddleware,
    adminMiddleware,
    fieldOfficerMiddleware,
    emergencyAccessMiddleware,
    allMiddleware,
};
