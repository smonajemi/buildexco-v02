import config from '../config/config.js';
import { instagramData } from '../controllers/homeController.js';

const attachAdminDetails = (req, res, next) => {
    res.locals = {
        ...res.locals,
        adminEmail: config.buildexAdminEmail,
        adminPhone: config.buildexAdminPhone,
        instagramUrl: config.buildexInstagramUrl,
        calendarUrl: config.buildexCalendarUrl,
        googleUrl: config.buildexGoogleUrl,
        instagramData: instagramData,
    };
    next();
};

export default attachAdminDetails;
