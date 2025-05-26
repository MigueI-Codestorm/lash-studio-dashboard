import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TransactionCategory {
  id: string;
  nome: string;
  tipo: 'entrada' | 'saida';
  ativo: boolean;
  created_at: string;
  descricao: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: any;
}

const TransactionModal = ({ isOpen, onClose, onSuccess, transaction }: TransactionModalProps) => {
  const [formData, setFormData] = useState({
    tipo: 'entrada' as 'entrada' | 'saida',
    categoria: '',
    category_id: '',
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0]
  });
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (transaction) {
        setFormData({
          tipo: transaction.tipo,
          categoria: transaction.categoria,
          category_id: transaction.category_id || '',
          descricao: transaction.descricao,
          valor: transaction.valor.toString(),
          data: transaction.data
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, transaction]);

  const resetForm = () => {
    setFormData({
      tipo: 'entrada',
      categoria: '',
      category_id: '',
      descricao: '',
      valor: '',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('transaction_categories')
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedCategories: TransactionCategory[] = (data || []).map(cat => ({
        ...cat,
        tipo: cat.tipo as 'entrada' | 'saida'
      }));
      
      setCategories(typedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      
      const transactionData = {
        tipo: formData.tipo,
        categoria: selectedCategory?.nome || formData.categoria,
        category_id: formData.category_id || null,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data: formData.data,
        created_by: user.id
      };

      if (transaction) {
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id);

        if (error) throw error;
        toast.success('Transação atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('transactions')
          .insert(transactionData);

        if (error) throw error;
        toast.success('Transação criada com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving transaction:', error);
      toast.error(error.message || 'Erro ao salvar transação');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat.tipo === formData.tipo);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-800 border-dark-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: 'entrada' | 'saida') => {
                setFormData({ ...formData, tipo: value, category_id: '', categoria: '' });
              }}
            >
              <SelectTrigger className="bg-dark-700 border-dark-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-700 border-dark-600">
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="saida">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => {
                const category = categories.find(cat => cat.id === value);
                setFormData({ 
                  ...formData, 
                  category_id: value,
                  categoria: category?.nome || ''
                });
              }}
            >
              <SelectTrigger className="bg-dark-700 border-dark-600">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-dark-700 border-dark-600">
                {loadingCategories ? (
                  <SelectItem value="" disabled>Carregando...</SelectItem>
                ) : (
                  filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-dark-700 border-dark-600"
              placeholder="Descrição da transação"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              className="bg-dark-700 border-dark-600"
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="bg-dark-700 border-dark-600"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-dark-600 text-dark-300 hover:bg-dark-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
