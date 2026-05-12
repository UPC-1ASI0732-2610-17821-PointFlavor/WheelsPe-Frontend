import { ref } from "vue";
import { PaymentApi } from "../infrastructure/payment-api.js";

export default function usePaymentsStore() {
    const payments = ref([]);
    const errors = ref([]);

    // 🔹 Cargar pagos desde localStorage si existen
    function loadFromLocalStorage() {
        const data = localStorage.getItem("payments");
        if (data) {
            const parsed = JSON.parse(data);
            // Los datos ya vienen como objetos Payment del assembler
            payments.value = parsed;
        }
    }

    // 🔹 Guardar en localStorage
    function saveToLocalStorage() {
        localStorage.setItem("payments", JSON.stringify(payments.value));
    }

    // 🔹 Obtener todos los pagos desde la API
    async function fetchPayments() {
        try {
            console.log('🔄 Cargando pagos desde API...');
            const result = await PaymentApi.listPayments();
            console.log('✅ Pagos recibidos de la API:', result);
            payments.value = result;
            console.log('✅ Pagos guardados en store:', payments.value);
            // Guardar en localStorage como cache
            saveToLocalStorage();
            return result;
        } catch (err) {
            // Si hay error en la API, intentar cargar desde localStorage
            console.error("❌ Error al cargar pagos desde API:", err.message);
            console.log('🔄 Intentando cargar desde localStorage...');
            loadFromLocalStorage();
            console.log('📦 Pagos cargados desde localStorage:', payments.value);
            errors.value.push(err);
        }
    }

    // 🔹 Agregar nuevo pago
    async function addPayment(paymentData) {
        try {
            const newPayment = await PaymentApi.createPayment(paymentData);
            payments.value.push(newPayment);
            saveToLocalStorage();
            return newPayment;
        } catch (err) {
            errors.value.push(err);
            console.error("Error al agregar pago:", err);
            throw err;
        }
    }

    // 🔹 Eliminar un pago
    async function deletePayment(payment) {
        try {
            payments.value = payments.value.filter(p => p.id !== payment.id);
            saveToLocalStorage();
        } catch (err) {
            errors.value.push(err);
            console.error("Error al eliminar pago:", err);
        }
    }

    // 🔹 Obtener un pago por ID
    function getPaymentById(id) {
        return payments.value.find(p => p.id === id);
    }

    // 🔹 Marcar como pagado
    async function markAsPaid(paymentId, method) {
        try {
            const payment = getPaymentById(paymentId);
            if (!payment) throw new Error("Pago no encontrado");

            payment.status = "pagado";
            payment.method = method;
            saveToLocalStorage();
        } catch (err) {
            errors.value.push(err);
            console.error("Error al actualizar pago:", err);
        }
    }

    return {
        payments,
        errors,
        fetchPayments,
        addPayment,
        deletePayment,
        getPaymentById,
        markAsPaid,
    };
}
