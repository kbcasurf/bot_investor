require('dotenv').config();
const api = require('./api');
const nodeSchedule = require('node-schedule');

let order;

const dt = new Date(2024, 10, 19, 11, 3); // Agende uma data específica e futura para evitar loops indesejados

// Verificação adicional para garantir que a data seja no futuro
if (dt <= new Date()) {
    console.error('Erro: a data de agendamento deve ser no futuro.');
    process.exit(1); // Sai do script para evitar a execução se a data for inválida
}

console.log('Job agendado para:', dt);

const job = nodeSchedule.scheduleJob(dt, async () => {
    try {
        console.log('Job iniciado em:', new Date());
        
        // Realiza a primeira operação
        order = await api.newQuoteOrder('USUALUSDT', 30);
        console.log('Order:', order);
        
        let order2;

        // Se a primeira ordem for preenchida, cria uma segunda ordem
        if (order.status === 'FILLED') {
            console.log('Order FILLED, iniciando nova ordem de venda.');
            order2 = await api.newOrder('USUALUSDT', order.executedQty, 0.37, 'SELL', 'LIMIT');
            console.log('Order2:', order2);
        }

    } catch (error) {
        console.error('Erro durante a execução do job:', error);
    } finally {
        console.log('Job finalizado em:', new Date());
        // Adicione lógica aqui, se necessário, para evitar loops ou reagendamentos
    }
});
