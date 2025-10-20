export const REQUEST_URL = {
  PUBLIC: {
    LOGIN: '/user/auth/login',
    SIGNUP: '/user/account/create',
    FINDID: '/user/account/find-id',
    FINDPASSWORD: '/user/account/find-password',
  },
  PRIVATE: {
    EXIST: '/user/account/exist',
    INFO: '/user/account/info',
    EDIT: '/user/account/edit',
    CHANGEPW: '/user/account/change-pw',
    LOGOUT: '/user/auth/logout',

    COMMUNITYINFO: '/community/participating',
    CREATE_COMMUNITYINFO: '/community/create',
    INVITE_FOLLOWER: '/community/invite',

    GET_RECEIVED: '/alarm/received',

    PROCESS_PAYMENT: '/payment',
    CANCELLED_PAYMENT: '/patment/cancel'
  },
};