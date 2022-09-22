import {client,db} from '../../database/dbConnection.js'

const collection = client.db(db).collection('loja')

//Retorna produtos ordenados de acordo com o campo definido em orderBy
//e ordenados na ordem definida por reverse, se verdadeiro ordem reversa (ASC)
const getAllProdutos = async (orderBy='id_prod', reverse = false) => {
    try {
        let ordem
        let resultados = []
        if(reverse == true){
            ordem = -1;
        }else{
            ordem = 1;
        }
        console.log('getAllProdutos')
        let filter = {sort:{[orderBy]:ordem}}
        console.log(filter);
        resultados = await collection.find({},filter).toArray() 
        return resultados;
    } catch (error) {
        console.log(error)
        return false;
    }
}

// Busca produto definido por id_prod igual ao campo id_prod
const getProdutoById = async (id_prod) => {
    try {
        let produto = {}
    
        //implementar aqui
        let filter = {id_prod:Number(id_prod)}
        produto = await collection.find(filter).toArray() 
        
        return produto;
    } catch (error) {
        console.log(error)
        return false;
    }
}

//Registra um novo produto no banco, 
//retorna verdadeiro se inserido com sucesso
//API - Testar com cliente HTTP
const insertProduto = async (produto) => {
    try {
        console.log(produto)
        // implementar aqui
        const inserir = await client.db('loja').collection('loja').insertOne(produto);
        console.log(inserir);

        return true 
    } catch (error) {
        console.log(error)
        return false;
    }
}

// //Atualiza um produto no banco
// //retorna verdadeiro se atualizado com sucesso
// // //API - Testar com cliente HTTP
const updateProduto = async (new_produto) => {
    try {
        //implementar aqui

        const id = Number(new_produto.id_prod);
    
        const filter = {
            id_prod: id
        };
        console.log(filter);
        console.log(new_produto)
        const collection = client.db('loja').collection('loja');
        let updated = await collection.updateOne(filter,{$set:new_produto});
        console.log(updated)
        if (updated.modifiedCount)
        return true
        else throw new Error('DAO: Erro ao atualizar produto!')
    } catch (error) {
        console.log(error)
        return false;
    }
}

// // //Remove um produto do banco
// // //API - Testar com cliente HTTP
const deleteProduto = async (id_prod) => {
    try {
        //implementar aqui
        let filter = {
            id_prod:Number(id_prod)
        }
        const collection = client.db('loja').collection('loja');
        let deleted = await collection.deleteOne(filter);
        if(deleted)
        return deleted
        else throw new Error('DAO: Erro ao deletar produto!')

    } catch (error) {
        console.log(error)
        return false;
    }
}

// // //API - Testar com cliente HTTP
const deleteManyProdutos = async (ids) => {
    try {
        //implementar aqui
      
        const filter = {id_prod:{$in:ids}};
        const collection = client.db('loja').collection('loja');
        const deletedAll = await collection.deleteMany(filter);
        
        if(deletedAll)        
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
        const termo = term
        const filtro = {
            $text:{
                $search: termo,
            }
        }
        const collection = client.db('loja').collection('loja');
        resultados = await collection.find(filtro).toArray();
        return resultados;
    } catch (error) {
        console.log(error)
        return false;
    }
}

const getProdutosPriceRange = async (greater = 0, less = 0, sort = 1) => {
    try {
        let resultados = []     
        //implementar aqui
        const filtro = {
            $and:[ // V e V -> V
                {preco:{$gte:greater}},
                {preco:{$lte:less}}
            ]
        }
        resultados = await client.db('loja').collection('loja').find(filtro).toArray()    
        return resultados;
    } catch (error) {
        console.log(error)
        return false;
    }
}

const changeIndexes = async (field) => {

    const indexes = await collection.indexes()
    const textIndexes = indexes.filter(index => index.key?._fts === 'text')
   
    textIndexes.forEach(async index =>{ 
        if(index.name !== field + '_text')
            await collection.dropIndex(index.name)
    })

    if(!textIndexes.length){
        let newIndex = {}
        newIndex[field] = 'text' //field = 'nome' => {nome:'text'}
        collection.createIndex(newIndex)
    }
}

export {
    getAllProdutos,
    getProdutoById,
    insertProduto,
    updateProduto,
    deleteProduto,
    deleteManyProdutos,
    getFiltredProdutos,
    getProdutosPriceRange
}