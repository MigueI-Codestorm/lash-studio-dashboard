
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Modal from './Modal';

interface BusinessHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DaySchedule {
  ativo: boolean;
  abertura: string;
  fechamento: string;
}

interface BusinessHours {
  segunda: DaySchedule;
  terca: DaySchedule;
  quarta: DaySchedule;
  quinta: DaySchedule;
  sexta: DaySchedule;
  sabado: DaySchedule;
  domingo: DaySchedule;
}

const BusinessHoursModal = ({ isOpen, onClose }: BusinessHoursModalProps) => {
  const [loading, setLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    segunda: { ativo: false, abertura: '09:00', fechamento: '18:00' },
    terca: { ativo: false, abertura: '09:00', fechamento: '18:00' },
    quarta: { ativo: false, abertura: '09:00', fechamento: '18:00' },
    quinta: { ativo: false, abertura: '09:00', fechamento: '18:00' },
    sexta: { ativo: false, abertura: '09:00', fechamento: '18:00' },
    sabado: { ativo: false, abertura: '09:00', fechamento: '16:00' },
    domingo: { ativo: false, abertura: '09:00', fechamento: '16:00' }
  });

  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchBusinessHours();
    }
  }, [isOpen]);

  const fetchBusinessHours = async () => {
    try {
      const { data, error } = await supabase
        .from('studio_settings')
        .select('horas_funcionamento')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.horas_funcionamento) {
        // Safely parse the JSON data with type assertion
        const horasData = data.horas_funcionamento as unknown as BusinessHours;
        setBusinessHours(horasData);
      }
    } catch (error: any) {
      console.error('Error fetching business hours:', error);
      toast.error('Erro ao carregar horários de funcionamento');
    }
  };

  const handleDayToggle = (day: keyof BusinessHours, checked: boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ativo: checked
      }
    }));
  };

  const handleTimeChange = (day: keyof BusinessHours, field: 'abertura' | 'fechamento', value: string) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
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
            horas_funcionamento: businessHours as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('studio_settings')
          .insert({
            nome: 'Studio Camila Lash',
            horas_funcionamento: businessHours as any
          });

        if (error) throw error;
      }

      toast.success('Horários de funcionamento salvos com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Error saving business hours:', error);
      toast.error('Erro ao salvar horários: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Horários de Funcionamento"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {daysOfWeek.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white font-medium">{label}</Label>
                <Switch
                  checked={businessHours[key as keyof BusinessHours].ativo}
                  onCheckedChange={(checked) => handleDayToggle(key as keyof BusinessHours, checked)}
                />
              </div>
              
              {businessHours[key as keyof BusinessHours].ativo && (
                <div className="grid grid-cols-2 gap-4 ml-4">
                  <div>
                    <Label htmlFor={`${key}-abertura`} className="text-sm text-dark-300">
                      Abertura
                    </Label>
                    <Input
                      id={`${key}-abertura`}
                      type="time"
                      value={businessHours[key as keyof BusinessHours].abertura}
                      onChange={(e) => handleTimeChange(key as keyof BusinessHours, 'abertura', e.target.value)}
                      className="bg-dark-700 border-dark-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${key}-fechamento`} className="text-sm text-dark-300">
                      Fechamento
                    </Label>
                    <Input
                      id={`${key}-fechamento`}
                      type="time"
                      value={businessHours[key as keyof BusinessHours].fechamento}
                      onChange={(e) => handleTimeChange(key as keyof BusinessHours, 'fechamento', e.target.value)}
                      className="bg-dark-700 border-dark-600 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Salvando...' : 'Salvar Horários'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BusinessHoursModal;
