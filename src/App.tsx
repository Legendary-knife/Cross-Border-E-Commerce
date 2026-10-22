import {
  ArrowRight,
  BarChart3,
  Camera,
  DollarSign,
  Download,
  Factory,
  FileText,
  Globe2,
  Link2,
  Megaphone,
  PackageSearch,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Platform = 'Amazon' | 'TikTok Shop'
type OutputType = 'analysis' | 'listing' | 'ads' | 'opportunity'

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

const workflow = [
  {
    title: '链接解析',
    note: '把 Amazon 和 TikTok Shop 链接转成商品基础信息。',
    icon: Link2,
  },
  {
    title: '竞品解读',
    note: '提取价格带、卖点、评价痛点和关键词缺口。',
    icon: BarChart3,
  },
  {
    title: '本地化素材',
    note: '基于同一份商品信息生成美国市场 Listing 和短视频脚本。',
    icon: Globe2,
  },
]

const requirementCards = [
  {
    id: 'FR-01',
    title: '项目录入',
    text: '单用户工作台，聚焦一个商品、美国市场、Amazon 和 TikTok Shop。',
  },
  {
    id: 'FR-02',
    title: '链接优先',
    text: '商品链接和竞品链接是主要输入，手动粘贴信息作为兜底。',
  },
  {
    id: 'FR-03',
    title: '结果可编辑',
    text: '生成内容可以重新生成、复制、编辑，并导出为 Word 可打开的 RTF 文件。',
  },
]

const skillModules = [
  {
    name: 'Product Spy',
    role: '趋势信号',
    note: '在写文案前先看社媒热度和竞品信号。',
    icon: PackageSearch,
  },
  {
    name: 'Blue Ocean',
    role: '蓝海判断',
    note: '评估差异化、工厂质量和利润空间。',
    icon: Factory,
  },
  {
    name: 'Price Compare',
    role: '价格比较',
    note: '把不同市场价格统一成美元，辅助判断价格带。',
    icon: DollarSign,
  },
  {
    name: 'Image Optimizer',
    role: '图片检查',
    note: '提示主图比例、白底图和 Amazon 图片尺寸要求。',
    icon: Camera,
  },
  {
    name: 'MJZJ SP',
    role: '服务商跟进',
    note: '把物流、海外仓、服务商搜索整理成后续任务。',
    icon: Truck,
  },
  {
    name: 'Listing Generator',
    role: '文案规则',
    note: '按 Amazon 标题、五点、关键词和卖点限制组织文案。',
    icon: FileText,
  },
]

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'manual input'
  }
}

