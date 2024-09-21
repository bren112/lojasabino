import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseclient';
import './admin.css';

function Admin() {
    const [produtos, setProdutos] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = async () => {
        const { data, error } = await supabase.from('roupas').select('*');
        if (error) {
            console.error('Erro ao buscar produtos:', error.message);
        } else {
            setProdutos(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingProduct) {
            const { error } = await supabase
                .from('roupas')
                .update({ nome, descricao, preco, imagem })
                .eq('id', editingProduct.id);

            if (error) {
                setMessage('Erro ao editar produto: ' + error.message);
            } else {
                setMessage('Produto editado com sucesso!');
                fetchProdutos();
                resetForm();
            }
        } else {
            const { error } = await supabase
                .from('roupas')
                .insert([{ nome, descricao, preco, imagem }]);

            if (error) {
                setMessage('Erro ao criar produto: ' + error.message);
            } else {
                setMessage('Produto criado com sucesso!');
                fetchProdutos();
                resetForm();
            }
        }
    };

    const handleEdit = (produto) => {
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco);
        setImagem(produto.imagem);
        setEditingProduct(produto);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('roupas')
            .delete()
            .eq('id', id);

        if (error) {
            setMessage('Erro ao excluir produto: ' + error.message);
        } else {
            setMessage('Produto excluído com sucesso!');
            fetchProdutos();
        }
    };

    const resetForm = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setImagem('');
        setEditingProduct(null);
    };

    return (
        <div className="admin-container">
            <h1>Administração de Produtos</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="URL da Imagem"
                    value={imagem}
                    onChange={(e) => setImagem(e.target.value)}
                    required
                />
                <button type="submit">{editingProduct ? 'Salvar' : 'Criar'}</button>
                <button type="button" onClick={resetForm}>Cancelar</button>
            </form>

            {message && <p>{message}</p>}

            <h2>Produtos</h2>
            <ul>
                {produtos.map((produto) => (
                    <li key={produto.id}>
                        <strong>{produto.nome}</strong> - R${produto.preco.toFixed(2)}
                        <button onClick={() => handleEdit(produto)}>Editar</button>
                        <button onClick={() => handleDelete(produto.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;
