/**
 * 生成 src/lib/tools/catalog.json（与 online-tool-box 分类顺序、slug 一致）
 * 运行：node scripts/build-tools-catalog.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/** @type {{ category: string; slug: string; title: string; description: string }[]} */
const catalog = [  // Converter
  { category: 'converter', slug: 'date-converter', title: '日期时间转换器', description: '将日期和时间转换为各种不同的格式' },
  { category: 'converter', slug: 'base-converter', title: '整数基转换器', description: '在不同的基数（十进制、十六进制、二进制、八进制、base64…）之间转换数字' },
  { category: 'converter', slug: 'roman-numeral-converter', title: '罗马数字转换器', description: '将罗马数字转换为数字，并将数字转换为罗马数字。' },
  { category: 'converter', slug: 'base64-string-converter', title: 'Base64 字符串编码/解码', description: '将字符串编码和解码为其 Base64 格式表示形式即可。' },
  { category: 'converter', slug: 'base64-file-converter', title: 'Base64 文件转换器', description: '将字符串、文件或图像转换为其 Base64 表示形式。' },
  { category: 'converter', slug: 'color-converter', title: 'Color 选择器', description: '在不同格式（十六进制、rgb、hsl和css名称）之间转换颜色' },
  { category: 'converter', slug: 'case-converter', title: '大小写转换', description: '更改字符串的大小写并在不同格式之间进行选择' },
  { category: 'converter', slug: 'text-to-nato-alphabet', title: '文本转北约字母表', description: '将文本转换为北约拼音字母以进行口头传播。' },
  { category: 'converter', slug: 'text-to-binary', title: '文本到 ASCII 二进制', description: '将文本转换为其 ASCII 二进制表示形式，反之亦然。' },
  { category: 'converter', slug: 'text-to-unicode', title: '文本转 Unicode', description: '解析文本并将其转换为 unicode，反之亦然' },
  { category: 'converter', slug: 'utf-8-inspector', title: 'UTF-8 编码检视', description: '查看文本的 UTF-8 十六进制字节、百分号编码，或由十六进制/%XX 还原为文本。' },
  { category: 'converter', slug: 'yaml-to-json-converter', title: 'YAML到JSON转换器', description: '使用此在线转换器将YAML转换为JSON。' },
  { category: 'converter', slug: 'yaml-to-toml', title: 'YAML 到 TOML', description: '解析YAML并将其转换为TOML。' },
  { category: 'converter', slug: 'json-to-yaml-converter', title: 'JSON到YAML转换器', description: '在线转换将JSON转换为YAML。' },
  { category: 'converter', slug: 'json-to-toml', title: 'JSON 转 TOML', description: '解析JSON并将其转换为TOML。' },
  { category: 'converter', slug: 'list-converter', title: 'List 转换器', description: '该工具可以处理基于数组的数据，并将各种更改（转置、添加前缀和后缀、反向列表、排序列表、小写值、截断值）应用于每一行。' },
  { category: 'converter', slug: 'toml-to-json', title: 'TOML 到 JSON', description: '解析TOML并将其转换为JSON。' },
  { category: 'converter', slug: 'toml-to-yaml', title: 'TOML 到 YAML', description: 'Parse and convert TOML to YAML.' },
  { category: 'converter', slug: 'encoding-toolkit', title: '编码工具包', description: 'Base32/Base58 编解码、JSON 片段 URL 安全转义等，与 URL/HTML/Base64 工具互补。' },

  // Crypto
  { category: 'crypto', slug: 'token-generator', title: 'Token 生成器', description: '使用您想要的字符、大写或小写字母、数字和/或符号生成随机字符串。' },
  { category: 'crypto', slug: 'hash-text', title: 'Hash 文本', description: '使用所需的函数哈希文本字符串：MD5、SHA1、SHA256、SHA224、SHA512、SHA384、SHA3、RIPEMD160 与 CRC32（IEEE）' },
  { category: 'crypto', slug: 'bcrypt', title: '加密', description: '使用bcrypt对文本字符串进行哈希和比较。Bcrypt是一个基于Blowfish密码的密码哈希函数。' },
  { category: 'crypto', slug: 'uuid-generator', title: 'UUIDs 生成器', description: '通用唯一标识符（UUID）是一个128位数字，用于标识计算机系统中的信息。可能的UUID数量为16^32，即2^128或约3.4x10^38（这是一个很大的数字！）。' },
  { category: 'crypto', slug: 'ulid-generator', title: 'ULID 生成器', description: '生成随机的通用唯一词典可排序标识符（ULID）。' },
  { category: 'crypto', slug: 'encryption', title: '加密/解密文本', description: '使用加密算法（如AES、TripleDES、Rabbit或RC4）加密和解密文本明文。' },
  { category: 'crypto', slug: 'bip39-generator', title: 'BIP39密码生成器', description: '从现有或随机助记符生成BIP39密码短语，或从密码短语获取助记符。' },
  { category: 'crypto', slug: 'hmac-generator', title: 'Hmac 生成器', description: '使用密钥和您喜欢的哈希函数计算基于哈希的消息身份验证代码（HMAC）。' },
  { category: 'crypto', slug: 'rsa-key-pair-generator', title: 'RSA密钥对生成器', description: '生成新的随机RSA私钥和公钥pem证书。' },
  { category: 'crypto', slug: 'password-strength-analyser', title: '密码强度分析仪', description: '使用此密码强度分析器和破解时间估计工具来发现密码的强度。' },
// Web
  { category: 'web', slug: 'url-encoder', title: '编码/解码url格式的字符串', description: '编码为url编码格式（也称为“百分比编码”）或从中解码。' },
  { category: 'web', slug: 'html-entities', title: '转义html实体', description: '转义或unescape html实体（将<、>、&、“和\'替换为其html版本）' },
  { category: 'web', slug: 'url-parser', title: 'Url分析器', description: '解析url字符串以获取所有不同的部分（协议、来源、参数、端口、用户名密码…）' },
  { category: 'web', slug: 'device-information', title: '设备信息', description: '获取有关当前设备的信息（屏幕大小、像素比率、用户代理…）' },
  { category: 'web', slug: 'basic-auth-generator', title: '基本身份验证生成器', description: '从用户名和密码生成 base64 基本身份验证标头。' },
  { category: 'web', slug: 'og-meta-generator', title: '开放式图形元生成器', description: '为您的网站生成开放式图形和社交html元标记。' },
  { category: 'web', slug: 'otp-generator', title: 'OTP代码生成器', description: '为多因素身份验证生成和验证基于时间的OTP（一次性密码）。' },
  { category: 'web', slug: 'mime-types', title: 'mime类型', description: '将mime类型转换为扩展，反之亦然。' },
  { category: 'web', slug: 'jwt-parser', title: 'JWT 解析器', description: '解析和解码JSON Web Token（jwt）并显示其内容。' },
  { category: 'web', slug: 'keycode-info', title: 'Keycode 信息', description: '查找任何按下的键的javascript键代码、代码、位置和修饰符。' },
  { category: 'web', slug: 'slugify-string', title: '打乱字符串', description: '确保字符串 url、文件名和 id 安全。' },
  { category: 'web', slug: 'html-wysiwyg-editor', title: 'HTML所见即所得编辑器', description: '在线HTML编辑器具有功能丰富的所见即所得编辑器，立即获得内容的源代码。' },
  { category: 'web', slug: 'user-agent-parser', title: '用户代理分析器', description: '从用户代理字符串中检测和分析浏览器、引擎、操作系统、CPU和设备类型/型号。' },
  { category: 'web', slug: 'http-status-codes', title: 'HTTP 状态码', description: '所有HTTP状态的列表对其名称和含义解释。' },
  { category: 'web', slug: 'json-diff', title: 'JSON 差异比较', description: '比较两个JSON对象并获得它们之间的差异。' },
  { category: 'web', slug: 'safelink-decoder', title: 'Outlook Safelink 解码', description: '解码 Outlook SafeLink 链接。' },
  { category: 'web', slug: 'escape-native-converter', title: 'Escape 与 Native 编解码', description: 'JavaScript/XML/CSV/C#/SQL 等转义与反转义；Java 风格 \\uXXXX（Native2Ascii）编码与解码。' },
  { category: 'web', slug: 'ubb-html-converter', title: 'UBB 与 HTML 互转', description: '常见论坛 UBB 标签与 HTML 互转；预览经消毒，复杂排版请人工核对。' },
  { category: 'web', slug: 'html-js-literal-converter', title: 'HTML / 文本 ↔ JS 字符串', description: '将内容转为模板字符串或双引号字面量，或从字面量还原文本，便于嵌入脚本。' },
  { category: 'web', slug: 'html-to-markdown', title: 'HTML 转 Markdown', description: '将 HTML 片段转为 GitHub Flavored Markdown，支持标题、列表、链接、代码块与表格等；浏览器内处理，可链接预填。' },
  { category: 'web', slug: 'markdown-to-html', title: 'Markdown 转 HTML', description: '将 Markdown（GFM）转为 HTML 片段，浏览器内 marked 解析；与 HTML 转 Markdown 互为补充。' },
  { category: 'web', slug: 'html-stripper', title: 'HTML 去标签', description: '去除 HTML 标签保留可见纯文本，忽略 script/style；适合邮件与 CMS 摘录前的粗清洗。' },
  { category: 'web', slug: 'rem-px-converter', title: 'REM / EM 与 PX 换算', description: '按根字号将 rem 与 px 互转，并按参考字号换算 em；用于前端稿与样式对照。' },
  // Media
  { category: 'media', slug: 'qrcode-generator', title: '二维码生成器', description: '生成并下载url或文本的QR代码，并自定义背景和前景颜色。' },
  { category: 'media', slug: 'wifi-qrcode-generator', title: 'WiFi 二维码生成器', description: '生成和下载QR码以快速连接到WiFi网络。' },
  { category: 'media', slug: 'svg-placeholder-generator', title: 'SVG 占位符生成器', description: '生成 svg 图像以用作应用程序中的占位符。' },
  { category: 'media', slug: 'camera-recorder', title: '摄像机记录器', description: '从网络摄像头或照相机拍摄照片或录制视频。' },
  // Development
  { category: 'development', slug: 'git-memo', title: 'Git 备忘录', description: 'Git是一种去中心化的版本管理软件。使用此备忘单，您可以快速访问最常见的git命令.' },
  { category: 'development', slug: 'random-port-generator', title: '随机端口生成', description: '生成“已知”端口范围（0-1023）之外的随机端口号。' },
  { category: 'development', slug: 'crontab-generator', title: 'Crontab 表达式生成', description: '验证并生成crontab，并获取cron调度的可读描述。' },
  { category: 'development', slug: 'json-prettify', title: 'JSON美化和格式化', description: '将JSON字符串修饰为友好的可读格式。' },
  { category: 'development', slug: 'json-jsonl-converter', title: 'JSON 与 JSONL 互转', description: 'JSON 数组与每行一条 JSON（JSONL/NDJSON）互转，便于日志与 LLM 数据管线。' },
  { category: 'development', slug: 'json-syntax-helper', title: 'JSON 语法检查', description: '尝试解析 JSON 并在失败时提示大致行号、列号与错误片段；不做自动修复。' },
  { category: 'development', slug: 'json-minify', title: 'JSON 压缩', description: '通过删除不必要的空白来缩小和压缩JSON。' },
  { category: 'development', slug: 'json-to-csv', title: 'JSON 转 CSV', description: '使用自动标头检测将JSON转换为CSV。' },
  { category: 'development', slug: 'sql-prettify', title: 'SQL 美化和格式化', description: '在线格式化和美化您的 SQL 查询（它支持各种 SQL 方言）。' },
  { category: 'development', slug: 'chmod-calculator', title: 'Chmod 计算器', description: '使用此在线的chmod计算器计算chmod权限和命令。' },
  { category: 'development', slug: 'docker-run-to-docker-compose-converter', title: 'Docker Run 到 docker-compose 转换器', description: '将 docker run 命令行转换为 docker-compose 文件!' },
  { category: 'development', slug: 'xml-formatter', title: 'XML 格式化', description: '将XML字符串修饰为友好的可读格式。' },
  { category: 'development', slug: 'yaml-prettify', title: 'YAML美化和格式化', description: '将YAML字符串修饰为友好的可读格式。' },
  { category: 'development', slug: 'js-html-prettify', title: 'JavaScript / HTML 格式化', description: '使用 Prettier 在浏览器内格式化 JavaScript 或 HTML 片段。' },
  { category: 'development', slug: 'html-to-jsx', title: 'HTML 转 JSX', description: '将 HTML 片段转为 React JSX 风格（className、自闭合标签、花括号转义）；复杂样式与事件需人工调整。' },
  { category: 'development', slug: 'curl-to-code', title: 'curl 转代码', description: '解析常见 curl 参数并生成 fetch、axios、PHP curl 或 Python requests 示例代码。' },
  { category: 'development', slug: 'javascript-compress', title: 'JavaScript 压缩与混淆', description: 'Terser 压缩、变量名混淆，或 javascript-obfuscator 高强度混淆（体积会增大）。' },
  // Network
  { category: 'network', slug: 'ipv4-subnet-calculator', title: 'IPv4子网计算器', description: '解析IPv4 CIDR块，并获取有关子网络的所有所需信息。' },
  { category: 'network', slug: 'cidr-calculator', title: 'CIDR 计算器', description: '输入 IPv4 CIDR，查看网络地址、掩码、广播与主机范围；与 IPv4 子网计算器能力一致，便于检索。' },
  { category: 'network', slug: 'ipv4-address-converter', title: 'Ipv4地址转换器', description: '在ipv6中，将ip地址转换为十进制、二进制、十六进制或事件' },
  { category: 'network', slug: 'ipv4-range-expander', title: 'IPv4范围扩展器', description: '给定起始和结束IPv4地址，此工具使用其CIDR表示法计算有效的IPv4网络。' },
  { category: 'network', slug: 'mac-address-lookup', title: 'MAC地址查找', description: '通过设备的MAC地址查找设备的供应商和制造商。' },
  { category: 'network', slug: 'mac-address-generator', title: 'MAC 地址生成器', description: '输入数量和前缀。MAC地址将以您选择的大小写（大写或小写）生成' },
  { category: 'network', slug: 'ipv6-ula-generator', title: 'IPv6 ULA生成器', description: '根据RFC4193在网络上生成您自己的本地不可路由IP地址。' },
  // Math
  { category: 'math', slug: 'math-evaluator', title: '数学计算器', description: '计算数学表达式的计算器。您可以使用sqrt、cos、sin、abs等函数。' },
  { category: 'math', slug: 'eta-calculator', title: 'ETA 计算器', description: 'ETA（估计到达时间）计算器，用于知道任务的近似结束时间，例如下载的结束时刻。' },
  { category: 'math', slug: 'percentage-calculator', title: '百分比计算器', description: '轻松计算从一个值到另一个值的百分比，或从百分比到值的百分比。' },
  // Measurement
  { category: 'measurement', slug: 'chronometer', title: '计时器', description: '监控事物的持续时间。基本上是一种具有简单计时器功能的计时器。' },
  { category: 'measurement', slug: 'temperature-converter', title: '温度转换器', description: '开尔文、摄氏度、华氏度、兰金、德莱尔、牛顿、雷奥穆尔和罗默温度度数转换。' },
  { category: 'measurement', slug: 'benchmark-builder', title: '基准生成器', description: '简单的在线基准构建器可以轻松比较任务的执行时间。' },
  { category: 'measurement', slug: 'unit-converter', title: '单位换算', description: '长度、质量、体积、面积、时间等常用单位互转；可与日期时间工具配合。' },
  // Text
  { category: 'text', slug: 'lorem-ipsum-generator', title: 'Lorem ipsum生成器', description: 'Lorem ipsum是一种占位符文本，通常用于排版与字体视觉预览，而不依赖于有意义的内容' },
  { category: 'text', slug: 'text-statistics', title: '文本统计', description: '获取有关文本、字符数、字数、大小等的信息' },
  { category: 'text', slug: 'emoji-picker', title: 'Emoji 选择器', description: '轻松复制和粘贴Emoji表情符号，并获得每个表情符号的unicode和code points值.' },
  { category: 'text', slug: 'string-obfuscator', title: '字符串混淆器', description: '混淆字符串（如秘密、IBAN 或令牌），使其可共享和可识别，而不泄露其内容。' },
  { category: 'text', slug: 'text-diff', title: '文本比较', description: '比较两个文本并查看它们之间的差异。' },
  { category: 'text', slug: 'numeronym-generator', title: '数字名称生成器', description: '数字名是一个用数字构成缩写的词。例如，“i18n”是“国际化”的名词，其中18表示单词中第一个i和最后一个n之间的字母数。' },
  { category: 'text', slug: 'ascii-text-drawer', title: 'ASCII 艺术字生成器', description: '使用多种字体与样式由文本生成 ASCII 艺术字。' },
  { category: 'text', slug: 'text-line-processor', title: '文本行处理', description: '去重行、去空行、排序行、去首尾空白等行级批量处理。' },
  // Data
  { category: 'data', slug: 'phone-parser-and-formatter', title: '电话分析器和格式化程序', description: '解析、验证和格式化电话号码。获取有关电话号码的信息，如国家/地区代码、类型等。' },
  { category: 'data', slug: 'iban-validator-and-parser', title: 'IBAN验证器和解析器', description: '验证和分析IBAN编号。检查IBAN是否有效，并获取国家BBAN，如果它是QR-IBAN和IBAN友好格式。' },
  { category: 'data', slug: 'tabular-spreadsheet-converter', title: '表格 CSV/XLSX', description: '上传 CSV 或 XLSX 预览为 CSV，或将 CSV 导出为 XLSX（浏览器内 SheetJS）。' },
  { category: 'data', slug: 'chart-from-csv', title: 'CSV 简易图表', description: '两列表头 CSV 生成折线图，便于快速查看趋势。' },

  // Media (extended)
  { category: 'media', slug: 'image-format-converter', title: '栅格图格式转换', description: '常见 JPG/PNG/WebP 等互转（Canvas），受输入大小限制。' },

  // Web (extended)
  { category: 'web', slug: 'xpath-tester', title: 'XPath 测试', description: '在浏览器中对 XML/HTML 片段运行 XPath 1.0 表达式并查看匹配节点。' },
  { category: 'web', slug: 'jsonpath-tester', title: 'JSONPath 测试', description: '对 JSON 文本执行 JSONPath 查询并展示结果。' },
  { category: 'web', slug: 'html-table-tools', title: 'HTML 表格工具', description: '生成简单 HTML 表格，或从 HTML 中提取首个表格为 CSV/TSV。' },

  // Development (extended)
  { category: 'development', slug: 'sql-to-data-formats', title: 'SQL 转 CSV/JSON/XML', description: '解析 INSERT 等受限 SQL，导出为 CSV、JSON、XML、YAML、HTML 表格（见页内语法说明）。' },
  { category: 'development', slug: 'csv-toolkit', title: 'CSV 工具包', description: 'CSV 与 JSON/XML/HTML/TSV/SQL 等互转，单页多 Tab。' },
  { category: 'development', slug: 'xml-diff', title: 'XML 文本对比', description: '对两段 XML 文本做行级差异对比（与 XML 格式化配合使用）。' },
  { category: 'development', slug: 'gzip-decompress', title: 'Gzip/Zlib 解压', description: '解压 gzip 或 zlib 包裹的字节（Base64 或原始二进制输入），受大小限制。' },
  { category: 'development', slug: 'structured-data-viewer', title: '结构化数据树视图', description: 'JSON/XML/YAML 树形查看（懒加载），便于浏览大文档结构。' },
  { category: 'development', slug: 'code-formatter', title: '多语言代码格式化', description: 'Prettier 支持的语言下拉格式化（JS/TS/CSS/JSON/Markdown 等）。' },
  { category: 'development', slug: 'css-beautify-minify', title: 'CSS 美化与压缩', description: 'Prettier 格式化与 csso 压缩；压缩警告会明确展示。' },

  // Network (extended)
  { category: 'network', slug: 'ip-representation-converter', title: 'IPv4 多表示转换', description: '点分 IPv4 与十进制、十六进制、二进制、八进制互转。' },
  { category: 'network', slug: 'dns-lookup', title: 'DNS 查询', description: '经服务端查询 A/AAAA/MX/NS/TXT，带超时与显式错误响应。' },
]

if (catalog.length !== 112) {
  console.error('Expected 112 tools, got', catalog.length)
  process.exit(1)
}

/** 每条 description 末尾追加 SEO 关键词：在线工具、{title}在线工具、online */
function appendOnlineToolKeywords(item) {
  const base = item.description.trim()
  const suffix = `在线工具，${item.title}在线工具，online`
  return {
    ...item,
    description: base ? `${base} ${suffix}` : suffix,
  }
}

const out = path.join(root, 'src/lib/tools/catalog.json')
const withSeo = catalog.map(appendOnlineToolKeywords)
fs.writeFileSync(out, `${JSON.stringify(withSeo, null, 2)}\n`, 'utf8')
console.log('Wrote', out)
