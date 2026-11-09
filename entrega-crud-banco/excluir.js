const { executarComConexao, lerId } = require('./conexao');

const [idInformado] = process.argv.slice(2);

if (!idInformado) {
    console.error('Uso: node excluir.js <id>');
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
            const [resultado] = await conexao.execute('DELETE FROM sales WHERE id = ?', [id]);

            if (resultado.affectedRows === 0) {
                console.log(`Venda ${id} não encontrada.`);
                return;
            }

            console.log(`Venda ${id} excluída com sucesso.`);
        });
    }
}
