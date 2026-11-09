const mysql = require('mysql2/promise');

function criarConexao() {
    const obrigatorias = ['DB_HOST', 'DB_USER', 'DB_NAME'];
    const faltando = obrigatorias.filter((variavel) => !process.env[variavel]);

    if (faltando.length > 0) {
        throw new Error(`Configure as variáveis de ambiente: ${faltando.join(', ')}.`);
    }

    const port = Number(process.env.DB_PORT || 3306);

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error('DB_PORT precisa ser um número entre 1 e 65535.');
    }

    return mysql.createConnection({
        host: process.env.DB_HOST,
        port,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME,
    });
}

async function executarComConexao(operacao) {
    let conexao;

    try {
        conexao = await criarConexao();
        await operacao(conexao);
    } catch (erro) {
        if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
            console.error('Chave estrangeira inválida: o cliente ou vendedor informado não existe.');
        } else if (erro.code === 'ER_ROW_IS_REFERENCED_2') {
            console.error('Não foi possível excluir: esta venda possui itens vinculados.');
        } else {
            console.error(`Erro: ${erro.message}`);
        }

        process.exitCode = 1;
    } finally {
        if (conexao) {
            try {
                await conexao.end();
            } catch (erro) {
                console.error(`Não foi possível fechar a conexão com o banco: ${erro.message}`);
                process.exitCode = 1;
            }
        }
    }
}

function lerId(valor, campo) {
    const id = Number(valor);

    if (!Number.isSafeInteger(id) || id < 1) {
        throw new Error(`${campo} precisa ser um número inteiro positivo.`);
    }

    return id;
}

function lerValorMonetario(valor) {
    const valorNormalizado = valor.trim().replace(',', '.');

    if (!/^\d+(\.\d{1,2})?$/.test(valorNormalizado)) {
        throw new Error('O total precisa ser um valor monetário válido com até duas casas decimais.');
    }

    const total = Number(valorNormalizado);

    if (!Number.isFinite(total) || total <= 0 || total >= 100000000) {
        throw new Error('O total precisa ser maior que zero e menor que 100.000.000.');
    }

    return total.toFixed(2);
}

function lerTextoObrigatorio(valor, campo) {
    const texto = valor.trim();

    if (texto.length === 0) {
        throw new Error(`${campo} não pode ficar vazio.`);
    }

    return texto;
}

module.exports = {
    executarComConexao,
    lerId,
    lerTextoObrigatorio,
    lerValorMonetario,
};
