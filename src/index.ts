import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { createSupabaseClient } from './lib/supabase'
import { getPrisma } from './lib/prisma'
import { cors } from 'hono/cors'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_JWT_SECRET: string
  MY_VAR: string,
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 中间件顺序要注意，一般cors-身份认证-路由处理
app.use('/api/*', cors())

// JWT中间件
app.use('/api/*', async (c, next) => {
  if (!c.env.SUPABASE_JWT_SECRET) {
    return c.json({ error: 'JWT secret is not set' }, 500)
  }
  const jwtMiddleware = jwt({
    secret: c.env.SUPABASE_JWT_SECRET,
  })
  return jwtMiddleware(c, next)
})

// 登录路由
app.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  const supabase = createSupabaseClient(c.env)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return c.json({ error: error.message }, 400)
  return c.json(data)
})

// 测试路由
app.get('/api/test', async (c) => {
  const supabase = createSupabaseClient(c.env)
  const page = c.req.query('page') || '1'
  const limit = 10
  const offset = (Number(page) - 1) * limit
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .range(offset, offset + limit - 1)

  if (error) return c.json({ success: false, error: '内部服务器错误' }, 500)

  return c.json({
    success: true,
    data
  })
})

app.get('/api/test1', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL)
  try {
    const data = await prisma.user.findMany();
    return c.json(data)
  } catch (error) {
    console.error('Prisma error:', error)
    return c.json({ error: 'Database error' }, 500)
  }
})

export default app
