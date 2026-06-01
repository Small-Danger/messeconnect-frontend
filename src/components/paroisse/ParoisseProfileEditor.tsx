import { ImagePlus, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormInput } from '../forms/FormInput';
import { SafeImage } from '../common/SafeImage';
import type { ParoisseProfile } from '../../services/mockApi/paroisse/data';
import { paroisseService } from '../../services/paroisseService';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

type ProfileFormValues = Omit<
  ParoisseProfile,
  'id' | 'diocese' | 'responsable' | 'photoCouverture' | 'photoProfil' | 'horaires'
>;

interface ParoisseProfileEditorProps {
  profile: ParoisseProfile;
  onSave: (data: Partial<ParoisseProfile>) => Promise<void>;
  onPreviewChange?: (profile: ParoisseProfile) => void;
}

export function ParoisseProfileEditor({ profile, onSave, onPreviewChange }: ParoisseProfileEditorProps) {
  const token = useParoisseAppStore((s) => s.token);
  const [horaires, setHoraires] = useState<string[]>(profile.horaires);
  const [coverPreview, setCoverPreview] = useState(profile.photoCouverture);
  const [logoPreview, setLogoPreview] = useState(profile.photoProfil);
  const [pendingCover, setPendingCover] = useState<File | null>(null);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      nom: profile.nom,
      adresse: profile.adresse,
      ville: profile.ville,
      pays: profile.pays,
      telephone: profile.telephone,
      email: profile.email,
      siteWeb: profile.siteWeb,
      description: profile.description,
    },
  });

  useEffect(() => {
    reset({
      nom: profile.nom,
      adresse: profile.adresse,
      ville: profile.ville,
      pays: profile.pays,
      telephone: profile.telephone,
      email: profile.email,
      siteWeb: profile.siteWeb,
      description: profile.description,
    });
    setHoraires(profile.horaires);
    setCoverPreview(profile.photoCouverture);
    setLogoPreview(profile.photoProfil);
    setPendingCover(null);
    setPendingLogo(null);
  }, [profile, reset]);

  const syncPreview = useCallback(() => {
    if (!onPreviewChange) return;
    onPreviewChange({
      ...profile,
      ...getValues(),
      horaires,
      photoCouverture: coverPreview,
      photoProfil: logoPreview,
    });
  }, [profile, horaires, coverPreview, logoPreview, onPreviewChange, getValues]);

  useEffect(() => {
    if (!onPreviewChange) return;
    const subscription = watch(() => {
      syncPreview();
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewChange, syncPreview]);

  useEffect(() => {
    syncPreview();
  }, [horaires, coverPreview, logoPreview, syncPreview]);

  const pickImage = (type: 'logo' | 'banniere', file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const preview = URL.createObjectURL(file);
    if (type === 'logo') {
      setPendingLogo(file);
      setLogoPreview(preview);
    } else {
      setPendingCover(file);
      setCoverPreview(preview);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setSaveError(null);
        setSaving(true);
        try {
          if (pendingLogo) {
            const updated = await paroisseService.uploadProfileImage(token, 'logo', pendingLogo);
            setLogoPreview(updated.photoProfil);
            setPendingLogo(null);
          }
          if (pendingCover) {
            const updated = await paroisseService.uploadProfileImage(token, 'banniere', pendingCover);
            setCoverPreview(updated.photoCouverture);
            setPendingCover(null);
          }

          await onSave({
            ...data,
            horaires: horaires.filter((line) => line.trim()),
          });
        } catch {
          setSaveError('Enregistrement impossible. Vérifiez vos informations et images (max 5 Mo).');
        } finally {
          setSaving(false);
        }
      })}
      className="space-y-5"
    >
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Visuels publics</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="group relative block cursor-pointer overflow-hidden rounded-xl border border-gray-200">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                pickImage('banniere', e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <SafeImage src={coverPreview} alt="" className="aspect-[16/9] w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-medium text-gray-800">
                <ImagePlus className="h-3.5 w-3.5" /> Bannière
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-4 py-5 hover:border-teal/40">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                pickImage('logo', e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <SafeImage
              src={logoPreview}
              alt=""
              className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md"
            />
            <span className="mt-2 text-xs font-medium text-gray-600">Logo / photo paroisse</span>
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Identité</h3>
        <FormInput label="Nom de la paroisse" {...register('nom', { required: true })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Ville" {...register('ville')} />
          <FormInput label="Pays" {...register('pays')} />
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Description publique</span>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            placeholder="Présentation visible par les fidèles sur la fiche paroisse…"
          />
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
        <FormInput label="Adresse" {...register('adresse')} />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormInput label="Téléphone" {...register('telephone')} />
          <FormInput label="Email" type="email" {...register('email')} />
        </div>
        <FormInput label="Site web" placeholder="https://…" {...register('siteWeb')} />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Horaires du secrétariat</h3>
          <button
            type="button"
            onClick={() => setHoraires((prev) => [...prev, ''])}
            className="flex items-center gap-1 text-xs font-medium text-teal"
          >
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </button>
        </div>
        <ul className="space-y-2">
          {horaires.length === 0 ? (
            <li className="rounded-xl border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-500">
              Aucun horaire — les fidèles ne verront pas cette section.
            </li>
          ) : (
            horaires.map((line, index) => (
              <li key={`horaire-${index}`} className="flex gap-2">
                <input
                  value={line}
                  onChange={(e) =>
                    setHoraires((prev) => prev.map((item, i) => (i === index ? e.target.value : item)))
                  }
                  placeholder="Ex. Lun-Ven : 8h - 17h"
                  className="min-h-touch flex-1 rounded-xl border border-gray-200 px-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                />
                <button
                  type="button"
                  onClick={() => setHoraires((prev) => prev.filter((_, i) => i !== index))}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="Supprimer l'horaire"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      {profile.diocese ? (
        <p className="text-xs text-gray-400">
          Diocèse : {profile.diocese} · Responsable : {profile.responsable || '—'}
        </p>
      ) : null}

      {saveError ? <p className="text-sm text-red-600">{saveError}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || saving}
        className="w-full min-h-touch rounded-xl bg-teal text-white font-medium disabled:opacity-60"
      >
        {isSubmitting || saving ? 'Enregistrement…' : 'Enregistrer le profil public'}
      </button>
    </form>
  );
}
