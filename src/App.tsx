import {
  BarChart3,
  Camera,
  CheckCircle2,
  ClipboardList,
  Copy,
  DollarSign,
  Download,
  Factory,
  FileText,
  Globe2,
  Megaphone,
  PackageSearch,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Printer,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Platform = 'Amazon' | 'TikTok Shop'

type FormState = {
  productName: string
  category: string
  productUrl: string
  competitorUrls: string
  sellingPoints: string
  tone: string
  salePriceUsd: string
  sourceCostCny: string
  shippingUsd: string
  adCostUsd: string
  exchangeRate: string
}

type ManualDownload = {
  url: string
  fileName: string
  label: string
}

type DocxModule = typeof import('docx')

type SkillModule = {
  name: string
  role: string
  output: string
  status: '已纳入' | '待接入'
  icon: typeof Search
}

const defaultForm: FormState = {
  productName: 'Cordless portable blender',
  category: 'Kitchen & Home',
  productUrl: 'https://www.amazon.com/dp/example-blender',
  competitorUrls:
    'https://www.amazon.com/dp/competitor-a\nhttps://shop.tiktok.com/view/product/example',
  sellingPoints:
    'USB-C charging, BPA-free cup, easy cleaning, compact for travel, 12 oz capacity',
  tone: 'Direct response',
  salePriceUsd: '34',
  sourceCostCny: '68',
  shippingUsd: '4.8',
  adCostUsd: '5.2',
  exchangeRate: '7.12',
}

const skillModules: SkillModule[] = [
  {
    name: 'ecom-product-orchestrator',
    role: '总控编排',
    output: '把输入、测算、竞品、Listing、广告脚本和下一步任务串成一份运营报告。',
    status: '已纳入',
    icon: ClipboardList,
  },
  {
    name: 'product-spy',
    role: '趋势雷达',
    output: '判断当前商品是否值得继续做社媒热度、竞品数量和内容角度验证。',
    status: '已纳入',
    icon: PackageSearch,
  },
  {
    name: 'blue-ocean-sourcing',
    role: '蓝海采购',
    output: '从差异化、工厂能力、打样成本和利润空间判断是否进入样品阶段。',
    status: '已纳入',
    icon: Factory,
  },
  {
    name: 'global-price-comparison',
    role: '全球比价',
    output: '用美国价格作为首个锚点，提醒后续接入其他站点价格带对比。',
    status: '已纳入',
    icon: Globe2,
  },
  {
    name: 'exchange-rate',
    role: '汇率换算',
    output: '把人民币采购价换算成美元成本，参与利润和毛利率判断。',
    status: '已纳入',
    icon: DollarSign,
  },
  {
    name: 'ecommerce-listing-generator',
    role: 'Listing 文案',
    output: '生成美国 Amazon 可用的标题、五点描述、长描述和搜索词。',
    status: '已纳入',
    icon: FileText,
  },
  {
    name: 'skill-listing-image-optimizer',
    role: '图片检查',
    output: '提醒主图、白底图、尺寸、场景图和 claim 证明图的检查事项。',
    status: '已纳入',
    icon: Camera,
  },
  {
    name: 'mjzj-sp',
    role: '服务商任务',
    output: '把物流、海外仓、退货、拍摄和合规服务整理成后续跟进任务。',
    status: '已纳入',
    icon: Truck,
  },
]

function splitCompetitors(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'manual input'
  }
}

