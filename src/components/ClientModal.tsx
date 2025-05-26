
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Modal from './Modal';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
  editingClient?: any;
}

const ClientModal = ({ isOpen, onClose, onClientAdded, editingClient }: ClientModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: editingClient?.nome || '',
    telefone: editingClient?.telefone || '',
    email: editingClient?.email || '',
    data_nascimento: editingClient?.data_nascimento || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update({
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email,
            data_nascimento: formData.data_nascimento || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingClient.id);

        if (error) throw error;
        toast.success('Cliente atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([{
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email,
            data_nascimento: formData.data_nascimento || null,
            criado_por: user.id
          }]);

        if (error) throw error;
        toast.success('Cliente adicionado com sucesso!');
      }

      onClientAdded();
      onClose();
      setFormData({ nome: '', telefone: '', email: '', data_nascimento: '' });
    } catch (error: any) {
      console.error('Error saving client:', error);
      toast.error('Erro ao salvar cliente: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingClient ? 'Editar Cliente' : 'Adicionar Cliente'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            required
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="data_nascimento">Data de Nascimento</Label>
          <Input
            id="data_nascimento"
            type="date"
            value={formData.data_nascimento}
            onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : editingClient ? 'Atualizar' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientModal;
