import * as model from '../models/produtosDao.js'

const index = async (req, res) => {
    let listProds
    console.log(req.query)
    if (req.query.order) {
        let orderBy = req.query.order
        let reverse = +req.query.reverse ? true : false
        listProds = await model.getAllProdutos(orderBy, reverse);
    } else if (req.query.field && req.query.search) {
        listProds = await model.getFiltredProdutos(req.query.field, req.query.search);
    } else {
        listProds = await model.getAllProdutos();
    }
    if (!listProds)
        return res.status(404).send({ "message": "Sem resultados" })
    res.send(listProds);
}

const filterPrice = async (req, res) => {
    let status = 500;
    try {
        if (!req.query.greater || !req.query.less) {
            status = 401;
            throw new Error('Faltam parâmetros!')
        }
        const greater = Number(req.query.greater)
        const less = Number(req.query.less)
        const sort = req.query.sort ? req.query.sort : -1
        const listProds = await model.getProdutosPriceRange(greater, less, sort)
        if (!listProds)
            return res.status(404).send({ "message": "Sem resultados" })
        res.send(listProds)
    } catch (error) {
        const mensagem = { erro: error }
        console.log(mensagem)
        res.status(status);
        res.send(mensagem)
    }
}

const show = async (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
    const produto = await model.getProdutoById(req.params.id)
    console.log(produto)
    res.send(produto)
}

const store = async (req, res) => {
    try {
        const formData = req.body;
        console.log(formData, req.body)
        console.log(formData, { ...req.body })
        const produto = {
            id_prod: +formData.id_prod,
            nome: formData.nome,
            descricao: formData.descricao,
            qtd_estoque: +formData.qtd_estoque,
            preco: +formData.preco,
            importado: formData.importado ? true : false,
            desconto: formData.desconto ? +formData.desconto : null
        }

        if (!produto.preco && formData.preco.indexOf(','))
            produto.preco = +formData.preco.replace(',', '.')

        if (await model.insertProduto(produto))
            res.send({
                mensagem: "Produto Inserido!!",
                produto: produto
            })
        else throw new Error("Erro ao inserir produto!")
    } catch (error) {
        const mensagem = { erro: error }
        console.log(mensagem)
        res.status(500);
        res.send(mensagem)
    }
}

const update = async (req, res) => {
    try {
        const formData = req.body;
        console.log({ query: req.params, body: formData })

        if (!req.params.id || req.params.id == 'undefined')
            throw new Error("O ID do produto é obrigatório")

        const newProduto = {}
        newProduto.id_prod = +req.params.id
        formData.qtd_estoque && (newProduto.qtd_estoque = +formData.qtd_estoque)

        if (formData.preco && formData.preco.indexOf(',')) {
            formData.preco = formData.preco.replace(',', '.')
            newProduto.preco = +formData.preco
        }

        formData.importado && (newProduto.importado = true)
        formData.desconto && (newProduto.desconto = +formData.desconto)

        if (!(await model.updateProduto(newProduto)))
            throw new Error("Erro ao atualizar produto!")
        res.send({
            mensagem: "Produto Atualizado!!",
            produto: newProduto
        })
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send({ Error: error.message })
    }
}

const remove = async (req, res) => {
    let status = 500;
    try {
        console.log({ query: req.params })
        if (!req.params.id || !req.params.id === 'undefined') {
            res.status = 400;
            throw new Error("Erro, falta o parâmetro ID na url!")
        }
        const id = parseInt(req.params.id)
        if (!(await model.deleteProduto(id)))
            throw new Error("Erro ao remover o produto!")
        res.send({
            success: `Produto ID:${id}  removido com sucesso!`,
        })
    } catch (error) {
        console.log(error)
        res.status(status);
        res.send({ Error: error.message })
    }
}

const removeMany = async (req, res) => {
    let status = 500;
    try {
        console.log({ query: req.body })
        if (!req.body.ids || !req.body.ids === 'undefined') {
            res.status = 400;
            throw new Error("Erro, falta o parâmetro com os IDs no corpo da requisição!")
        }

        let ids = req.body.ids.map(id => Number(id))

        if (!(await model.deleteManyProdutos(ids)))
            throw new Error("Erro ao remover o produtos!")
        res.send({
            success: `Produtos removidos com sucesso!`,
            ids: req.body.ids
        })
    } catch (error) {
        console.log(error)
        res.status(status);
        res.send({ Error: error.message })
    }
}
export { index, show, store, update, remove, removeMany, filterPrice }