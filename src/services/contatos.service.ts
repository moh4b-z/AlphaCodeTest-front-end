import { fetchAPI } from './api.config';
import type {
  ApiResponse,
  Contato,
  CriarContatoInput,
  EditarContatoInput,
} from './types';

/**
 * Serviço para gerenciar contatos
 */
export class ContatosService {
  /**
   * Lista todos os contatos
   * GET /api/contatos
   */
  static async listarTodos(): Promise<ApiResponse<Contato[]>> {
    return fetchAPI<ApiResponse<Contato[]>>('/contatos', {
      method: 'GET',
    });
  }

  /**
   * Busca um contato por ID
   * GET /api/contatos/:id
   */
  static async buscarPorId(id: number): Promise<ApiResponse<Contato>> {
    return fetchAPI<ApiResponse<Contato>>(`/contatos/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Busca contatos por nome (busca parcial)
   * GET /api/contatos/buscar?nome=
   */
  static async buscarPorNome(nome: string): Promise<ApiResponse<Contato[]>> {
    const queryParam = encodeURIComponent(nome);
    return fetchAPI<ApiResponse<Contato[]>>(`/contatos/buscar?nome=${queryParam}`, {
      method: 'GET',
    });
  }

  /**
   * Cria um novo contato
   * POST /api/contatos
   * 
   * Regras:
   * - telefone_celular é obrigatório
   * - telefone_fixo é opcional
   * - Email deve ser único
   * - Número de celular deve ser único
   * - data_nascimento formato: YYYY-MM-DD
   * - Telefone fixo não pode ter WhatsApp ou SMS
   */
  static async criar(dados: CriarContatoInput): Promise<ApiResponse<Contato>> {
    return fetchAPI<ApiResponse<Contato>>('/contatos', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  /**
   * Edita um contato existente
   * PUT /api/contatos/:id
   * 
   * Pode enviar apenas os campos que quer atualizar
   */
  static async editar(
    id: number,
    dados: EditarContatoInput
  ): Promise<ApiResponse<Contato>> {
    return fetchAPI<ApiResponse<Contato>>(`/contatos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  /**
   * Deleta um contato
   * DELETE /api/contatos/:id
   */
  static async deletar(id: number): Promise<ApiResponse<void>> {
    return fetchAPI<ApiResponse<void>>(`/contatos/${id}`, {
      method: 'DELETE',
    });
  }
}
