import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseclient'; // Supabase client configurado
import './admin.css';
import { Link } from 'react-router-dom';

function Admin() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
            fetchProdutos();
        }
    }, []);

    const fetchProdutos = async () => {
        const { data, error } = await supabase.from('roupas').select('*');
        if (!error) {
            setProdutos(data);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === 'mari' && password === 'marilinda') {
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            setMessage('');
            fetchProdutos();
        } else {
            setMessage('Usuário ou senha incorretos');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    const handleUpload = (event) => {
        const file = event.target.files[0];
        setImagem(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(preco) <= 0 || isNaN(parseFloat(preco))) {
            setMessage('Por favor, insira um valor de preço válido e positivo.');
            return;
        }

        let imagemUrl = '';
        if (imagem) {
            const { data, error } = await supabase
                .storage
                .from('imagens-roupa')
                .upload(`public/${imagem.name}`, imagem);

            if (error) {
                setMessage('Erro ao fazer upload da imagem: ' + error.message);
                return;
            }

            imagemUrl = supabase.storage
                .from('imagens-roupa')
                .getPublicUrl(`public/${imagem.name}`).data.publicUrl;
        }

        if (selectedId) {
            const { error } = await supabase
                .from('roupas')
                .update({ nome, descricao, preco: parseFloat(preco), imagem: imagemUrl })
                .match({ id: selectedId });

            if (error) {
                setMessage('Erro ao atualizar os dados: ' + error.message);
            } else {
                setMessage('Produto atualizado com sucesso!');
            }
        } else {
            const { error } = await supabase
                .from('roupas')
                .insert([{ nome, descricao, preco: parseFloat(preco), imagem: imagemUrl }]);

            if (error) {
                setMessage('Erro ao salvar os dados: ' + error.message);
            } else {
                setMessage('Produto cadastrado com sucesso!');
            }
        }

        resetForm();
        fetchProdutos();
    };

    const resetForm = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setImagem(null);
        setSelectedId(null);
    };

    const handleEdit = (produto) => {
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco);
        setSelectedId(produto.id);
    };

    const handleDelete = async (id) => {
        const { error } = await supabase.from('roupas').delete().match({ id });
        if (error) {
            setMessage('Erro ao excluir o produto: ' + error.message);
        } else {
            setMessage('Produto excluído com sucesso!');
            fetchProdutos();
        }
    };

    return (
        <div>
            {!isLoggedIn ? (
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <br/>
                    <Link to="/" className="nav__brand" id='p'>Voltar</Link>
                    <br/>
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Entrar</button>
                    {message && <p>{message}</p>}
                </form>
            ) : (
                <>
                    <h1 id='title'>Bem-vinda Mari ✨</h1>
                    <br/>
                    <div className="bts">
                        <Link to="/" className="nav__brand" id='p'><button id='editar'>Voltar</button></Link>
                        <button id='excluir' onClick={handleLogout}>Sair</button>
                    </div>
                    <br/>
                    <br/>

                    <form onSubmit={handleSubmit}>
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                        <br />
                        <label>Descrição:</label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                        />
                        <br />
                        <label>Preço (somente valores positivos):</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            required
                        />
                        <br />
                        <label>Imagem:</label>
                        <input
                            type="file"
                            onChange={handleUpload}
                            required
                        />
                        <br />
                        <button type="submit">{selectedId ? 'Atualizar Produto' : 'Cadastrar Produto'}</button>
                    </form>
                    {message && <p>{message}</p>}

                    <h2>Produtos Cadastrados</h2>
                    <div className="produtos-list">
                        {produtos.map(produto => (
                            <div className="produto-card" key={produto.id}>
                                <img src={produto.imagem} alt={produto.nome} />
                                <h3>{produto.nome}</h3>
                                
                                {/* <button onClick={() => handleEdit(produto)}>Editar</button> */}
                                <button id='excluir' onClick={() => handleDelete(produto.id)}>Excluir</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Admin;
