# CRUD da Império Celulares

**Banco:** `imperio_crud`  
**Tabela principal:** `sales` (vendas), relacionada a clientes e vendedores.  
**Integrantes:** preencher com os nomes do grupo.

Esta entrega usa Node.js e `mysql2/promise`. O esquema de vendas e suas relações foi baseado no banco do projeto. O SQL mantém um item ligado à venda de id `1` para permitir demonstrar o erro de exclusão por chave estrangeira.

## Preparação

1. Instale o MySQL Server e o Node.js.
2. Na pasta `entrega-crud-banco`, instale a dependência:

   ```powershell
   npm install
   ```

3. Crie o banco e os dados de demonstração:

   ```powershell
   mysql -u root -p < banco.sql
   ```

   O script cria o banco `imperio_crud`, as tabelas relacionadas e 10 vendas de exemplo.

4. Configure as variáveis de conexão no PowerShell, ajustando usuário, senha e endereço para seu MySQL:

   ```powershell
   $env:DB_HOST = "localhost"
   $env:DB_PORT = "3306"
   $env:DB_USER = "root"
   $env:DB_PASSWORD = "sua_senha"
   $env:DB_NAME = "imperio_crud"
   ```

As variáveis precisam estar configuradas na mesma janela do terminal usada para executar os comandos.

## Executar o CRUD

Todos os comandos também podem ser executados como `npm run listar`, `npm run buscar -- 1`, `npm run inserir -- 1 199.90 Pix concluida`, `npm run atualizar -- 11 189.90 Pix concluida` e `npm run excluir -- 11`.

| Arquivo | Operação | Exemplo |
|---|---|---|
| `listar.js` | Lista vendas com nome do cliente e vendedor | `node listar.js` |
| `inserir.js` | Cadastra uma venda e mostra o id gerado | `node inserir.js 1 199.90 Pix concluida` |
| `buscar.js` | Busca uma venda pelo id | `node buscar.js 1` |
| `atualizar.js` | Atualiza total, pagamento e status | `node atualizar.js 11 189.90 Pix concluida` |
| `excluir.js` | Exclui uma venda pelo id | `node excluir.js 11` |

Para a apresentação, execute `inserir.js`, copie o id exibido e use esse id em `buscar.js`, `atualizar.js` e `excluir.js`. Os ids dos exemplos podem mudar após novas inserções.

## Demonstração dos erros de chave estrangeira

- Inserção com cliente inexistente: `node inserir.js 999999 100.00 Pix concluida`
- Exclusão de venda que possui item vinculado: `node excluir.js 1`

O programa usa `?` e valores separados em todos os comandos SQL com dados do terminal. UPDATE e DELETE filtram pela chave primária `id`, e as operações de alteração verificam `affectedRows`. As conexões são fechadas ao final de cada execução.

## DER

O diagrama do esquema entregue está em [`der.svg`](./der.svg).

**Observação sobre a exclusão:** no esquema Laravel atual, `sale_items.sale_id` é excluído em cascata. Neste banco didático isolado, essa relação usa `ON DELETE RESTRICT` para que o requisito de erro ao excluir um registro referenciado possa ser demonstrado. Essa alteração vale apenas para `imperio_crud`; ela não modifica o banco de dados do aplicativo.
