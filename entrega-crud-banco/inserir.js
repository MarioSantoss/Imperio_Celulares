const {
    executarComConexao,
    lerId,
    lerTextoObrigatorio,
    lerValorMonetario,
} = require('./conexao');

const [clienteInformado, totalInformado, pagamentoInformado, statusInformado] = process.argv.slice(2);

if (!clienteInformado || !totalInformado || !pagamentoInformado || !statusInformado) {
    console.error('Uso: node inserir.js <id_cliente> <total> <forma_pagamento> <status>');
    process.exitCode = 1;
} else {
    let clienteId;
    let total;
    let formaPagamento;
    let status;

    try {
        clienteId = lerId(clienteInformado, 'O id do cliente');
        total = lerValorMonetario(totalInformado);
        formaPagamento = lerTextoObrigatorio(pagamentoInformado, 'A forma de pagamento');
        status = lerTextoObrigatorio(statusInformado, 'O status');
    } catch (erro) {
        console.error(erro.message);
        process.exitCode = 1;
    }

    if (clienteId && total && formaPagamento && status) {
        executarComConexao(async (conexao) => {
            const [resultado] = await conexao.execute(
                `INSERT INTO sales (customer_id, total, payment_method, status, sold_at)
                 VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                [clienteId, total, formaPagamento, status],
            );

            console.log(`Venda cadastrada com sucesso. ID gerado: ${resultado.insertId}`);
        });
    }
}
