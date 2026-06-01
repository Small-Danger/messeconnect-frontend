import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../../components/forms/FormInput';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { PhoneInputBF } from '../../components/forms/PhoneInputBF';
import { AuthGoogleSection } from '../../components/auth/AuthGoogleSection';
import { AuthHeader } from '../../components/layout/AuthHeader';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { useAuthStore } from '../../stores/authStore';

interface RegisterForm {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  password_confirmation: string;
  conditions: boolean;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const [authError, setAuthError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setAuthError('');
    try {
      await registerUser({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      navigate('/profile');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Inscription impossible');
    }
  };

  return (
    <MobileLayout showBottomNav={false} header={<AuthHeader backTo="/auth/login" />}>
      <div className="px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-teal-900">Inscription</h1>
        <p className="mt-3 text-base font-semibold text-teal">Créez votre compte fidèle</p>
        <p className="mt-1 text-sm text-gray-500">Rejoignez la communauté MesseConnect.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-8">
          <FormInput
            label="Nom"
            placeholder="Votre nom"
            error={errors.nom}
            {...register('nom', { required: 'Nom requis' })}
          />
          <FormInput
            label="Prénom"
            placeholder="Votre prénom"
            error={errors.prenom}
            {...register('prenom', { required: 'Prénom requis' })}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            error={errors.email}
            {...register('email', { required: 'Email requis' })}
          />
          <PhoneInputBF
            placeholder="70 12 34 56"
            error={errors.telephone}
            {...register('telephone', { required: 'Téléphone requis' })}
          />
          <PasswordInput
            label="Mot de passe"
            error={errors.password}
            {...register('password', {
              required: 'Mot de passe requis',
              minLength: { value: 8, message: 'Min. 8 caractères' },
            })}
          />
          <PasswordInput
            label="Confirmer le mot de passe"
            error={errors.password_confirmation}
            {...register('password_confirmation', {
              required: 'Confirmation requise',
              validate: (v) => v === watch('password') || 'Les mots de passe ne correspondent pas',
            })}
          />
          <label className="flex items-start gap-3 min-h-touch">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-gray-300 text-teal focus:ring-teal"
              {...register('conditions', { required: 'Vous devez accepter les conditions' })}
            />
            <span className="text-sm text-gray-600">
              J&apos;accepte les{' '}
              <Link to="#" className="text-teal font-medium">
                conditions d&apos;utilisation
              </Link>
            </span>
          </label>
          {errors.conditions ? <span className="text-xs text-red-600">{errors.conditions.message}</span> : null}
          {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-touch rounded-xl bg-teal-900 text-white font-semibold active:scale-95 transition-transform disabled:opacity-60"
          >
            S&apos;inscrire
          </button>
        </form>

        <AuthGoogleSection disabled={isSubmitting} />

        <p className="text-center text-sm text-gray-600 mt-8">
          Déjà un compte ?{' '}
          <Link to="/auth/login" className="text-teal font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </MobileLayout>
  );
}
