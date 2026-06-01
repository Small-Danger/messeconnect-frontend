export interface FideleNotification {
  id: string;
  type: string;
  titre: string;
  contenu: string;
  statut: 'envoyee' | 'lue';
  demandeMesseId?: string | null;
  dateEnvoi: string;
}

export interface FideleSettings {
  emailDemandes: boolean;
  emailPaiements: boolean;
  smsRappels: boolean;
  campagnesParoisse: boolean;
}

export const defaultFideleSettings: FideleSettings = {
  emailDemandes: true,
  emailPaiements: true,
  smsRappels: false,
  campagnesParoisse: true,
};
