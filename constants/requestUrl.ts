export const REQUEST_URL = {
  PUBLIC: {
    LOGIN: '/user/auth/login',
    SIGNUP: '/user/account/create',
    FINDID: '/api/auth/find-id',
    RESET_PASSWORD: '/api/auth/reset-password',
    OAUTH: '/auth/oauth',
    OAUTH_COMPLETE_PROFILE: '/auth/oauth/complete-profile',
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
    CANCELLED_PAYMENT: '/payment/cancel',

    PAYMENT_REQUEST_CREATE: '/community/{groupId}/payment-request',
    PAYMENT_REQUEST_LIST: '/community/{groupId}/payment-requests',
    PAYMENT_REQUEST_APPROVE: '/community/payment-request/{requestId}/approve',
    PAYMENT_REQUEST_REJECT: '/community/payment-request/{requestId}/reject',
    PAYMENT_REQUEST_MY: '/community/payment-requests/my',
    USER_PROFILE: '/user/account/profile',
    TRANSFER_CASH: '/transaction/transfer/cash',
    TRANSFER_HISTORY: '/transaction/query',
    TRANSACTION_PERSONAL_RECENT: '/transaction/query/personal/recent',
    TRANSACTION_PERSONAL_ASSET: '/transaction/query/personal/asset',
    ASSET_ONLINE_CREATE: '/asset/online',
    ASSET_TRANSFER_USER: '/transaction/transfer/user',
    ASSET_TRANSFER_COMMUNITY: '/transaction/transfer/community',
    PAYMENT_LIMITS: '/user/settings/payment-limits',
  },
}
