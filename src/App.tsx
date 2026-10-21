import {
  ArrowRight,
  BarChart3,
  Download,
  FileText,
  Globe2,
  Link2,
  Megaphone,
  RefreshCcw,
  Search,
  Sparkles,
} from 'lucide-react'
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'
import { useMemo, useState } from 'react'
import './App.css'

type Platform = 'Amazon' | 'TikTok Shop'
type OutputType = 'analysis' | 'listing' | 'ads'

type FormState = {
  productName: string
  category: string
  productUrl: string
  competitorUrls: string
  sellingPoints: string
  tone: string
}

type FileSavePickerOptions = {
  suggestedName?: string
  types?: Array<{
    description: string
    accept: Record<string, string[]>
  }>
}

type WritableFileHandle = {
  createWritable: () => Promise<{
    write: (data: Blob) => Promise<void>
    close: () => Promise<void>
  }>
}

type WindowWithFilePicker = Window &
  typeof globalThis & {
    showSaveFilePicker?: (options: FileSavePickerOptions) => Promise<WritableFileHandle>
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
}

const workflow = [
  {
    title: 'Link parsing',
    note: 'Amazon and TikTok Shop URLs are converted into product facts.',
    icon: Link2,
  },
  {
    title: 'Competitor readout',
    note: 'The system extracts price range, claims, review pain points, and keyword gaps.',
    icon: BarChart3,
  },
  {
    title: 'Localized assets',
    note: 'US-market Listing copy and short-form ad scripts are generated from the same project source.',
    icon: Globe2,
  },
]

