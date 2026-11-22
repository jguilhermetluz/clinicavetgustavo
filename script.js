/* CLÍNICA VETERINÁRIA DR. GUSTAVO CALDAS — script.js
   Índice: 01 Utilitários · 02 Cabeçalho · 03 Menu mobile · 04 Link ativo · 05 Revelação
           06 Contadores · 07 Modal de serviços · 08 Questionário do WhatsApp · 09 FAQ · 10 Rodapé */
'use strict';

/* ===== 01. UTILITÁRIOS ===== */
// Número da clínica (formato internacional, sem símbolos). >>> Troque aqui <<<
const WHATSAPP = '5584999935303';
const linkWhatsapp = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const $  = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => Array.from(e.querySelectorAll(s));

/* ===== 02. CABEÇALHO + VOLTAR AO TOPO ===== */
const cabecalho = $('#cabecalho');
const botaoTopo = $('#voltar-topo');
function aoRolar() {
  cabecalho.classList.toggle('rolou', window.scrollY > 10);
  if (botaoTopo) botaoTopo.hidden = window.scrollY < 600;
}
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();
botaoTopo?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== 03. MENU MOBILE ===== */
const botaoMenu = $('#botao-menu');
const navegacao = $('#navegacao');
function alternarMenu(fechar = false) {
  const abrir = fechar ? false : !navegacao.classList.contains('aberto');
  navegacao.classList.toggle('aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}
botaoMenu?.addEventListener('click', () => alternarMenu());
$$('.navegacao a').forEach((l) => l.addEventListener('click', () => alternarMenu(true)));
window.addEventListener('resize', () => { if (window.innerWidth >= 900) alternarMenu(true); });

/* ===== 04. LINK ATIVO NA NAVEGAÇÃO ===== */
const linksMenu = $$('.link-menu');
const obsSecao = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    linksMenu.forEach((l) => l.classList.toggle('ativo', l.getAttribute('href') === `#${e.target.id}`));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach((s) => obsSecao.observe(s));

/* ===== 05. REVELAÇÃO AO ROLAR ===== */
const obsReveal = new IntersectionObserver((entradas, o) => {
  entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); o.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach((el) => obsReveal.observe(el));

/* ===== 06. CONTADORES ===== */
function animarContador(el) {
  const alvo = parseInt(el.dataset.alvo, 10) || 0;
  const inicio = performance.now();
  (function passo(agora) {
    const p = Math.min((agora - inicio) / 1600, 1);
    el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(passo);
  })(inicio);
}
const blocoStats = $('#estatisticas');
if (blocoStats) {
  new IntersectionObserver((entradas, o) => {
    entradas.forEach((e) => { if (e.isIntersecting) { $$('.contador', blocoStats).forEach(animarContador); o.unobserve(e.target); } });
  }, { threshold: 0.4 }).observe(blocoStats);
}

/* ===== UTILIDADE DE MODAL (usada pelos dois modais) ===== */
function abrirCaixa(caixa, focar) {
  caixa._foco = document.activeElement;
  caixa.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => caixa.classList.add('aberto')));
  document.body.style.overflow = 'hidden';
  focar?.focus();
}
function fecharCaixa(caixa, devolverFoco = true) {
  caixa.classList.remove('aberto');
  document.body.style.overflow = '';
  setTimeout(() => { caixa.hidden = true; if (devolverFoco) caixa._foco?.focus(); }, 300);
}

/* ===== 07. MODAL DE SERVIÇOS ===== */
const DADOS_SERVICOS = {
  consultas: { titulo: 'Consultas', icone: 'i-estetoscopio', servico: 'Consulta',
    descricao: 'Atendimento de clínica geral com anamnese completa, exame físico cuidadoso e um plano de saúde individual para o seu pet — sem pressa e com linguagem simples.',
    itens: ['Consulta clínica completa (cães, gatos e exóticos)', 'Check-up de rotina e acompanhamento de idosos', 'Segunda opinião sobre diagnósticos e tratamentos', 'Orientação sobre comportamento e prevenção'],
    cta: 'Olá! Gostaria de agendar uma consulta para o meu pet.' },
  vacinacao: { titulo: 'Vacinação', icone: 'i-vacina', servico: 'Vacinação',
    descricao: 'Programa de vacinação completo, com vacinas de procedência comprovada, aplicação segura e carteirinha digital — e ainda enviamos lembretes quando chegar a data do reforço.',
    itens: ['V8 e V10 para filhotes e adultos', 'Antirrábica (exigida por lei)', 'Quadrivalente e quíntupla felina', 'Lembretes de reforço no WhatsApp'],
    cta: 'Olá! Quero atualizar a carteirinha de vacinas do meu pet.' },
  exames: { titulo: 'Exames', icone: 'i-exame', servico: 'Exames',
    descricao: 'Laboratório próprio e parceiros de imagem para um diagnóstico rápido e preciso. Muitos resultados ficam prontos no mesmo dia, para tranquilizar você o quanto antes.',
    itens: ['Hemograma e bioquímica sanguínea', 'Exames de fezes e urina', 'Ultrassom e radiografia digital', 'Testes rápidos (leishmaniose, carrapato, felv/fiv)'],
    cta: 'Olá! Meu pet precisa fazer exames. Podemos agendar?' },
  cirurgias: { titulo: 'Cirurgias', icone: 'i-cirurgia', servico: 'Cirurgia',
    descricao: 'Centro cirúrgico equipado com monitoramento completo, anestesia segura e equipe dedicada. Você recebe atualizações do procedimento e orientações claras de pós-operatório.',
    itens: ['Castração de cães e gatos (com condições especiais)', 'Cirurgias de tecidos moles e tumores', 'Limpeza de tártaro com anestesia', 'Pós-operatório com acompanhamento próximo'],
    cta: 'Olá! Gostaria de informações sobre um procedimento cirúrgico.' },
  emergencia: { titulo: 'Emergência 24h', icone: 'i-raio', servico: 'Emergência',
    descricao: 'Plantão 24 horas, todos os dias do ano. Em situações críticas, cada minuto conta — chame no WhatsApp e receba orientação imediata enquanto vem até a clínica.',
    itens: ['Atendimento urgente 24h, inclusive feriados', 'Orientação de primeiros socorros por WhatsApp', 'Estabilização, oxigenioterapia e monitoramento', 'Internamento com acompanhamento contínuo'],
    cta: 'OLÁ! É UMA EMERGÊNCIA! Meu pet precisa de atendimento urgente.' },
};
const modal = $('#modal-servico');
const modalCta = $('#modal-cta');

function abrirModal(chave) {
  const d = DADOS_SERVICOS[chave];
  if (!d) return;
  $('#modal-titulo').textContent = d.titulo;
  $('#modal-descricao').textContent = d.descricao;
  $('#modal-icone-use').setAttribute('href', `#${d.icone}`);
  modalCta.dataset.whats = d.cta;
  modalCta.dataset.servico = d.servico;
  $('#modal-itens').innerHTML = d.itens.map((i) => `<li><svg aria-hidden="true"><use href="#i-check"/></svg>${i}</li>`).join('');
  abrirCaixa(modal, $('.modal-fechar', modal));
}
$$('[data-abrir-modal]').forEach((b) => b.addEventListener('click', () => abrirModal(b.dataset.abrirModal)));
$$('[data-fechar-modal]').forEach((e) => e.addEventListener('click', () => fecharCaixa(modal)));

/* ===== 08. QUESTIONÁRIO DO WHATSAPP =====
   Qualquer elemento com [data-whats="mensagem"] abre o questionário em vez de ir direto ao WhatsApp.
   Sim → nome do tutor + nome do animal. Não → dados do cadastro + serviço desejado. */
const caixaWhats = $('#modal-whats');
const formCliente = $('#form-cliente');
const formNovo = $('#form-novo');
let contexto = { msg: '', servico: '' };

function mostrarPasso(nome) {
  $$('.qw-passo', caixaWhats).forEach((p) => (p.hidden = p.dataset.passo !== nome));
  const alvo = $(`.qw-passo[data-passo="${nome}"] input, .qw-passo[data-passo="${nome}"] button`, caixaWhats);
  alvo?.focus();
}
function limparFormularios() {
  [formCliente, formNovo].forEach((f) => {
    f.reset();
    $$('.campo-erro', f).forEach((c) => c.classList.remove('campo-erro'));
    $('.qw-erro', f).hidden = true;
  });
}
function abrirQuestionario(msg, servico) {
  contexto = { msg: msg || 'Olá! Gostaria de falar com a clínica.', servico: servico || '' };
  limparFormularios();
  if (!modal.hidden) fecharCaixa(modal, false); // fecha o modal de serviço, se estiver aberto
  $$('.qw-passo', caixaWhats).forEach((p) => (p.hidden = p.dataset.passo !== 'inicio'));
  if (servico) $('#qw-servico').value = servico;
  abrirCaixa(caixaWhats, $('[data-ir="cliente"]', caixaWhats));
}

// Intercepta todos os botões/links de WhatsApp do site
document.addEventListener('click', (e) => {
  const gatilho = e.target.closest('[data-whats]');
  if (!gatilho) return;
  e.preventDefault();
  abrirQuestionario(gatilho.dataset.whats, gatilho.dataset.servico);
});

$$('[data-ir]', caixaWhats).forEach((b) => b.addEventListener('click', () => mostrarPasso(b.dataset.ir)));
$$('[data-fechar-whats]').forEach((e) => e.addEventListener('click', () => fecharCaixa(caixaWhats)));

// Valida os campos obrigatórios; retorna true se tudo preenchido
function validar(form) {
  let ok = true;
  $$('[required]', form).forEach((c) => {
    const vazio = !c.value.trim();
    c.closest('.campo').classList.toggle('campo-erro', vazio);
    if (vazio) ok = false;
  });
  $('.qw-erro', form).hidden = ok;
  if (!ok) $('.campo-erro input, .campo-erro select', form)?.focus();
  return ok;
}
$$('.qw-passo input, .qw-passo select').forEach((c) =>
  c.addEventListener('input', () => c.closest('.campo')?.classList.remove('campo-erro')));

function enviarWhats(form, texto) {
  window.open(linkWhatsapp(texto), '_blank', 'noopener');
  fecharCaixa(caixaWhats, false);
  form.reset();
}

// Já é cliente
formCliente.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validar(formCliente)) return;
  const d = Object.fromEntries(new FormData(formCliente));
  enviarWhats(formCliente, `${contexto.msg}\nSou cliente da clínica.\n*Tutor(a):* ${d.tutor.trim()}\n*Pet:* ${d.pet.trim()}`);
});

