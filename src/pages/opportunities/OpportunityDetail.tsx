import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore from '@/stores/useCrmStore'
import { formatDate, formatMoney } from '@/lib/utils'
import NotFound from '../NotFound'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { opps, accounts, activities } = useCrmStore()

  const opp = opps.find((o) => o.id === id)
  if (!opp) return <NotFound />

  const account = accounts.find((a) => a.id === opp.accountId)
  const oppActivities = activities.filter(
    (a) => a.relatedTo === 'Opportunity' && a.relatedId === id,
  )

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold">{opp.title}</h1>
          <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
            <Link
              to={`/contas/${account?.id}`}
              className="hover:underline hover:text-primary font-medium"
            >
              {account?.name}
            </Link>
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono text-primary">{formatMoney(opp.value)}</div>
          <div className="flex justify-end gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {opp.stage.replace('_', ' ')}
            </Badge>
            <Badge
              className={
                opp.temperature === 'quente'
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : opp.temperature === 'morna'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-500 hover:bg-blue-600'
              }
            >
              {opp.temperature}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="360" className="w-full">
        <TabsList className="bg-muted flex flex-wrap h-auto w-full justify-start gap-1 p-1">
          <TabsTrigger value="360">Visão 360º</TabsTrigger>
          <TabsTrigger value="meddic">Qualificação MEDDPICC</TabsTrigger>
          <TabsTrigger value="committee">Comitê de Compra</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="360" className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-subtle md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pipeline & Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Fechamento Previsto
                    </p>
                    <p className="font-semibold text-base mt-1">
                      {formatDate(opp.expectedCloseDate || opp.nextStepDate)}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Próximo Passo
                    </p>
                    <p className="font-semibold text-base mt-1 truncate" title={opp.nextStep}>
                      {opp.nextStep || '-'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Data Ação
                    </p>
                    <p className="font-semibold text-base mt-1">{formatDate(opp.nextStepDate)}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Parceiro
                    </p>
                    <p className="font-semibold text-base mt-1 uppercase">{opp.partner}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Detalhes Comerciais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Tipo de Venda
                    </p>
                    <p className="font-medium capitalize">{opp.saleType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Modalidade
                    </p>
                    <p className="font-medium capitalize">{opp.modality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Moeda
                    </p>
                    <p className="font-medium">{opp.currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Dono da Oportunidade
                    </p>
                    <p className="font-medium">{opp.opportunityOwnerId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Resumo MEDDPICC</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    Dor Identificada
                  </p>
                  <p className="font-medium line-clamp-2">
                    {opp.identifiedPain || (
                      <span className="text-muted-foreground italic">Não preenchido</span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    Impacto no Negócio
                  </p>
                  <p className="font-medium line-clamp-2">
                    {opp.businessImpact || (
                      <span className="text-muted-foreground italic">Não preenchido</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meddic" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Framework de Qualificação Detalhado</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Pain (Dor Identificada)</Label>
                <Textarea defaultValue={opp.identifiedPain} placeholder="Qual a dor principal?" />
              </div>
              <div className="space-y-2">
                <Label>Metrics / Business Impact</Label>
                <Textarea
                  defaultValue={opp.businessImpact}
                  placeholder="Quais os ganhos mensuráveis?"
                />
              </div>
              <div className="space-y-2">
                <Label>Decision Criteria (Critérios de Decisão)</Label>
                <Textarea
                  defaultValue={opp.decisionCriteria}
                  placeholder="Como eles avaliam a solução?"
                />
              </div>
              <div className="space-y-2">
                <Label>Decision Process (Processo de Decisão)</Label>
                <Textarea
                  defaultValue={opp.decisionProcess}
                  placeholder="Quais os passos até a compra?"
                />
              </div>
              <div className="space-y-2">
                <Label>Status de Orçamento (Budget)</Label>
                <Select defaultValue={opp.budgetStatus || 'nao_confirmado'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao_confirmado">Não Confirmado</SelectItem>
                    <SelectItem value="parcialmente_confirmado">Parcialmente Confirmado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="committee" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Análise do Comitê de Compra</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Champion (Campeão)</Label>
                <Select defaultValue={opp.championStatus || 'nao_identificado'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao_identificado">Não Identificado</SelectItem>
                    <SelectItem value="identificado">Identificado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Economic Buyer (Comprador Econômico)</Label>
                <Select defaultValue={opp.economicBuyerStatus || 'nao_identificado'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao_identificado">Não Identificado</SelectItem>
                    <SelectItem value="identificado">Identificado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Decision Maker (Tomador de Decisão)</Label>
                <Select defaultValue={opp.decisionMakerStatus || 'nao_identificado'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao_identificado">Não Identificado</SelectItem>
                    <SelectItem value="identificado">Identificado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card className="shadow-subtle">
            <CardContent className="pt-6">
              {oppActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma atividade registrada.
                </p>
              ) : (
                <div className="space-y-6">
                  {oppActivities.map((a) => (
                    <div key={a.id} className="flex gap-4">
                      <div className="w-24 text-sm text-muted-foreground shrink-0">
                        {formatDate(a.date)}
                      </div>
                      <div className="flex flex-col gap-1 pb-6 border-l pl-4 relative before:absolute before:left-[-5px] before:top-1 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                        <span className="font-medium">{a.type}</span>
                        <span className="text-sm">{a.summary}</span>
                        {a.outcome && (
                          <Badge variant="outline" className="w-fit mt-1">
                            {a.outcome}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
