import { useParams } from 'react-router-dom'
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
import { formatMoney } from '@/lib/utils'
import NotFound from '../NotFound'

export default function OpportunityDetail() {
  const { id } = useParams()
  const { opps, accounts } = useCrmStore()

  const opp = opps.find((o) => o.id === id)
  if (!opp) return <NotFound />

  const account = accounts.find((a) => a.id === opp.accountId)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold">{opp.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{account?.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{formatMoney(opp.value)}</div>
          <div className="flex justify-end gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {opp.stage.replace('_', ' ')}
            </Badge>
            <Badge
              className={
                opp.temperature === 'quente'
                  ? 'bg-rose-500'
                  : opp.temperature === 'morna'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
              }
            >
              {opp.temperature}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="meddic" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="info">Detalhes Gerais</TabsTrigger>
          <TabsTrigger value="meddic">Qualificação MEDDPICC</TabsTrigger>
          <TabsTrigger value="committee">Comitê de Compra</TabsTrigger>
        </TabsList>

        <TabsContent value="meddic" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Framework de Qualificação</CardTitle>
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

        <TabsContent value="info" className="mt-4 space-y-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 max-w-xl">
              <div className="space-y-2">
                <Label>Ação Pendente</Label>
                <Input defaultValue={opp.nextStep} />
              </div>
              <div className="space-y-2">
                <Label>Data Prevista</Label>
                <Input type="date" defaultValue={opp.nextStepDate} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Detalhes Comerciais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Moeda</Label>
                <Input readOnly value={opp.currency} className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Venda</Label>
                <Input
                  readOnly
                  value={opp.saleType.replace('_', ' ')}
                  className="bg-muted capitalize"
                />
              </div>
              <div className="space-y-2">
                <Label>Parceiro</Label>
                <Input readOnly value={opp.partner} className="bg-muted uppercase" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
