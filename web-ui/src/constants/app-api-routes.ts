export default {
    host: process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : `http://${window.location.hostname}:${process.env.REACT_APP_WEB_API_PORT}`,

    accountSignIn: '/sign-in',
    accountSignOut: '/sign-out',
    accountAuthCheck: '/auth-check',
    accounts: '/api/accounts',

    pumpingStations: '/api/pumping-stations',
};
