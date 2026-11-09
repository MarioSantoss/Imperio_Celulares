const { executarComConexao } = require('./conexao');

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
        ORDER BY v.id
    `);

    if (vendas.length === 0) {
        console.log('Nenhuma venda cadastrada.');
        return;
    }

    console.table(vendas);
});
