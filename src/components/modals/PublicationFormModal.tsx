import { ImagePlus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './Modal';
import { FormInput } from '../forms/FormInput';
import type { PublicationParoisse } from '../../services/mockApi/paroisse/data';
import { paroisseService } from '../../services/paroisseService';
import { useParoisseAppStore } from '../../stores/paroisseAppStore';

type PublicationFormValues = Pick<PublicationParoisse, 'titre' | 'contenu' | 'datePublication'>;

interface PublicationFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<PublicationParoisse, 'id'>) => Promise<void>;
  publication?: PublicationParoisse | null;
}

interface PendingImage {
  id: string;
  file: File;
  preview: string;
}

export function PublicationFormModal({ open, onClose, onSave, publication }: PublicationFormModalProps) {
  const token = useParoisseAppStore((s) => s.token);
  const isEdit = !!publication;
  const [keptImages, setKeptImages] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PublicationFormValues>({
    defaultValues: {
      titre: '',
      contenu: '',
      datePublication: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      publication
        ? {
            titre: publication.titre,
            contenu: publication.contenu,
            datePublication: publication.datePublication,
          }
        : {
            titre: '',
            contenu: '',
            datePublication: new Date().toISOString().split('T')[0],
          },
    );
    setKeptImages(publication?.images?.length ? publication.images : publication?.image ? [publication.image] : []);
    setPendingImages([]);
    setUploadError(null);
  }, [open, publication, reset]);

  useEffect(() => {
    return () => {
      pendingImages.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [pendingImages]);

  const previewCount = keptImages.length + pendingImages.length;

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: PendingImage[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      next.push({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      });
    }
    if (next.length === 0) return;
    setPendingImages((prev) => [...prev, ...next].slice(0, 10));
  };

  const removePending = (id: string) => {
    setPendingImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const allPreviews = useMemo(
    () => [
      ...keptImages.map((url, index) => ({
        key: `kept-${index}`,
        url,
        onRemove: () => setKeptImages((prev) => prev.filter((_, i) => i !== index)),
      })),
      ...pendingImages.map((item) => ({
        key: item.id,
        url: item.preview,
        onRemove: () => removePending(item.id),
      })),
    ],
    [keptImages, pendingImages],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifier la publication' : 'Nouvelle publication'}
      size="md"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          setUploadError(null);
          setSaving(true);
          try {
            let uploadedUrls: string[] = [];
            if (pendingImages.length > 0) {
              uploadedUrls = await paroisseService.uploadPublicationImages(
                token,
                pendingImages.map((item) => item.file),
              );
            }

            const images = [...keptImages, ...uploadedUrls];
            await onSave({
              ...data,
              images,
              image: images[0] ?? '',
            });
            onClose();
          } catch {
            setUploadError('Impossible d’enregistrer la publication. Vérifiez vos images (max 5 Mo chacune).');
          } finally {
            setSaving(false);
          }
        })}
        className="space-y-4"
      >
        <FormInput label="Titre" {...register('titre', { required: true })} />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-gray-700">Contenu</span>
          <textarea
            {...register('contenu', { required: true })}
            rows={5}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
            placeholder="Annonce, événement, information pour les fidèles…"
          />
        </label>
        <FormInput label="Date de publication" type="date" {...register('datePublication', { required: true })} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Photos</span>
            <span className="text-xs text-gray-400">{previewCount}/10</span>
          </div>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 px-4 py-5 transition-colors hover:border-teal/40">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <ImagePlus className="h-6 w-6 text-teal" />
            <span className="mt-2 text-sm font-medium text-gray-700">Ajouter une ou plusieurs images</span>
            <span className="mt-1 text-xs text-gray-500">JPG, PNG — 5 Mo max par image</span>
          </label>

          {allPreviews.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {allPreviews.map((item) => (
                <div key={item.key} className="relative aspect-square overflow-hidden rounded-xl border border-gray-100">
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={item.onRemove}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
                    aria-label="Retirer l’image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting || saving}
          className="w-full min-h-touch rounded-xl bg-teal text-white font-medium disabled:opacity-60"
        >
          {isSubmitting || saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Publier'}
        </button>
      </form>
    </Modal>
  );
}