// Novo cliente (cadastro + serviço)
formNovo.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validar(formNovo)) return;
  const d = Object.fromEntries(new FormData(formNovo));
  const linhas = [
    contexto.msg,
    'Ainda não sou cliente e gostaria de me cadastrar.',
    `*Tutor(a):* ${d.tutor.trim()}`,
    `*Telefone:* ${d.telefone.trim()}`,
    `*Pet:* ${d.pet.trim()} (${d.especie}${d.raca.trim() ? ', ' + d.raca.trim() : ''})`,
    `*Serviço desejado:* ${d.servico}`,
  ];
  if (d.obs.trim()) linhas.push(`*Obs.:* ${d.obs.trim()}`);
  enviarWhats(formNovo, linhas.join('\n'));
});

// Esc fecha o modal que estiver aberto
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  alternarMenu(true);
  if (!caixaWhats.hidden) fecharCaixa(caixaWhats);
  else if (!modal.hidden) fecharCaixa(modal);
});

/* ===== 09. FAQ (ACORDEÃO) ===== */
$$('.faq-item').forEach((item) => {
  const pergunta = $('.faq-pergunta', item);
  pergunta.addEventListener('click', () => {
    const jaAberto = item.classList.contains('aberto');
    $$('.faq-item.aberto').forEach((o) => { o.classList.remove('aberto'); $('.faq-pergunta', o).setAttribute('aria-expanded', 'false'); });
    if (!jaAberto) { item.classList.add('aberto'); pergunta.setAttribute('aria-expanded', 'true'); }
  });
});

/* ===== 10. RODAPÉ: ANO ATUAL ===== */
const ano = $('#ano-atual');
if (ano) ano.textContent = new Date().getFullYear();
