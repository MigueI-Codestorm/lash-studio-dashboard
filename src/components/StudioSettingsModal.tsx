
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: () => void;
}

interface DaySchedule {
  ativo: boolean;
  abertura: string;
  fechamento: string;
}

interface BusinessHours {
  [key: string]: DaySchedule;
  segunda: DaySchedule;
  terca: DaySchedule;
  quarta: DaySchedule;
  quinta: DaySchedule;
  sexta: DaySchedule;
  sabado: DaySchedule;
  domingo: DaySchedule;
}

const StudioSettingsModal = ({ isOpen, onClose, onSettingsUpdated }: StudioSettingsModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    endereco: '',
    link_agendamento: '',
    logo_url: '',
    cor_primaria: '#1e3a8a'
  });
  
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    segunda: { ativo: true, abertura: '09:00', fechamento: '18:00' },
    terca: { ativo: true, abertura: '09:00', fechamento: '18:00' },
    quarta: { ativo: true, abertura: '09:00', fechamento: '18:00' },
    quinta: { ativo: true, abertura: '09:00', fechamento: '18:00' },
    sexta: { ativo: true, abertura: '09:00', fechamento: '18:00' },
    sabado: { ativo: false, abertura: '09:00', fechamento: '18:00' },
    domingo: { ativo: false, abertura: '09:00', fechamento: '18:00' }
  });

  const [loading, setLoading] = useState(false);
  const [existingSettingsId, setExistingSettingsId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStudioSettings();
    }
  }, [isOpen]);

  const isValidBusinessHours = (data: any): data is BusinessHours => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return false;
    }

    const requiredDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    
    for (const day of requiredDays) {
      const dayData = data[day];
      if (!dayData || typeof dayData !== 'object') {
        return false;
      }
      
      if (typeof dayData.ativo !== 'boolean' || 
          typeof dayData.abertura !== 'string' || 
          typeof dayData.fechamento !== 'string') {
        return false;
      }
    }
    
    return true;
  };

  const fetchStudioSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = data[0];
        setExistingSettingsId(settings.id);
        
        setFormData({
          nome: settings.nome || '',
          telefone: settings.telefone || '',
          whatsapp: settings.whatsapp || '',
          instagram: settings.instagram || '',
          facebook: settings.facebook || '',
          endereco: settings.endereco || '',
          link_agendamento: settings.link_agendamento || '',
          logo_url: settings.logo_url || '',
          cor_primaria: settings.cor_primaria || '#1e3a8a'
        });

        if (settings.horas_funcionamento && isValidBusinessHours(settings.horas_funcionamento)) {
          setBusinessHours(settings.horas_funcionamento);
        }
      }
    } catch (error: any) {
      console.error('Error fetching studio settings:', error);
      toast.error('Erro ao carregar configurações');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const settingsData = {
        nome: formData.nome,
        telefone: formData.telefone || null,
        whatsapp: formData.whatsapp || null,
        instagram: formData.instagram || null,
        facebook: formData.facebook || null,
        endereco: formData.endereco || null,
        link_agendamento: formData.link_agendamento || null,
        logo_url: formData.logo_url || null,
        cor_primaria: formData.cor_primaria,
        horas_funcionamento: businessHours as any
      };

      if (existingSettingsId) {
        const { error } = await supabase
          .from('studio_settings')
          .update(settingsData)
          .eq('id', existingSettingsId);

        if (error) throw error;
        toast.success('Configurações atualizadas com sucesso!');
      } else {
        const { error } = await supabase
          .from('studio_settings')
          .insert(settingsData);

        if (error) throw error;
        toast.success('Configurações criadas com sucesso!');
      }

      onSettingsUpdated();
      onClose();
      
      // Trigger a page refresh to update the header with the new studio name
      window.location.reload();
    } catch (error: any) {
      console.error('Error saving studio settings:', error);
      toast.error(error.message || 'Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessHours = (day: keyof BusinessHours, field: string, value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const dayLabels = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-800 border-dark-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações do Estúdio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Estúdio</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="Studio Camila Lash"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="@studiocamilalash"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="Studio Camila Lash"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_agendamento">Link de Agendamento</Label>
              <Input
                id="link_agendamento"
                value={formData.link_agendamento}
                onChange={(e) => setFormData({ ...formData, link_agendamento: e.target.value })}
                className="bg-dark-700 border-dark-600"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              className="bg-dark-700 border-dark-600"
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personalização Visual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL do Logo</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="bg-dark-700 border-dark-600"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cor_primaria">Cor Primária</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="cor_primaria"
                    value={formData.cor_primaria}
                    onChange={(e) => setFormData({ ...formData, cor_primaria: e.target.value })}
                    className="w-12 h-10 rounded border border-dark-600 bg-dark-700 cursor-pointer"
                  />
                  <Input
                    value={formData.cor_primaria}
                    onChange={(e) => setFormData({ ...formData, cor_primaria: e.target.value })}
                    className="bg-dark-700 border-dark-600 flex-1"
                    placeholder="#1e3a8a"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Horários de Funcionamento</h3>
            {Object.entries(dayLabels).map(([key, label]) => (
              <div key={key} className="flex items-center gap-4 p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-2 min-w-[120px]">
                  <Switch
                    checked={businessHours[key as keyof BusinessHours].ativo}
                    onCheckedChange={(checked) => updateBusinessHours(key as keyof BusinessHours, 'ativo', checked)}
                  />
                  <span className="text-sm">{label}</span>
                </div>
                
                {businessHours[key as keyof BusinessHours].ativo && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={businessHours[key as keyof BusinessHours].abertura}
                      onChange={(e) => updateBusinessHours(key as keyof BusinessHours, 'abertura', e.target.value)}
                      className="bg-dark-600 border-dark-500 w-24"
                    />
                    <span className="text-dark-400">às</span>
                    <Input
                      type="time"
                      value={businessHours[key as keyof BusinessHours].fechamento}
                      onChange={(e) => updateBusinessHours(key as keyof BusinessHours, 'fechamento', e.target.value)}
                      className="bg-dark-600 border-dark-500 w-24"
                    />
                  </div>
                )}
              </div>
            ))}
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
              {loading ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudioSettingsModal;
