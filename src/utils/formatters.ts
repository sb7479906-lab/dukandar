import { Currency, CartItem, Product } from '../types';

export function formatPrice(amountInPkr: number, currency: Currency, usdRate: number = 278): string {
  if (currency === 'USD') {
    const usd = amountInPkr / usdRate;
    return `$${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₨ ${amountInPkr.toLocaleString('en-PK')}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function generateWhatsAppOrderUrl(
  phone: string,
  items: CartItem[],
  total: number,
  customerName?: string,
  city?: string,
  orderNumber?: string
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  let message = `🛒 *New Order Request - Dukandar Store*\n\n`;
  
  if (orderNumber) {
    message += `📋 *Order Ref:* ${orderNumber}\n`;
  }
  if (customerName) {
    message += `👤 *Customer:* ${customerName}\n`;
  }
  if (city) {
    message += `📍 *City:* ${city}\n`;
  }
  
  message += `\n📦 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.product.title} (x${item.quantity}) - ₨ ${(item.product.price * item.quantity).toLocaleString('en-PK')}\n`;
    if (item.selectedSize) message += `   ▫️ Size: ${item.selectedSize}\n`;
    if (item.selectedColor) message += `   ▫️ Color: ${item.selectedColor.name}\n`;
  });

  message += `\n💰 *Total Payable:* ₨ ${total.toLocaleString('en-PK')}\n`;
  message += `\n_Please confirm my order and share delivery details!_`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppProductInquiryUrl(phone: string, product: Product): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const message = `Salam! I am interested in buying this product from Dukandar:\n\n🛍️ *${product.title}*\n💰 Price: ₨ ${product.price.toLocaleString('en-PK')}\n\nIs this currently in stock?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
