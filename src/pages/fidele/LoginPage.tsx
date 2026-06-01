import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../../components/forms/FormInput';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { AuthGoogleSection } from '../../components/auth/AuthGoogleSection';
import { AuthHeader } from '../../components/layout/AuthHeader';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { useAuthStore } from '../../stores/authStore';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [authError, setAuthError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setAuthError('');
    try {
      await login(data.email, data.password);
      navigate('/profile');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Connexion impossible');
    }
  };

  return (
    <MobileLayout showBottomNav={false} header={<AuthHeader backTo="/" />}>
      <div className="px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-teal-900">Connexion</h1>
        <p className="mt-3 text-base font-semibold text-teal">Bienvenue sur MesseConnect</p>
        <p className="mt-1 text-sm text-gray-500">Connectez-vous pour continuer.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-8">
          <FormInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="exemple@email.com"
            error={errors.email}
            {...register('email', { required: 'Email requis' })}
          />
          <PasswordInput
            label="Mot de passe"
            autoComplete="current-password"
            error={errors.password}
            {...register('password', {
              required: 'Mot de passe requis',
              minLength: { value: 6, message: 'Min. 6 caractères' },
            })}
          />
          <Link to="#" className="text-sm text-teal font-medium self-end">
            Mot de passe oublié ?
          </Link>
          {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-touch mt-2 rounded-xl bg-teal-900 text-white font-semibold px-6 py-3 active:scale-95 transition-transform disabled:opacity-60"
          >
            Se connecter
          </button>
        </form>

        <AuthGoogleSection disabled={isSubmitting} />

        <p className="text-center text-sm text-gray-600 mt-8">
          Pas encore de compte ?{' '}
          <Link to="/auth/register" className="text-teal font-semibold">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </MobileLayout>
  );
}
