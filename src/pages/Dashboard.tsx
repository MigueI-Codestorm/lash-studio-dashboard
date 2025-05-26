
import { Calendar, Users, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import { agendamentos, transacoes, dadosGrafico } from '../data/mockData';

const Dashboard = () => {
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
  const receitaHoje = agendamentosHoje.reduce((sum, a) => sum + a.valor, 0);
  const proximosAgendamentos = agendamentos
    .filter(a => new Date(a.data) >= new Date())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-dark-400">Visão geral do seu negócio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Agendamentos Hoje"
          value={agendamentosHoje.length.toString()}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-blue-600"
          trend={{ value: "+12%", isPositive: true }}
        />
        
        <StatsCard
          title="Receita Hoje"
          value={`R$ ${receitaHoje}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-emerald-600"
          trend={{ value: "+8%", isPositive: true }}
        />
        
        <StatsCard
          title="Clientes Ativos"
          value="127"
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-600"
          trend={{ value: "+3%", isPositive: true }}
        />
        
        <StatsCard
          title="Serviços Realizados"
          value="45"
          icon={<Package className="w-6 h-6 text-white" />}
          color="bg-orange-600"
          trend={{ value: "Este mês", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Agendamentos da Semana</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosGrafico.semana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="dia" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Bar dataKey="agendamentos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Próximos Agendamentos</h3>
          <div className="space-y-4">
            {proximosAgendamentos.map((agendamento) => (
              <div key={agendamento.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div>
                  <p className="font-medium text-white">{agendamento.clienteNome}</p>
                  <p className="text-sm text-dark-400">{agendamento.servicoNome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-400">
                    {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-dark-400">{agendamento.hora}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Receita Mensal</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">R$ 12.450</p>
            <p className="text-dark-400 text-sm mt-2">Meta: R$ 15.000</p>
            <div className="w-full bg-dark-700 rounded-full h-2 mt-4">
              <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Serviço Mais Popular</h3>
          <div className="text-center">
            <p className="text-xl font-bold text-purple-400">Extensão de Cílios</p>
            <p className="text-dark-400 text-sm mt-2">35 realizados este mês</p>
            <p className="text-emerald-400 text-sm mt-1">+15% vs mês anterior</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-4">Taxa de Retorno</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">87%</p>
            <p className="text-dark-400 text-sm mt-2">Clientes que retornaram</p>
            <p className="text-emerald-400 text-sm mt-1">+5% vs mês anterior</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