function parseMoney(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function calculateEconomics(form: FormState) {
  const salePriceUsd = parseMoney(form.salePriceUsd)
  const sourceCostCny = parseMoney(form.sourceCostCny)
  const shippingUsd = parseMoney(form.shippingUsd)
  const adCostUsd = parseMoney(form.adCostUsd)
  const exchangeRate = parseMoney(form.exchangeRate) || 7.12
  const sourceCostUsd = sourceCostCny / exchangeRate
  const totalCostUsd = sourceCostUsd + shippingUsd + adCostUsd
  const profitUsd = salePriceUsd - totalCostUsd
  const margin = salePriceUsd > 0 ? (profitUsd / salePriceUsd) * 100 : 0
  const status = margin >= 35 ? 'STRONG_GO' : margin >= 20 ? 'GO' : margin >= 10 ? 'WATCH' : 'PASS'

  return {
    salePriceUsd,
    sourceCostUsd,
    shippingUsd,
    adCostUsd,
    totalCostUsd,
    profitUsd,
    margin,
    status,
  }
}

function formatUsd(value: number) {
  return `$${value.toFixed(2)}`
}

function formatStatus(value: string) {
  const statusLabels: Record<string, string> = {
    STRONG_GO: '强烈可测',
    GO: '可以测试',
    WATCH: '继续观察',
    PASS: '暂不建议',
  }

  return statusLabels[value] ?? value.replaceAll('_', ' ')
}

function getDecisionSummary(status: string) {
  if (status === 'STRONG_GO') {
    return '利润空间较好，可以进入样品验证和素材测试。'
  }

  if (status === 'GO') {
    return '可以小规模测试，但需要继续确认竞品价格和广告成本。'
  }

  if (status === 'WATCH') {
    return '建议先观察，重点压低成本或提高售价后再测试。'
  }

  return '当前利润空间不足，不建议直接进入投放测试。'
}

function createListing(form: FormState) {
  return `Amazon Listing Draft - US Market

Title
${form.productName}, USB-C Rechargeable Portable Blender, BPA-Free 12 oz Travel Cup for Smoothies, Shakes, Gym, Office, and Travel

Bullet points
1. Blend on the go: compact 12 oz design fits commute, gym, office, and travel routines.
2. USB-C rechargeable: simple charging keeps the blender ready without extra adapters.
3. BPA-free cup: built for daily smoothies, protein shakes, and light fruit blends.
4. Easy to clean: detachable cup design helps reduce cleaning friction after each use.
5. Clear usage fit: best for soft fruit, protein powder, and everyday drinks.

Long description
Built for buyers who want a fast personal smoothie without a full kitchen setup, this portable blender combines a compact cup, USB-C charging, and a simple cleaning flow. It is positioned for morning routines, post-workout drinks, desk use, and travel.

Search keywords
portable blender, personal blender, USB blender, travel blender, smoothie blender, protein shake blender`
}

function createAdScript(form: FormState) {
  return `TikTok Shop Ad Script - US Market

Product
${form.productName}

Video angle
Daily smoothie in 30 seconds, from desk to gym bag.

15-second script
0-3s: Show the bulky blender problem on a busy morning.
Voiceover: "No time for the big blender?"

4-8s: Add soft fruit, milk, and protein powder into the portable cup.
Voiceover: "This USB-C portable blender makes a quick shake anywhere."

9-12s: Show blending, pouring, and quick rinse.
Voiceover: "Blend, drink, rinse, and go."

13-15s: Product close-up with offer frame.
Voiceover: "Tap to get yours on TikTok Shop."

Primary CTA
Shop now

Caption variants
- Your morning smoothie just got easier.
- Small blender, simple routine.
- For desk, gym, travel, and busy mornings.`
}

function createEnglishCompetitorBrief(form: FormState) {
  const competitors = splitCompetitors(form.competitorUrls)
  const domains = competitors.map(getDomain).join(', ') || 'manual competitor set'

  return `Competitor Readout - US Market

Product
${form.productName}

Category
${form.category}

Sources
${domains}

Main competitor claims
- Fast blending for shakes and smoothies
- Travel-friendly form factor
- USB charging and easy cleaning
- Giftable lifestyle positioning

Observed buyer pain points
- Weak motor performance with frozen fruit
- Battery life is unclear or overstated
- Cleaning claims need proof
- Leakage risk is a repeated trust concern

Opportunity angle
- Lead with proof-backed portability
- Avoid overpromising frozen-fruit performance
- Show cleaning and leak testing in video assets
- Keep Amazon copy specification-heavy and TikTok copy demo-heavy`
}

function createChineseReport(form: FormState, platforms: Platform[]) {
  const economics = calculateEconomics(form)
  const competitors = splitCompetitors(form.competitorUrls)
  const competitorDomains = competitors.map(getDomain)
  const productSpyScore = Math.min(92, 58 + competitors.length * 8)
  const imageScore = form.sellingPoints.toLowerCase().includes('bpa') ? 82 : 68
  const sourcingScore = economics.margin >= 35 ? 86 : economics.margin >= 20 ? 72 : 58
  const priceScore = economics.margin >= 35 ? 88 : economics.margin >= 20 ? 74 : 55

  return {
    economics,
    competitors,
    competitorDomains,
    productSpyScore,
    imageScore,
    sourcingScore,
    priceScore,
    decision: formatStatus(economics.status),
    decisionSummary: getDecisionSummary(economics.status),
    platforms: platforms.join(' / '),
    nextActions: [
      '确认竞品真实销量、评价数量和近 30 天内容热度。',
      '找 3 家供应商询价，重点确认 MOQ、打样费、交期、质检标准。',
      '补齐主图、场景图、尺寸图、卖点证明图，优先满足 Amazon 主图规范。',
      '用英文 Listing 和 TikTok 脚本各做 2 个版本，准备小预算广告测试。',
      '导出报告给运营或供应链同事复核，再决定是否进入样品采购。',
    ],
    risks: [
      '当前链接解析和竞品数据仍是前端模拟，真实上线前必须接后端解析服务。',
      '利润测算没有包含平台佣金、仓储费、退货损耗和税费。',
      '广告脚本和 Listing 文案需要人工复核平台禁词、医疗/功效类 claim。',
    ],
  }
}

function buildReportText(form: FormState, platforms: Platform[], listing: string, adScript: string) {
  const report = createChineseReport(form, platforms)

  return `跨境电商 AI 运营报告

商品：${form.productName}
类目：${form.category}
目标市场：美国
平台：${report.platforms}

一、机会结论
判断：${report.decision}
说明：${report.decisionSummary}

二、利润测算
目标售价：${formatUsd(report.economics.salePriceUsd)}
采购成本折美元：${formatUsd(report.economics.sourceCostUsd)}
预估运费：${formatUsd(report.economics.shippingUsd)}
预估广告成本：${formatUsd(report.economics.adCostUsd)}
总成本：${formatUsd(report.economics.totalCostUsd)}
单件利润：${formatUsd(report.economics.profitUsd)}
毛利率：${report.economics.margin.toFixed(1)}%

三、竞品与趋势
竞品数量：${report.competitors.length}
竞品来源：${report.competitorDomains.join(', ') || 'manual input'}
Product Spy 评分：${report.productSpyScore}/100
Price Compare 评分：${report.priceScore}/100
Blue Ocean 评分：${report.sourcingScore}/100
Image Optimizer 评分：${report.imageScore}/100

四、下一步行动
${report.nextActions.map((item, index) => `${index + 1}. ${item}`).join('\n')}

五、主要风险
${report.risks.map((item, index) => `${index + 1}. ${item}`).join('\n')}

六、英文 Listing 素材
${listing}

七、英文 TikTok 素材
${adScript}`
}

function encodeRtfText(value: string) {
  return Array.from(value)
    .map((char) => {
      if (char === '\\') {
        return '\\\\'
      }

      if (char === '{') {
        return '\\{'
      }

      if (char === '}') {
        return '\\}'
      }

      const codePoint = char.codePointAt(0) ?? 0

      if (codePoint === 10) {
        return '\\par '
      }

      if (codePoint < 128) {
        return char
      }

      if (codePoint <= 65535) {
        const signedCodePoint = codePoint > 32767 ? codePoint - 65536 : codePoint
        return `\\u${signedCodePoint}?`
      }

      return '?'
    })
    .join('')
}

function createWordRtf(content: string) {
  const lines = content.split('\n')
  const body = lines
    .map((line) => {
      const trimmed = line.trim()

      if (!trimmed) {
        return '\\par'
      }

      const isHeading =
        trimmed.includes('、') ||
        trimmed === '跨境电商 AI 运营报告' ||
        trimmed.endsWith('素材')

      if (isHeading) {
        return `\\pard\\sa140\\b ${encodeRtfText(trimmed)}\\b0\\par`
      }

      return `\\pard\\sa80 ${encodeRtfText(trimmed)}\\par`
    })
    .join('\n')

  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
\\f0\\fs24
${body}
}`
}

function createDocxParagraphs(content: string, docx: DocxModule) {
  const { HeadingLevel, Paragraph, TextRun } = docx

  return content.split('\n').map((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      return new Paragraph({ text: '', spacing: { after: 80 } })
    }

    if (trimmed === '跨境电商 AI 运营报告') {
      return new Paragraph({
        text: trimmed,
        heading: HeadingLevel.TITLE,
        spacing: { after: 220 },
      })
    }

    const isSectionHeading = /^[一二三四五六七八九十]+、/.test(trimmed)

    if (isSectionHeading) {
      return new Paragraph({
        text: trimmed,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 260, after: 120 },
      })
    }

    if (/^\d+\.\s/.test(trimmed)) {
      return new Paragraph({
        children: [new TextRun(trimmed)],
        spacing: { after: 80 },
        indent: { left: 360 },
      })
    }

    if (trimmed.startsWith('- ')) {
      return new Paragraph({
        text: trimmed.slice(2),
        bullet: { level: 0 },
        spacing: { after: 80 },
      })
    }

    const [label, ...rest] = trimmed.split('：')

    if (rest.length > 0 && label.length <= 12) {
      return new Paragraph({
        children: [
          new TextRun({ text: `${label}：`, bold: true }),
          new TextRun(rest.join('：')),
        ],
        spacing: { after: 90 },
      })
    }

    return new Paragraph({
      children: [new TextRun(trimmed)],
      spacing: { after: 90 },
    })
  })
}

function createDocxDocument(content: string, docx: DocxModule) {
  const { Document } = docx

  return new Document({
    creator: 'Cross-Border-E-Commerce',
    title: '跨境电商 AI 运营报告',
    description: 'Chinese operation report with English ecommerce assets.',
    sections: [
      {
        properties: {},
        children: createDocxParagraphs(content, docx),
      },
    ],
  })
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 30000)
}

function App() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [platforms, setPlatforms] = useState<Platform[]>(['Amazon', 'TikTok Shop'])
  const [generatedAt, setGeneratedAt] = useState('报告已就绪')
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('点击“导出 DOCX”保存完整中文运营报告。')
  const [manualDownload, setManualDownload] = useState<ManualDownload | null>(null)

  const competitors = useMemo(
    () => splitCompetitors(form.competitorUrls),
    [form.competitorUrls],
  )
  const listingDraft = useMemo(() => createListing(form), [form])
  const adScript = useMemo(() => createAdScript(form), [form])
  const competitorBrief = useMemo(() => createEnglishCompetitorBrief(form), [form])
  const report = useMemo(() => createChineseReport(form, platforms), [form, platforms])
  const fullReportText = useMemo(
    () => buildReportText(form, platforms, listingDraft, adScript),
    [adScript, form, listingDraft, platforms],
  )

  const readinessScore = Math.min(
    100,
    20 +
      (form.productName ? 15 : 0) +
      (form.productUrl ? 18 : 0) +
      (competitors.length ? 22 : 0) +
      (form.sellingPoints ? 15 : 0) +
      (parseMoney(form.salePriceUsd) ? 10 : 0),
  )

  useEffect(() => {
    return () => {
      if (manualDownload) {
        URL.revokeObjectURL(manualDownload.url)
      }
    }
  }, [manualDownload])

  function setManualDownloadBlob(blob: Blob, fileName: string, label: string) {
    setManualDownload((current) => {
      if (current) {
        URL.revokeObjectURL(current.url)
      }

      return {
        url: URL.createObjectURL(blob),
        fileName,
        label,
      }
    })
  }

  function updateForm(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function togglePlatform(platform: Platform) {
    setPlatforms((current) => {
      if (current.includes(platform)) {
        return current.length === 1 ? current : current.filter((item) => item !== platform)
      }

      return [...current, platform]
    })
  }

  function generateReport() {
    setGeneratedAt(`生成于 ${new Date().toLocaleTimeString()}`)
  }

  async function exportDocx() {
    const fileName = `${sanitizeFileName(form.productName) || 'ecommerce-report'}-运营报告.docx`
    setIsExporting(true)
    setExportStatus('正在准备 DOCX 文件...')

    try {
      const docx = await import('docx')
      const document = createDocxDocument(fullReportText, docx)
      const blob = await docx.Packer.toBlob(document)
      setManualDownloadBlob(blob, fileName, '手动下载 DOCX 文件')
      downloadBlob(blob, fileName)
      setExportStatus(`DOCX 文件已生成：${fileName}。如果浏览器没有自动下载，请点下面的手动下载链接。`)
    } catch (error) {
      setExportStatus('DOCX 导出失败。请使用“备用 RTF”或“复制报告”。')
      console.error('DOCX export failed', error)
    } finally {
      setIsExporting(false)
    }
  }

  function exportRtf() {
    const fileName = `${sanitizeFileName(form.productName) || 'ecommerce-report'}-运营报告-备用.rtf`
    setExportStatus('正在准备 RTF 备用文件...')

    try {
      const rtf = createWordRtf(fullReportText)
      const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' })
      setManualDownloadBlob(blob, fileName, '手动下载 RTF 备用文件')
      downloadBlob(blob, fileName)
      setExportStatus(`RTF 备用文件已生成：${fileName}。Word 和 WPS 都可以打开。`)
    } catch (error) {
      setExportStatus('RTF 备用导出失败。请使用“复制报告”。')
      console.error('RTF export failed', error)
    }
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(fullReportText)
      setExportStatus('报告正文已复制。可以直接粘贴到 Word、WPS 或飞书文档。')
    } catch (error) {
      setExportStatus('复制失败。请手动选中页面内容复制。')
      console.error('Copy report failed', error)
    }
  }

  function openPrintView() {
    const escapedReport = fullReportText
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')

    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      setExportStatus('打印窗口被浏览器拦截。请允许弹窗，或使用 DOCX/RTF 下载。')
      return
    }

    printWindow.opener = null
    printWindow.document.write(`
      <html>
        <head>
          <title>跨境电商 AI 运营报告</title>
          <meta charset="utf-8" />
          <style>
            body { margin: 40px; color: #111827; font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif; }
            pre { white-space: pre-wrap; font-size: 14px; line-height: 1.65; }
          </style>
        </head>
        <body>
          <pre>${escapedReport}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setExportStatus('已打开打印版。可以在浏览器里打印，或另存为 PDF。')
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">跨境电商 AI 运营台</p>
          <h1>输入商品和竞品链接，一键生成中文运营报告与英文销售素材</h1>
          <p className="hero-copy">
            这版把你发来的 Skill 组合成一条完整流程：趋势判断、蓝海采购、价格测算、Listing、广告脚本、图片检查和服务商任务。
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" className="secondary-button" onClick={generateReport}>
            <RefreshCcw size={18} />
            一键生成报告
          </button>
          <button type="button" className="primary-button" onClick={exportDocx} disabled={isExporting}>
            <Download size={18} />
            {isExporting ? '导出中...' : '导出 DOCX'}
          </button>
          <button type="button" className="secondary-button" onClick={exportRtf}>
            <FileText size={18} />
            备用 RTF
          </button>
          <button type="button" className="secondary-button" onClick={copyReport}>
            <Copy size={18} />
            复制报告
          </button>
          <button type="button" className="secondary-button" onClick={openPrintView}>
            <Printer size={18} />
            打印版
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="input-panel">
          <div className="panel-heading">
            <Search size={19} />
            <div>
              <h2>输入区</h2>
              <p>先填商品、链接和利润假设，右侧报告会同步更新。</p>
            </div>
          </div>

          <div className="step-card">
            <span>步骤 1</span>
            <h3>选择目标平台</h3>
            <div className="platform-switch">
              {(['Amazon', 'TikTok Shop'] as Platform[]).map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className={platforms.includes(platform) ? 'selected' : ''}
                  onClick={() => togglePlatform(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div className="step-card">
            <span>步骤 2</span>
            <h3>商品和竞品信息</h3>
            <label>
              商品名称
              <input
                value={form.productName}
                onChange={(event) => updateForm('productName', event.target.value)}
              />
            </label>
            <label>
              商品类目
              <input
                value={form.category}
                onChange={(event) => updateForm('category', event.target.value)}
              />
            </label>
            <label>
              商品链接
              <input
                value={form.productUrl}
                onChange={(event) => updateForm('productUrl', event.target.value)}
              />
            </label>
            <label>
              竞品链接
              <textarea
                rows={4}
                value={form.competitorUrls}
                onChange={(event) => updateForm('competitorUrls', event.target.value)}
              />
            </label>
            <label>
              商品卖点
              <textarea
                rows={4}
                value={form.sellingPoints}
                onChange={(event) => updateForm('sellingPoints', event.target.value)}
              />
            </label>
          </div>

          <div className="step-card">
            <span>步骤 3</span>
            <h3>利润测算假设</h3>
            <div className="money-grid">
              <label>
                售价 USD
                <input
                  inputMode="decimal"
                  value={form.salePriceUsd}
                  onChange={(event) => updateForm('salePriceUsd', event.target.value)}
                />
              </label>
              <label>
                采购成本 CNY
                <input
                  inputMode="decimal"
                  value={form.sourceCostCny}
                  onChange={(event) => updateForm('sourceCostCny', event.target.value)}
                />
              </label>
              <label>
                运费 USD
                <input
                  inputMode="decimal"
                  value={form.shippingUsd}
                  onChange={(event) => updateForm('shippingUsd', event.target.value)}
                />
              </label>
              <label>
                广告费 USD
                <input
                  inputMode="decimal"
                  value={form.adCostUsd}
                  onChange={(event) => updateForm('adCostUsd', event.target.value)}
                />
              </label>
              <label className="wide-field">
                人民币兑美元
                <input
                  inputMode="decimal"
                  value={form.exchangeRate}
                  onChange={(event) => updateForm('exchangeRate', event.target.value)}
                />
              </label>
            </div>
          </div>
        </aside>

        <section className="report-panel">
          <div className="report-toolbar">
            <div>
              <p className="eyebrow">中文运营报告</p>
              <h2>{form.productName}</h2>
              <p>{generatedAt}，目标市场：美国，平台：{report.platforms}</p>
            </div>
            <div className="export-status" role="status">
              <span>{exportStatus}</span>
              {manualDownload && (
                <a href={manualDownload.url} download={manualDownload.fileName}>
                  {manualDownload.label}
                </a>
              )}
            </div>
          </div>

          <div className="kpi-grid">
            <article>
              <span>机会判断</span>
              <strong>{report.decision}</strong>
              <p>{report.decisionSummary}</p>
            </article>
            <article>
              <span>准备度</span>
              <strong>{readinessScore}%</strong>
              <p>输入越完整，报告可信度越高。</p>
            </article>
            <article>
              <span>毛利率</span>
              <strong>{report.economics.margin.toFixed(1)}%</strong>
              <p>未含平台佣金、仓储和退货损耗。</p>
            </article>
            <article>
              <span>单件利润</span>
              <strong>{formatUsd(report.economics.profitUsd)}</strong>
              <p>售价减采购、物流和广告成本。</p>
            </article>
          </div>

          <div className="section-grid">
            <article className="report-card">
              <div className="card-heading">
                <ShieldCheck size={18} />
                <h3>一、机会结论</h3>
              </div>
              <p>
                当前商品在 {report.platforms} 的初步判断为 <strong>{report.decision}</strong>。
                {report.decisionSummary}
              </p>
              <div className="score-list">
                <span>Product Spy：{report.productSpyScore}/100</span>
                <span>Blue Ocean：{report.sourcingScore}/100</span>
                <span>Price Compare：{report.priceScore}/100</span>
                <span>Image Optimizer：{report.imageScore}/100</span>
              </div>
            </article>

            <article className="report-card">
              <div className="card-heading">
                <DollarSign size={18} />
                <h3>二、利润测算</h3>
              </div>
              <div className="economics-grid">
                <span>售价 {formatUsd(report.economics.salePriceUsd)}</span>
                <span>采购 {formatUsd(report.economics.sourceCostUsd)}</span>
                <span>运费 {formatUsd(report.economics.shippingUsd)}</span>
                <span>广告 {formatUsd(report.economics.adCostUsd)}</span>
                <span>总成本 {formatUsd(report.economics.totalCostUsd)}</span>
                <span>利润 {formatUsd(report.economics.profitUsd)}</span>
              </div>
            </article>
          </div>

          <article className="report-card">
            <div className="card-heading">
              <Sparkles size={18} />
              <h3>三、Skill 编排结果</h3>
            </div>
            <div className="skill-orchestrator">
              {skillModules.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.name} className="skill-node">
                    <div>
                      <Icon size={17} />
                      <strong>{item.role}</strong>
                    </div>
                    <span>{item.name}</span>
                    <p>{item.output}</p>
                    <em>{item.status}</em>
                  </div>
                )
              })}
            </div>
          </article>

          <div className="section-grid">
            <article className="report-card">
              <div className="card-heading">
                <BarChart3 size={18} />
                <h3>四、竞品洞察</h3>
              </div>
              <pre>{competitorBrief}</pre>
            </article>

            <article className="report-card">
              <div className="card-heading">
                <CheckCircle2 size={18} />
                <h3>五、下一步行动</h3>
              </div>
              <ol className="action-list">
                {report.nextActions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          </div>

          <div className="section-grid">
            <article className="report-card">
              <div className="card-heading">
                <FileText size={18} />
                <h3>六、英文 Listing 素材</h3>
              </div>
              <pre>{listingDraft}</pre>
            </article>

            <article className="report-card">
              <div className="card-heading">
                <Megaphone size={18} />
                <h3>七、英文 TikTok 素材</h3>
              </div>
              <pre>{adScript}</pre>
            </article>
          </div>

          <article className="risk-note">
            <strong>边界提醒</strong>
            <p>
              当前版本是前端 MVP，链接解析、竞品销量、社媒热度和服务商查询仍是模拟报告结构。
              真实上线前需要接入后端解析、AI 生成、汇率、价格比较和日志脱敏。
            </p>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
