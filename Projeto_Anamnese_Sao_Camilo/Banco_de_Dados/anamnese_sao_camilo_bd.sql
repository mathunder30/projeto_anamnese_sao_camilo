create database anamnese_db;
use anamnese_db;
-- Estrutura Base
create table usuarios (
id char(36) primary key,
nome varchar(100) not null,
email varchar(150) unique not null,
senha_hash varchar(255) not null,
perfil enum('recepcionista', 'podologo', 'administracao') not null,
ativo tinyint (1) not null default 1,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

alter table usuarios
modify ativo tinyint not null default 1;

create table pacientes (
id char(36) primary key,
num_prontuario varchar(20) unique not null,
nome varchar(100) not null,
data_nascimento date not null,
cpf varchar(14) unique null,
sexo ENUM('masculino','feminino','outro') NOT NULL,
rg varchar(20) null,
email varchar(100) null,
telefone varchar(20) null,
celular varchar(20) not null,
profissao varchar(100) null,
indicacao varchar(100) null,
ativo tinyint (1) not null default 1,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table enderecos (
id char(36) primary key,
paciente_id char(36) not null,
logradouro varchar(150) not null,
numero varchar(20) not null,
complemento varchar(50) null,
bairro varchar(80) not null,
cidade varchar(80) not null,
estado char(2) not null,
cep varchar(9) not null,
criado_em timestamp default current_timestamp,
atualizado_em timestamp default current_timestamp on update current_timestamp,

foreign key (paciente_id) references pacientes(id)
);
-- Prontuário
create table prontuarios(
id char(36) primary key not null,
paciente_id char(36) not null,
criado_por char(36) not null,

data_consulta DATETIME NOT NULL,
ativo tinyint(1) not null default 1,

criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

foreign key (paciente_id) references pacientes(id),
foreign key (criado_por) references usuarios(id)


);

create table anamneses (
id char(36) primary key not null,
prontuario_id char(36) not null UNIQUE,
tipo_diabete varchar(50) null,
tempo_diabetes varchar(50) null,
hemoglobina_glicada decimal(4,2) null,
retinopatia tinyint(1) not null default 0,
neuropatia tinyint(1) not null default 0,
nefropatia tinyint(1) not null default 0,
hipertenso tinyint(1) not null default 0,
cardiopatia tinyint(1) not null default 0,
cirurgia_mmii tinyint(1) not null default 0,
amputacao_previa tinyint(1) not null default 0,
uso_palmilha tinyint(1) not null default 0,
medicacoes text null,
calcado_mais_usado varchar(50) null,
tabagista tinyint(1) not null default 0,
etilista tinyint(1) not null default 0,
frequencia_esporte varchar(50) null,
observacoes text null,

criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

foreign key (prontuario_id) references prontuarios(id)

);

-- Avaliação Clínicas
create table exames_dermatologicos(
id char(36) primary key not null,
anamnese_id char(36) not null unique,
micose tinyint(1) not null default 0,
ressecamento tinyint(1) not null default 0,
maceracao tinyint(1) not null default 0,
disidrose tinyint(1) not null default 0,
hiperpigmentacao tinyint(1) not null default 0,
bromidrose tinyint(1) not null default 0,
hiperhidrose tinyint(1) not null default 0,
hiperqueratose tinyint(1) not null default 0,
fissuras tinyint(1) not null default 0,
calos tinyint(1) not null default 0,
verruga tinyint(1) not null default 0,
ulceracao tinyint(1) not null default 0,
outros text null,

criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


foreign key (anamnese_id) references anamneses(id)

);


create table avaliacoes_ungueais (
-- d = direito / e = esquerdo
id char(36) primary key not null,
anamnese_id char(36) not null unique,
onicogrifose_d tinyint(1) not null default 0,
onicogrifose_e tinyint(1) not null default 0,
onicocriptose_d tinyint(1) not null default 0,
onicocriptose_e tinyint(1) not null default 0,
onicomicose_d tinyint(1) not null default 0,
onicomicose_e tinyint(1) not null default 0,
formato_d varchar(30) null,
formato_e varchar(30) null,
outros text null,

criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


foreign key (anamnese_id) references anamneses(id)

);

create table avaliacoes_vasculares(
id char(36) primary key not null,
anamnese_id char(36) not null unique,
coloracao_d varchar(30) null,
coloracao_e varchar(30) null,
temperatura_d varchar(20) null,
temperatura_e varchar(20) null,
edema_d tinyint(1) not null default 0,
edema_e tinyint(1) not null default 0,
pulso_dorsal_d varchar(20) null,
pulso_dorsal_e varchar(20) null,
pulso_tibial_d varchar(20) null,
pulso_tibial_e varchar(20) null,
varizes tinyint(1) not null default 0,
observacoes text null,

criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


foreign key (anamnese_id) references anamneses(id)


);

create table deformidades(
id char(36) primary key not null,
anamnese_id char(36) not null unique,
halux_valgo tinyint(1) not null default 0,
dedos_garra tinyint(1) not null default 0,
dedos_martelo tinyint(1) not null default 0,
proeminencia_ossea tinyint(1) not null default 0,
pe_plano_cavo_d varchar(20) null,
pe_plano_cavo_e varchar(20) null,
claudicacao tinyint(1) not null default 0,
palmilhas tinyint(1) not null default 0,
observacoes text null,

criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


foreign key (anamnese_id) references anamneses(id)
);

create table atendimentos (
id char(36) primary key not null,
prontuarios_id char(36) not null,
podologo_id char(36) not null, -- Referência a usuarios.id — podóloga responsável
diagnostico text null,
conduta text null,
evolucao text null,
data_atendimento datetime not null,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

foreign key(prontuarios_id) references prontuarios(id),
foreign key(podologo_id) references usuarios(id)
);

create table audit_logs(
id char(36) primary key not null,
usuario_id char(36) not null,
acao varchar(50) not null,
tabela_alvo varchar(50) not null,
registro_id char(36) null,
dado_anterior json null,
dado_novo json null,
criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

foreign key (usuario_id) references usuarios(id)

);
