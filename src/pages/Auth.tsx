
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Auth = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerNome, setRegisterNome] = useState('');
  const [registerTipo, setRegisterTipo] = useState<'admin' | 'cliente'>('cliente');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp, user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users
  if (user && profile) {
    if (profile.tipo_usuario === 'admin') {
      navigate('/');
    } else {
      navigate('/cliente-dashboard');
    }
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(loginEmail, loginPassword);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signUp(registerEmail, registerPassword, registerNome, registerTipo);
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-dark-800 border-dark-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Studio Camila Lash</CardTitle>
          <CardDescription className="text-dark-300">
            Acesse sua conta ou crie uma nova
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-dark-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-dark-300">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nome" className="text-dark-300">Nome</Label>
                  <Input
                    id="register-nome"
                    type="text"
                    value={registerNome}
                    onChange={(e) => setRegisterNome(e.target.value)}
                    required
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-dark-300">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-dark-300">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    className="bg-dark-700 border-dark-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-tipo" className="text-dark-300">Tipo de Usuário</Label>
                  <Select value={registerTipo} onValueChange={(value: 'admin' | 'cliente') => setRegisterTipo(value)}>
                    <SelectTrigger className="bg-dark-700 border-dark-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-700 border-dark-600">
                      <SelectItem value="cliente">Cliente</SelectItem>
                      <SelectItem value="admin">Lash Designer (Admin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
