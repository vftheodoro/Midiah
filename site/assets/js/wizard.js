// Wizard - Nova Campanha

let currentStep = 1;
let wizardData = {
    plan: null,
    planPrice: 0,
    planDays: 0,
    fileName: null,
    fileSize: null,
    startDate: null,
    endDate: null
};

document.addEventListener('DOMContentLoaded', function() {
    
    // Step 1: Seleção de Plano
    document.querySelectorAll('.select-plan').forEach(btn => {
        btn.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            
            // Remove seleção anterior
            document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
            planCard.classList.add('selected');
            
            // Salva dados do plano
            wizardData.plan = planCard.dataset.plan;
            wizardData.planPrice = parseFloat(planCard.dataset.price);
            wizardData.planDays = parseInt(planCard.dataset.days);
            
            // Avança para próximo passo
            setTimeout(() => nextStep(), 300);
        });
    });
    
    // Step 2: Upload de Arquivo
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const removeFileBtn = document.getElementById('removeFile');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--cor-primaria)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--cor-borda)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--cor-borda)';
            const file = e.dataTransfer.files[0];
            handleFile(file);
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            handleFile(file);
        });
    }
    
    if (removeFileBtn) {
        removeFileBtn.addEventListener('click', () => {
            fileInput.value = '';
            filePreview.style.display = 'none';
            uploadArea.style.display = 'flex';
            wizardData.fileName = null;
            wizardData.fileSize = null;
        });
    }
    
    // Step 3: Data de Início
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        // Define data mínima como hoje
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        startDateInput.value = today;
        
        startDateInput.addEventListener('change', updateScheduleInfo);
        updateScheduleInfo();
    }
    
});

function handleFile(file) {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (!validTypes.includes(file.type)) {
        alert('Formato inválido! Use JPG, PNG ou MP4');
        return;
    }
    
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        alert('Arquivo muito grande! Máximo 50MB');
        return;
    }
    
    // Salva informações
    wizardData.fileName = file.name;
    wizardData.fileSize = formatBytes(file.size);
    
    // Mostra preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewImage = document.getElementById('previewImage');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        
        if (previewImage && fileName && fileSize) {
            previewImage.src = e.target.result;
            fileName.textContent = file.name;
            fileSize.textContent = wizardData.fileSize;
            
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('filePreview').style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function updateScheduleInfo() {
    const startDate = document.getElementById('startDate').value;
    if (!startDate) return;
    
    wizardData.startDate = startDate;
    
    // Calcula data de término
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + wizardData.planDays);
    wizardData.endDate = end.toISOString().split('T')[0];
    
    // Atualiza UI
    document.getElementById('endDate').textContent = formatDate(wizardData.endDate);
    document.getElementById('duration').textContent = wizardData.planDays + ' dias';
    document.getElementById('estimatedViews').textContent = '~' + (192 * wizardData.planDays).toLocaleString('pt-BR');
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
}

function nextStep() {
    // Validações
    if (currentStep === 1 && !wizardData.plan) {
        alert('Selecione um plano');
        return;
    }
    
    if (currentStep === 2 && !wizardData.fileName) {
        alert('Faça upload de uma mídia');
        return;
    }
    
    if (currentStep === 3 && !wizardData.startDate) {
        alert('Selecione a data de início');
        return;
    }
    
    if (currentStep >= 4) return;
    
    // Oculta step atual
    document.getElementById('step' + currentStep).classList.remove('active');
    
    // Marca como completo
    document.querySelector('.wizard-step[data-step="' + currentStep + '"]').classList.add('completed');
    
    // Avança
    currentStep++;
    
    // Mostra próximo step
    document.getElementById('step' + currentStep).classList.add('active');
    document.querySelector('.wizard-step[data-step="' + currentStep + '"]').classList.add('active');
    
    // Atualiza resumo no step 4
    if (currentStep === 4) {
        updatePaymentSummary();
    }
    
    // Scroll para topo
    window.scrollTo(0, 0);
    
    // Reinicializa ícones
    lucide.createIcons();
}

function previousStep() {
    if (currentStep <= 1) return;
    
    // Oculta step atual
    document.getElementById('step' + currentStep).classList.remove('active');
    document.querySelector('.wizard-step[data-step="' + currentStep + '"]').classList.remove('active');
    
    // Volta
    currentStep--;
    
    // Mostra step anterior
    document.getElementById('step' + currentStep).classList.add('active');
    
    // Scroll para topo
    window.scrollTo(0, 0);
    
    // Reinicializa ícones
    lucide.createIcons();
}

function updatePaymentSummary() {
    const planNames = {
        'semanal': 'Semanal',
        'quinzenal': 'Quinzenal',
        'mensal': 'Mensal'
    };
    
    document.getElementById('summaryPlan').textContent = planNames[wizardData.plan] || '-';
    document.getElementById('summaryDuration').textContent = wizardData.planDays + ' dias';
    document.getElementById('summaryStart').textContent = formatDate(wizardData.startDate);
    document.getElementById('summaryEnd').textContent = formatDate(wizardData.endDate);
    document.getElementById('summaryTotal').textContent = 'R$ ' + wizardData.planPrice.toFixed(2).replace('.', ',');
}

function simulatePayment() {
    // Simula processamento
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px;"></div> Processando...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Oculta step de pagamento
        document.getElementById('step4').style.display = 'none';
        
        // Mostra tela de sucesso
        document.getElementById('stepSuccess').style.display = 'block';
        
        // Reinicializa ícones
        lucide.createIcons();
    }, 2000);
}
