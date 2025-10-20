import naverpay from '@naverpay/eslint-config/typescript'

export default [
    {
        ignores: ['**/dist/**'],
    },
    ...naverpay.configs.node,
    ...naverpay.configs.typescript,
    ...naverpay.configs.strict,
    ...naverpay.configs.packageJson
]