import {client,db} from '../../database/dbConnection.js'

const collection = client.db(db).collection('produtos')

//Retorna produtos ordenados de acordo com o campo definido em orderBy
//e ordenados na ordem definida por reverse, se verdadeiro ordem reversa (ASC)
const getAllProdutos = async (orderBy='id_prod', reverse = false) => {
    try {
        console.log('getAllProdutos')
        let resultados = [];
        //implementar aqui
        let filtro = {
            $sort:{orderby:1},
        }
        const collection = client.db('loja').collection('produtos')
        resultados = await collection.find(filtro).toArray()
        // console.table(resultados)

        return resultados;
    } catch (error) {
        console.log(error)
        return false;
    }
}

//Busca produto definido por id_prod igual ao campo id_prod
// const getProdutoById = async (id_prod) => {
//     try {
//         let produto = {}
        
//         //implementar aqui
        
//         return produto;
//     } catch (error) {
//         console.log(error)
//         return false;
//     }
// }

//Registra um novo produto no banco, 
//retorna verdadeiro se inserido com sucesso
//API - Testar com cliente HTTP
// const insertProduto = async (produto) => {
//     try {
//         console.log(produto)
//         //implementar aqui
        
//         return true 
//     } catch (error) {
//         console.log(error)
//         return false;
//     }
// }

// //Atualiza um produto no banco
// //retorna verdadeiro se atualizado com sucesso
// //API - Testar com cliente HTTP
const updateProduto = async (new_produto) => {
    try {
        
        //implementar aqui
        const filter = {id_prod:11};
        const newProduto = {
            preco:1500
        }
        const collection = client.db('loja').collection('produtos');
        const resultado = await collection.updateOne(filter, {$set: newProduto});

        let updated
        if (updated) return true
        else throw new Error('DAO: Erro ao atualizar produto!')
    } catch (error) {
        console.log(error)
        return false;
    }
}

// //Remove um produto do banco
// //API - Testar com cliente HTTP
const deleteProduto = async (id_prod) => {
    try {
        //implementar aqui
        const filter = id_prod;
        const collection = client.db('loja').collection('produtos');
        const resultado = await collection.deleteOne(filter);
        let deleted = true;
        return deleted
    } catch (error) {
        console.log(error)
        return false;
    }
}

// //API - Testar com cliente HTTP
const deleteManyProdutos = async (ids) => {
    try {
        //implementar aqui
        const filter = {id_prod:{in:[118,119,120]}};
        const collection = client.db('loja').collection('produtos');
        const resultado = await collection.deleteMany(filter);

        let deletedAll = true;
        
        return deletedAll 
    } catch (error) {
        console.log(error)
        return false;
    }
}

const getFiltredProdutos = async (field = 'nome', term = '') => {
    try {
        let resultados=[]
        console.log({ field, term })
        await changeIndexes(field) //troca de indices
  
        //implementar aqui
        
        return resultados;
    } catch (error) {
        console.log(error)
        return false;
    }
}

// const getProdutosPriceRange = async (greater = 0, less = 0, sort = 1) => {
//     try {
//         let resultados = []
        
//         //implementar aqui
        
//         return resultados;
//     } catch (error) {
//         console.log(error)
//         return false;
//     }
// }

// const changeIndexes = async (field) => {

//     const indexes = await collection.indexes()
//     const textIndexes = indexes.filter(index => index.key?._fts === 'text')
   
//     textIndexes.forEach(async index =>{ 
//         if(index.name !== field + '_text')
//             await collection.dropIndex(index.name)
//     })

//     if(!textIndexes.length){
//         let newIndex = {}
//         newIndex[field] = 'text' //field = 'nome' => {nome:'text'}
//         collection.createIndex(newIndex)
//     }
// }

export {
    getAllProdutos,
    // getProdutoById,
    // insertProduto,
    // updateProduto,
    // deleteProduto,
    // deleteManyProdutos,
    // getFiltredProdutos,
    // getProdutosPriceRange
}