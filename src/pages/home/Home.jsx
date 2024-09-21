import './home.css';
import { useState } from 'react';
import supabase from '../../supabaseclient'; // Supabase client configurado

function Home() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [imagem, setImagem] = useState(null);
    const [message, setMessage] = useState('');

    // Função para manipular o upload de imagem
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        setImagem(file); // Salva a imagem no estado para upload posterior
    };

    // Função para enviar o formulário e salvar o produto
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Valida o valor do preço
        if (parseFloat(preco) <= 0 || isNaN(parseFloat(preco))) {
            setMessage('Por favor, insira um valor de preço válido e positivo.');
            return;
        }

        let imagemUrl = '';

        if (imagem) {
            // Gera um nome único para a imagem usando o timestamp
            const imagemPath = `public/${Date.now()}-${imagem.name}`;

            // Upload da imagem para o bucket "imagens-roupa"
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('imagens-roupa')
                .upload(imagemPath, imagem);

            if (uploadError) {
                setMessage('Erro ao fazer upload da imagem: ' + uploadError.message);
                return;
            }

            // Obtém a URL pública da imagem
            const { data: publicData } = supabase
                .storage
                .from('imagens-roupa')
                .getPublicUrl(imagemPath);
            
            imagemUrl = publicData.publicUrl;
        }

        // Insere os dados do produto no Supabase
        const { data, error } = await supabase
            .from('roupas')
            .insert([
                { nome, descricao, preco: parseFloat(preco), imagem: imagemUrl }
            ]);

        if (error) {
            setMessage('Erro ao salvar os dados: ' + error.message);
        } else {
            setMessage('Produto cadastrado com sucesso!');
        }

        // Limpa os campos após o envio
        setNome('');
        setDescricao('');
        setPreco('');
        setImagem(null);
    };

    return (
        <>
            <br />
            <h1 id='title'>Roupas Seminovas!</h1>
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
                <button type="submit">Cadastrar Produto</button>
            </form>

            {message && <p>{message}</p>}
        </>
    );
}

export default Home;
