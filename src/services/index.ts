// Exporta todos os serviços e tipos
export { ContatosService } from './contatos.service';
export { ProfissoesService } from './profissoes.service';
export { API_CONFIG, fetchAPI } from './api.config';
export type {
  ApiResponse,
  Telefone,
  TelefoneCelularInput,
  TelefoneFixoInput,
  Profissao,
  Contato,
  CriarContatoInput,
  EditarContatoInput,
} from './types';
