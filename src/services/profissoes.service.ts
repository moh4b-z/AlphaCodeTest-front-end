import { fetchAPI } from './api.config';
import type { ApiResponse, Profissao } from './types';

/**
 * Serviço para gerenciar profissões
 */
export class ProfissoesService {
  /**
   * Lista todas as profissões
   * GET /api/profissoes
   */
  static async listarTodas(): Promise<ApiResponse<Profissao[]>> {
    return fetchAPI<ApiResponse<Profissao[]>>('/profissoes', {
      method: 'GET',
    });
  }

  /**
   * Busca profissões por nome (busca parcial)
   * GET /api/profissoes/buscar?nome=
   */
  static async buscarPorNome(nome: string): Promise<ApiResponse<Profissao[]>> {
    const queryParam = encodeURIComponent(nome);
    return fetchAPI<ApiResponse<Profissao[]>>(`/profissoes/buscar?nome=${queryParam}`, {
      method: 'GET',
    });
  }
}
