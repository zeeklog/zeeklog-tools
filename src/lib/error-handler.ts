/**
 * 统一错误处理工具
 * 用于过滤敏感信息，防止数据库连接信息等泄露给客户端
 */

import { NextResponse } from 'next/server'

/**
 * 错误类型枚举
 */
export enum ErrorType {
  // 数据库相关错误
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR', // 数据库连接失败
  DATABASE_QUERY_ERROR = 'DATABASE_QUERY_ERROR', // 数据库查询错误
  DATABASE_VALIDATION_ERROR = 'DATABASE_VALIDATION_ERROR', // 数据库验证错误
  
  // 认证相关错误
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR', // 认证失败
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR', // 权限不足
  TOKEN_INVALID = 'TOKEN_INVALID', // Token无效
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // Token已过期
  
  // 参数验证错误
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 参数验证失败
  MISSING_PARAMETER = 'MISSING_PARAMETER', // 缺少必要参数
  INVALID_PARAMETER = 'INVALID_PARAMETER', // 参数格式错误
  
  // 资源相关错误
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND', // 资源不存在
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT', // 资源冲突（如重复创建）
  RESOURCE_LOCKED = 'RESOURCE_LOCKED', // 资源已被锁定
  
  // 业务逻辑错误
  OPERATION_FAILED = 'OPERATION_FAILED', // 操作失败
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED', // 操作不允许
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED', // 请求频率过高
  
  // 系统错误
  INTERNAL_ERROR = 'INTERNAL_ERROR', // 服务器内部错误
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 服务暂不可用
  TIMEOUT_ERROR = 'TIMEOUT_ERROR', // 请求超时
}

/**
 * 错误类型对应的中文消息
 */
const ERROR_MESSAGES: Record<ErrorType, string> = {
  // 数据库相关错误
  [ErrorType.DATABASE_CONNECTION_ERROR]: '数据库连接失败，请稍后重试',
  [ErrorType.DATABASE_QUERY_ERROR]: '数据查询失败，请稍后重试',
  [ErrorType.DATABASE_VALIDATION_ERROR]: '数据验证失败，请检查输入',
  
  // 认证相关错误
  [ErrorType.AUTHENTICATION_ERROR]: '身份验证失败，请重新登录',
  [ErrorType.AUTHORIZATION_ERROR]: '权限不足，无法执行此操作',
  [ErrorType.TOKEN_INVALID]: '登录凭证无效，请重新登录',
  [ErrorType.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  
  // 参数验证错误
  [ErrorType.VALIDATION_ERROR]: '参数验证失败，请检查输入',
  [ErrorType.MISSING_PARAMETER]: '缺少必要参数',
  [ErrorType.INVALID_PARAMETER]: '参数格式错误',
  
  // 资源相关错误
  [ErrorType.RESOURCE_NOT_FOUND]: '资源不存在',
  [ErrorType.RESOURCE_CONFLICT]: '资源已存在',
  [ErrorType.RESOURCE_LOCKED]: '资源已被占用，请稍后重试',
  
  // 业务逻辑错误
  [ErrorType.OPERATION_FAILED]: '操作失败，请稍后重试',
  [ErrorType.OPERATION_NOT_ALLOWED]: '操作不允许',
  [ErrorType.RATE_LIMIT_EXCEEDED]: '请求过于频繁，请稍后再试',
  
  // 系统错误
  [ErrorType.INTERNAL_ERROR]: '服务器内部错误，请稍后重试',
  [ErrorType.SERVICE_UNAVAILABLE]: '服务暂不可用，请稍后重试',
  [ErrorType.TIMEOUT_ERROR]: '请求超时，请稍后重试',
}

/**
 * 判断是否为Prisma数据库错误
 */
function isPrismaError(error: any): boolean {
  const errorName = error?.constructor?.name || ''
  const errorCode = error?.code || ''
  const errorMessage = String(error?.message || '').toLowerCase()
  
  return (
    errorName.includes('Prisma') ||
    errorCode.startsWith('P') || // Prisma错误代码以P开头
    errorMessage.includes('prisma') ||
    errorMessage.includes('can\'t reach database') ||
    errorMessage.includes('database server') ||
    errorMessage.includes('invalid `prisma') ||
    errorMessage.includes('prisma client')
  )
}

/**
 * 判断是否为数据库连接错误
 */
function isDatabaseConnectionError(error: any): boolean {
  const message = String(error?.message || '').toLowerCase()
  const errorCode = error?.code || ''
  
  return (
    message.includes('can\'t reach database') ||
    message.includes('database server') ||
    message.includes('connection') ||
    message.includes('connection pool') ||
    message.includes('pool timeout') ||
    message.includes('fetching a new connection') ||
    message.includes('too many connections') ||
    message.includes('econnrefused') ||
    message.includes('etimedout') ||
    message.includes('127.0.0.1') ||
    message.includes('localhost') ||
    errorCode === 'P1001' || // Prisma连接错误代码
    errorCode === 'ECONNREFUSED' ||
    errorCode === 'ETIMEDOUT'
  )
}

/**
 * 判断是否为数据库查询错误
 */
function isDatabaseQueryError(error: any): boolean {
  const errorCode = error?.code || ''
  const message = String(error?.message || '').toLowerCase()
  
  return (
    (errorCode.startsWith('P') && !isDatabaseConnectionError(error)) ||
    message.includes('invalid') ||
    message.includes('query') ||
    message.includes('syntax')
  )
}

/**
 * 判断是否为数据库验证错误
 */
function isDatabaseValidationError(error: any): boolean {
  const errorCode = error?.code || ''
  const errorName = error?.constructor?.name || ''
  
  return (
    errorCode === 'P2002' || // 唯一约束违反
    errorCode === 'P2003' || // 外键约束违反
    errorCode === 'P2025' || // 记录不存在
    errorName.includes('ValidationError')
  )
}

/**
 * 过滤敏感信息
 * 移除数据库连接字符串、IP地址、密码等敏感信息
 */
function sanitizeError(error: any): any {
  if (!error) return error

  const sanitized: any = { ...error }

  // 过滤message中的敏感信息
  if (sanitized.message) {
    let message = sanitized.message

    // 移除数据库连接字符串
    message = message.replace(/mysql:\/\/[^@]+@[^\s]+/gi, 'mysql://***:***@***')
    message = message.replace(/postgresql:\/\/[^@]+@[^\s]+/gi, 'postgresql://***:***@***')
    message = message.replace(/mongodb:\/\/[^@]+@[^\s]+/gi, 'mongodb://***:***@***')

    // 移除IP地址
    message = message.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+\b/g, '***.***.***.***:***')
    message = message.replace(/\b127\.0\.0\.1:\d+\b/g, 'localhost:***')
    message = message.replace(/\blocalhost:\d+\b/g, 'localhost:***')

    // 移除文件路径中的敏感信息
    message = message.replace(/\/[^\s]*node_modules[^\s]*/g, '/***/node_modules/***')
    message = message.replace(/\/[^\s]*\.next[^\s]*/g, '/***/.next/***')

    sanitized.message = message
  }

  // 过滤meta中的敏感信息
  if (sanitized.meta) {
    const meta: any = { ...sanitized.meta }
    
    if (meta.target) {
      meta.target = '***'
    }
    if (meta.query) {
      meta.query = '***'
    }
    
    sanitized.meta = meta
  }

  return sanitized
}

