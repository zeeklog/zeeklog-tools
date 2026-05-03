# 极客日志（zeeklog.com）在线工具箱

`zeeklog.com` 开源版的在线工具站。当前是纯前端 + Next.js 应用

![alt text](examples/example-1.png)
![alt text](examples/example-2.png)

## 开发

```bash
pnpm install
pnpm dev
```

默认地址：`http://127.0.0.1:3003`


## 部署

```bash
pnpm build
pnpm start
```

线上部署时，把 `SITE_URL` 设成真实域名，例如 `https://zeeklog.com`。如果需要先本地模拟生产环境，可用 `pnpm preview`。

## 脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 开发模式 |
| `pnpm dev:turbo` | Turbopack 开发模式 |
| `pnpm dev:lan` | 局域网可访问开发模式 |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务 |
| `pnpm preview` | 构建后本地预览 |
| `pnpm lint` | 代码检查 |
| `pnpm format` | 代码格式化 |
| `pnpm verify:tools` | 校验工具注册与实现 |
| `pnpm test:a11y` | 无障碍回归测试 |

## 目录

```text
src/app        页面、路由与站点级 metadata
src/components 工具页面与通用组件
src/lib/tools  工具逻辑、SEO 与注册表
public         静态资源
scripts        校验与辅助脚本
tests          测试
```

## 说明

- 已移除旧的 Vite、Prisma、数据库和临时资源
- 新增或调整工具后，先跑 `pnpm verify:tools`
