## FinAPI - Financeira

### Requisitos

- [x] Deve ser possivel criar um conta
- [x] Deve ser possivel buscar o extrato bancaria do cliente
- [x] Deve ser possivel realizar um depósito
- [x] Deve ser possivel realizar um saque
- [] Deve ser possivel buscar o extrato bancario do cliente por data
- [] Deve ser possivel atulizar dados da conta do cliente
- [] Deve ser possivel obter dados da conta do cliente
- [] Deve ser possivel deletar uma conta

## Regras de negócio

- [x] Não deve ser possivel cadastrar uma conta com o cpf já existente
- [x] Não deve ser possivel fazer depósito em uma conta não existente
- [x] Não deve ser possivel buscar extrato em uma conta não existente
- [x] Não deve ser possivel fazer saque em uma conta não existente
- [] Não deve ser possivel excluir uma conta não existente
- [] Não deve ser possivel fazer saque quando o saldo for insuficiente