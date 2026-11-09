const {
    executarComConexao,
    lerId,
    lerTextoObrigatorio,
    lerValorMonetario,
} = require('./conexao');

const [idInformado, totalInformado, pagamentoInformado, statusInformado] = process.argv.slice(2);

if (!idInformado || !totalInformado || !pagamentoInformado || !statusInformado) {
    console.error('Uso: node atualizar.js <id> <total> <forma_pagamento> <status>');
    process.exitCode = 1;
} else {
    let id;
    let total;
    let formaPagamento;
    let status;

    try {
        id = lerId(idInformado, 'O id');
        total = lerValorMonetario(totalInformado);
        formaPagamento = lerTextoObrigatorio(pagamentoInformado, 'A forma de pagamento');
        status = lerTextoObrigatorio(statusInformado, 'O status');
    } catch (erro) {
        console.error(erro.message);
        process.exitCode = 1;
    }

    if (id && total && formaPagamento && status) {
        executarComConexao(async (conexao) => {
            const [resultado] = await conexao.execute(
                `UPDATE sales
                 SET total = ?, payment_method = ?, status = ?
                 WHERE id = ?`,
                [total, formaPagamento, status, id],
            );

            if (resultado.affectedRows > 0) {
                console.log(`Venda ${id} atualizada com sucesso.`);
                return;
            }

            const [vendas] = await conexao.execute('SELECT id FROM sales WHERE id = ?', [id]);

            if (vendas.length === 0) {
                console.log(`Venda ${id} não encontrada.`);
                return;
            }

            console.log(`Venda ${id} já possuía esses valores.`);
        });
    }
}
