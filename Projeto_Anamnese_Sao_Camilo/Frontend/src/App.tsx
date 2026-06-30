import React, { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

// SVG Icons from prototype
const Icons = {
  clk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  usr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  upl: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="17" y1="11" x2="23" y2="11" />
    </svg>
  ),
  clp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  ),
  act: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  bar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  ftx: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  shd: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="svg-icon">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  pls: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="svg-icon-sm">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="svg-icon-sm">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  edt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="svg-icon-sm">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  inf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="svg-icon-sm" style={{ marginRight: '8px' }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  ok: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="svg-icon-sm">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  sch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="svg-icon-sm">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

interface Paciente {
  id: string;
  num_prontuario: string;
  nome: string;
  data_nascimento: string;
  cpf: string | null;
  sexo: 'masculino' | 'feminino' | 'outro';
  rg: string | null;
  email: string | null;
  telefone: string | null;
  celular: string;
  profissao: string | null;
  indicacao: string | null;
  ativo: boolean;
  criado_em?: string;
  atualizado_em?: string;
}

interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'recepcionista' | 'podologo' | 'administracao';
  ativo: boolean;
}

export default function App() {
  // Session State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState('recep@saocamilo.com.br');
  const [passwordInput, setPasswordInput] = useState('123456');

  // App Navigation & Responsive Sidebar
  const [currentView, setCurrentView] = useState('fila');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  // Form States
  const [newPaciente, setNewPaciente] = useState({
    nome: '',
    data_nascimento: '',
    cpf: '',
    sexo: 'feminino',
    rg: '',
    profissao: '',
    indicacao: '',
    celular: '',
    telefone: '',
    email: '',
    cep: '',
    estado: 'MG',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
  });

  // Anamnese / Avaliações tab index
  const [activeAmnTab, setActiveAmnTab] = useState(0);

  // Anamnese Data State
  const [anamnese, setAnamnese] = useState({
    tipo_diabete: 'Tipo II',
    tempo_diabetes: '10 anos',
    hemoglobina_glicada: 7.8,
    comorbidades: {
      Retinopatia: false,
      Neuropatia: true,
      Nefropatia: false,
      Hipertensão: true,
      Cardiopatia: false,
      'Cirurgia MMII': false,
      'Amputação prévia': false,
      Anestesia: false,
      Hiperalgesia: false,
      Alodinia: false,
      Queimação: false,
      Câimbras: false,
    } as Record<string, boolean>,
    calcado_mais_usado: 'Fechado',
    frequencia_esporte: 'Não pratica',
    medicacoes: 'Metformina 850mg, Losartana 50mg',
    tabagista: false,
    etilista: false,
    uso_palmilha: true,
    observacoes: '',
  });

  // Clinical Exam State
  const [exameDerm, setExameDerm] = useState<Record<string, boolean>>({
    'Micose interdigital': false,
    Ressecamento: true,
    Maceração: false,
    Disidrose: false,
    Hiperpigmentação: false,
    Bromidrose: false,
    Hiperhidrose: true,
    Hiperqueratose: false,
    Fissuras: true,
    Calosidades: false,
    'Verruga plantar': false,
    Úlceração: false,
  });

  // Monofilament state: 10 points for each foot, cycles between 'none' -> 'pos' -> 'neg' -> 'none'
  const [monoD, setMonoD] = useState<string[]>(Array(10).fill('none'));
  const [monoE, setMonoE] = useState<string[]>(Array(10).fill('none'));

  // Vascular evaluation state
  const [vascular, setVascular] = useState({
    coloracaoD: 'Normal',
    coloracaoE: 'Normal',
    temperaturaD: 'Normal',
    temperaturaE: 'Normal',
    pulsoDorsalD: 'Normal',
    pulsoDorsalE: 'Normal',
  });

  // Atendimento State
  const [atendimento, setAtendimento] = useState({
    diagnostico: '',
    conduta: '',
    evolucao: '',
  });

  // Load initial datasets from backend if available (otherwise fall back to mock)
  const fetchPacientes = async () => {
    try {
      const response = await api.get('/pacientes');
      if (response.data && response.data.pacientes) {
        setPacientes(response.data.pacientes);
      }
    } catch (error) {
      console.warn('Backend indisponível. Usando dados fictícios do protótipo.');
      // Mock data from prototype
      setPacientes([
        {
          id: '1',
          num_prontuario: 'PRO-000142',
          nome: 'Maria Aparecida Silva',
          data_nascimento: '1964-05-12',
          cpf: '032.123.456-82',
          sexo: 'feminino',
          rg: 'MG-12.345.678',
          email: 'maria.silva@exemplo.com',
          telefone: '(31) 3456-7890',
          celular: '(31) 99821-4455',
          profissao: 'Dona de Casa',
          indicacao: 'Amiga',
          ativo: true,
        },
        {
          id: '2',
          num_prontuario: 'PRO-000201',
          nome: 'João Carlos Ferreira',
          data_nascimento: '1982-11-28',
          cpf: '155.987.654-10',
          sexo: 'masculino',
          rg: 'MG-98.765.432',
          email: 'joao.ferreira@exemplo.com',
          telefone: null,
          celular: '(31) 98744-2211',
          profissao: 'Comerciante',
          indicacao: 'Placa da clínica',
          ativo: true,
        },
        {
          id: '3',
          num_prontuario: 'PRO-000088',
          nome: 'Rosana Matos',
          data_nascimento: '1975-08-05',
          cpf: '278.456.123-66',
          sexo: 'feminino',
          rg: 'MG-88.888.888',
          email: 'rosana.matos@exemplo.com',
          telefone: null,
          celular: '(31) 99012-3344',
          profissao: 'Professora',
          indicacao: 'Médico',
          ativo: true,
        },
      ]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPacientes();
    }
  }, [isAuthenticated]);

  // Show status popup
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Login handler
  const handleLogin = async (roleOverride?: 'recepcionista' | 'podologo' | 'administracao') => {
    if (roleOverride) {
      // Direct mock logins for testing from the prototype buttons
      let mockName = 'Ana Paula';
      if (roleOverride === 'podologo') mockName = 'Dra. Carla';
      if (roleOverride === 'administracao') mockName = 'Administrador';

      setCurrentUser({
        id: 'mock-id',
        nome: mockName,
        email: `${roleOverride}@saocamilo.com.br`,
        perfil: roleOverride,
        ativo: true,
      });
      setIsAuthenticated(true);
      setCurrentView(roleOverride === 'administracao' ? 'dash' : 'fila');
      showToast('Login efetuado (Modo Protótipo)!');
      return;
    }

    try {
      const response = await api.post('/users/login', {
        email: emailInput,
        senha: passwordInput,
      });
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        setIsAuthenticated(true);
        setCurrentView(response.data.user.perfil === 'administracao' ? 'dash' : 'fila');
        showToast('Login efetuado com sucesso!');
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Falha ao conectar na API. Utilizando credenciais padrão do protótipo.';
      showToast(msg);
      // Fallback behavior: let user login anyway
      let matchedRole: 'recepcionista' | 'podologo' | 'administracao' = 'recepcionista';
      if (emailInput.includes('carla') || emailInput.includes('podologa') || emailInput.includes('podologo')) {
        matchedRole = 'podologo';
      } else if (emailInput.includes('admin')) {
        matchedRole = 'administracao';
      }
      
      setCurrentUser({
        id: 'fallback-id',
        nome: matchedRole === 'recepcionista' ? 'Ana Paula' : matchedRole === 'podologo' ? 'Dra. Carla' : 'Administrador',
        email: emailInput,
        perfil: matchedRole,
        ativo: true,
      });
      setIsAuthenticated(true);
      setCurrentView(matchedRole === 'administracao' ? 'dash' : 'fila');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Registering Patient
  const handleSavePaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nome: newPaciente.nome,
        data_nascimento: newPaciente.data_nascimento,
        cpf: newPaciente.cpf || null,
        sexo: newPaciente.sexo,
        rg: newPaciente.rg || null,
        email: newPaciente.email || null,
        telefone: newPaciente.telefone || null,
        celular: newPaciente.celular,
        profissao: newPaciente.profissao || null,
        indicacao: newPaciente.indicacao || null,
      };

      const response = await api.post('/pacientes/register', payload);
      if (response.status === 201) {
        showToast('Paciente cadastrado com sucesso!');
        fetchPacientes();
        setCurrentView('pac');
      }
    } catch (error: any) {
      console.warn('Erro na conexão com API ao cadastrar paciente. Simulando cadastro local.');
      const simulated: Paciente = {
        id: Math.random().toString(),
        num_prontuario: `PRO-000${Math.floor(100 + Math.random() * 900)}`,
        nome: newPaciente.nome || 'Paciente Simulado',
        data_nascimento: newPaciente.data_nascimento || '1990-01-01',
        cpf: newPaciente.cpf || null,
        sexo: newPaciente.sexo as any,
        rg: newPaciente.rg || null,
        email: newPaciente.email || null,
        telefone: newPaciente.telefone || null,
        celular: newPaciente.celular || '(31) 99999-9999',
        profissao: newPaciente.profissao || null,
        indicacao: newPaciente.indicacao || null,
        ativo: true,
      };
      setPacientes([simulated, ...pacientes]);
      showToast('Paciente cadastrado localmente (Simulado)!');
      setCurrentView('pac');
    }
  };

  // Cycle monofilament values: 'none' -> 'pos' -> 'neg' -> 'none'
  const handleCyclePoint = (foot: 'D' | 'E', index: number) => {
    const nextState: Record<string, string> = { none: 'pos', pos: 'neg', neg: 'none' };
    if (foot === 'D') {
      const copy = [...monoD];
      copy[index] = nextState[copy[index] || 'none'] || 'none';
      setMonoD(copy);
    } else {
      const copy = [...monoE];
      copy[index] = nextState[copy[index] || 'none'] || 'none';
      setMonoE(copy);
    }
  };

  // Nav configuration based on user profile
  const menuConfig = {
    recepcionista: [
      { id: 'fila', ic: 'clk', l: 'Fila de espera', b: 3 },
      { id: 'pac', ic: 'usr', l: 'Pacientes' },
      { id: 'novo', ic: 'upl', l: 'Novo paciente' },
    ],
    podologo: [
      { id: 'fila', ic: 'clk', l: 'Fila de espera', b: 2 },
      { id: 'pac', ic: 'usr', l: 'Pacientes' },
      { id: 'amn', ic: 'clp', l: 'Anamnese' },
      { id: 'atd', ic: 'act', l: 'Registrar atendimento' },
    ],
    administracao: [
      { id: 'dash', ic: 'bar', l: 'Dashboard' },
      { id: 'pac', ic: 'usr', l: 'Pacientes' },
      { id: 'fila', ic: 'clk', l: 'Fila de espera' },
      { id: 'rel', ic: 'ftx', l: 'Relatórios' },
      { id: 'usr', ic: 'shd', l: 'Usuários' },
    ],
  };

  const getTitle = (id: string) => {
    const titles: Record<string, string> = {
      fila: 'Fila de espera',
      pac: 'Pacientes',
      novo: 'Novo paciente',
      amn: 'Anamnese podológica',
      atd: 'Registrar atendimento',
      dash: 'Dashboard',
      rel: 'Relatórios',
      usr: 'Gestão de usuários',
    };
    return titles[id] || 'Início';
  };

  // Filter patients based on search
  const filteredPacientes = pacientes.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      p.nome.toLowerCase().includes(search) ||
      (p.cpf && p.cpf.includes(search)) ||
      p.num_prontuario.toLowerCase().includes(search)
    );
  });

  const getProfileHeader = () => {
    if (!currentUser) return { n: 'Usuário', r: 'Perfil', a: 'US' };
    const mappings = {
      recepcionista: { n: currentUser.nome, r: 'Recepcionista', a: 'RC' },
      podologo: { n: currentUser.nome, r: 'Podóloga', a: 'PD' },
      administracao: { n: currentUser.nome, r: 'Admin', a: 'AD' },
    };
    return mappings[currentUser.perfil] || { n: currentUser.nome, r: 'Usuário', a: 'US' };
  };

  const profileHeader = getProfileHeader();

  // Renders the specific content view
  const renderViewContent = () => {
    switch (currentView) {
      case 'fila':
        return (
          <>
            <div className="al">
              {Icons.inf}
              <span>
                Há <strong>3 pacientes</strong> aguardando. Tempo médio: 18 min.
              </span>
            </div>
            <div className="card">
              <div className="ch">
                <div>
                  <div className="ct2">Pacientes aguardando</div>
                  <div className="cs">Atualizado agora</div>
                </div>
                <button className="btn bp bsm" onClick={() => setCurrentView('novo')}>
                  {Icons.pls} Novo paciente
                </button>
              </div>
              {[
                { n: 1, nm: 'Maria Aparecida Silva', tp: 'Retorno', es: '32 min', pr: 'PRO-000142', ug: false, targetId: '1' },
                { n: 2, nm: 'João Carlos Ferreira', tp: 'Primeira consulta', es: '18 min', pr: 'PRO-000201', ug: false, targetId: '2' },
                { n: 3, nm: 'Rosana Matos', tp: 'Urgência', es: '5 min', pr: 'PRO-000088', ug: true, targetId: '3' },
              ].map((p, idx) => {
                // Try to find the matching patient from state to load
                const matched = pacientes.find(item => item.num_prontuario === p.pr) || null;
                return (
                  <div key={idx} className={`fi${p.ug ? ' urg' : ''}`} onClick={() => {
                    if (matched) setSelectedPaciente(matched);
                    setCurrentView('amn');
                    setActiveAmnTab(0);
                  }}>
                    <div className="fn">{p.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13px, color: 'var(--g800)' }}>{p.nm}</div>
                      <div style={{ fontSize: 11px, color: 'var(--g500)' }}>
                        {p.pr} · {p.tp}
                        {p.ug && (
                          <>
                            {' · '}
                            <span style={{ color: 'var(--coral)', fontWeight: 600 }}>Urgência</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: 11px, color: 'var(--g500)', textAlign: 'right', marginRight: '15px' }}>
                      {p.es}
                      <br />
                      <span style={{ color: 'var(--g400)', fontSize: 10px }}>esperando</span>
                    </div>
                    <button className="btn bp bsm">Atender</button>
                  </div>
                );
              })}
            </div>
          </>
        );

      case 'pac':
        return (
          <>
            <div className="sr">
              <div className="si">
                {Icons.sch}
                <input
                  placeholder="Buscar por nome, CPF ou nº do prontuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn bp" onClick={() => setCurrentView('novo')}>
                {Icons.pls} Novo paciente
              </button>
            </div>
            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Prontuário</th>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>Celular</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPacientes.map((p, index) => (
                      <tr key={index}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12px, color: 'var(--brand)' }}>
                            {p.num_prontuario}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{p.nome}</td>
                        <td style={{ color: 'var(--g500)' }}>{p.cpf || 'Não cadastrado'}</td>
                        <td>{p.celular}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '3px' }}>
                            <button
                              className="btn bs bic bsm"
                              onClick={() => {
                                setSelectedPaciente(p);
                                setCurrentView('amn');
                                setActiveAmnTab(0);
                              }}
                            >
                              {Icons.eye}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredPacientes.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: 'var(--g500)', padding: '20px' }}>
                          Nenhum paciente encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'novo':
        return (
          <form className="card" onSubmit={handleSavePaciente}>
            <div className="ch">
              <div>
                <div className="ct2">Cadastro de paciente</div>
                <div className="cs">Preencha os dados do novo paciente</div>
              </div>
            </div>
            <div className="sl2">Dados pessoais</div>
            <div className="fg">
              <div className="fgr full">
                <label className="lbl">Nome completo *</label>
                <input
                  required
                  placeholder="Nome completo do paciente"
                  value={newPaciente.nome}
                  onChange={(e) => setNewPaciente({ ...newPaciente, nome: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Data de nascimento *</label>
                <input
                  required
                  type="date"
                  value={newPaciente.data_nascimento}
                  onChange={(e) => setNewPaciente({ ...newPaciente, data_nascimento: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">CPF</label>
                <input
                  placeholder="000.000.000-00"
                  value={newPaciente.cpf}
                  onChange={(e) => setNewPaciente({ ...newPaciente, cpf: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">RG</label>
                <input
                  placeholder="MG-00.000.000"
                  value={newPaciente.rg}
                  onChange={(e) => setNewPaciente({ ...newPaciente, rg: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Profissão</label>
                <input
                  placeholder="Ex: Professora, Comerciante..."
                  value={newPaciente.profissao}
                  onChange={(e) => setNewPaciente({ ...newPaciente, profissao: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Indicação</label>
                <input
                  placeholder="Como chegou à clínica?"
                  value={newPaciente.indicacao}
                  onChange={(e) => setNewPaciente({ ...newPaciente, indicacao: e.target.value })}
                />
              </div>
            </div>
            <div className="sl2">Contato</div>
            <div className="fg">
              <div className="fgr">
                <label className="lbl">Celular *</label>
                <input
                  required
                  placeholder="(00) 00000-0000"
                  value={newPaciente.celular}
                  onChange={(e) => setNewPaciente({ ...newPaciente, celular: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Telefone</label>
                <input
                  placeholder="(00) 0000-0000"
                  value={newPaciente.telefone}
                  onChange={(e) => setNewPaciente({ ...newPaciente, telefone: e.target.value })}
                />
              </div>
              <div className="fgr full">
                <label className="lbl">E-mail</label>
                <input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newPaciente.email}
                  onChange={(e) => setNewPaciente({ ...newPaciente, email: e.target.value })}
                />
              </div>
            </div>
            <div className="sl2">Endereço</div>
            <div className="fg">
              <div className="fgr">
                <label className="lbl">CEP</label>
                <input
                  placeholder="00000-000"
                  value={newPaciente.cep}
                  onChange={(e) => setNewPaciente({ ...newPaciente, cep: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Estado</label>
                <select
                  value={newPaciente.estado}
                  onChange={(e) => setNewPaciente({ ...newPaciente, estado: e.target.value })}
                >
                  <option>MG</option>
                  <option>SP</option>
                  <option>RJ</option>
                </select>
              </div>
              <div className="fgr full">
                <label className="lbl">Logradouro</label>
                <input
                  placeholder="Rua, Avenida..."
                  value={newPaciente.logradouro}
                  onChange={(e) => setNewPaciente({ ...newPaciente, logradouro: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Número</label>
                <input
                  placeholder="Nº"
                  value={newPaciente.numero}
                  onChange={(e) => setNewPaciente({ ...newPaciente, numero: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Complemento</label>
                <input
                  placeholder="Apto, Bloco..."
                  value={newPaciente.complemento}
                  onChange={(e) => setNewPaciente({ ...newPaciente, complemento: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Bairro</label>
                <input
                  placeholder="Bairro"
                  value={newPaciente.bairro}
                  onChange={(e) => setNewPaciente({ ...newPaciente, bairro: e.target.value })}
                />
              </div>
              <div className="fgr">
                <label className="lbl">Cidade</label>
                <input
                  placeholder="Cidade"
                  value={newPaciente.cidade}
                  onChange={(e) => setNewPaciente({ ...newPaciente, cidade: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--g200)' }}>
              <button type="button" className="btn bs" onClick={() => setCurrentView('pac')}>
                Cancelar
              </button>
              <button type="submit" className="btn bp">
                {Icons.ok} Salvar paciente
              </button>
            </div>
          </form>
        );

      case 'amn':
        const currentPac = selectedPaciente || {
          nome: 'Maria Aparecida Silva',
          num_prontuario: 'PRO-000142',
          data_nascimento: '1964-05-12',
          cpf: '032.123.456-82',
        };
        const age = currentPac.data_nascimento
          ? new Date().getFullYear() - new Date(currentPac.data_nascimento).getFullYear()
          : 62;

        return (
          <>
            <div className="ph">
              <div className="pn">PRONTUÁRIO · {currentPac.num_prontuario}</div>
              <div className="pm">{currentPac.nome}</div>
              <div className="pp">
                <span>{age} anos</span>
                <span>·</span>
                <span>Diabética tipo II</span>
                <span>·</span>
                <span>Último atendimento recente</span>
              </div>
            </div>
            <div className="tabs">
              <div className={`tab ${activeAmnTab === 0 ? 'active' : ''}`} onClick={() => setActiveAmnTab(0)}>
                Anamnese
              </div>
              <div className={`tab ${activeAmnTab === 1 ? 'active' : ''}`} onClick={() => setActiveAmnTab(1)}>
                Avaliações
              </div>
              <div className={`tab ${activeAmnTab === 2 ? 'active' : ''}`} onClick={() => setActiveAmnTab(2)}>
                Atendimentos
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeAmnTab === 0 && (
              <div className="card">
                <div className="ch">
                  <div className="ct2">História clínica</div>
                </div>
                <div className="fg3">
                  <div className="fgr">
                    <label className="lbl">Tipo de diabetes</label>
                    <select
                      value={anamnese.tipo_diabete}
                      onChange={(e) => setAnamnese({ ...anamnese, tipo_diabete: e.target.value })}
                    >
                      <option>Não diabético</option>
                      <option>Tipo II</option>
                      <option>Tipo I</option>
                    </select>
                  </div>
                  <div className="fgr">
                    <label className="lbl">Tempo de diagnóstico</label>
                    <input
                      value={anamnese.tempo_diabetes}
                      onChange={(e) => setAnamnese({ ...anamnese, tempo_diabetes: e.target.value })}
                    />
                  </div>
                  <div className="fgr">
                    <label className="lbl">Hemoglobina glicada (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={anamnese.hemoglobina_glicada}
                      onChange={(e) => setAnamnese({ ...anamnese, hemoglobina_glicada: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="sl2">Comorbidades / Sintomas</div>
                <div className="ckg">
                  {Object.keys(anamnese.comorbidades).map((c, i) => (
                    <label key={i} className={`cki${anamnese.comorbidades[c] ? ' ck' : ''}`}>
                      <input
                        type="checkbox"
                        checked={anamnese.comorbidades[c]}
                        onChange={(e) => {
                          const updated = { ...anamnese.comorbidades };
                          updated[c] = e.target.checked;
                          setAnamnese({ ...anamnese, comorbidades: updated });
                        }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
                <div className="sl2">Hábitos de vida</div>
                <div className="fg">
                  <div className="fgr">
                    <label className="lbl">Calçado mais usado</label>
                    <select
                      value={anamnese.calcado_mais_usado}
                      onChange={(e) => setAnamnese({ ...anamnese, calcado_mais_usado: e.target.value })}
                    >
                      <option>Fechado</option>
                      <option>Aberto</option>
                      <option>Tênis</option>
                    </select>
                  </div>
                  <div className="fgr">
                    <label className="lbl">Frequência de esporte</label>
                    <select
                      value={anamnese.frequencia_esporte}
                      onChange={(e) => setAnamnese({ ...anamnese, frequencia_esporte: e.target.value })}
                    >
                      <option>Não pratica</option>
                      <option>Semanal</option>
                      <option>Diário</option>
                    </select>
                  </div>
                  <div className="fgr full">
                    <label className="lbl">Medicações em uso</label>
                    <input
                      value={anamnese.medicacoes}
                      onChange={(e) => setAnamnese({ ...anamnese, medicacoes: e.target.value })}
                    />
                  </div>
                  <div className="fgr full">
                    <label className="lbl">Outros hábitos</label>
                    <div style={{ display: 'flex', gap: '7px', marginTop: '4px' }}>
                      <label className={`cki${anamnese.tabagista ? ' ck' : ''}`} style={{ flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={anamnese.tabagista}
                          onChange={(e) => setAnamnese({ ...anamnese, tabagista: e.target.checked })}
                        />{' '}
                        Tabagista
                      </label>
                      <label className={`cki${anamnese.etilista ? ' ck' : ''}`} style={{ flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={anamnese.etilista}
                          onChange={(e) => setAnamnese({ ...anamnese, etilista: e.target.checked })}
                        />{' '}
                        Etilista
                      </label>
                      <label className={`cki${anamnese.uso_palmilha ? ' ck' : ''}`} style={{ flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={anamnese.uso_palmilha}
                          onChange={(e) => setAnamnese({ ...anamnese, uso_palmilha: e.target.checked })}
                        />{' '}
                        Usa palmilha
                      </label>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--g200)' }}>
                  <button className="btn bp" onClick={() => {
                    showToast('História clínica salva!');
                    setActiveAmnTab(1);
                  }}>
                    Próximo: Avaliações →
                  </button>
                </div>
              </div>
            )}

            {activeAmnTab === 1 && (
              <div className="card">
                <div className="ch">
                  <div className="ct2">Exame dermatológico</div>
                </div>
                <div className="ckg">
                  {Object.keys(exameDerm).map((c, i) => (
                    <label key={i} className={`cki${exameDerm[c] ? ' ck' : ''}`}>
                      <input
                        type="checkbox"
                        checked={exameDerm[c]}
                        onChange={(e) => {
                          const updated = { ...exameDerm };
                          updated[c] = e.target.checked;
                          setExameDerm(updated);
                        }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
                <div className="sl2">Aparelho ungueal</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {['Direito', 'Esquerdo'].map((pe, idx) => (
                    <div key={idx} style={{ background: 'var(--g50)', border: '1px solid var(--g200)', borderRadius: 'var(--r)', padding: '13px' }}>
                      <div style={{ fontSize: 12px, fontWeight: 600, color: 'var(--g600)', marginBottom: '9px' }}>
                        Pé {pe}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {['Onicogrifose', 'Onicocriptose', 'Onicomicose'].map((u, i) => (
                          <label key={i} className="cki">
                            <input type="checkbox" /> {u}
                          </label>
                        ))}
                        <div className="fgr" style={{ marginTop: '5px' }}>
                          <label className="lbl">Formato</label>
                          <select defaultValue="Normal">
                            <option>Normal</option>
                            <option>Telha</option>
                            <option>Funil</option>
                            <option>Gancho</option>
                            <option>Caracol</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="sl2">Monofilamento Semmes-Weinstein (10g)</div>
                <div className="mg">
                  <div className="mf">
                    <div style={{ fontSize: 11px, fontWeight: 600, color: 'var(--g500)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '9px' }}>
                      Pé Direito
                    </div>
                    <div className="mp">
                      {monoD.map((state, i) => (
                        <div
                          key={i}
                          className={`mpt ${state === 'pos' ? 'pos' : state === 'neg' ? 'neg' : ''}`}
                          onClick={() => handleCyclePoint('D', i)}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '7px', marginTop: '7px', fontSize: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '9px', height: '9px', background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: '2px', display: 'inline-block' }}></span>
                        Sensibilidade Preservada
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '9px', height: '9px', background: 'var(--coral-light)', border: '1px solid var(--coral)', borderRadius: '2px', display: 'inline-block' }}></span>
                        Sensibilidade Ausente
                      </span>
                    </div>
                  </div>
                  <div className="mf">
                    <div style={{ fontSize: 11px, fontWeight: 600, color: 'var(--g500)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '9px' }}>
                      Pé Esquerdo
                    </div>
                    <div className="mp">
                      {monoE.map((state, i) => (
                        <div
                          key={i}
                          className={`mpt ${state === 'pos' ? 'pos' : state === 'neg' ? 'neg' : ''}`}
                          onClick={() => handleCyclePoint('E', i)}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '7px', marginTop: '7px', fontSize: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '9px', height: '9px', background: 'var(--teal-light)', border: '1px solid var(--teal)', borderRadius: '2px', display: 'inline-block' }}></span>
                        Sensibilidade Preservada
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '9px', height: '9px', background: 'var(--coral-light)', border: '1px solid var(--coral)', borderRadius: '2px', display: 'inline-block' }}></span>
                        Sensibilidade Ausente
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sl2">Avaliação vascular</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {['Direito', 'Esquerdo'].map((pe, idx) => (
                    <div key={idx} style={{ background: 'var(--g50)', border: '1px solid var(--g200)', borderRadius: 'var(--r)', padding: '13px' }}>
                      <div style={{ fontSize: 12px, fontWeight: 600, color: 'var(--g600)', marginBottom: '9px' }}>
                        Pé {pe}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="fgr">
                          <label className="lbl">Coloração</label>
                          <select
                            value={idx === 0 ? vascular.coloracaoD : vascular.coloracaoE}
                            onChange={(e) => {
                              const key = idx === 0 ? 'coloracaoD' : 'coloracaoE';
                              setVascular({ ...vascular, [key]: e.target.value });
                            }}
                          >
                            <option>Normal</option>
                            <option>Cianose</option>
                            <option>Eritema</option>
                          </select>
                        </div>
                        <div className="fgr">
                          <label className="lbl">Temperatura</label>
                          <select
                            value={idx === 0 ? vascular.temperaturaD : vascular.temperaturaE}
                            onChange={(e) => {
                              const key = idx === 0 ? 'temperaturaD' : 'temperaturaE';
                              setVascular({ ...vascular, [key]: e.target.value });
                            }}
                          >
                            <option>Normal</option>
                            <option>Fria</option>
                            <option>Quente</option>
                          </select>
                        </div>
                        <div className="fgr">
                          <label className="lbl">Pulso dorsal</label>
                          <select
                            value={idx === 0 ? vascular.pulsoDorsalD : vascular.pulsoDorsalE}
                            onChange={(e) => {
                              const key = idx === 0 ? 'pulsoDorsalD' : 'pulsoDorsalE';
                              setVascular({ ...vascular, [key]: e.target.value });
                            }}
                          >
                            <option>Normal</option>
                            <option>Fraco</option>
                            <option>Ausente</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--g200)' }}>
                  <button className="btn bs" onClick={() => setActiveAmnTab(0)}>
                    ← Anamnese
                  </button>
                  <button className="btn bp" onClick={() => {
                    showToast('Avaliação clínica salva!');
                    setActiveAmnTab(2);
                  }}>
                    Próximo: Atendimentos →
                  </button>
                </div>
              </div>
            )}

            {activeAmnTab === 2 && (
              <div className="card">
                <div className="ch">
                  <div>
                    <div className="ct2">Histórico de atendimentos</div>
                    <div className="cs">{currentPac.nome} · {currentPac.num_prontuario}</div>
                  </div>
                  <button className="btn bt bsm" onClick={() => setCurrentView('atd')}>
                    {Icons.pls} Novo atendimento
                  </button>
                </div>
                {[
                  { d: '12/04/2026', dg: 'Onicocriptose grau I bilateral', c: 'Desbridamento e curativo oclusivo.', e: 'Melhora da dor. Edema reduzido. Orientada sobre higiene e calçado.', p: 'Dra. Carla Mendes' },
                  { d: '20/03/2026', dg: 'Onicocriptose grau II hálux D', c: 'Antisséptico. Curativo oclusivo.', e: 'Dor intensa. Unhas com bordas cortantes. Pele íntegra.', p: 'Dra. Carla Mendes' },
                  { d: '05/01/2026', dg: 'Avaliação inicial — Hiperqueratose plantar', c: 'Limpeza e hidratação. Orientações gerais.', e: 'Diabética tipo II. Pele ressecada. Sensibilidade preservada.', p: 'Dra. Fernanda Lima' },
                ].map((e, index) => (
                  <div key={index} className="ec">
                    <div style={{ fontSize: 11px, color: 'var(--g500)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {Icons.clk}
                      {e.d} · <span style={{ color: 'var(--brand)', fontWeight: 500 }}>{e.dg}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '6px 0' }}>
                      <div>
                        <div style={{ fontSize: 10px, fontWeight: 600, color: 'var(--g500)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '3px' }}>
                          Conduta
                        </div>
                        <div style={{ fontSize: 12px, color: 'var(--g700)' }}>{e.c}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10px, fontWeight: 600, color: 'var(--g500)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '3px' }}>
                          Evolução
                        </div>
                        <div style={{ fontSize: 12px, color: 'var(--g700)' }}>{e.e}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11px, color: 'var(--brand)', fontWeight: 500, marginTop: '4px' }}>
                      {e.p}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      case 'atd':
        const pacForAtd = selectedPaciente || { nome: 'Maria Aparecida Silva', num_prontuario: 'PRO-000142' };
        return (
          <>
            <div className="ph">
              <div className="pn">{pacForAtd.num_prontuario} · NOVO ATENDIMENTO · Hoje</div>
              <div className="pm">{pacForAtd.nome}</div>
              <div className="pp">
                <span>{currentUser?.nome || 'Dra. Carla Mendes'}</span>
                <span>·</span>
                <span>{new Date().toLocaleTimeString().slice(0, 5)}</span>
              </div>
            </div>
            <div className="card">
              <div className="ch">
                <div className="ct2">Registro do atendimento</div>
              </div>
              <div className="fgr" style={{ marginBottom: '12px' }}>
                <label className="lbl">Diagnóstico podológico *</label>
                <textarea
                  placeholder="Descreva o diagnóstico observado neste atendimento..."
                  style={{ minHeight: '88px' }}
                  value={atendimento.diagnostico}
                  onChange={(e) => setAtendimento({ ...atendimento, diagnostico: e.target.value })}
                ></textarea>
              </div>
              <div className="fgr" style={{ marginBottom: '12px' }}>
                <label className="lbl">Conduta realizada *</label>
                <textarea
                  placeholder="Descreva os procedimentos realizados..."
                  style={{ minHeight: '88px' }}
                  value={atendimento.conduta}
                  onChange={(e) => setAtendimento({ ...atendimento, conduta: e.target.value })}
                ></textarea>
              </div>
              <div className="fgr" style={{ marginBottom: '18px' }}>
                <label className="lbl">Evolução clínica</label>
                <textarea
                  placeholder="Registre a evolução do quadro clínico..."
                  style={{ minHeight: '75px' }}
                  value={atendimento.evolucao}
                  onChange={(e) => setAtendimento({ ...atendimento, evolucao: e.target.value })}
                ></textarea>
              </div>
              <div style={{ background: 'var(--g50)', borderRadius: '8px', padding: '13px', marginBottom: '18px' }}>
                <div style={{ fontSize: 12px, fontWeight: 600, color: 'var(--g600)', marginBottom: '9px' }}>
                  Histórico recente
                </div>
                {[
                  { d: '12/04/2026', t: 'Melhora da onicocriptose bilateral. Desbridamento e curativo.' },
                  { d: '20/03/2026', t: 'Onicocriptose grau II hálux D. Curativo oclusivo aplicado.' },
                ].map((e, idx) => (
                  <div key={idx} className="ec">
                    <div style={{ fontSize: 11px, color: 'var(--g500)', marginBottom: '5px', display: 'flex', alignHover: 'center', gap: '5px' }}>
                      {Icons.clk} {e.d}
                    </div>
                    <div style={{ fontSize: 13px, color: 'var(--g700)' }}>{e.t}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', paddingTop: '14px', borderTop: '1px solid var(--g200)' }}>
                <button type="button" className="btn bs" onClick={() => setCurrentView('fila')}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn bt"
                  onClick={() => {
                    showToast('Atendimento registrado com sucesso!');
                    setAtendimento({ diagnostico: '', conduta: '', evolucao: '' });
                    setCurrentView('fila');
                  }}
                >
                  {Icons.ok} Finalizar atendimento
                </button>
              </div>
            </div>
          </>
        );

      case 'dash':
        return (
          <>
            <div className="sg">
              <div className="sc bl">
                <div className="sv">{pacientes.length + 281}</div>
                <div className="sl">Pacientes ativos</div>
              </div>
              <div className="sc tl">
                <div className="sv">47</div>
                <div className="sl">Atendimentos este mês</div>
              </div>
              <div className="sc co">
                <div className="sv">3</div>
                <div className="sl">Na fila agora</div>
              </div>
              <div className="sc am">
                <div className="sv">18</div>
                <div className="sl">Novos este mês</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
              <div className="card">
                <div className="ch">
                  <div className="ct2">Atendimentos por mês</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '110px', padding: '8px 0' }}>
                  {[32, 28, 35, 41, 38, 44, 47].map((val, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.round((val / 47) * 80)}px`,
                          background: idx === 6 ? 'var(--brand)' : 'var(--brand-light)',
                          borderRadius: '4px 4px 0 0',
                          position: 'relative',
                        }}
                      >
                        <span style={{ position: 'absolute', top: '-17px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', fontWeight: 600, color: 'var(--g600)' }}>
                          {val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
                  {['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'].map((month, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: 'var(--g400)' }}>
                      {month}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="ch">
                  <div className="ct2">Por podóloga</div>
                </div>
                {[
                  { n: 'Dra. Carla Mendes', v: 28, p: 60 },
                  { n: 'Dra. Fernanda Lima', v: 19, p: 40 },
                ].map((p, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{p.n}</span>
                      <span style={{ color: 'var(--g500)' }}>{p.v}</span>
                    </div>
                    <div style={{ background: 'var(--g100)', borderRadius: '4px', height: '6px' }}>
                      <div style={{ width: `${p.p}%`, height: '100%', background: 'var(--brand)', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--g800)', margin: '14px 0 8px' }}>
                  Condições frequentes
                </div>
                {[
                  { c: 'Onicocriptose', n: 18, cl: 'var(--brand)' },
                  { c: 'Onicomicose', n: 12, cl: 'var(--teal)' },
                  { c: 'Hiperqueratose', n: 9, cl: 'var(--coral)' },
                  { c: 'Calosidades', n: 8, cl: 'var(--amber)' },
                ].map((r, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px', fontSize: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: r.cl, flexShrink: 0 }}></div>
                    <span style={{ flex: 1, color: 'var(--g700)' }}>{r.c}</span>
                    <span style={{ fontWeight: 600 }}>{r.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="ch">
                <div className="ct2">Últimos atendimentos</div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Prontuário</th>
                      <th>Paciente</th>
                      <th>Podóloga</th>
                      <th>Data</th>
                      <th>Diagnóstico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { p: 'PRO-000142', n: 'Maria Aparecida Silva', pod: 'Dra. Carla', d: '18/04/2026', dg: 'Onicocriptose' },
                      { p: 'PRO-000201', n: 'João Carlos Ferreira', pod: 'Dra. Fernanda', d: '17/04/2026', dg: 'Hiperqueratose' },
                      { p: 'PRO-000088', n: 'Rosana Matos', pod: 'Dra. Carla', d: '16/04/2026', dg: 'Onicomicose' },
                    ].map((r, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12px, color: 'var(--brand)' }}>
                            {r.p}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{r.n}</td>
                        <td style={{ color: 'var(--g500)' }}>{r.pod}</td>
                        <td style={{ color: 'var(--g500)' }}>{r.d}</td>
                        <td>
                          <span className="bdg b-bl">{r.dg}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'rel':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
              {[
                { t: 'Atendimentos por período', d: 'Filtre por data e exporte', c: 'var(--brand)' },
                { t: 'Relatório por podóloga', d: 'Desempenho individual', c: 'var(--teal)' },
                { t: 'Pacientes ativos/inativos', d: 'Situação cadastral', c: 'var(--coral)' },
              ].map((r, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{ cursor: 'pointer', borderTop: `3px solid ${r.c}` }}
                  onClick={() => showToast('Relatório gerado!')}
                >
                  <div style={{ fontWeight: 600, fontSize: 13px, color: 'var(--g800)', marginBottom: '3px' }}>
                    {r.t}
                  </div>
                  <div style={{ fontSize: 12px, color: 'var(--g500)' }}>{r.d}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="ch">
                <div className="ct2">Gerar relatório personalizado</div>
              </div>
              <div className="fg">
                <div className="fgr">
                  <label className="lbl">Período inicial</label>
                  <input type="date" />
                </div>
                <div className="fgr">
                  <label className="lbl">Período final</label>
                  <input type="date" />
                </div>
                <div className="fgr">
                  <label className="lbl">Podóloga</label>
                  <select>
                    <option>Todas</option>
                    <option>Dra. Carla Mendes</option>
                    <option>Dra. Fernanda Lima</option>
                  </select>
                </div>
                <div className="fgr">
                  <label className="lbl">Tipo</label>
                  <select>
                    <option>Atendimentos</option>
                    <option>Pacientes</option>
                    <option>Condições clínicas</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                <button className="btn bp" onClick={() => showToast('PDF exportado!')}>
                  {Icons.ftx} Exportar PDF
                </button>
              </div>
            </div>
          </>
        );

      case 'usr':
        return (
          <div className="card">
            <div className="ch">
              <div className="ct2">Usuários do sistema</div>
              <button className="btn bp bsm" onClick={() => showToast('Novo formulário de usuário!')}>
                {Icons.pls} Novo usuário
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Perfil</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: 'Ana Paula Costa', e: 'ana@saocamilo.com.br', p: 'recepcionista' },
                    { n: 'Dra. Carla Mendes', e: 'carla@saocamilo.com.br', p: 'podologa' },
                    { n: 'Dra. Fernanda Lima', e: 'fernanda@saocamilo.com.br', p: 'podologa' },
                    { n: 'Administrador', e: 'admin@saocamilo.com.br', p: 'administrador' },
                  ].map((u, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500 }}>{u.n}</td>
                      <td style={{ color: 'var(--g500)' }}>{u.e}</td>
                      <td>
                        <span className={`bdg ${u.p === 'administrador' ? 'b-co' : u.p === 'podologa' ? 'b-tl' : 'b-bl'}`}>
                          {u.p}
                        </span>
                      </td>
                      <td>
                        <span className="bdg b-tl">ativo</span>
                      </td>
                      <td>
                        <button className="btn bs bic bsm">{Icons.edt}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <p style={{ color: 'var(--g500)' }}>Em construção</p>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="ls">
        <div className="lc">
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px', justifyContent: 'center' }}>
            <div className="li">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--g800)' }}>Clínica São Camilo</div>
              <div style={{ fontSize: '12px', color: 'var(--g500)' }}>Sistema de Prontuário Digital</div>
            </div>
          </div>
          <div style={{ fontSize: '21px', fontWeight: 600, color: 'var(--g800)', textAlign: 'center', marginBottom: '3px' }}>
            Bem-vindo(a)
          </div>
          <div style={{ fontSize: '13px', color: 'var(--g500)', textAlign: 'center', marginBottom: '22px' }}>
            Informe suas credenciais para acessar
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label className="lbl" style={{ display: 'block', marginBottom: '4px' }}>
              E-mail
            </label>
            <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
          </div>
          <div style={{ marginBottom: '4px' }}>
            <label className="lbl" style={{ display: 'block', marginBottom: '4px' }}>
              Senha
            </label>
            <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
          </div>
          <button className="lb" onClick={() => handleLogin()}>
            Entrar
          </button>
          <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '11px', color: 'var(--g500)' }}>
            Entrar rápido (Simulador):
          </div>
          <div style={{ display: 'flex', gap: '7px', marginTop: '8px' }}>
            <button className="rb" onClick={() => handleLogin('recepcionista')}>
              Recepcionista
            </button>
            <button className="rb" onClick={() => handleLogin('podologo')}>
              Podóloga
            </button>
            <button className="rb" onClick={() => handleLogin('administracao')}>
              Administrador
            </button>
          </div>
        </div>
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '22px',
            right: '22px',
            background: 'var(--teal)',
            color: 'white',
            padding: '11px 16px',
            borderRadius: '9px',
            fontSize: '13px',
            fontWeight: 500,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 4px 20px rgba(0,0,0,.2)'
          }}>
            {Icons.ok}
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  const userMenu = menuConfig[currentUser?.perfil || 'recepcionista'] || [];

  return (
    <div className="app">
      <div className={`ov ${isSidebarOpen ? 'show' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <nav className={`sb ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sb-logo">
          <div className="sb-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
            </svg>
          </div>
          <div className="sb-txt">
            São Camilo<span>Prontuário Digital</span>
          </div>
        </div>
        <div className="sb-nav">
          {userMenu.map((m, idx) => (
            <div
              key={idx}
              className={`ni ${currentView === m.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentView(m.id);
                setIsSidebarOpen(false);
              }}
            >
              {Icons[m.ic as keyof typeof Icons]}
              {m.l}
              {m.b && <span className="nb">{m.b}</span>}
            </div>
          ))}
        </div>
        <div className="sb-foot">
          <div className="av">{profileHeader.a}</div>
          <div>
            <div className="un">{profileHeader.n}</div>
            <div className="ur">{profileHeader.r}</div>
          </div>
        </div>
      </nav>
      <div className="main">
        <div className="tb">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="mt" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--g700)" strokeWidth="2" strokeLinecap="round" width="17" height="17">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="tb-t">{getTitle(currentView)}</div>
          </div>
          <button className="btn bs bsm" onClick={handleLogout}>
            Sair
          </button>
        </div>
        <div className="ct">{renderViewContent()}</div>
      </div>

      {/* Toast popup */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          background: 'var(--teal)',
          color: 'white',
          padding: '11px 16px',
          borderRadius: '9px',
          fontSize: '13px',
          fontWeight: 500,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          boxShadow: '0 4px 20px rgba(0,0,0,.2)'
        }}>
          {Icons.ok}
          {toastMessage}
        </div>
      )}
    </div>
  );
}
