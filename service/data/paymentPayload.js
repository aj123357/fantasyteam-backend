 const payload = {
    "entity": "event",
    "account_id": "acc_F2bvo8HtgDMmnt",
    "event": "payment.captured",
    "contains": [
        "payment"
    ],
    "payload": {
        "payment": {
            "entity": {
                "id": "pay_O4LC0IciJhe6ou",
                "entity": "payment",
                "amount": 1000,
                "currency": "INR",
                "status": "captured",
                "order_id": "order_O4LBs0Y0Ix6FHR",
                "invoice_id": null,
                "international": false,
                "method": "paylater",
                "amount_refunded": 0,
                "refund_status": null,
                "captured": true,
                "description": null,
                "card_id": null,
                "bank": null,
                "wallet": "getsimpl",
                "vpa": null,
                "email": "ankushjindal2007@gmail.com",
                "contact": "+9197160278",
                "notes": {
                    "email": "ankushjindal2007@gmail.com",
                    "phone": "9899364654"
                },
                "fee": 24,
                "tax": 4,
                "error_code": null,
                "error_description": null,
                "error_source": null,
                "error_step": null,
                "error_reason": null,
                "acquirer_data": {
                    "transaction_id": null
                },
                "created_at": 1714372473,
                "reward": null,
                "base_amount": 1000
            }
        }
    },
    "created_at": 1714372477
}

module.exports = payload