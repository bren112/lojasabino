import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseclient';
import './home.css';

function Home() {
    const [produtos, setProdutos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

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

    const openModal = (produto) => {
        setProdutoSelecionado(produto);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setProdutoSelecionado(null);
    };

    const handleClickOutside = (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    };

    return (
        <>
            <br />
            <h1 id='title'>Roupas Seminovas da <span id='span'>Mari✨!</span></h1>
            <div className="produtos-container">
                {produtos.map((produto) => (
                    <div key={produto.id} className="produto-card">
                        <h2>{produto.nome}</h2>
                        <br/>
                        <img src={produto.imagem} alt={produto.nome} />
                        <br/>
                        <br/>

                        <p>{produto.descricao}</p>
                        <br/>

                        <p>{produto.preco.toFixed(2)}</p>
                        <br/>

                        <button onClick={() => openModal(produto)}>Comprar</button>
                    </div>
                ))}
            </div>

            {modalVisible && produtoSelecionado && (
                <div className="modal" onClick={handleClickOutside}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{produtoSelecionado.nome}</h2>
                        <br />
                        <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} />
                        <p>{produtoSelecionado.preco.toFixed(2)}</p>
                        <br />
                        <a 
                            href={`https://wa.me/19983057540?text=${encodeURIComponent(produtoSelecionado.nome)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <button className='whats'>Enviar pelo WhatsApp</button>
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
