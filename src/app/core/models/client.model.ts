export interface ContactItem {
  name: string;
  email: string;
  role?: string;
}

export interface LinkItem {
  url: string;
  label: string;
}

export type ClientStatus = 'active' | 'archived';

export interface Client {
  id: string;
  name: string;
  sector?: string;
  website?: string;
  links: LinkItem[];
  contacts: ContactItem[];
  notes?: string;
  logo_path?: string;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
}

export interface ClientCreate {
  name: string;
  sector?: string;
  website?: string;
  links: LinkItem[];
  contacts: ContactItem[];
  notes?: string;
  status: ClientStatus;
}

export type ClientUpdate = Partial<ClientCreate>;
