
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StudioStatus {
  is_open: boolean;
  current_day: string;
  opening_time: string;
  closing_time: string;
}

export const useStudioStatus = () => {
  const [studioStatus, setStudioStatus] = useState<StudioStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudioStatus = async () => {
      try {
        const { data, error } = await supabase.rpc('get_studio_status');
        
        if (error) {
          console.error('Error fetching studio status:', error);
          return;
        }

        if (data && data.length > 0) {
          setStudioStatus(data[0]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudioStatus();
    
    // Refresh status every minute
    const interval = setInterval(fetchStudioStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { studioStatus, loading };
};
