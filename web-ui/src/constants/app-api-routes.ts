export default {
    host: process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`,

    accountSignIn: '/sign-in',
    accountSignOut: '/sign-out',
    accountAuthCheck: '/auth-check',
    accounts: '/api/accounts',

    pumpingStations: '/api/pumping-stations',
};
