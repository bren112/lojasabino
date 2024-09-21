import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseclient';
import './compra.css';

function Compra() {
    const [produtos, setProdutos] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProdutos = async () => {
            const { data, error } = await supabase.from('roupas').select('*');
            if (error) {
                console.error('Erro ao buscar produtos:', error.message);
            } else {
                setProdutos(data);
            }
        };

        fetchProdutos();
    }, []);

    const handleCompra = (produto) => {
        setSelectedProduct(produto);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Quero comprar: ${selectedProduct.nome}`);
        window.open(`https://wa.me/19983057540?text=${message}`, '_blank');
        closeModal();
    };

    return (
        <div className="loja-container">
            <h1>Produtos Disponíveis</h1>
            <div className="produtos-grid">
                {produtos.map((produto) => (
                    <div className="produto-card" key={produto.id}>
                        <img src={produto.imagem} alt={produto.nome} className="produto-imagem" />
                        <h2 className="produto-nome">{produto.nome}</h2>
                        <p className="produto-descricao">{produto.descricao}</p>
                        <p className="produto-preco">R${produto.preco.toFixed(2)}</p>
                        <button className="botao-comprar" onClick={() => handleCompra(produto)}>Comprar</button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        {selectedProduct && (
                            <>
                                <img src={selectedProduct.imagem} alt={selectedProduct.nome} style={{ width: '100%' }} />
                                <h2>{selectedProduct.nome}</h2>
                                <button onClick={handleWhatsApp}>Enviar para WhatsApp</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Compra;
