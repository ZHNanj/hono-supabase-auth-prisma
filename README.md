# Hono + Supabase Auth + Prisma
使用hono.js框架，搭配supabase auth 和 prisma/supabase 的模板

## 本地调试
```CMD
copy .dev.vars.example .dev.vars
```
配置环境变量`.dev.vars`
```
SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]
SUPABASE_URL=[SUPABASE_URL]
SUPABASE_JWT_SECRET=[SUPABASE_JWT_SECRET]
POSTGRES_PRISMA_URL=[POSTGRES_PRISMA_URL]
POSTGRES_URL_NON_POOLING=[POSTGRES_URL_NON_POOLING]
```

安装依赖
```CMD
npm install
```

本地运行
```CMD
npm run dev
```

## 部署
修改`wrangler.toml`
```
[vars]
SUPABASE_ANON_KEY=[SUPABASE_ANON_KEY]   
SUPABASE_URL=[SUPABASE_URL]
SUPABASE_JWT_SECRET=[SUPABASE_JWT_SECRET]
POSTGRES_PRISMA_URL=[POSTGRES_PRISMA_URL]
POSTGRES_URL_NON_POOLING=[POSTGRES_URL_NON_POOLING] 
```

部署
```CMD
npm run deploy
```