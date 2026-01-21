let guestCount = 1;

// Adicionar novo convidado
document.getElementById('addGuestBtn').addEventListener('click', function() {
    const guestsList = document.getElementById('guestsList');
    const newGuestItem = document.createElement('div');
    newGuestItem.className = 'guest-item';
    newGuestItem.setAttribute('data-guest-index', guestCount);
    
    newGuestItem.innerHTML = `
        <div class="guest-input-group">
            <input type="text" name="guest_name_${guestCount}" class="guest-input" required placeholder="Nome do ${guestCount + 1}º convidado" />
            <select name="guest_age_${guestCount}" class="age-select" required>
                <option value="">Idade</option>
                <option value="adulto">Adulto</option>
                <option value="crianca">Criança</option>
            </select>
            <button type="button" class="remove-guest-btn" onclick="removeGuest(${guestCount})">✕</button>
        </div>
    `;
    
    guestsList.appendChild(newGuestItem);
    guestCount++;
});

// Remover convidado
function removeGuest(index) {
    const guestItem = document.querySelector(`[data-guest-index="${index}"]`);
    if (guestItem) {
        guestItem.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            guestItem.remove();
        }, 300);
    }
}

// Adicionar animação de remoção
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// =============================================================================
// VERSÃO 1: APENAS VISUAL (ATIVA) - Para demonstração/portfólio
// =============================================================================
// Esta versão apenas simula o envio do formulário sem salvar os dados em lugar nenhum.
// É útil para:
// - Demonstração do projeto no GitHub
// - Testar a interface sem precisar configurar backend
// - Mostrar o funcionamento visual para o portfólio

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio real do formulário

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Enviando...';

    // Coleta os dados apenas para logar no console (para fins de demonstração)
    const guests = [];
    const guestItems = document.querySelectorAll('.guest-item');
    
    guestItems.forEach((item, index) => {
        const nameInput = item.querySelector(`input[name^="guest_name_"]`);
        const ageSelect = item.querySelector(`select[name^="guest_age_"]`);
        
        if (nameInput && ageSelect && nameInput.value && ageSelect.value) {
            guests.push({
                name: nameInput.value,
                ageCategory: ageSelect.value
            });
        }
    });

    const formData = {
        guests: guests,
        totalGuests: guests.length,
        adults: guests.filter(g => g.ageCategory === 'adulto').length,
        children: guests.filter(g => g.ageCategory === 'crianca').length,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    // Apenas loga os dados no console (abra F12 para ver)
    console.log('📋 Dados que seriam enviados:', formData);

    // Simula um pequeno delay como se estivesse enviando
    setTimeout(() => {
        // Mostra mensagem de sucesso
        document.getElementById('successMessage').classList.add('show');

        // Scroll suave até a mensagem
        document.getElementById('successMessage').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });

        // Aguarda 3 segundos e então limpa o formulário
        setTimeout(() => {
            this.reset();
            
            // Reseta a lista de convidados para apenas 1
            const guestsList = document.getElementById('guestsList');
            guestsList.innerHTML = `
                <div class="guest-item" data-guest-index="0">
                    <div class="guest-input-group">
                        <input type="text" name="guest_name_0" class="guest-input" required placeholder="Nome do 1º convidado" />
                        <select name="guest_age_0" class="age-select" required>
                            <option value="">Idade</option>
                            <option value="adulto">Adulto</option>
                            <option value="crianca">Criança</option>
                        </select>
                    </div>
                </div>
            `;
            guestCount = 1;
            
            // Reabilita o botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Remove a mensagem de sucesso após 5 segundos
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 5000);
        }, 3000);
    }, 1500); // Simula 1.5 segundos de "envio"
});


// =============================================================================
// VERSÃO 2: COM GOOGLE SHEETS (COMENTADA) - Para uso real em eventos
// =============================================================================
// Para ativar esta versão e salvar os dados em uma planilha do Google Sheets:
// 1. Comente todo o código da VERSÃO 1 acima (coloque /* no início e */ no final)
// 2. Descomente todo o código da VERSÃO 2 abaixo (remova /* e */)
// 3. Siga o guia GUIA-CONFIGURACAO.md para configurar o Google Sheets
// 4. Substitua 'SUA_URL_DO_GOOGLE_APPS_SCRIPT' pela URL real do seu script

/*
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Enviando...';

    // Coleta os dados dos convidados
    const guests = [];
    const guestItems = document.querySelectorAll('.guest-item');
    
    guestItems.forEach((item, index) => {
        const nameInput = item.querySelector(`input[name^="guest_name_"]`);
        const ageSelect = item.querySelector(`select[name^="guest_age_"]`);
        
        if (nameInput && ageSelect && nameInput.value && ageSelect.value) {
            guests.push({
                name: nameInput.value,
                ageCategory: ageSelect.value
            });
        }
    });

    // Prepara os dados para envio
    const formData = {
        guests: guests,
        totalGuests: guests.length,
        adults: guests.filter(g => g.ageCategory === 'adulto').length,
        children: guests.filter(g => g.ageCategory === 'crianca').length,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    // IMPORTANTE: Substitua pela URL do seu Google Apps Script
    // Você consegue essa URL seguindo o GUIA-CONFIGURACAO.md
    const SCRIPT_URL = 'SUA_URL_DO_GOOGLE_APPS_SCRIPT';

    // Envia os dados para o Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necessário para funcionar com Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // Log para debug (pode remover em produção)
        console.log('✅ Dados enviados com sucesso:', formData);
        
        // Mostra mensagem de sucesso
        document.getElementById('successMessage').classList.add('show');

        // Scroll suave até a mensagem
        document.getElementById('successMessage').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });

        // Aguarda 3 segundos e então limpa o formulário
        setTimeout(() => {
            this.reset();
            
            // Reseta a lista de convidados
            const guestsList = document.getElementById('guestsList');
            guestsList.innerHTML = `
                <div class="guest-item" data-guest-index="0">
                    <div class="guest-input-group">
                        <input type="text" name="guest_name_0" class="guest-input" required placeholder="Nome do 1º convidado" />
                        <select name="guest_age_0" class="age-select" required>
                            <option value="">Idade</option>
                            <option value="adulto">Adulto</option>
                            <option value="crianca">Criança</option>
                        </select>
                    </div>
                </div>
            `;
            guestCount = 1;
            
            // Reabilita o botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            // Remove a mensagem de sucesso após 5 segundos
            setTimeout(() => {
                document.getElementById('successMessage').classList.remove('show');
            }, 5000);
        }, 3000);
    })
    .catch((error) => {
        // Trata erros de envio
        console.error('❌ Erro ao enviar:', error);
        alert('Ops! Ocorreu um erro ao enviar. Tente novamente.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
});
*/
