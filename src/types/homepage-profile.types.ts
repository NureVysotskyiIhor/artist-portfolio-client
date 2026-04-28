export interface HomepageProfileContacts {
  telegram: string;
  instagram: string;
  whatsapp: string;
}

export interface HomepageProfileResponse {
  id: string;
  email: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  achievements: string[];
  contacts: HomepageProfileContacts;
  isActive: boolean;
}

export interface HomepageProfileCreateRequest {
  name: string;
  email: string;
  contacts: HomepageProfileContacts;
}

export interface HomepageProfileUpdateRequest {
  email?: string;
  name?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  achievements?: string[];
  contacts?: HomepageProfileContacts;
  isActive?: boolean;
}
