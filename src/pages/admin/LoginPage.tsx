import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MesseConnectLogo } from '../../components/common/MesseConnectLogo';
import { FormInput } from '../../components/forms/FormInput';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { useAdminStore } from '../../stores/adminStore';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAdminStore((s) => s.login);
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: 'admin@messeconnect.test', password: 'password' },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
      navigate('/admin/dashboard');
    } catch {
      setError('Email ou mot de passe incorrect, ou compte inactif.');
    }
  };

  return (
    <div className="min-h-screen bg-purple-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <MesseConnectLogo className="justify-center" />
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Administration</h1>
          <p className="text-sm text-gray-500 mt-1">Supervision de la plateforme MesseConnect</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <FormInput label="Email" type="email" error={errors.email} {...register('email', { required: 'Email requis' })} />
          <PasswordInput label="Mot de passe" error={errors.password} {...register('password', { required: 'Mot de passe requis' })} />
          <button type="submit" disabled={isSubmitting} className="w-full min-h-touch rounded-xl bg-purple text-white font-medium">
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">
          <Link to="/" className="text-purple hover:underline">
            Retour à l&apos;accueil fidèle
          </Link>
        </p>
      </div>
    </div>
  );
}