/**
 * 识别错误类型
 */
function identifyErrorType(error: any): ErrorType {
  // 数据库连接错误
  if (isDatabaseConnectionError(error)) {
    return ErrorType.DATABASE_CONNECTION_ERROR
  }
  
  // 数据库验证错误
  if (isDatabaseValidationError(error)) {
    return ErrorType.DATABASE_VALIDATION_ERROR
  }
  
  // 数据库查询错误
  if (isDatabaseQueryError(error) || isPrismaError(error)) {
    return ErrorType.DATABASE_QUERY_ERROR
  }
  
  // Token相关错误
  const message = String(error?.message || '').toLowerCase()
  if (message.includes('token') || message.includes('jwt')) {
    if (message.includes('expired')) {
      return ErrorType.TOKEN_EXPIRED
    }
    return ErrorType.TOKEN_INVALID
  }
  
  // 认证/授权错误
  if (message.includes('unauthorized') || message.includes('forbidden')) {
    if (message.includes('forbidden')) {
      return ErrorType.AUTHORIZATION_ERROR
    }
    return ErrorType.AUTHENTICATION_ERROR
  }
  
  // 参数验证错误
  if (message.includes('validation') || message.includes('invalid parameter')) {
    if (message.includes('missing') || message.includes('required')) {
      return ErrorType.MISSING_PARAMETER
    }
    return ErrorType.VALIDATION_ERROR
  }
  
  // 资源不存在
  if (message.includes('not found') || message.includes('does not exist')) {
    return ErrorType.RESOURCE_NOT_FOUND
  }
  
  // 资源冲突
  if (message.includes('already exists') || message.includes('duplicate') || message.includes('unique')) {
    return ErrorType.RESOURCE_CONFLICT
  }
  
  // 操作不允许
  if (message.includes('not allowed') || message.includes('permission denied')) {
    return ErrorType.OPERATION_NOT_ALLOWED
  }
  
  // 请求频率限制
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return ErrorType.RATE_LIMIT_EXCEEDED
  }
  
  // 超时错误
  if (message.includes('timeout') || message.includes('timed out')) {
    return ErrorType.TIMEOUT_ERROR
  }
  
  // 默认返回内部错误
  return ErrorType.INTERNAL_ERROR
}

