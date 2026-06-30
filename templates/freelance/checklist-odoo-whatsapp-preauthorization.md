# Odoo + WhatsApp Preauthorization Checklist

Purpose: prepare a safe first phase for Odoo + WhatsApp + n8n opportunities where sales and purchasing actions require internal approval before payment, warehouse or supplier steps.

## First-Phase Boundary

- Use fake Odoo-like product, customer, sales order and purchase RFQ records until contract and secure access exist.
- Build one stock-available path and one stock-insufficient path before expanding edge cases.
- Keep all order and RFQ records in draft or pending-approval states during the prototype.
- Do not automate payment links, PDFs, supplier messages or warehouse notifications before approval-state validation.

## Intake Questions

1. Which Odoo edition and hosting model is in scope: Online, Odoo.sh, self-hosted, Community or partner-hosted?
2. Is API access available for product, stock, customer, sales order and purchase RFQ records?
3. Which WhatsApp provider is approved, and are templates/opt-in already configured?
4. What product identifiers are reliable: SKU, barcode, internal reference, exact name or aliases?
5. Which approval rules matter: amount, discount, customer type, controlled product, stock threshold or supplier?
6. Who approves sales orders and purchase RFQs, and where should approval be recorded?
7. Which payment provider or payment-link flow is allowed after approval?
8. What warehouse/logistics event is safe to trigger after payment confirmation?

## Data Contract

| Entity | Minimum fields |
|---|---|
| WhatsApp message | message id, sender id, timestamp, text, opt-in/source, normalized phone |
| Intent extraction | intent, product candidate, quantity, confidence, missing fields, escalation reason |
| Odoo product | sku, name, stock quantity, price, active flag |
| Sales draft | customer id, products, quantities, price snapshot, approval state, audit note |
| Purchase RFQ draft | product, quantity, supplier candidate, estimated date, approval state, audit note |
| Approval event | approver role, decision, reason, timestamp, source record |

## Test Cases

- Known SKU with enough stock creates a draft sales order in `pending_approval`.
- Known SKU with zero or insufficient stock creates a draft purchase RFQ in `pending_purchase_approval`.
- Unknown product asks a clarification question instead of inventing stock or price.
- Duplicate WhatsApp webhook does not create duplicate Odoo records.
- Rejected approval informs the customer with alternatives but does not send a payment link.
- Payment link is not generated before internal approval.
- Warehouse/logistics notification is not sent before payment confirmation.

## Proposal Angle

Offer a controlled operational prototype first: WhatsApp intake, Odoo lookup, two approval paths and audit trail. Keep production payment, warehouse, supplier and portal/PDF automation as phase 2 after the approval model is proven.
