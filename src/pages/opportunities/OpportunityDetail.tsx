import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
            <Badge variant="outline">{opp.stage}</Badge>
            <Badge
              className={
                opp.temperature === 'Quente'
                  ? 'bg-rose-500'
                  : opp.temperature === 'Morna'
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
          <TabsTrigger value="meddic">Qualificação MEDDIC</TabsTrigger>
          <TabsTrigger value="committee">Comitê de Compra</TabsTrigger>
        </TabsList>

        <TabsContent value="meddic" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Framework MEDDIC</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>M - Metrics (Métricas de Sucesso)</Label>
                <Textarea
                  defaultValue={opp.meddic.metrics}
                  placeholder="Quais os ganhos mensuráveis?"
                />
              </div>
              <div className="space-y-2">
                <Label>E - Economic Buyer (Comprador Econômico)</Label>
                <Input
                  defaultValue={opp.meddic.economicBuyer}
                  placeholder="Quem assina o cheque?"
                />
              </div>
              <div className="space-y-2">
                <Label>D - Decision Criteria (Critérios de Decisão)</Label>
                <Textarea
                  defaultValue={opp.meddic.decisionCriteria}
                  placeholder="Como eles avaliam a solução?"
                />
              </div>
              <div className="space-y-2">
                <Label>D - Decision Process (Processo de Decisão)</Label>
                <Textarea
                  defaultValue={opp.meddic.decisionProcess}
                  placeholder="Quais os passos até a compra?"
                />
              </div>
              <div className="space-y-2">
                <Label>I - Identify Pain (Dor Identificada)</Label>
                <Textarea
                  defaultValue={opp.meddic.identifyPain}
                  placeholder="Qual o problema principal?"
                />
              </div>
              <div className="space-y-2">
                <Label>C - Champion (Campeão)</Label>
                <Input
                  defaultValue={opp.meddic.champion}
                  placeholder="Quem nos defende lá dentro?"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label>Ação</Label>
                <Input defaultValue={opp.nextStep} />
              </div>
              <div className="space-y-2">
                <Label>Data Prevista</Label>
                <Input type="date" defaultValue={opp.nextStepDate} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
