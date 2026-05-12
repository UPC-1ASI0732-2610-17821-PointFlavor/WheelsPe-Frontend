export class PaymentEntity {
    constructor({ 
        id, 
        userId, 
        payerId, 
        recipientId, 
        rentalId,
        amount, 
        currency,
        description, 
        dueDate, 
        paymentMethod,
        method,
        paid,
        status,
        transactionId,
        type,
        reason,
        createdAt 
    }) {
        this.id = id;
        // Support both userId (old) and payerId (new)
        this.userId = userId;
        this.payerId = payerId || userId;
        this.recipientId = recipientId;
        this.rentalId = rentalId;
        this.amount = amount;
        this.currency = currency || 'PEN';
        this.description = description;
        this.dueDate = dueDate;
        this.paymentMethod = paymentMethod;
        // Support both method and paymentMethod
        this.method = method || paymentMethod;
        this.paid = paid;
        this.status = status || (paid ? 'completed' : 'pending');
        this.transactionId = transactionId;
        this.type = type;
        this.reason = reason;
        this.createdAt = createdAt;
    }
}
