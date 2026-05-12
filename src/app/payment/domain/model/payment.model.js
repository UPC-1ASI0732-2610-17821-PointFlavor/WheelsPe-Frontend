import { PaymentEntity } from "./payment.entity.js";

export class Payment extends PaymentEntity {
    get formattedDueDate() {
        if (!this.dueDate) return 'N/A';
        const date = new Date(this.dueDate);
        return date.toLocaleDateString("es-PE");
    }

    get formattedCreatedAt() {
        if (!this.createdAt) return 'N/A';
        const date = new Date(this.createdAt);
        return date.toLocaleDateString("es-PE", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    get displayStatus() {
        // Use the status from API, or fallback to paid status
        return this.status || (this.paid ? "completed" : "pending");
    }

    get formattedAmount() {
        return `S/. ${parseFloat(this.amount || 0).toFixed(2)}`;
    }
}