/**
 * 获取用户友好的错误消息
 * 只返回错误类型对应的中文消息，不暴露技术细节
 */
export function getClientErrorMessage(error: any, defaultMessage: string = '操作失败，请稍后重试'): string {
  // 如果已经是指定的错误类型，直接返回对应的消息
  if (error?.errorType && ERROR_MESSAGES[error.errorType as ErrorType]) {
    return ERROR_MESSAGES[error.errorType as ErrorType]
  }
  
  // 识别错误类型
  const errorType = identifyErrorType(error)
  
  // 返回对应的中文消息
  return ERROR_MESSAGES[errorType] || defaultMessage
}

function writeServerStderrJson(record: Record<string, unknown>): void {
  let line: string
  try {
    line = JSON.stringify(record, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))
  } catch {
    line = JSON.stringify({
      level: record.level,
      context: record.context,
      note: 'log payload failed JSON.stringify',
    })
  }
  if (typeof process !== 'undefined' && typeof process.stderr?.write === 'function') {
    process.stderr.write(`${line}\n`)
  }
}

/**
 * 记录服务器端错误（完整信息）
 * 仅写入 Node stderr，避免 Next.js 开发模式下把 `console.error` 从 RSC/服务端同步到浏览器控制台。
 * 可选 `extras` 仅供服务端排障（不会进入 API 响应）。
 */
export function logServerError(
  error: any,
  context?: string,
  extras?: Record<string, unknown>
): void {
  const e = error && typeof error === 'object' ? (error as Record<string, unknown>) : null
  const record: Record<string, unknown> = {
    level: 'error',
    ts: new Date().toISOString(),
    context: context ?? null,
    error: e
      ? {
          name:
            typeof (e as { constructor?: { name?: unknown } }).constructor?.name === 'string'
              ? ((e as { constructor: { name: string } }).constructor.name as string)
              : 'Unknown',
          message: typeof e.message === 'string' ? e.message : undefined,
          stack: typeof e.stack === 'string' ? e.stack : undefined,
          code: e.code,
          meta: e.meta,
        }
      : { message: String(error) },
  }
  if (extras && Object.keys(extras).length > 0) {
    record.extras = extras
  }
  writeServerStderrJson(record)
}

/**
 * 创建不向客户端暴露错误分类/基础设施语义的响应（完整信息仅写日志）。
 * 用于登录等场景：除业务层已显式返回的账号、密码、验证码提示外，异常统一为同一文案。
 */
export function createGenericErrorResponse(
  error: any,
  clientMessage: string,
  statusCode: number = 500,
  context?: string
): NextResponse {
  logServerError(error, context)
  return NextResponse.json(
    {
      code: -1,
      msg: clientMessage,
    },
    { status: statusCode }
  )
}

/**
 * 创建API错误响应
 * 自动过滤敏感信息，只返回错误类型的中文消息
 */
export function createErrorResponse(
  error: any,
  defaultMessage: string = '操作失败，请稍后重试',
  statusCode: number = 500,
  context?: string
): NextResponse {
  // 记录完整错误到服务器日志（包含所有详细信息）
  logServerError(error, context)

  // 返回给客户端的消息（只返回错误类型对应的中文消息）
  const clientMessage = getClientErrorMessage(error, defaultMessage)
  
  // 识别错误类型
  const errorType = error?.errorType || identifyErrorType(error)

  return NextResponse.json(
    {
      code: -1,
      msg: clientMessage,
      errorType, // 可选：返回错误类型，方便前端处理
    },
    { status: statusCode }
  )
}

/**
 * 根据错误类型创建错误响应（直接指定错误类型）
 */
export function createTypedErrorResponse(
  errorType: ErrorType,
  statusCode: number = 500,
  context?: string
): NextResponse {
  const message = ERROR_MESSAGES[errorType]
  
  if (context) {
    writeServerStderrJson({
      level: 'error',
      ts: new Date().toISOString(),
      context,
      kind: 'typed-error-response',
      errorType,
      message,
    })
  }

  return NextResponse.json(
    {
      code: -1,
      msg: message,
      errorType,
    },
    { status: statusCode }
  )
}
