import React, { useParams, useEffect, useState } from 'react';
import supabase from '../../supabaseclient';

function Pagamento() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);

    useEffect(() => {
        const fetchProduto = async () => {
            const { data, error } = await supabase
                .from('roupas')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Erro ao buscar produto:', error.message);
            } else {
                setProduto(data);
            }
        };

        fetchProduto();
    }, [id]);

    if (!produto) return <p>Carregando...</p>;

    return (
        <div>
            <h1>Detalhes do Produto</h1>
            <img src={produto.imagem} alt={produto.nome} style={{ width: '200px' }} />
            <h2>{produto.nome}</h2>
            <p>Descrição: {produto.descricao}</p>
            <p>Preço: R${produto.preco.toFixed(2)}</p>
            {/* Aqui você pode adicionar mais detalhes ou funcionalidades de pagamento */}
        </div>
    );
}

export default Pagamento;
