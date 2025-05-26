
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';
import { transacoes, dadosGrafico } from '../data/mockData';

const Financeiro = () => {
  const totalEntradas = transacoes
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + t.valor, 0);
    
  const totalSaidas = transacoes
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);
    
  const saldoTotal = totalEntradas - totalSaidas;

  const columns = [
    {
      key: 'data',
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    },
    { key: 'descricao', label: 'Descrição' },
    { key: 'categoria', label: 'Categoria' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs text-white ${
          value === 'entrada' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          {value === 'entrada' ? 'Entrada' : 'Saída'}
        </span>
      )
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (value: number, row: any) => (
        <span className={row.tipo === 'entrada' ? 'text-emerald-400' : 'text-red-400'}>
          {row.tipo === 'entrada' ? '+' : '-'} R$ {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
        <p className="text-dark-400">Controle suas finanças e receitas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Entradas"
          value={`R$ ${totalEntradas.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-emerald-600"
          trend={{ value: "+12%", isPositive: true }}
        />
        
        <StatsCard
          title="Total de Saídas"
          value={`R$ ${totalSaidas.toLocaleString()}`}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="bg-red-600"
          trend={{ value: "-5%", isPositive: true }}
        />
        
        <StatsCard
          title="Saldo do Mês"
          value={`R$ ${saldoTotal.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color="bg-blue-600"
          trend={{ value: "+8%", isPositive: true }}
        />
        
        <StatsCard
          title="Média por Dia"
          value={`R$ ${Math.round(totalEntradas / 30).toLocaleString()}`}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-purple-600"
          trend={{ value: "+3%", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Receita vs Gastos - Últimos 10 Dias</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosGrafico.financeiro}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="data" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Line 
                  type="monotone" 
                  dataKey="entrada" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Entradas"
                />
                <Line 
                  type="monotone" 
                  dataKey="saida" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Saídas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Metas Mensais</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-dark-300">Receita</span>
                <span className="text-emerald-400 font-semibold">R$ {totalEntradas} / R$ 15.000</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div 
                  className="bg-emerald-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(totalEntradas / 15000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-dark-400 mt-1">{Math.round((totalEntradas / 15000) * 100)}% da meta</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-dark-300">Gastos</span>
                <span className="text-red-400 font-semibold">R$ {totalSaidas} / R$ 3.000</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div 
                  className="bg-red-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(totalSaidas / 3000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-dark-400 mt-1">{Math.round((totalSaidas / 3000) * 100)}% do limite</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-dark-300">Lucro</span>
                <span className="text-blue-400 font-semibold">R$ {saldoTotal} / R$ 12.000</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div 
                  className="bg-blue-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(saldoTotal / 12000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-dark-400 mt-1">{Math.round((saldoTotal / 12000) * 100)}% da meta</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Últimas Transações</h3>
          <button className="text-primary-400 hover:text-primary-300 transition-colors text-sm">
            Ver todas
          </button>
        </div>
        <Table columns={columns} data={transacoes.slice(0, 10)} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Categorias de Entrada</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Serviços</span>
              <span className="text-emerald-400 font-semibold">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Produtos</span>
              <span className="text-emerald-400 font-semibold">15%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Categorias de Saída</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Materiais</span>
              <span className="text-red-400 font-semibold">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-300">Fixos</span>
              <span className="text-red-400 font-semibold">55%</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Crescimento</h3>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">+23%</p>
            <p className="text-dark-400 text-sm">vs mês anterior</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Financeiro;