const requirementCards = [
  {
    id: 'FR-01',
    title: 'Project intake',
    text: 'Single-user project workspace for one product, US market, Amazon and TikTok Shop.',
  },
  {
    id: 'FR-02',
    title: 'Link-first input',
    text: 'Product and competitor links are the primary input. Manual pasted facts remain the fallback.',
  },
  {
    id: 'FR-03',
    title: 'Editable AI output',
    text: 'Generated content can be regenerated, copied, edited, and exported as a real DOCX file.',
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

function createAnalysis(form: FormState) {
  const competitors = splitCompetitors(form.competitorUrls)
  const domains = competitors.map(getDomain).join(', ') || 'manual competitor set'

  return `Competitor analysis for ${form.productName}

Market: United States
Platforms: Amazon, TikTok Shop
Category: ${form.category}
Source coverage: ${domains}

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
- Use Amazon copy for specifications and TikTok copy for demonstration`
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

function createOutputParagraphs(output: string) {
  return output.split('\n').map((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      return new Paragraph({ text: '', spacing: { after: 120 } })
    }

    if (trimmed.startsWith('- ')) {
      return new Paragraph({
        text: trimmed.slice(2),
        bullet: { level: 0 },
        spacing: { after: 80 },
      })
    }

    const isSectionHeading =
      !trimmed.endsWith('.') &&
      !trimmed.includes(':') &&
      trimmed.length <= 42

    if (isSectionHeading) {
      return new Paragraph({
        text: trimmed,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 220, after: 100 },
      })
    }

    return new Paragraph({
      children: [new TextRun(trimmed)],
      spacing: { after: 100 },
    })
  })
}

function createDocxDocument(form: FormState, output: string) {
  return new Document({
    creator: 'Cross-Border-E-Commerce MVP',
    title: `${form.productName} AI Growth Package`,
    description: 'AI-generated ecommerce competitor analysis and localized marketing assets.',
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `${form.productName} AI Growth Package`,
            heading: HeadingLevel.TITLE,
            spacing: { after: 180 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Market: ', bold: true }),
              new TextRun('United States'),
              new TextRun({ text: ' | Platforms: ', bold: true }),
              new TextRun('Amazon, TikTok Shop'),
              new TextRun({ text: ' | Export: ', bold: true }),
              new TextRun('DOCX'),
            ],
            spacing: { after: 260 },
          }),
          ...createOutputParagraphs(output),
        ],
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

function getFilePicker() {
  return (window as WindowWithFilePicker).showSaveFilePicker
}

function App() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [platform, setPlatform] = useState<Platform>('Amazon')
  const [activeOutput, setActiveOutput] = useState<OutputType>('analysis')
  const [drafts, setDrafts] = useState<Partial<Record<OutputType, string>>>({})
  const [generatedAt, setGeneratedAt] = useState('Draft ready')
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('Choose Export DOCX to save the current tab output.')

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

    return createAds(form)
  }, [activeOutput, form])

  const completionScore = Math.min(
    100,
    25 +
      (form.productName ? 15 : 0) +
      (form.productUrl ? 20 : 0) +
      (competitors.length ? 25 : 0) +
      (form.sellingPoints ? 15 : 0),
  )

  const visibleOutput = drafts[activeOutput] ?? generatedOutput

  function updateForm(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setDrafts({})
  }

  function regenerate() {
    setGeneratedAt(`Generated at ${new Date().toLocaleTimeString()}`)
    setDrafts((current) => {
      const next = { ...current }
      delete next[activeOutput]
      return next
    })
  }

  async function exportWord() {
    const fileName = `${sanitizeFileName(form.productName) || 'ai-export'}.docx`
    const filePicker = getFilePicker()

    setIsExporting(true)
    setExportStatus('Preparing DOCX export...')

    try {
      if (filePicker) {
        const fileHandle = await filePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'Word document',
              accept: {
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                  '.docx',
                ],
              },
            },
          ],
        })
        const document = createDocxDocument(form, visibleOutput)
        const blob = await Packer.toBlob(document)
        const writable = await fileHandle.createWritable()
        await writable.write(blob)
        await writable.close()
        setExportStatus(`Saved ${fileName}`)
        return
      }

      const document = createDocxDocument(form, visibleOutput)
      const blob = await Packer.toBlob(document)
      downloadBlob(blob, fileName)
      setExportStatus(`Download started: ${fileName}`)
    } catch (error) {
      const isCanceled =
        error instanceof DOMException && error.name === 'AbortError'

      setExportStatus(isCanceled ? 'Export canceled.' : 'Export failed. Check browser download permission.')

      if (!isCanceled) {
        console.error('DOCX export failed', error)
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cross-border AI MVP</p>
          <h1>AI growth workspace for US ecommerce operators</h1>
        </div>
        <div className="topbar-actions">
          <button type="button" className="icon-button" title="Regenerate" onClick={regenerate}>
            <RefreshCcw size={18} />
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={exportWord}
            disabled={isExporting}
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Export DOCX'}
          </button>
        </div>
      </header>

      <section className="workspace">
        <aside className="input-panel">
          <div className="panel-heading">
            <Search size={19} />
            <div>
              <h2>Project input</h2>
              <p>Amazon and TikTok Shop links first, manual facts as fallback.</p>
            </div>
          </div>

          <label>
            Product name
            <input
              value={form.productName}
              onChange={(event) => updateForm('productName', event.target.value)}
            />
          </label>

          <label>
            Category
            <input
              value={form.category}
              onChange={(event) => updateForm('category', event.target.value)}
            />
          </label>

          <label>
            Product link
            <input
              value={form.productUrl}
              onChange={(event) => updateForm('productUrl', event.target.value)}
            />
          </label>

          <label>
            Competitor links
            <textarea
              rows={4}
              value={form.competitorUrls}
              onChange={(event) => updateForm('competitorUrls', event.target.value)}
            />
          </label>

          <label>
            Product facts
            <textarea
              rows={4}
              value={form.sellingPoints}
              onChange={(event) => updateForm('sellingPoints', event.target.value)}
            />
          </label>

          <label>
            Output tone
            <select value={form.tone} onChange={(event) => updateForm('tone', event.target.value)}>
              <option>Direct response</option>
              <option>Premium retail</option>
              <option>Creator-style casual</option>
            </select>
          </label>
        </aside>

        <section className="center-panel">
          <div className="preview-visual">
            <div className="commerce-visual" aria-label="Ecommerce AI workspace preview">
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
                <span>Review signal</span>
              </div>
              <div className="visual-card card-b">
                <strong>$34</strong>
                <span>Price band</span>
              </div>
              <div className="visual-bars">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="preview-copy">
              <p className="eyebrow">MVP scope</p>
              <h2>Single-user workflow from links to sellable copy</h2>
              <p>
                The first version focuses on one product, one market, and two platforms. The user
                reviews every AI output before export.
              </p>
            </div>
          </div>

          <div className="status-row">
            <div>
              <span>Input readiness</span>
              <strong>{completionScore}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${completionScore}%` }} />
            </div>
          </div>

          <div className="platform-switch" aria-label="Platform selector">
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
        </section>

        <aside className="output-panel">
          <div className="panel-heading">
            <Sparkles size={19} />
            <div>
              <h2>AI output</h2>
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
              Analysis
            </button>
            <button
              type="button"
              className={activeOutput === 'listing' ? 'selected' : ''}
              onClick={() => setActiveOutput('listing')}
            >
              <FileText size={16} />
              Listing
            </button>
            <button
              type="button"
              className={activeOutput === 'ads' ? 'selected' : ''}
              onClick={() => setActiveOutput('ads')}
            >
              <Megaphone size={16} />
              Ads
            </button>
          </div>

          <div className="output-meta">
            <span>Market: United States</span>
            <span>Platform focus: {platform}</span>
          </div>

          <div className="export-status" role="status">
            {exportStatus}
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
            aria-label="Generated AI output"
          />

          <div className="risk-note">
            <strong>MVP guardrail</strong>
            <p>
              The prototype flags content for human review. It does not publish to stores or make
              final platform compliance decisions.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
