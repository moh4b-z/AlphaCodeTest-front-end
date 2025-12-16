# AlphaCodeTest - Front End

Aplicação Angular para cadastro e gerenciamento de contatos com integração a uma API REST.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 22+ recomendada): [Download](https://nodejs.org/)
- **npm** (gerenciador de pacotes, incluído com Node.js)
- **Git** (opcional, para clonar o repositório): [Download](https://git-scm.com/)

### Clonar o repositório

```bash
git clone https://github.com/moh4b-z/AlphaCodeTest-front-end.git
```

### Instalar dependências

```bash
npm install
```

## Executando o projeto

### Desenvolvimento (com hot-reload)

```bash
npm start
```


## Configuração da API

A aplicação conecta à seguinte API:

```
http://localhost:8000/api
```

Ou se mudou a rota da API mude no arquivo api.config.ts dentro de services.


## Campos do Formulário

### Obrigatórios:
- **Nome completo**: Máximo 100 caracteres
- **E-mail**: Validação de formato
- **Data de nascimento**: Idade entre 18 e 100 anos
- **Profissão**: Com autocomplete
- **Celular**: Formatação automática (11) 98493-2039

### Opcionais:
- **Telefone fixo**: Formatação automática (11) 4033-2019
- **Whatsapp**: Checkbox (número de celular possui Whatsapp)
- **Notificações por SMS**: Checkbox
- **Notificações por E-mail**: Checkbox

