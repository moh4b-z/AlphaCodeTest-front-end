// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean;
  status_code: number;
  message: string;
  data?: T;
}

// Tipos de Telefone
export interface Telefone {
  id: number;
  numero: string;
  e_celular: boolean;
  tem_whatsapp: boolean;
  permite_sms: boolean;
}

export interface TelefoneCelularInput {
  numero: string;
  tem_whatsapp: boolean;
  permite_sms: boolean;
}

export interface TelefoneFixoInput {
  numero: string;
}

// Tipos de Profissão
export interface Profissao {
  id: number | string;
  nome: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos de Contato
export interface Contato {
  id: number | string;
  nome: string;
  email: string;
  data_nascimento: string; // formato DD/MM/YYYY
  idade: number;
  permite_notificacao_email: boolean;
  profissao: {
    id: number | string;
    nome: string;
  };
  created_at: string;
  updated_at: string;
  telefones: Telefone[];
}

// Tipo para criar contato
export interface CriarContatoInput {
  nome: string;
  email: string;
  data_nascimento: string; // formato YYYY-MM-DD
  permite_notificacao_email: boolean;
  profissao: string;
  telefone_celular: TelefoneCelularInput; // obrigatório
  telefone_fixo?: TelefoneFixoInput; // opcional
}

// Tipo para editar contato (todos os campos são opcionais)
export interface EditarContatoInput {
  nome?: string;
  email?: string;
  data_nascimento?: string; // formato YYYY-MM-DD
  permite_notificacao_email?: boolean;
  profissao?: string;
  telefone_celular?: TelefoneCelularInput;
  telefone_fixo?: TelefoneFixoInput;
}
