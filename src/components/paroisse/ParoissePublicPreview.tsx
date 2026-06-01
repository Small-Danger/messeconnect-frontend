import { Globe, MapPin, Phone, Sparkles } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';
import type { ParoisseProfile } from '../../services/mockApi/paroisse/data';

function dioceseLabel(diocese: string) {
  return diocese.replace('Archidiocèse de ', '').replace('Diocèse de ', '');
}

interface ParoissePublicPreviewProps {
  profile: ParoisseProfile;
  compact?: boolean;
}

export function ParoissePublicPreview({ profile, compact = false }: ParoissePublicPreviewProps) {
  const heroHeight = compact ? 'h-44' : 'h-56';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className={`relative ${heroHeight}`}>
        <SafeImage
          src={profile.photoCouverture}
          alt={profile.nom}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          {profile.diocese ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
              <Sparkles className="h-3 w-3" />
              {dioceseLabel(profile.diocese)}
            </span>
          ) : null}
          <h2 className={`mt-2 font-bold leading-snug ${compact ? 'text-lg' : 'text-xl'}`}>{profile.nom}</h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
            <MapPin className="h-4 w-4 shrink-0" />
            {[profile.ville, profile.pays].filter(Boolean).join(' · ') || 'Localisation à renseigner'}
          </p>
        </div>
      </div>

      <div className={`space-y-3 ${compact ? 'p-3' : 'p-4'}`}>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-xl border border-teal/10 bg-teal-light p-2.5">
            <Phone className="h-4 w-4 text-teal" />
            <span className="text-[10px] font-semibold text-teal-900 text-center">Appeler</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border border-teal/10 bg-teal-light p-2.5">
            <MapPin className="h-4 w-4 text-teal" />
            <span className="text-[10px] font-semibold text-teal-900 text-center">Itinéraire</span>
          </div>
          <div
            className={[
              'flex flex-col items-center gap-1 rounded-xl border p-2.5',
              profile.siteWeb
                ? 'border-teal/10 bg-teal-light'
                : 'border-gray-100 bg-gray-50 opacity-60',
            ].join(' ')}
          >
            <Globe className={`h-4 w-4 ${profile.siteWeb ? 'text-teal' : 'text-gray-400'}`} />
            <span
              className={`text-[10px] text-center ${profile.siteWeb ? 'font-semibold text-teal-900' : 'text-gray-400'}`}
            >
              Site web
            </span>
          </div>
        </div>

        <article className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
          <h3 className="text-sm font-semibold text-gray-900">À propos</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            {profile.description || 'Ajoutez une description pour présenter votre paroisse aux fidèles.'}
          </p>
          {profile.adresse ? (
            <p className="mt-2 flex items-start gap-2 text-xs text-gray-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
              {profile.adresse}
            </p>
          ) : null}
        </article>

        <article className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
          <h3 className="text-sm font-semibold text-gray-900">Horaires du secrétariat</h3>
          {profile.horaires.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {profile.horaires.map((h) => (
                <li key={h} className="flex gap-2 text-xs text-gray-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {h}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-gray-500">Indiquez vos horaires d&apos;accueil au secrétariat.</p>
          )}
        </article>
      </div>
    </div>
  );
}
