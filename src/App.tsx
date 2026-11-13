import { useMemo, useState } from 'react';

type Screen = 'home' | 'login' | 'register' | 'recipes' | 'detail' | 'favorites' | 'education' | 'article' | 'profile' | 'chat';
type Category = 'Todas' | 'Sem glúten' | 'Sem lactose' | 'Vegana' | 'Sem açúcar';
type Recipe = {
  id: number;
  title: string;
  category: Exclude<Category, 'Todas'>;
  time: string;
  level: string;
  description: string;
  ingredients: string[];
  preparation: string;
  palette: string;
  emoji: string;
};
type Message = { id: number; from: 'nutritionist' | 'user'; text: string; time: string };

const recipes: Recipe[] = [
  {
    id: 1, title: 'Crepioca de banana', category: 'Sem glúten', time: '15 min', level: 'Fácil',
    description: 'Uma opção prática para um café da manhã nutritivo e saboroso.',
    ingredients: ['1 ovo', '2 colheres de tapioca', '1 banana amassada', 'Canela a gosto'],
    preparation: 'Misture os ingredientes, despeje em uma frigideira antiaderente e doure dos dois lados.', palette: 'peach', emoji: '🍌',
  },
  {
    id: 2, title: 'Bolo de banana', category: 'Sem lactose', time: '35 min', level: 'Fácil',
    description: 'Bolo caseiro com banana madura e ingredientes simples.',
    ingredients: ['3 bananas maduras', '2 ovos', '1 xícara de aveia', '1 colher de fermento'],
    preparation: 'Amasse as bananas, misture os demais ingredientes e asse até dourar. Verifique se todos os produtos utilizados são adequados às suas necessidades.', palette: 'yellow', emoji: '🍰',
  },
  {
    id: 3, title: 'Bowl colorido', category: 'Vegana', time: '20 min', level: 'Fácil',
    description: 'Combinação colorida de vegetais, grãos e molho cítrico.',
    ingredients: ['1/2 xícara de grão-de-bico', 'Folhas verdes', 'Tomate-cereja', 'Cenoura ralada'],
    preparation: 'Monte os ingredientes em uma tigela e finalize com azeite, limão e ervas.', palette: 'mint', emoji: '🥗',
  },
  {
    id: 4, title: 'Panqueca de aveia', category: 'Sem lactose', time: '15 min', level: 'Fácil',
    description: 'Panquecas leves para um lanche rápido.',
    ingredients: ['1 ovo', '3 colheres de aveia', '1 banana', 'Canela'],
    preparation: 'Bata os ingredientes, prepare pequenas porções em frigideira antiaderente e sirva.', palette: 'lilac', emoji: '🥞',
  },
  {
    id: 5, title: 'Maçã assada com canela', category: 'Sem açúcar', time: '18 min', level: 'Fácil',
    description: 'Sobremesa simples que valoriza o sabor natural da fruta.',
    ingredients: ['2 maçãs', 'Canela em pó', 'Algumas gotas de limão'],
    preparation: 'Corte as maçãs, adicione canela e limão e asse até ficarem macias.', palette: 'rose', emoji: '🍎',
  },
];

const categories: Category[] = ['Todas', 'Sem glúten', 'Sem lactose', 'Vegana', 'Sem açúcar'];

function Logo() {
  return <div className="brand"><span className="brand-mark">✦</span><span><b>Deméter</b><small>ALIMENTAÇÃO INCLUSIVA</small></span></div>;
}

function FoodArt({ recipe, compact = false }: { recipe: Recipe; compact?: boolean }) {
  return <div className={`food-art ${recipe.palette} ${compact ? 'compact' : ''}`} aria-hidden="true"><span>{recipe.emoji}</span><i>✦</i></div>;
}

