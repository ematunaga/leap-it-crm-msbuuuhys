import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { Account, Contact } from '@/types'
import { Badge } from '@/components/ui/badge'

export function parseCSV(str: string): string[][] {
  const arr: string[][] = []
  let quote = false,
    row = 0,
    col = 0,
    c = 0
  for (; c < str.length; c++) {
    const cc = str[c],
      nc = str[c + 1]
    arr[row] = arr[row] || []
    arr[row][col] = arr[row][col] || ''
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc
      ++c
      continue
    }
    if (cc === '"') {
      quote = !quote
      continue
    }
    if (cc === ',' && !quote) {
      ++col
      continue
    }
    if (cc === '\r' && nc === '\n' && !quote) {
      ++row
      col = 0
      ++c
      continue
    }
    if (cc === '\n' && !quote) {
      ++row
      col = 0
      continue
    }
    if (cc === '\r' && !quote) {
      ++row
      col = 0
      continue
    }
    arr[row][col] += cc
  }
  return arr
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const ACCT_FIELDS = [
  { key: 'name', label: 'Razão Social', req: true },
  { key: 'tradingName', label: 'Nome Fantasia' },
  { key: 'cnpj', label: 'CNPJ' },
  { key: 'email', label: 'E-mail' },
  { key: 'phone', label: 'Telefone' },
  { key: 'segment', label: 'Segmento' },
  { key: 'website', label: 'Website' },
]

const CONT_FIELDS = [
  { key: 'name', label: 'Nome Completo', req: true },
  { key: 'email', label: 'E-mail', req: true },
  { key: 'phone', label: 'Telefone' },
  { key: 'position', label: 'Cargo' },
  { key: 'accountName', label: 'Nome da Conta (Matriz/Filial)' },
]

