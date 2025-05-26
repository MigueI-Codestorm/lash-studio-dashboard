
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Modal from './Modal';

interface StudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudioSettingsModal = ({ isOpen, onClose }: StudioSettingsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    link_agendamento: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('nome, endereco, telefone, whatsapp, instagram, facebook, link_agendamento')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          nome: data.nome || '',
          endereco: data.endereco || '',
          telefone: data.telefone || '',
          whatsapp: data.whatsapp || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          link_agendamento: data.link_agendamento || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: existingSettings } = await supabase
        .from('studio_settings')
        .select('id')
        .limit(1)
        .single();

      if (existingSettings) {
        const { error } = await supabase
          .from('studio_settings')
          .update({
            nome: formData.nome,
            endereco: formData.endereco,
            telefone: formData.telefone,
            whatsapp: formData.whatsapp,
            instagram: formData.instagram,
            facebook: formData.facebook,
            link_agendamento: formData.link_agendamento,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('studio_settings')
          .insert([formData]);

        if (error) throw error;
      }

      toast.success('Configurações salvas com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações do Studio"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome do Studio *</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={formData.facebook}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              className="bg-dark-700 border-dark-600 text-white"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="link_agendamento">Link de Agendamento</Label>
          <Input
            id="link_agendamento"
            value={formData.link_agendamento}
            onChange={(e) => setFormData({ ...formData, link_agendamento: e.target.value })}
            className="bg-dark-700 border-dark-600 text-white"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudioSettingsModal;
