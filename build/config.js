
const APP_NAME = 'FeatureFinder';
const APP_ID = 'DEFAULT';
const APP_VERSION = 'DEFAULT';
const APP_INSTALLER_ID = 'DEFAULT';
const CAMPAIGN = 'DEFUALT';
const GA_PRODUCT_CODE = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
const COOKIE_DOMAIN = 'FeatureFinder.com';
const DEV = process.env.NODE_ENV !== 'production';

module.exports = {
    APP_NAME: `String("${APP_NAME}")`,
    APP_ID: `String("${APP_ID}")`,
    APP_VERSION: `String("${APP_VERSION}")`,
    APP_INSTALLER_ID: `String("${APP_INSTALLER_ID}")`,
    CAMPAIGN: `String("${CAMPAIGN}")`,
    GA_PRODUCT_CODE: `String("${GA_PRODUCT_CODE}")`,
    COOKIE_DOMAIN: `String("${COOKIE_DOMAIN}")`,
    DEV: `String("${DEV}")`
};
