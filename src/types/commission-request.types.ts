import type { CommissionRequestStatus } from "./enums/commission-status.enums";

export interface CommissionRequestContacts {
  telegram: string;
  instagram: string;
  whatsapp: string;
}

export interface CommissionRequestResponse {
  id: string;
  userId: string;
  topicId: string;

  title: string;
  description: string;

  budgetMin: number;
  budgetMax: number;

  deadline: string; // YYYY-MM-DD

  contacts: CommissionRequestContacts;

  artistNote: string | null;

  status: CommissionRequestStatus;

  createdAt: string;
  updatedAt: string;
}

export interface CommissionRequestCreateRequest {
  userId: string;
  topicId: string;

  title: string;
  description: string;

  budgetMin: number;
  budgetMax: number;

  deadline: string;

  contacts: CommissionRequestContacts;

  status: CommissionRequestStatus;

  city?: string;
  longitude?: number;
  latitude?: number;
}

export interface CommissionRequestUpdateRequest {
  description: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;

  contacts: CommissionRequestContacts;

  status: CommissionRequestStatus;
}

export interface CommissionRequestArtistNoteUpdateRequest {
  artistNote: string;
}

export interface CommissionRequestNearbyParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
}