export function ImportDataModal({
  isOpen,
  onClose,
  entityType,
}: {
  isOpen: boolean
  onClose: () => void
  entityType: 'account' | 'contact'
}) {
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'importing' | 'result'>(
    'upload',
  )
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [previewData, setPreviewData] = useState<any[]>([])
  const [rowErrors, setRowErrors] = useState<Record<number, string[]>>({})
  const [importedCount, setImportedCount] = useState(0)

  const { toast } = useToast()
  const { accounts, contacts, bulkAddAccounts, bulkAddContacts } = useCrmStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fields = entityType === 'account' ? ACCT_FIELDS : CONT_FIELDS

  const reset = () => {
    setStep('upload')
    setFile(null)
    setCsvData([])
    setHeaders([])
    setMapping({})
    setPreviewData([])
    setRowErrors({})
    setImportedCount(0)
  }
  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  const parseFile = () => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length < 2)
        return toast({
          title: 'Arquivo inválido',
          description: 'O CSV deve ter ao menos cabeçalho e uma linha.',
          variant: 'destructive',
        })
      const rawHeaders = parsed[0].map((h) => h.trim())
      setHeaders(rawHeaders)
      setCsvData(parsed)

      const initialMapping: Record<string, string> = {}
      rawHeaders.forEach((h) => {
        const norm = normalize(h)
        fields.forEach((f) => {
          if (normalize(f.label).includes(norm) || norm.includes(normalize(f.key)))
            initialMapping[f.key] = h
        })
      })
      setMapping(initialMapping)
      setStep('mapping')
    }
    reader.readAsText(file)
  }

  const analyze = () => {
    const rows = csvData.slice(1)
    const prev: any[] = []
    const errs: Record<number, string[]> = {}

    const existingCnpjs = new Set<string>()
    accounts.forEach((a) => {
      if (a.cnpj) existingCnpjs.add(a.cnpj.replace(/\D/g, ''))
      if (a.branches && Array.isArray(a.branches))
        a.branches.forEach((b: any) => {
          if (b.cnpj) existingCnpjs.add(b.cnpj.replace(/\D/g, ''))
        })
    })

    const existingEmails = new Set(contacts.map((c) => c.email?.toLowerCase()).filter(Boolean))
    const newCnpjs = new Set<string>(),
      newEmails = new Set<string>()

    rows.forEach((row, i) => {
      if (row.length === 1 && !row[0]) return
      const obj: any = {}
      fields.forEach((f) => {
        const headerIdx = headers.indexOf(mapping[f.key])
        if (headerIdx !== -1) obj[f.key] = row[headerIdx]?.trim() || ''
      })

      const lineErrors: string[] = []
      if (entityType === 'account') {
        if (!obj.name) lineErrors.push('Razão Social obrigatória')
        if (obj.cnpj) {
          const cleanCnpj = obj.cnpj.replace(/\D/g, '')
          if (existingCnpjs.has(cleanCnpj)) lineErrors.push('CNPJ já existe')
          else if (newCnpjs.has(cleanCnpj)) lineErrors.push('CNPJ duplicado no arquivo')
          else newCnpjs.add(cleanCnpj)
        }
      } else {
        if (!obj.name) lineErrors.push('Nome obrigatório')
        if (!obj.email) lineErrors.push('E-mail obrigatório')
        else {
          const email = obj.email.toLowerCase()
          if (existingEmails.has(email)) lineErrors.push('E-mail já existe na base')
          else if (newEmails.has(email)) lineErrors.push('E-mail duplicado no arquivo')
          else newEmails.add(email)
        }
        if (obj.accountName) {
          const acc = accounts.find(
            (a) =>
              normalize(a.name) === normalize(obj.accountName) ||
              normalize(a.tradingName || '') === normalize(obj.accountName),
          )
          if (acc) obj.accountId = acc.id
          else lineErrors.push(`Conta não encontrada`)
        }
      }
      prev.push(obj)
      if (lineErrors.length > 0) errs[i] = lineErrors
    })

    setPreviewData(prev)
    setRowErrors(errs)
    setStep('preview')
  }

  const handleImport = async () => {
    setStep('importing')
    const validRows = previewData.filter((_, i) => !rowErrors[i])
    try {
      if (validRows.length > 0) {
        if (entityType === 'account') await bulkAddAccounts(validRows as Omit<Account, 'id'>[])
        else await bulkAddContacts(validRows as Omit<Contact, 'id'>[])
      }
      setImportedCount(validRows.length)
      setStep('result')
    } catch (e) {
      toast({ title: 'Erro ao importar', variant: 'destructive' })
      setStep('preview')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Importar {entityType === 'account' ? 'Contas' : 'Contatos'}</DialogTitle>
          <DialogDescription>Siga as etapas para importar seus dados via CSV.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-muted/20">
              <Upload className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Selecione um arquivo CSV (separado por vírgulas)
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Escolher Arquivo
                </Button>
                <Button disabled={!file} onClick={parseFile}>
                  Próximo
                </Button>
              </div>
              {file && <p className="text-xs font-medium mt-3 text-primary">{file.name}</p>}
            </div>
          )}

          {step === 'mapping' && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-muted p-3 rounded-md text-sm mb-2">
                Relacione as colunas do seu arquivo com os campos do sistema.
              </div>
              {fields.map((f) => (
                <div key={f.key} className="grid grid-cols-2 gap-4 items-center border-b pb-2">
                  <Label className="text-sm">
                    {f.label} {f.req && <span className="text-destructive">*</span>}
                  </Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    value={mapping[f.key] || ''}
                    onChange={(e) => setMapping({ ...mapping, [f.key]: e.target.value })}
                  >
                    <option value="">-- Ignorar campo --</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="flex justify-end pt-4 gap-2">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Voltar
                </Button>
                <Button onClick={analyze}>Analisar Dados</Button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                <div>
                  <p className="text-sm font-semibold">Resumo da Validação</p>
                  <p className="text-xs text-muted-foreground">
                    Válidos: {previewData.length - Object.keys(rowErrors).length} | Com erros:{' '}
                    {Object.keys(rowErrors).length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep('mapping')}>
                    Voltar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleImport}
                    disabled={previewData.length - Object.keys(rowErrors).length === 0}
                  >
                    Importar Válidos
                  </Button>
                </div>
              </div>
              <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0 shadow-sm">
                    <tr>
                      <th className="p-2 text-left w-8 border-b">#</th>
                      <th className="p-2 text-left border-b">Status</th>
                      <th className="p-2 text-left border-b">Nome Principal</th>
                      <th className="p-2 text-left border-b">Detalhes do Erro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => {
                      const errs = rowErrors[i]
                      return (
                        <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30">
                          <td className="p-2 text-muted-foreground">{i + 1}</td>
                          <td className="p-2">
                            {errs ? (
                              <Badge variant="destructive" className="text-[10px] py-0">
                                Erro
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500 text-[10px] py-0">Ok</Badge>
                            )}
                          </td>
                          <td className="p-2 font-medium text-xs">{row.name || '-'}</td>
                          <td className="p-2 text-destructive text-[10px]">
                            {errs ? errs.join(', ') : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p>Processando importação...</p>
            </div>
          )}

          {step === 'result' && (
            <div className="flex flex-col items-center justify-center p-10 space-y-4 text-center">
              <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold">Importação Concluída</h3>
              <p className="text-muted-foreground">
                {importedCount} registros foram importados com sucesso.
              </p>
              <Button onClick={handleClose} className="mt-4">
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
