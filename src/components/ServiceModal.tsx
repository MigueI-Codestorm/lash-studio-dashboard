
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Modal from './Modal';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceSaved: () => void;
  editingService?: any;
}

const ServiceModal = ({ isOpen, onClose, onServiceSaved, editingService }: ServiceModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: editingService?.nome || '',
    descricao: editingService?.descricao || '',
    preco: editingService?.preco || '',
    duracao_min: editingService?.duracao_min || '',
    categoria: editingService?.categoria || '',
    ativo: editingService?.ativo ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const serviceData = {
        nome: formData.nome,
        descricao: formData.descricao || null,
        preco: parseFloat(formData.preco),
        duracao_min: parseInt(formData.duracao_min),
        categoria: formData.categoria || null,
        ativo: formData.ativo
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
        toast.success('Serviço atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);

        if (error) throw error;
        toast.success('Serviço criado com sucesso!');
      }

      onServiceSaved();
      onClose();
      setFormData({
        nome: '', descricao: '', preco: '', duracao_min: '',
        categoria: '', ativo: true
      });
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error('Erro ao salvar serviço: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingService ? 'Editar Serviço' : 'Criar Serviço'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome do Serviço *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="preco">Preço (R$) *</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              required
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="duracao_min">Duração (minutos) *</Label>
            <Input
              id="duracao_min"
              type="number"
              value={formData.duracao_min}
              onChange={(e) => setFormData({ ...formData, duracao_min: e.target.value })}
              required
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Input
            id="categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ativo"
            checked={formData.ativo}
            onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="ativo">Serviço ativo</Label>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : editingService ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ServiceModal;
