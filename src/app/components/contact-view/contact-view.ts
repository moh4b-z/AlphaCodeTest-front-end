import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FillField } from '../fill-field/fill-field';
import { ContatosService, type Contato, type CriarContatoInput, type EditarContatoInput } from '../../../services';

@Component({
  selector: 'app-contact-view',
  imports: [CommonModule, FormsModule, FillField],
  templateUrl: './contact-view.html',
  styleUrl: './contact-view.css',
})
export class ContactView implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  // Dados do formulário
  formData = {
    nome: '',
    email: '',
    data_nascimento: '',
    profissao: '',
    telefone_fixo: '',
    telefone_celular: '',
    tem_whatsapp: false,
    permite_sms: false,
    permite_notificacao_email: false,
  };

  // Lista de contatos
  contatos: Contato[] = [];
  contatosFiltrados: Contato[] = [];
  searchTerm: string = '';
  
  // Estado
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  idadeError: string = '';
  
  // Modo de edição
  isEditMode: boolean = false;
  contatoEditandoId: number | null = null;
  
  // Modais
  showModalVisualizacao: boolean = false;
  showModalConfirmacao: boolean = false;
  contatoVisualizando: Contato | null = null;
  contatoDeletandoId: number | string | null = null;

  async ngOnInit() {
    await this.carregarContatos();
  }

  async carregarContatos() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      const response = await ContatosService.listarTodos();
      if (response.success && response.data) {
        this.contatos = response.data;
        this.contatosFiltrados = this.contatos;
        this.cdr.detectChanges();
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao carregar contatos';
      console.error('Erro ao carregar contatos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  buscarContatos() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.contatosFiltrados = this.contatos;
      return;
    }

    const termo = this.searchTerm.toLowerCase();
    this.contatosFiltrados = this.contatos.filter(contato =>
      contato.nome.toLowerCase().includes(termo) ||
      contato.email.toLowerCase().includes(termo)
    );
  }

  async buscarContatosAPI() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      await this.carregarContatos();
      return;
    }

    try {
      this.isLoading = true;
      const response = await ContatosService.buscarPorNome(this.searchTerm);
      if (response.success && response.data) {
        this.contatosFiltrados = response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      this.buscarContatos(); // Fallback para busca local
    } finally {
      this.isLoading = false;
    }
  }

  async salvarContato() {
    // Validações
    if (!this.validarFormulario()) {
      return;
    }

    try {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      // Formatar data para YYYY-MM-DD
      const dataFormatada = this.formatarDataParaAPI(this.formData.data_nascimento);

      if (this.isEditMode && this.contatoEditandoId) {
        // Editar contato existente
        const dadosEdicao: EditarContatoInput = {
          nome: this.formData.nome,
          email: this.formData.email,
          data_nascimento: dataFormatada,
          profissao: this.formData.profissao,
          permite_notificacao_email: this.formData.permite_notificacao_email,
        };

        // Adicionar telefone celular se preenchido
        if (this.formData.telefone_celular) {
          dadosEdicao.telefone_celular = {
            numero: this.limparTelefone(this.formData.telefone_celular),
            tem_whatsapp: this.formData.tem_whatsapp,
            permite_sms: this.formData.permite_sms,
          };
        }

        // Adicionar telefone fixo se preenchido
        if (this.formData.telefone_fixo) {
          dadosEdicao.telefone_fixo = {
            numero: this.limparTelefone(this.formData.telefone_fixo),
          };
        }

        const response = await ContatosService.editar(this.contatoEditandoId, dadosEdicao);
        if (response.success) {
          this.successMessage = 'Contato atualizado com sucesso!';
          this.cancelarEdicao();
        }
      } else {
        // Criar novo contato
        const novoContato: CriarContatoInput = {
          nome: this.formData.nome,
          email: this.formData.email,
          data_nascimento: dataFormatada,
          profissao: this.formData.profissao,
          permite_notificacao_email: this.formData.permite_notificacao_email,
          telefone_celular: {
            numero: this.limparTelefone(this.formData.telefone_celular),
            tem_whatsapp: this.formData.tem_whatsapp,
            permite_sms: this.formData.permite_sms,
          },
        };

        // Adicionar telefone fixo se preenchido
        if (this.formData.telefone_fixo) {
          novoContato.telefone_fixo = {
            numero: this.limparTelefone(this.formData.telefone_fixo),
          };
        }

        const response = await ContatosService.criar(novoContato);
        if (response.success) {
          this.successMessage = 'Contato criado com sucesso!';
          this.limparFormulario();
        }
      }

      await this.carregarContatos();
      this.cdr.detectChanges();
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        this.successMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao salvar contato';
      console.error('Erro ao salvar contato:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  visualizarContato(contato: Contato) {
    this.contatoVisualizando = contato;
    this.showModalVisualizacao = true;
  }

  fecharModalVisualizacao() {
    this.showModalVisualizacao = false;
    this.contatoVisualizando = null;
  }

  editarContato(contato: Contato) {
    this.isEditMode = true;
    this.contatoEditandoId = Number(contato.id);
    
    // Preencher formulário com dados do contato
    this.formData.nome = contato.nome;
    this.formData.email = contato.email;
    this.formData.data_nascimento = this.formatarDataParaInput(contato.data_nascimento);
    this.formData.profissao = contato.profissao.nome;
    this.formData.permite_notificacao_email = contato.permite_notificacao_email;

    // Preencher telefones
    const celular = contato.telefones.find(t => t.e_celular);
    const fixo = contato.telefones.find(t => !t.e_celular);

    if (celular) {
      this.formData.telefone_celular = celular.numero;
      this.formData.tem_whatsapp = celular.tem_whatsapp;
      this.formData.permite_sms = celular.permite_sms;
    }

    if (fixo) {
      this.formData.telefone_fixo = fixo.numero;
    }

    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao() {
    this.isEditMode = false;
    this.contatoEditandoId = null;
    this.limparFormulario();
  }

  abrirModalDeletar(id: number | string) {
    this.contatoDeletandoId = id;
    this.showModalConfirmacao = true;
  }

  fecharModalConfirmacao() {
    this.showModalConfirmacao = false;
    this.contatoDeletandoId = null;
  }

  async confirmarDelecao() {
    if (!this.contatoDeletandoId) return;

    try {
      const response = await ContatosService.deletar(Number(this.contatoDeletandoId));
      if (response.success) {
        this.successMessage = 'Contato deletado com sucesso!';
        await this.carregarContatos();
        this.fecharModalConfirmacao();
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao deletar contato';
      console.error('Erro ao deletar contato:', error);
    }
  }

  validarFormulario(): boolean {
    if (!this.formData.nome || this.formData.nome.trim() === '') {
      this.errorMessage = 'Nome é obrigatório';
      return false;
    }

    if (!this.formData.email || !this.validarEmail(this.formData.email)) {
      this.errorMessage = 'Email inválido';
      return false;
    }

    if (!this.formData.data_nascimento) {
      this.errorMessage = 'Data de nascimento é obrigatória';
      return false;
    }

    // Validar idade
    if (!this.validarIdade()) {
      this.errorMessage = this.idadeError;
      return false;
    }

    if (!this.formData.profissao || this.formData.profissao.trim() === '') {
      this.errorMessage = 'Profissão é obrigatória';
      return false;
    }

    if (!this.formData.telefone_celular || this.formData.telefone_celular.trim() === '') {
      this.errorMessage = 'Telefone celular é obrigatório';
      return false;
    }

    return true;
  }

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  validarIdade(): boolean {
    if (!this.formData.data_nascimento) {
      this.idadeError = '';
      return true;
    }

    const idade = this.calcularIdade(this.formData.data_nascimento);
    
    if (idade < 18) {
      this.idadeError = 'Não é permitido cadastrar menores de idade (mínimo 18 anos)';
      return false;
    }
    
    if (idade > 100) {
      this.idadeError = 'Data de nascimento inválida (idade máxima: 100 anos)';
      return false;
    }
    
    this.idadeError = '';
    return true;
  }

  onDataNascimentoChange() {
    this.validarIdade();
  }

  limparTelefone(telefone: string): string {
    return telefone.replace(/\D/g, '');
  }

  formatarDataParaAPI(data: string): string {
    // Se já está no formato YYYY-MM-DD, retorna
    if (data.includes('-') && data.split('-')[0].length === 4) {
      return data;
    }
    
    // Se está no formato DD/MM/YYYY, converte
    const parts = data.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    return data;
  }

  formatarDataParaInput(data: string): string {
    // Se está no formato DD/MM/YYYY, converte para YYYY-MM-DD
    const parts = data.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return data;
  }

  limparFormulario() {
    this.formData = {
      nome: '',
      email: '',
      data_nascimento: '',
      profissao: '',
      telefone_fixo: '',
      telefone_celular: '',
      tem_whatsapp: false,
      permite_sms: false,
      permite_notificacao_email: false,
    };
    this.errorMessage = '';
    this.idadeError = '';
  }

  getTelefoneCelular(contato: Contato): string {
    const celular = contato.telefones.find(t => t.e_celular);
    return celular?.numero || '-';
  }

  getTelefoneFixo(contato: Contato): string {
    const fixo = contato.telefones.find(t => !t.e_celular);
    return fixo?.numero || '-';
  }

  hasWhatsApp(contato: Contato): boolean {
    const celular = contato.telefones.find(t => t.e_celular);
    return celular?.tem_whatsapp || false;
  }

  allowsSMS(contato: Contato): boolean {
    const celular = contato.telefones.find(t => t.e_celular);
    return celular?.permite_sms || false;
  }
}
