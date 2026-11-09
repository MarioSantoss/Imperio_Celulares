const { executarComConexao, lerId } = require('./conexao');

const [idInformado] = process.argv.slice(2);

if (!idInformado) {
    console.error('Uso: node buscar.js <id>');
    process.exitCode = 1;
} else {
    let id;

    try {
        id = lerId(idInformado, 'O id');
    } catch (erro) {
        console.error(erro.message);
        process.exitCode = 1;
    }

    if (id) {
        executarComConexao(async (conexao) => {
            const [vendas] = await conexao.execute(`
                SELECT
                    v.id,
                    c.name AS cliente,
                    u.name AS vendedor,
                    v.total,
                    v.payment_method AS forma_pagamento,
                    v.status,
                    v.sold_at AS data_venda
                FROM sales AS v
                LEFT JOIN customers AS c ON c.id = v.customer_id
                LEFT JOIN users AS u ON u.id = v.user_id
                WHERE v.id = ?
            `, [id]);

            if (vendas.length === 0) {
                console.log(`Venda ${id} não encontrada.`);
                return;
            }

            console.table(vendas);
        });
    }
}
