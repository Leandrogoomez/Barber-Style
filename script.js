document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-date').value = today;

  estado.data = today;
  atualizarResumo();
  carregarAgendaBarbeiro();
});

// ESTADO DO AGENDAMENTO
let estado = {
  servico: "Cabelo + Barba",
  preco: "70",
  barbeiro: "Carlos",
  data: "",
  horario: "11:00"
};

// SERVIÇO
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    estado.servico = card.getAttribute('data-service');
    estado.preco = card.getAttribute('data-price');
    atualizarResumo();
  });
});

// BARBEIRO
document.querySelectorAll('.barber-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.barber-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    estado.barbeiro = card.getAttribute('data-barber');
    atualizarResumo();
  });
});

// HORÁRIO
document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    estado.horario = btn.getAttribute('data-time');
    atualizarResumo();
  });
});

// DATA
document.getElementById('booking-date').addEventListener('change', (e) => {
  estado.data = e.target.value;
  atualizarResumo();
});

function atualizarResumo() {
  document.getElementById('summary-service').innerText = estado.servico;
  document.getElementById('summary-barber').innerText = estado.barbeiro;
  document.getElementById('summary-datetime').innerText = `${formatarData(estado.data)} às ${estado.horario}`;
  document.getElementById('summary-price').innerText = `R$ ${estado.preco},00`;
}

function formatarData(dataIso) {
  if (!dataIso) return '';
  const partes = dataIso.split('-');
  return `${partes[2]}/${partes[1]}`;
}

// CONFIRMAÇÃO & DISPARO PARA O WHATSAPP
document.getElementById('btn-confirm-booking').addEventListener('click', () => {
  const nomeCliente = document.getElementById('client-name').value;

  if (!nomeCliente.trim()) {
    alert("Por favor, digite seu nome antes de prosseguir.");
    return;
  }

  // 1. Número do seu WhatsApp (Com código do país 55 + DDD + Número)
  // Exemplo para SP: 5511987654321
  const numeroWhats = "5511999999999"; 

  // 2. Montagem da Mensagem Formatada
  const mensagem = `👋 Olá! Gostaria de confirmar um agendamento:\n\n` +
    `👤 *Cliente:* ${nomeCliente}\n` +
    `💈 *Serviço:* ${estado.servico}\n` +
    `✂️ *Profissional:* ${estado.barbeiro}\n` +
    `📅 *Data/Hora:* ${formatarData(estado.data)} às ${estado.horario}\n` +
    `💰 *Valor:* R$ ${estado.preco},00\n\n` +
    `Aguardo a confirmação!`;

  // 3. Salvar registro interno
  let agendamentos = JSON.parse(localStorage.getItem('barber_agendamentos') || '[]');
  agendamentos.push({
    cliente: nomeCliente,
    servico: estado.servico,
    barbeiro: estado.barbeiro,
    data: estado.data,
    horario: estado.horario,
    preco: estado.preco
  });
  localStorage.setItem('barber_agendamentos', JSON.stringify(agendamentos));

  // 4. Abrir aplicativo do WhatsApp (Normal ou Business)
  const urlWhatsapp = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
  window.open(urlWhatsapp, '_blank');

  carregarAgendaBarbeiro();
});

// ALTERNAR VISÃO DO BARBEIRO
const toggleBtn = document.getElementById('toggle-view-btn');
toggleBtn.addEventListener('click', () => {
  const clientView = document.getElementById('client-view');
  const barberView = document.getElementById('barber-view');

  if (clientView.classList.contains('active')) {
    clientView.classList.remove('active');
    barberView.classList.add('active');
    toggleBtn.innerText = "Modo Agendar 💈";
  } else {
    barberView.classList.remove('active');
    clientView.classList.add('active');
    toggleBtn.innerText = "Ver Agenda ✂️";
  }
});

function carregarAgendaBarbeiro() {
  const agendaList = document.getElementById('agenda-list');
  const agendamentos = JSON.parse(localStorage.getItem('barber_agendamentos') || '[]');

  if (agendamentos.length === 0) {
    agendaList.innerHTML = `<p style="color:#888; font-size:0.85rem; text-align:center; padding: 20px;">Nenhum agendamento realizado ainda.</p>`;
    return;
  }

  agendaList.innerHTML = "";
  agendamentos.slice().reverse().forEach(item => {
    const card = document.createElement('div');
    card.className = 'agenda-item';
    card.innerHTML = `
      <div class="agenda-time">${item.horario}</div>
      <div class="agenda-info">
        <strong>${item.cliente} (${item.servico})</strong>
        <p>Com: ${item.barbeiro} | Data: ${formatarData(item.data)}</p>
      </div>
      <span class="price">R$ ${item.preco}</span>
    `;
    agendaList.appendChild(card);
  });
}
