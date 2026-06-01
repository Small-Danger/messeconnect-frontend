import { ImagePlus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { FormInput } from '../forms/FormInput';
import { MoneyInput } from '../forms/MoneyInput';
import type { CampagneParoisse } from '../../services/mockApi/paroisse/data';
import { paroisseService } from '../../services/paroisseService';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

type CampagneFormValues = Omit<CampagneParoisse, 'id' | 'collecte' | 'image'>;

interface NewCampaignModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<CampagneParoisse, 'id' | 'collecte'>) => Promise<void>;
  campagne?: CampagneParoisse | null;
}

interface PendingImage {
  file: File;
  preview: string;
}

export function NewCampaignModal({ open, onClose, onSave, campagne }: NewCampaignModalProps) {
  const token = useParoisseAppStore((s) => s.token);
  const isEdit = !!campagne;
  const [keptImage, setKeptImage] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CampagneFormValues>({
    defaultValues: {
      titre: '',
      description: '',
      objectif: 0,
      dateDebut: new Date().toISOString().slice(0, 10),
      dateFin: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      campagne
        ? {
            titre: campagne.titre,
            description: campagne.description,
            objectif: campagne.objectif,
            dateDebut: campagne.dateDebut,
            dateFin: campagne.dateFin,
          }
        : {
            titre: '',
            description: '',
            objectif: 0,
            dateDebut: new Date().toISOString().slice(0, 10),
            dateFin: '',
          },
    );
    setKeptImage(campagne?.image || null);
    setPendingImage(null);
    setUploadError(null);
  }, [open, campagne, reset]);

  useEffect(() => {
    return () => {
      if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
    };
  }, [pendingImage]);

  const previewUrl = pendingImage?.preview ?? keptImage;

  const addFile = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    setPendingImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview);
      return { file, preview: URL.createObjectURL(file) };
    });
  };

  const clearImage = () => {
    setPendingImage((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview);
      return null;
    });
    setKeptImage(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier la campagne' : 'Nouvelle campagne'}
      size="md"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          setUploadError(null);
          setSaving(true);
          try {
            let image = keptImage ?? '';
            if (pendingImage) {
              image = await paroisseService.uploadCampagneImage(token, pendingImage.file);
            }

            await onSave({ ...data, objectif: Number(data.objectif), image });
            onClose();
          } catch {
            setUploadError('Impossible d’enregistrer la campagne. Vérifiez l’image (max 5 Mo).');
          } finally {
            setSaving(false);
          }
        })}
        className="space-y-4"
      >
        <FormInput label="Titre" {...register('titre', { required: true })} />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Description</span>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
          />
        </label>
        <MoneyInput label="Objectif (FCFA)" {...register('objectif', { required: true, valueAsNumber: true })} />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Date début"
            type="date"
            {...register('dateDebut', { required: !isEdit })}
            disabled={isEdit}
          />
          <FormInput label="Date fin" type="date" {...register('dateFin', { required: true })} />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700">Image de la campagne</span>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-4 py-5 transition-colors hover:border-teal/40">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                addFile(e.target.files);
                e.target.value = '';
              }}
            />
            <ImagePlus className="h-6 w-6 text-teal" />
            <span className="mt-2 text-sm font-medium text-gray-700">Choisir une image</span>
            <span className="mt-1 text-xs text-gray-500">JPG, PNG — 5 Mo max</span>
          </label>

          {previewUrl ? (
            <div className="relative mt-3 aspect-video overflow-hidden rounded-xl border border-gray-100">
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                aria-label="Retirer l’image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting || saving}
          className="w-full min-h-touch rounded-xl bg-teal text-white font-medium disabled:opacity-60"
        >
          {isSubmitting || saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer la campagne'}
        </button>
      </form>
    </Modal>
  );
}
