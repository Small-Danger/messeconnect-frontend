import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FormInput } from '../../components/forms/FormInput';
import { FormSelect } from '../../components/forms/FormSelect';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { PhoneInputBF } from '../../components/forms/PhoneInputBF';
import {
  ParoisseAuthFooterLink,
  ParoisseAuthLayout,
} from '../../components/paroisse/ParoisseAuthLayout';
import type { RegistrationDiocese } from '../../services/api/paroisse';
import { paroisseService } from '../../services/paroisseService';

interface RegisterForm {
  nomParoisse: string;
  adresse: string;
  diocese_id: string;
  siteWeb: string;
  telephone: string;
  email: string;
  responsable: string;
  password: string;
  password_confirmation: string;
  conditions: boolean;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [dioceses, setDioceses] = useState<RegistrationDiocese[]>([]);
  const [loadingDioceses, setLoadingDioceses] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  useEffect(() => {
    paroisseService
      .getRegistrationDioceses()
      .then(setDioceses)
      .catch(() => setDioceses([]))
      .finally(() => setLoadingDioceses(false));
  }, []);

  const dioceseOptions = dioceses.map((d) => ({
    value: d.id,
    label: d.ville ? `${d.nom} (${d.ville})` : d.nom,
  }));

  const onSubmit = async (data: RegisterForm) => {
    setAuthError('');
    const selectedDiocese = dioceses.find((d) => d.id === data.diocese_id);

    try {
      await paroisseService.registerParoisse({
        paroisse: {
          nom: data.nomParoisse,
          email: data.email,
          telephone: data.telephone,
          adresse: data.adresse,
          ville: selectedDiocese?.ville ?? undefined,
          pays: 'Burkina Faso',
          site_web: data.siteWeb?.trim() || undefined,
          diocese_id: data.diocese_id || undefined,
        },
        responsable: {
          nom: data.responsable,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      });
      navigate('/paroisse/pending');
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Inscription impossible');
    }
  };

  return (
    <ParoisseAuthLayout variant="register">
      <div className="lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-white lg:p-8 lg:shadow-sm">
        <h1 className="text-2xl font-bold text-teal-900">Inscription paroisse</h1>
        <p className="mt-2 text-sm text-gray-500">
          Informations sur votre paroisse. L&apos;email servira aussi pour la connexion du responsable.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Nom de la paroisse *"
              placeholder="Ex : Paroisse Saint Joseph"
              error={errors.nomParoisse}
              {...register('nomParoisse', { required: 'Nom requis' })}
            />
            <FormInput
              label="Adresse complète *"
              placeholder="Quartier, ville"
              error={errors.adresse}
              {...register('adresse', { required: 'Adresse requise' })}
            />
            <FormSelect
              label="Diocèse *"
              options={dioceseOptions}
              disabled={loadingDioceses}
              error={errors.diocese_id}
              {...register('diocese_id', { required: 'Diocèse requis' })}
            />
            <FormInput
              label="Site web (optionnel)"
              type="url"
              placeholder="https://…"
              error={errors.siteWeb}
              {...register('siteWeb')}
            />
            <PhoneInputBF
              label="Téléphone *"
              error={errors.telephone}
              {...register('telephone', { required: 'Téléphone requis' })}
            />
            <FormInput
              label="Email *"
              type="email"
              placeholder="contact@paroisse.bf"
              error={errors.email}
              {...register('email', { required: 'Email requis' })}
            />
            <PasswordInput
              label="Mot de passe *"
              error={errors.password}
              {...register('password', {
                required: 'Mot de passe requis',
                minLength: { value: 8, message: 'Min. 8 caractères' },
              })}
            />
            <PasswordInput
              label="Confirmer le mot de passe *"
              error={errors.password_confirmation}
              {...register('password_confirmation', {
                required: 'Confirmation requise',
                validate: (v) => v === watch('password') || 'Les mots de passe ne correspondent pas',
              })}
            />
          </div>

          <FormInput
            label="Nom du responsable *"
            placeholder="Ex : Père Jean-Baptiste"
            error={errors.responsable}
            {...register('responsable', { required: 'Nom du responsable requis' })}
          />

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-gray-300 text-teal focus:ring-teal"
              {...register('conditions', { required: 'Acceptation requise' })}
            />
            <span className="text-sm leading-relaxed text-gray-600">
              J&apos;accepte les{' '}
              <Link to="#" className="font-medium text-teal">
                conditions d&apos;utilisation
              </Link>{' '}
              et la{' '}
              <Link to="#" className="font-medium text-teal">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {errors.conditions ? <span className="text-xs text-red-600">{errors.conditions.message}</span> : null}
          {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting || loadingDioceses || dioceseOptions.length === 0}
            className="w-full min-h-touch rounded-xl bg-teal-900 font-semibold text-white active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? 'Envoi…' : 'Soumettre ma demande'}
          </button>
          {!loadingDioceses && dioceseOptions.length === 0 ? (
            <p className="text-sm text-amber-700">
              Aucun diocèse disponible pour l&apos;inscription. Contactez MesseConnect.
            </p>
          ) : null}
        </form>

        <ParoisseAuthFooterLink
          prompt="Déjà inscrit ?"
          action="Se connecter"
          to="/paroisse/login"
        />
      </div>
    </ParoisseAuthLayout>
  );
}