function RecipeCard({ recipe, favorite, onOpen, onFavorite }: { recipe: Recipe; favorite: boolean; onOpen: () => void; onFavorite: () => void }) {
  return (
    <article className="recipe-card">
      <button className="recipe-open" onClick={onOpen} aria-label={`Abrir ${recipe.title}`}>
        <FoodArt recipe={recipe} />
        <div className="recipe-card-content">
          <span className="eyebrow">{recipe.category}</span>
          <h3>{recipe.title}</h3>
          <p>{recipe.time} <span>·</span> {recipe.level}</p>
        </div>
      </button>
      <button className={`favorite-toggle ${favorite ? 'active' : ''}`} onClick={onFavorite} aria-label={favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}>{favorite ? '♥' : '♡'}</button>
    </article>
  );
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} placeholder={placeholder} /></label>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [filter, setFilter] = useState<Category>('Todas');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(recipes[0]);
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [preferences, setPreferences] = useState<string[]>(['Sem glúten', 'Sem lactose']);
  const [profileName, setProfileName] = useState('Ana Morais');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'nutritionist', text: 'Olá! Sou a nutricionista do Deméter. Como posso ajudar com suas dúvidas sobre alimentação?', time: '09:40' },
    { id: 2, from: 'user', text: 'Tenho dúvidas sobre como adaptar receitas sem lactose.', time: '09:41' },
    { id: 3, from: 'nutritionist', text: 'Claro! É importante conferir os rótulos e observar os ingredientes utilizados. Posso ajudar a pensar em substituições adequadas.', time: '09:42' },
  ]);
  const [chatText, setChatText] = useState('');
  const [toast, setToast] = useState('');

  const visibleRecipes = useMemo(() => {
    const base = screen === 'favorites' ? recipes.filter((item) => favorites.includes(item.id)) : recipes;
    return filter === 'Todas' ? base : base.filter((item) => item.category === filter);
  }, [filter, favorites, screen]);

  const goRecipes = (category: Category = 'Todas') => {
    setFilter(category);
    setScreen('recipes');
  };
  const openRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setScreen('detail');
  };
  const toggleFavorite = (id: number) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setToast(favorites.includes(id) ? 'Receita removida dos favoritos.' : 'Receita salva nos favoritos.');
    window.setTimeout(() => setToast(''), 2200);
  };
  const togglePreference = (value: string) => setPreferences((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const sendMessage = () => {
    const value = chatText.trim();
    if (!value) return;
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setMessages((current) => [...current,
      { id: Date.now(), from: 'user', text: value, time },
      { id: Date.now() + 1, from: 'nutritionist', text: 'Obrigada por compartilhar sua dúvida! Este é um retorno demonstrativo. Para orientações individualizadas, procure um nutricionista.', time },
    ]);
    setChatText('');
  };
  const navItems: { key: Screen; icon: string; label: string }[] = [
    { key: 'home', icon: '⌂', label: 'Início' },
    { key: 'recipes', icon: '◈', label: 'Receitas' },
    { key: 'education', icon: '▤', label: 'Aprender' },
    { key: 'favorites', icon: '♡', label: 'Favoritos' },
    { key: 'profile', icon: '○', label: 'Perfil' },
  ];

  const bottomNav = !['login', 'register'].includes(screen) && (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {navItems.map((item) => <button key={item.key} className={screen === item.key || (screen === 'detail' && item.key === 'recipes') || (screen === 'article' && item.key === 'education') ? 'selected' : ''} onClick={() => item.key === 'recipes' ? goRecipes() : setScreen(item.key)}><span>{item.icon}</span><small>{item.label}</small></button>)}
    </nav>
  );

  const header = (title?: string, back: Screen = 'home') => (
    <div className="screen-header">
      <button className="back-button" onClick={() => setScreen(back)}>←</button>
      <strong>{title}</strong>
      <button className="header-action" onClick={() => setScreen('profile')}>●</button>
    </div>
  );

  const content = (() => {
    switch (screen) {
      case 'home': return <>
        <div className="home-top"><Logo /><button className="avatar-mini" onClick={() => setScreen('profile')}>AM</button></div>
        <section className="welcome"><span className="eyebrow">SUA ROTINA, SEU JEITO</span><h1>Olá, {profileName.split(' ')[0]}!</h1><p>Encontre receitas que respeitam suas escolhas.</p></section>
        <section className="hero-panel"><div><span className="eyebrow light">DEMÉTER</span><h2>Comer bem pode ser mais simples.</h2><p>Receitas adaptadas e informação para escolher com confiança.</p><button className="button button-white" onClick={() => goRecipes()}>Explorar receitas <span>→</span></button></div><div className="hero-orbit">🥑</div></section>
        <section className="section-block"><div className="section-heading"><h2>Explore por categoria</h2><button onClick={() => goRecipes()}>Ver todas</button></div><div className="category-grid">{categories.slice(1).map((cat, i) => <button className={`category-tile category-${i}`} key={cat} onClick={() => goRecipes(cat)}><span>{['🌾', '🥛', '🌱', '🍎'][i]}</span><b>{cat}</b><small>Explorar →</small></button>)}</div></section>
        <section className="section-block"><div className="section-heading"><h2>Receitas em destaque</h2><button onClick={() => goRecipes()}>Ver todas →</button></div><div className="recipe-grid">{recipes.slice(0, 2).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => toggleFavorite(recipe.id)} />)}</div></section>
        <button className="nutritionist-banner" onClick={() => setScreen('chat')}><span>💬</span><div><b>Tem dúvidas sobre alimentação?</b><small>Conheça o espaço de conversa com nutricionistas.</small></div><strong>→</strong></button>
      </>;
      case 'login': return <div className="auth-screen"><button className="back-button" onClick={() => setScreen('home')}>← Voltar</button><Logo /><div className="auth-copy"><span className="eyebrow">BEM-VINDA DE VOLTA</span><h1>Boas-vindas de volta!</h1><p>Entre para salvar receitas e personalizar seu perfil.</p></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); setScreen('home'); setToast('Acesso demonstrativo iniciado.'); window.setTimeout(() => setToast(''), 2200); }}><Field label="E-mail" placeholder="seuemail@exemplo.com" type="email" /><Field label="Senha" placeholder="Digite sua senha" type="password" /><button type="button" className="text-button align-right">Esqueceu sua senha?</button><button className="button button-primary" type="submit">Entrar</button></form><p className="auth-switch">Ainda não tem conta? <button onClick={() => setScreen('register')}>Criar conta</button></p><p className="demo-note">Acesso demonstrativo · sem autenticação real</p></div>;
      case 'register': return <div className="auth-screen"><button className="back-button" onClick={() => setScreen('login')}>← Voltar</button><Logo /><div className="auth-copy"><span className="eyebrow">COMECE POR AQUI</span><h1>Crie sua conta</h1><p>Personalize sua experiência no Deméter.</p></div><form className="form-stack" onSubmit={(event) => { event.preventDefault(); setProfileName('Ana Morais'); setScreen('home'); setToast('Cadastro demonstrativo concluído.'); window.setTimeout(() => setToast(''), 2200); }}><Field label="Nome completo" placeholder="Como podemos chamar você?" /><Field label="E-mail" placeholder="seuemail@exemplo.com" type="email" /><Field label="Senha" placeholder="Crie uma senha" type="password" /><span className="field-label">Quais são suas preferências?</span><div className="chip-row wrap">{categories.slice(1).map((cat) => <button type="button" key={cat} className={`chip ${preferences.includes(cat) ? 'active' : ''}`} onClick={() => togglePreference(cat)}>{cat}</button>)}</div><button className="button button-primary" type="submit">Criar conta</button></form><p className="auth-switch">Já possui conta? <button onClick={() => setScreen('login')}>Entrar</button></p><p className="demo-note">Cadastro demonstrativo · os dados não são enviados</p></div>;
      case 'recipes': return <>
        {header('Receitas')}
        <section className="page-intro"><span className="eyebrow">ENCONTRE SUA RECEITA</span><h1>Receitas para suas escolhas</h1><p>Explore opções de acordo com suas necessidades.</p></section>
        <div className="search-box"><span>⌕</span><input placeholder="Buscar por nome ou ingrediente" /></div>
        <section className="section-block"><div className="section-heading"><h2>Filtrar por restrição</h2><span className="result-count">{visibleRecipes.length} opções</span></div><div className="chip-row wrap">{categories.map((cat) => <button key={cat} className={`chip ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>)}</div></section>
        <section className="section-block"><div className="section-heading"><h2>{filter === 'Todas' ? 'Receitas disponíveis' : `Opções: ${filter}`}</h2></div><div className="recipe-grid">{visibleRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => toggleFavorite(recipe.id)} />)}</div>{visibleRecipes.length === 0 && <div className="empty-state">Nenhuma receita encontrada para esse filtro.</div>}</section>
        <p className="safety-note">Confira sempre os ingredientes, os rótulos e possíveis riscos de contaminação cruzada.</p>
      </>;
      case 'detail': return <>
        {header('Detalhe da receita', 'recipes')}
        <div className="detail-hero"><FoodArt recipe={selectedRecipe} /><span className="detail-tag">{selectedRecipe.category}</span></div>
        <div className="detail-title-row"><div><h1>{selectedRecipe.title}</h1><p>{selectedRecipe.time} <span>·</span> {selectedRecipe.level} <span>·</span> 2 porções</p></div><button className={`favorite-round ${favorites.includes(selectedRecipe.id) ? 'active' : ''}`} onClick={() => toggleFavorite(selectedRecipe.id)}>{favorites.includes(selectedRecipe.id) ? '♥' : '♡'}</button></div>
        <p className="detail-description">{selectedRecipe.description}</p>
        <section className="detail-section"><h2>Ingredientes</h2><ul>{selectedRecipe.ingredients.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="detail-section"><h2>Modo de preparo</h2><p>{selectedRecipe.preparation}</p></section>
        <div className="safety-box"><b>Um cuidado importante</b><p>Confira os rótulos dos ingredientes e o risco de contaminação cruzada. As necessidades alimentares variam de pessoa para pessoa.</p></div>
        <button className="button button-primary full-width" onClick={() => toggleFavorite(selectedRecipe.id)}>{favorites.includes(selectedRecipe.id) ? 'Remover dos favoritos' : 'Salvar nos favoritos'}</button>
        <button className="button button-outline full-width" onClick={() => setScreen('chat')}>Conversar com nutricionista</button>
      </>;
      case 'favorites': return <>
        {header('Favoritos')}
        <section className="page-intro"><span className="eyebrow">SUA COLEÇÃO</span><h1>Suas receitas favoritas</h1><p>Tudo o que você salvou em um só lugar.</p></section>
        {visibleRecipes.length ? <div className="recipe-grid">{visibleRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} favorite={favorites.includes(recipe.id)} onOpen={() => openRecipe(recipe)} onFavorite={() => toggleFavorite(recipe.id)} />)}</div> : <div className="empty-state"><span>♡</span><h2>Você ainda não salvou receitas</h2><p>Explore as receitas e toque no coração para guardá-las aqui.</p><button className="button button-primary" onClick={() => goRecipes()}>Explorar receitas</button></div>}
      </>;
      case 'education': return <>
        {header('Conteúdos educativos')}
        <section className="page-intro"><span className="eyebrow">INFORMAÇÃO TAMBÉM É CUIDADO</span><h1>Aprenda e cuide-se</h1><p>Conteúdos para escolhas alimentares mais conscientes.</p></section>
        <div className="education-hero"><span>📚</span><div><h2>Conhecimento que acolhe</h2><p>Entenda ingredientes, alergias e intolerâncias.</p></div></div>
        <section className="section-block"><h2 className="section-title">Temas para explorar</h2><div className="education-list">{[
          ['🥜', 'Alergias alimentares', 'Cuidados, leitura de rótulos e atenção aos ingredientes.'],
          ['🥛', 'Intolerância à lactose', 'Entenda a condição e conheça alternativas alimentares.'],
          ['🌾', 'Glúten e doença celíaca', 'Informações gerais e cuidados na preparação dos alimentos.'],
          ['🥕', 'Substituição de ingredientes', 'Ideias para adaptar preparações com atenção.'],
        ].map(([icon, title, desc]) => <button className="education-item" key={title} onClick={() => setScreen('article')}><span className="education-icon">{icon}</span><span><b>{title}</b><small>{desc}</small></span><strong>→</strong></button>)}</div></section>
        <p className="safety-note">Conteúdos educativos não substituem diagnóstico ou orientação individual de profissionais de saúde.</p>
      </>;
      case 'article': return <>
        {header('Guia educativo', 'education')}
        <div className="article-cover"><span className="eyebrow light">GUIA EDUCATIVO</span><h1>Alergias e intolerâncias: qual é a diferença?</h1><span>Leitura · 4 minutos</span></div>
        <div className="article-body"><p>Alergia alimentar e intolerância alimentar são condições diferentes. Conhecer essa diferença ajuda a compreender os cuidados necessários na escolha e no preparo dos alimentos.</p><h2>Atenção aos ingredientes</h2><p>Leia atentamente os rótulos, observe a composição dos produtos e procure informações em fontes confiáveis. Em caso de dúvidas sobre sua alimentação, busque orientação de um profissional de saúde.</p><h2>Cuidados na rotina</h2><p>Ao preparar alimentos, considere utensílios, superfícies e possíveis contatos com ingredientes que precisam ser evitados. A informação sobre o preparo é tão importante quanto a lista de ingredientes.</p></div>
        <div className="safety-box"><b>Este conteúdo é educativo</b><p>Não substitui diagnóstico, prescrição ou orientação individual de profissionais de saúde.</p></div><button className="button button-primary full-width" onClick={() => setScreen('chat')}>Conversar com nutricionista</button>
      </>;
      case 'profile': return <>
        {header('Meu perfil')}
        <div className="profile-head"><div className="profile-avatar">{profileName.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div><div><h1>{profileName}</h1><p>ana@exemplo.com</p></div><button className="text-button" onClick={() => setScreen('login')}>Editar</button></div>
        <section className="section-block"><h2 className="section-title">Minhas restrições e preferências</h2><p className="muted-small">Selecione as opções que deseja considerar na sua experiência.</p><div className="preference-list">{categories.slice(1).map((cat) => <label key={cat} className="preference-row"><span>{cat}</span><input type="checkbox" checked={preferences.includes(cat)} onChange={() => togglePreference(cat)} /></label>)}</div></section>
        <section className="section-block"><h2 className="section-title">Minha atividade</h2><button className="profile-link" onClick={() => setScreen('favorites')}><span>♡</span>Receitas favoritas <strong>→</strong></button><button className="profile-link" onClick={() => setScreen('chat')}><span>💬</span>Conversar com nutricionista <strong>→</strong></button></section>
        <button className="button button-outline full-width" onClick={() => setScreen('home')}>Sair da conta</button><p className="demo-note">Perfil demonstrativo · dados fictícios</p>
      </>;
      case 'chat': return <>
        {header('Conversa com nutricionista', 'profile')}
        <div className="chat-professional"><div className="profile-avatar small">N</div><div><b>Nutricionista</b><small>Atendimento demonstrativo</small></div><span className="online-dot" /></div>
        <div className="chat-thread">{messages.map((message) => <div className={`message ${message.from}`} key={message.id}><p>{message.text}</p><small>{message.time}</small></div>)}</div>
        <div className="chat-suggestions"><span>Sugestões rápidas</span><div className="chip-row wrap"><button className="chip" onClick={() => setChatText('Como posso substituir o leite em uma receita?')}>Substituições</button><button className="chip" onClick={() => setChatText('Como conferir os rótulos dos produtos?')}>Leitura de rótulos</button></div></div>
        <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Digite sua mensagem..." /><button type="submit" aria-label="Enviar mensagem">➤</button></form>
        <p className="demo-note">Conversa ilustrativa. Não há envio real de mensagens nem atendimento clínico.</p>
      </>;
    }
  })();

  return (
    <div className="app-shell">
      <div className="desktop-sidebar"><Logo /><p>Seu espaço de alimentação inclusiva.</p><nav>{navItems.map((item) => <button key={item.key} className={screen === item.key ? 'active' : ''} onClick={() => item.key === 'recipes' ? goRecipes() : setScreen(item.key)}><span>{item.icon}</span>{item.label}</button>)}</nav><div className="sidebar-bottom"><span className="sidebar-dot" /> Protótipo demonstrativo</div></div>
      <main className={`app-main ${['login', 'register'].includes(screen) ? 'auth-main' : ''}`}>
        <div className="mobile-status"><span>9:41</span><span>● ▰ ▰</span></div>
        <div className="screen-content">{content}</div>
        {bottomNav}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
