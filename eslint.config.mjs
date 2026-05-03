import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  {
    ignores: [
      'dist/**',
      '.next/**',
      'fork-repo-template/**',
      'node_modules/**',
      'admin/**',
      'public/admin/**',
    ],
  },
  ...nextVitals,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    },
  },
  /**
   * tsx 运行的脚本不是 Next Server Components 打包环境，`import 'server-only'` 会直接抛错。
   * 禁止从 scripts 引用带 server-only 壳的模块；请使用 *-core 或拆出无 server-only 的实现。
   */
  {
    files: ['scripts/**/*.{ts,tsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/lib/content-moderation',
              message:
                'tsx 脚本勿导入该入口（含 server-only）。请使用 @/lib/content-moderation-core。',
            },
            {
              name: '@/lib/moderation-audit',
              message: 'tsx 脚本勿导入该入口（含 server-only）。请使用 @/lib/moderation-audit-core。',
            },
            {
              name: '@/lib/new-account-post-policy',
              message: '该模块含 server-only，禁止在 scripts 中导入。',
            },
            {
              name: '@/lib/community-html-sanitize',
              message: '该模块含 server-only，禁止在 scripts 中导入。',
            },
            {
              name: '@/lib/markdown-link-safety',
              message: '该模块含 server-only，禁止在 scripts 中导入。',
            },
            {
              name: '../src/lib/content-moderation',
              message:
                'tsx 脚本勿导入该入口（含 server-only）。请使用 ../src/lib/content-moderation-core。',
            },
            {
              name: '../src/lib/moderation-audit',
              message: 'tsx 脚本勿导入该入口（含 server-only）。请使用 ../src/lib/moderation-audit-core。',
            },
            {
              name: '../src/lib/new-account-post-policy',
              message: '该模块含 server-only，禁止在 scripts 中导入。',
            },
            {
              name: '../src/lib/community-html-sanitize',
              message: '该模块含 server-only，禁止在 scripts 中导入。',
            },
            {
              name: '../src/lib/markdown-link-safety',
              message: '该模块含 server-only，禁止在 scripts 中导入。',
            },
          ],
        },
      ],
    },
  },
]

export default config
