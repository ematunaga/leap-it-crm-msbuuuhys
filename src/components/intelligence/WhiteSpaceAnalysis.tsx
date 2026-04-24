import { useState } from 'react'
import { Map, ChevronDown, ChevronUp, ExternalLink, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Link } from 'react-router-dom'
import useCrmStore from '@/stores/useCrmStore'
import { useRBAC } from '@/hooks/use-rbac'
import type { Account } from '@/types'

export function WhiteSpaceAnalysis() {
  const { accounts, updateAccount } = useCrmStore()
  const { can } = useRBAC()
  const canEdit = can('accounts', 'edit')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  // Only show accounts with white space notes OR accounts with no notes (potential opportunities)
  const accountsWithWhiteSpace = (accounts ?? []).filter(a => a.whiteSpaceNotes)
  const accountsWithoutAnalysis = (accounts ?? []).filter(a => !a.whiteSpaceNotes)

  const handleSave = async (account: Account) => {
    await updateAccount(account.id, { whiteSpaceNotes: editValue } as Partial<Account>)
    setEditingId(null)
    setEditValue('')
  }

  const startEdit = (account: Account) => {
    setEditingId(account.id)
    setEditValue(account.whiteSpaceNotes ?? '')
    setExpanded(account.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-400" />
            White Space Analysis
          </h2>
          <p className="text-sm text-muted-foreground">Oportunidades nao exploradas por account</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{accountsWithWhiteSpace.length} com analise</Badge>
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">{accountsWithoutAnalysis.length} sem analise</Badge>
        </div>
      </div>

      {/* Accounts with white space notes */}
      {accountsWithWhiteSpace.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Analise Documentada</h3>
          {accountsWithWhiteSpace.map(account => (
            <Card key={account.id} className="border-border bg-card">
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(e => e === account.id ? null : account.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="font-medium text-white">{account.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {account.accountTier && <span className="mr-2">Tier: {account.accountTier}</span>}
                        {account.segment && <span>Seg: {account.segment}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="ghost" className="h-7 px-2" onClick={e => e.stopPropagation()}>
                      <Link to={`/accounts/${account.id}`}><ExternalLink className="h-3 w-3" /></Link>
                    </Button>
                    {expanded === account.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </CardHeader>
              {expanded === account.id && (
                <CardContent className="pt-0">
                  {editingId === account.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        rows={4}
                        placeholder="Documente oportunidades nao exploradas..."
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSave(account)}>Salvar</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{account.whiteSpaceNotes}</p>
                      {canEdit && (
                        <Button size="sm" variant="outline" onClick={() => startEdit(account)}>Editar Analise</Button>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Accounts pending analysis */}
      {accountsWithoutAnalysis.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pendente de Analise ({accountsWithoutAnalysis.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accountsWithoutAnalysis.slice(0, 10).map(account => (
              <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border border-border border-dashed opacity-60 hover:opacity-100 transition-opacity">
                <div>
                  <div className="text-sm font-medium text-white">{account.name}</div>
                  <div className="text-xs text-muted-foreground">{account.accountTier && `Tier: ${account.accountTier}`}</div>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => startEdit(account)}>+ Analise</Button>
                  )}
                  <Button asChild size="sm" variant="ghost" className="h-7 px-2">
                    <Link to={`/accounts/${account.id}`}><ExternalLink className="h-3 w-3" /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {accountsWithoutAnalysis.length > 10 && (
            <p className="text-xs text-muted-foreground text-center">+ {accountsWithoutAnalysis.length - 10} accounts sem analise</p>
          )}
        </div>
      )}

      {accounts?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Map className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhuma account disponivel para analise.</p>
        </div>
      )}
    </div>
  )
}
