
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
        <p className="text-dark-300 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <Link to="/auth">
          <Button>Voltar ao Login</Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
