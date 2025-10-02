export const REQUEST_URL = {
  PUBLIC: {
    LOGIN: '/user/auth/login',
    SIGNUP: '/user/account/create',
    FINDID: '/user/account/find-id',
    FINDPASSWORD: '/user/account/find-password',
  },
  PRIVATE: {
    INFO: '/user/account/info',
    EDIT: '/user/account/edit',
    CHANGEPW: '/user/account/change-pw',
    LOGOUT: '/user/auth/logout',
  },
};