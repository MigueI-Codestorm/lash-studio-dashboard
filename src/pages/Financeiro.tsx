
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';

interface Transaction {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  tipo: string;
  valor: number;
}

const Financeiro = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('data', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const addSampleTransaction = async (tipo: 'entrada' | 'saida') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sampleData = {
        tipo,
        descricao: tipo === 'entrada' ? 'Serviço de extensão de cílios' : 'Compra de materiais',
        categoria: tipo === 'entrada' ? 'Serviços' : 'Materiais',
        valor: tipo === 'entrada' ? 150 : 50,
        data: new Date().toISOString().split('T')[0],
        created_by: user.id
      };

      const { error } = await supabase
        .from('transactions')
        .insert([sampleData]);

      if (error) throw error;
      
      toast.success('Transação adicionada com sucesso!');
      fetchTransactions();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast.error('Erro ao adicionar transação');
    }
  };

  const totalEntradas = transactions
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + Number(t.valor), 0);
    
  const totalSaidas = transactions
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + Number(t.valor), 0);
    
  const saldoTotal = totalEntradas - totalSaidas;

  // Dados para o gráfico dos últimos 7 dias
  const getFinancialData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.data === dateStr);
      const entrada = dayTransactions.filter(t => t.tipo === 'entrada').reduce((sum, t) => sum + Number(t.valor), 0);
      const saida = dayTransactions.filter(t => t.tipo === 'saida').reduce((sum, t) => sum + Number(t.valor), 0);
      
      last7Days.push({
        data: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        entrada,
        saida
      });
    }
    return last7Days;
  };

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
      render: (value: number, row: Transaction) => (
        <span className={row.tipo === 'entrada' ? 'text-emerald-400' : 'text-red-400'}>
          {row.tipo === 'entrada' ? '+' : '-'} R$ {Number(value).toFixed(2)}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Financeiro</h1>
          <p className="text-dark-400">Controle suas finanças e receitas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => addSampleTransaction('entrada')} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Entrada
          </Button>
          <Button onClick={() => addSampleTransaction('saida')} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Saída
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Entradas"
          value={`R$ ${totalEntradas.toFixed(2)}`}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-emerald-600"
          trend={{ value: "Acumulado", isPositive: true }}
        />
        
        <StatsCard
          title="Total de Saídas"
          value={`R$ ${totalSaidas.toFixed(2)}`}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="bg-red-600"
          trend={{ value: "Acumulado", isPositive: false }}
        />
        
        <StatsCard
          title="Saldo Total"
          value={`R$ ${saldoTotal.toFixed(2)}`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color={saldoTotal >= 0 ? "bg-blue-600" : "bg-red-600"}
          trend={{ value: saldoTotal >= 0 ? "Positivo" : "Negativo", isPositive: saldoTotal >= 0 }}
        />
        
        <StatsCard
          title="Transações"
          value={transactions.length.toString()}
          icon={<Calendar className="w-6 h-6 text-white" />}
          color="bg-purple-600"
          trend={{ value: "Total", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-xl font-semibold text-white mb-6">Receita vs Gastos - Últimos 7 Dias</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFinancialData()}>
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
          <h3 className="text-xl font-semibold text-white mb-6">Resumo Financeiro</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-dark-300">Entradas</span>
                <span className="text-emerald-400 font-semibold">R$ {totalEntradas.toFixed(2)}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div 
                  className="bg-emerald-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: totalEntradas > 0 ? `${(totalEntradas / (totalEntradas + totalSaidas)) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-dark-300">Saídas</span>
                <span className="text-red-400 font-semibold">R$ {totalSaidas.toFixed(2)}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-3">
                <div 
                  className="bg-red-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: totalSaidas > 0 ? `${(totalSaidas / (totalEntradas + totalSaidas)) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-dark-700">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Saldo</span>
                <span className={`font-bold ${saldoTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  R$ {saldoTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Transações Recentes</h3>
          <span className="text-dark-400 text-sm">{transactions.length} transações</span>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-dark-400">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-dark-500" />
            <p>Nenhuma transação encontrada</p>
            <p className="text-sm mt-2">Adicione entradas e saídas usando os botões acima</p>
          </div>
        ) : (
          <Table columns={columns} data={transactions.slice(0, 10)} />
        )}
      </Card>
    </div>
  );
};

export default Financeiro;
