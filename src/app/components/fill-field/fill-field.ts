import { Component, Input, Output, EventEmitter, OnInit, forwardRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ProfissoesService, type Profissao } from '../../../services';

@Component({
  selector: 'app-fill-field',
  imports: [CommonModule, FormsModule],
  templateUrl: './fill-field.html',
  styleUrl: './fill-field.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FillField),
      multi: true
    }
  ]
})
export class FillField implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'date' | 'tel' | 'select' = 'text';
  @Input() disabled: boolean = false;
  @Input() maxLength: number = 0;
  @Output() valueChange = new EventEmitter<string>();
  
  showCharacterWarning: boolean = false;

  value: string = '';
  profissoes: Profissao[] = [];
  filteredProfissoes: Profissao[] = [];
  showSuggestions: boolean = false;
  isLoadingProfissoes: boolean = false;
  searchTerm: string = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  async ngOnInit() {
    if (this.type === 'select') {
      await this.carregarProfissoes();
    }
  }

  async carregarProfissoes() {
    try {
      this.isLoadingProfissoes = true;
      const response = await ProfissoesService.listarTodas();
      if (response.success && response.data) {
        this.profissoes = response.data;
        this.filteredProfissoes = this.profissoes;
      }
    } catch (error) {
      console.error('Erro ao carregar profissões:', error);
      alert('Erro ao carregar profissões. Por favor, tente novamente.');
    } finally {
      this.isLoadingProfissoes = false;
    }
  }

  onInputChange(newValue: string) {
    // Validar limite de caracteres
    if (this.maxLength > 0 && newValue.length > this.maxLength) {
      this.showCharacterWarning = true;
      return; // Não permite digitar mais
    }
    
    this.showCharacterWarning = false;
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);

    // Se for select, filtrar profissões
    if (this.type === 'select') {
      this.searchTerm = newValue;
      this.filterProfissoes(newValue);
      this.showSuggestions = true;
    }
  }

  filterProfissoes(term: string) {
    if (!term || term.trim() === '') {
      this.filteredProfissoes = this.profissoes;
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.filteredProfissoes = this.profissoes.filter(prof =>
      prof.nome.toLowerCase().includes(lowerTerm)
    );
  }

  selectProfissao(profissao: Profissao) {
    this.value = profissao.nome;
    this.searchTerm = profissao.nome;
    this.onChange(profissao.nome);
    this.onTouched();
    this.valueChange.emit(profissao.nome);
    this.showSuggestions = false;
  }

  onFocus() {
    if (this.type === 'select') {
      this.showSuggestions = true;
    }
  }

  onBlur() {
    // Delay para permitir clique na sugestão
    setTimeout(() => {
      this.showSuggestions = false;
      this.onTouched();
    }, 150);
  }

  formatPhoneNumber(value: string): string {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata de acordo com o tamanho
    if (numbers.length <= 10) {
      // Telefone fixo: (11) 4033-2019
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    } else {
      // Celular: (11) 98493-2039
      return numbers
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formatted = this.formatPhoneNumber(input.value);
    input.value = formatted;
    this.onInputChange(formatted);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
    this.searchTerm = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Listener global para fechar dropdown ao clicar fora
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.type === 'select' && this.showSuggestions) {
      const target = event.target as HTMLElement;
      const clickedInside = target.closest('.select-wrapper');
      if (!clickedInside) {
        this.showSuggestions = false;
      }
    }
  }
}
