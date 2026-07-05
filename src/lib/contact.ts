/** Shared contact links — matches SiteFooter tel link. */
export const RESTAURANT_PHONE = "+966535004311";
export const RESTAURANT_PHONE_DISPLAY = "+966 53 500 4311";
export const WHATSAPP_ORDER_URL = "https://wa.me/966535004311";

export const WHATSAPP_FAMILY_DINING_MESSAGE = `Hello Teri Meri, I'd like to reserve a table for Family Dining.

Name:
Preferred date:
Preferred time:
Number of guests:
Any children's chairs needed? (Yes/No):
Special requests or notes:

Thank you.`;

export const WHATSAPP_PRIVATE_DINING_MESSAGE = `Hello Teri Meri, I'd like to enquire about Private Dining for a group of up to 20 guests.

Name:
Preferred date:
Preferred time:
Number of guests:
Occasion (optional):
Food preferences or special requests:
Additional notes:

Thank you.`;

export function whatsAppUrl(text: string) {
  return `${WHATSAPP_ORDER_URL}?text=${encodeURIComponent(text)}`;
}

export const WHATSAPP_FAMILY_DINING_URL = whatsAppUrl(
  WHATSAPP_FAMILY_DINING_MESSAGE
);

export const WHATSAPP_PRIVATE_DINING_URL = whatsAppUrl(
  WHATSAPP_PRIVATE_DINING_MESSAGE
);

/** Homepage reservations block */
export const RESERVE_PATH = "/#reserve";
