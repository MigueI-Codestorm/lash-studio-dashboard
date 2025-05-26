
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TransactionModal from '../components/TransactionModal';
import StatsCard from '../components/StatsCard';

interface Transaction {
  id: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  created_at: string;
}

const Financeiro = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [stats, setStats] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionList: Transaction[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactionList.filter(transaction => {
      const transactionDate = new Date(transaction.data);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const totalEntradas = monthlyTransactions
      .filter(t => t.tipo === 'entrada')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    const totalSaidas = monthlyTransactions
      .filter(t => t.tipo === 'saida')
      .reduce((sum, t) => sum + Number(t.valor), 0);

    setStats({
      totalEntradas,
      totalSaidas,
      saldo: totalEntradas - totalSaidas
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Transação excluída com sucesso!');
      fetchTransactions();
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao excluir transação');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
  };

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
          <p className="text-dark-400">Controle suas receitas e despesas</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Entradas do Mês"
          value={formatCurrency(stats.totalEntradas)}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          color="bg-emerald-600"
          trend={{ value: "Este mês", isPositive: true }}
        />
        
        <StatsCard
          title="Saídas do Mês"
          value={formatCurrency(stats.totalSaidas)}
          icon={<TrendingDown className="w-6 h-6 text-white" />}
          color="bg-red-600"
          trend={{ value: "Este mês", isPositive: false }}
        />
        
        <StatsCard
          title="Saldo do Mês"
          value={formatCurrency(stats.saldo)}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          color={stats.saldo >= 0 ? "bg-blue-600" : "bg-orange-600"}
          trend={{ 
            value: stats.saldo >= 0 ? "Positivo" : "Negativo", 
            isPositive: stats.saldo >= 0 
          }}
        />
      </div>

      {/* Lista de transações */}
      <Card className="bg-dark-800 border-dark-700">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Transações Recentes</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center text-dark-400 py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-dark-500" />
              <p>Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.tipo === 'entrada' 
                        ? 'bg-emerald-600' 
                        : 'bg-red-600'
                    }`}>
                      {transaction.tipo === 'entrada' 
                        ? <TrendingUp className="w-4 h-4 text-white" />
                        : <TrendingDown className="w-4 h-4 text-white" />
                      }
                    </div>
                    
                    <div>
                      <p className="font-medium text-white">{transaction.descricao}</p>
                      <p className="text-sm text-dark-400">
                        {transaction.categoria} • {formatDate(transaction.data)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`font-semibold ${
                      transaction.tipo === 'entrada' 
                        ? 'text-emerald-400' 
                        : 'text-red-400'
                    }`}>
                      {transaction.tipo === 'entrada' ? '+' : '-'} {formatCurrency(transaction.valor)}
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                        className="border-dark-600 text-dark-300 hover:bg-dark-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchTransactions}
        transaction={editingTransaction}
      />
    </div>
  );
};

export default Financeiro;