function splitCompetitors(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
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

function createAnalysis(form: FormState) {
  const competitors = splitCompetitors(form.competitorUrls)
  const domains = competitors.map(getDomain).join(', ') || 'manual competitor set'
  const economics = calculateEconomics(form)

  return `Competitor analysis for ${form.productName}

Market: United States
Platforms: Amazon, TikTok Shop
Category: ${form.category}
Source coverage: ${domains}
Skill stack used: Product Spy, Global Price Comparison, Exchange Rate, Blue Ocean Sourcing

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
- Lead with a proof-backed portability claim
- Add usage boundaries instead of overpromising
- Show cleaning and leak testing in video assets
- Use Amazon copy for specifications and TikTok copy for demonstration

Economics snapshot
- Target sale price: ${formatUsd(economics.salePriceUsd)}
- Estimated total cost: ${formatUsd(economics.totalCostUsd)}
- Estimated profit: ${formatUsd(economics.profitUsd)}
- Margin: ${economics.margin.toFixed(1)}%
- Decision: ${economics.status}`
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

function createAds(form: FormState) {
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

function createOpportunity(form: FormState) {
  const economics = calculateEconomics(form)
  const competitors = splitCompetitors(form.competitorUrls)
  const competitionLevel =
    competitors.length >= 4 ? 'red ocean watch' : competitors.length >= 2 ? 'yellow ocean' : 'blue ocean candidate'

  return `Skill-assisted opportunity brief

Product
${form.productName}

Decision
${economics.status}

Why this product is worth testing
- Product Spy: treat this as a trend candidate only after checking recent social mentions and at least two independent sources.
- Global Price Comparison: use US Amazon as the first price anchor, then compare TikTok Shop and overseas marketplace spread before locking retail price.
- Exchange Rate: current calculation uses ${form.exchangeRate} CNY per USD. Update it before supplier negotiation.
- Blue Ocean Sourcing: prioritize factory capability, defect rate, and product improvement support instead of lowest unit cost only.
- Listing Image Optimizer: MAIN image should be square, white background, ideally 2000 x 2000 px before Amazon upload.
- MJZJ SP: search logistics providers for US line haul, FBA prep, and return handling after sample validation.

Pricing model
- Target sale price: ${formatUsd(economics.salePriceUsd)}
- Source cost converted to USD: ${formatUsd(economics.sourceCostUsd)}
- Estimated total cost: ${formatUsd(economics.totalCostUsd)}
- Estimated profit: ${formatUsd(economics.profitUsd)}
- Estimated margin: ${economics.margin.toFixed(1)}%

Competition status
- Competitor links supplied: ${competitors.length}
- Current gate: ${competitionLevel}
- Data rule: do not claim sales volume or review counts until the parser connects to verified sources.

Next actions
- Verify exact model or variant before comparing prices.
- Ask suppliers for MOQ, defect-rate guarantee, packaging specs, and sample lead time.
- Prepare Amazon Listing and TikTok demo script from the same approved claim set.
- Audit hero image ratio before publishing.
- Export this brief as a Word-readable file and use it as the product testing worksheet.`
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

function createWordRtf(form: FormState, output: string) {
  const lines = output.split('\n')
  const body = lines
    .map((line) => {
      const trimmed = line.trim()

      if (!trimmed) {
        return '\\par'
      }

      if (trimmed.startsWith('- ')) {
        return `\\pard\\li360\\fi-180\\bullet\\tab ${encodeRtfText(trimmed.slice(2))}\\par`
      }

      const isHeading =
        !trimmed.endsWith('.') &&
        !trimmed.includes(':') &&
        trimmed.length <= 42

      if (isHeading) {
        return `\\pard\\sa120\\b ${encodeRtfText(trimmed)}\\b0\\par`
      }

      return `\\pard\\sa80 ${encodeRtfText(trimmed)}\\par`
    })
    .join('\n')

  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0 Arial;}}
\\f0\\fs24
\\pard\\sa180\\b\\fs34 ${encodeRtfText(`${form.productName} AI Growth Package`)}\\b0\\fs24\\par
\\pard\\sa240\\b Market:\\b0 United States | \\b Platforms:\\b0 Amazon, TikTok Shop | \\b Export:\\b0 Word RTF\\par
${body}
}`
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
  const [platform, setPlatform] = useState<Platform>('Amazon')
  const [activeOutput, setActiveOutput] = useState<OutputType>('analysis')
  const [drafts, setDrafts] = useState<Partial<Record<OutputType, string>>>({})
  const [generatedAt, setGeneratedAt] = useState('草稿已就绪')
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('点击“导出 Word”保存当前输出内容。')
  const [manualDownload, setManualDownload] = useState<ManualDownload | null>(null)

  const competitors = useMemo(
    () => splitCompetitors(form.competitorUrls),
    [form.competitorUrls],
  )

  const generatedOutput = useMemo(() => {
    if (activeOutput === 'analysis') {
      return createAnalysis(form)
    }

    if (activeOutput === 'listing') {
      return createListing(form)
    }

    if (activeOutput === 'ads') {
      return createAds(form)
    }

    return createOpportunity(form)
  }, [activeOutput, form])

  const completionScore = Math.min(
    100,
    25 +
      (form.productName ? 15 : 0) +
      (form.productUrl ? 20 : 0) +
      (competitors.length ? 25 : 0) +
      (form.sellingPoints ? 15 : 0),
  )

  const economics = calculateEconomics(form)
  const visibleOutput = drafts[activeOutput] ?? generatedOutput

  useEffect(() => {
    return () => {
      if (manualDownload) {
        URL.revokeObjectURL(manualDownload.url)
      }
    }
  }, [manualDownload])

  function setManualDownloadBlob(blob: Blob, fileName: string) {
    setManualDownload((current) => {
      if (current) {
        URL.revokeObjectURL(current.url)
      }

      return {
        url: URL.createObjectURL(blob),
        fileName,
      }
    })
  }

  function updateForm(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setDrafts({})
  }

  function regenerate() {
    setGeneratedAt(`生成于 ${new Date().toLocaleTimeString()}`)
    setDrafts((current) => {
      const next = { ...current }
      delete next[activeOutput]
      return next
    })
  }

  function exportWord() {
    const fileName = `${sanitizeFileName(form.productName) || 'ai-export'}.rtf`
    setIsExporting(true)
    setExportStatus('正在准备 Word 文件...')

    try {
      const rtf = createWordRtf(form, visibleOutput)
      const blob = new Blob([rtf], { type: 'application/rtf;charset=utf-8' })
      setManualDownloadBlob(blob, fileName)
      downloadBlob(blob, fileName)
      setExportStatus(`Word 文件已生成：${fileName}。如果浏览器没有自动下载，请点下面的手动下载链接。`)
    } catch (error) {
      setExportStatus('Word 导出失败。可以先复制右侧编辑框内容作为兜底。')
      console.error('Word export failed', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">跨境电商 AI MVP</p>
          <h1>面向美国市场的跨境电商 AI 增长工作台</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="icon-button" title="重新生成" onClick={regenerate}>
            <RefreshCcw size={18} />
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={exportWord}
            disabled={isExporting}
          >
            <Download size={18} />
            {isExporting ? '导出中...' : '导出 Word'}
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="input-panel">
          <div className="panel-heading">
            <Search size={19} />
            <div>
              <h2>项目信息</h2>
              <p>优先输入 Amazon 和 TikTok Shop 链接，手动信息作为兜底。</p>
            </div>
          </div>

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

          <label>
            输出语气
            <select value={form.tone} onChange={(event) => updateForm('tone', event.target.value)}>
              <option value="Direct response">直接转化型</option>
              <option value="Premium retail">高端零售型</option>
              <option value="Creator-style casual">达人口播型</option>
            </select>
          </label>

          <div className="input-subsection">
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

        <section className="center-panel">
          <div className="preview-visual">
            <div className="commerce-visual" aria-label="跨境电商 AI 工作台预览">
              <div className="visual-toolbar">
                <span />
                <span />
                <span />
              </div>
              <div className="visual-product">
                <div className="bottle-cap" />
                <div className="bottle-body">
                  <Sparkles size={26} />
                </div>
              </div>
              <div className="visual-card card-a">
                <strong>4.6</strong>
                <span>评价信号</span>
              </div>
              <div className="visual-card card-b">
                <strong>$34</strong>
                <span>价格带</span>
              </div>
              <div className="visual-bars">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="preview-copy">
              <p className="eyebrow">MVP 范围</p>
              <h2>从链接到可销售文案的单用户工作流</h2>
              <p>
                首版聚焦一个商品、一个美国市场、Amazon 和 TikTok Shop 两个平台。
                所有 AI 输出都先由用户确认，再导出交付。
              </p>
            </div>
          </div>

          <div className="status-row">
            <div>
              <span>机会评分</span>
              <strong>{completionScore}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${completionScore}%` }} />
            </div>
          </div>

          <div className="economics-strip">
            <div>
              <span>判断</span>
              <strong>{formatStatus(economics.status)}</strong>
            </div>
            <div>
              <span>毛利率</span>
              <strong>{economics.margin.toFixed(1)}%</strong>
            </div>
            <div>
              <span>利润</span>
              <strong>{formatUsd(economics.profitUsd)}</strong>
            </div>
            <div>
              <span>总成本</span>
              <strong>{formatUsd(economics.totalCostUsd)}</strong>
            </div>
          </div>

          <div className="platform-switch" aria-label="平台选择">
            {(['Amazon', 'TikTok Shop'] as Platform[]).map((item) => (
              <button
                key={item}
                type="button"
                className={platform === item ? 'selected' : ''}
                onClick={() => setPlatform(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flow-list">
            {workflow.map((step, index) => {
              const Icon = step.icon
              return (
                <div className="flow-item" key={step.title}>
                  <div className="flow-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.note}</p>
                  </div>
                  {index < workflow.length - 1 && <ArrowRight className="flow-arrow" size={18} />}
                </div>
              )
            })}
          </div>

          <div className="requirements-grid">
            {requirementCards.map((item) => (
              <article key={item.id}>
                <span>{item.id}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="skill-grid">
            {skillModules.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.name}>
                  <div className="skill-icon">
                    <Icon size={17} />
                  </div>
                  <span>{item.role}</span>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </article>
              )
            })}
          </div>
        </section>

        <aside className="output-panel">
          <div className="panel-heading">
            <Sparkles size={19} />
            <div>
              <h2>AI 输出</h2>
              <p>{generatedAt}</p>
            </div>
          </div>

          <div className="output-tabs">
            <button
              type="button"
              className={activeOutput === 'analysis' ? 'selected' : ''}
              onClick={() => setActiveOutput('analysis')}
            >
              <BarChart3 size={16} />
              竞品分析
            </button>
            <button
              type="button"
              className={activeOutput === 'listing' ? 'selected' : ''}
              onClick={() => setActiveOutput('listing')}
            >
              <FileText size={16} />
              Listing 文案
            </button>
            <button
              type="button"
              className={activeOutput === 'ads' ? 'selected' : ''}
              onClick={() => setActiveOutput('ads')}
            >
              <Megaphone size={16} />
              广告脚本
            </button>
            <button
              type="button"
              className={activeOutput === 'opportunity' ? 'selected' : ''}
              onClick={() => setActiveOutput('opportunity')}
            >
              <ShieldCheck size={16} />
              机会简报
            </button>
          </div>

          <div className="output-meta">
            <span>目标市场：美国</span>
            <span>平台重点：{platform}</span>
          </div>

          <div className="export-status" role="status">
            <span>{exportStatus}</span>
            {manualDownload && (
              <a href={manualDownload.url} download={manualDownload.fileName}>
                手动下载 Word 文件
              </a>
            )}
          </div>

          <textarea
            className="output-editor"
            value={visibleOutput}
            onChange={(event) =>
              setDrafts((current) => ({
                ...current,
                [activeOutput]: event.target.value,
              }))
            }
            aria-label="AI 生成结果编辑区"
          />

          <div className="risk-note">
            <strong>MVP 边界提醒</strong>
            <p>
              当前原型只辅助生成和整理内容，不会自动发布到店铺，也不替代平台合规审核。
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
