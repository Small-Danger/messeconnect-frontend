import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { PasswordInput } from '../../components/forms/PasswordInput';
import {
  ParoisseAuthDivider,
  ParoisseAuthFooterLink,
  ParoisseAuthLayout,
} from '../../components/paroisse/ParoisseAuthLayout';
import { ParoisseAuthField } from '../../components/paroisse/ParoisseAuthField';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const token = useParoisseAppStore((s) => s.token);
  const login = useParoisseAppStore((s) => s.login);
  const [authError, setAuthError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: 'secretaire@paroisse-saint-pierre.test', password: 'password' },
  });

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
      navigate('/paroisse/dashboard');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Connexion impossible');
    }
  };

  if (token) {
    return <Navigate to="/paroisse/dashboard" replace />;
  }

  return (
    <ParoisseAuthLayout variant="login">
      <div className="lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-white lg:p-8 lg:shadow-sm">
        <h1 className="text-2xl font-bold text-teal-900">Connexion paroisse</h1>
        <p className="mt-2 text-sm text-gray-500">Accédez à votre espace de gestion.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <ParoisseAuthField
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="Entrez votre email"
            error={errors.email}
            {...register('email', { required: 'Email requis' })}
          />
          <PasswordInput
            label="Mot de passe"
            autoComplete="current-password"
            placeholder="Entrez votre mot de passe"
            error={errors.password}
            {...register('password', { required: 'Mot de passe requis' })}
          />
          <Link to="#" className="self-end text-sm font-medium text-teal active:opacity-80">
            Mot de passe oublié ?
          </Link>
          {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full min-h-touch rounded-xl bg-teal-900 font-semibold text-white active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <ParoisseAuthDivider />

        <ParoisseAuthFooterLink
          prompt="Pas encore de paroisse inscrite ?"
          action="Inscrire ma paroisse →"
          to="/paroisse/register"
        />
      </div>
    </ParoisseAuthLayout>
  );
}
