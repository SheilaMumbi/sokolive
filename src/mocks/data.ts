import { nextPhoto } from '../photos'
import type { Category, Shape } from '../types'

export interface Template {
  brand: string
  name: string
  category: Category
  shape: Shape
  price: number
  size: string
  condition: string
  seller: string
  pal: number
  photo?: string
}

const S = ['Wanjiru’s Closet', 'Gikomba Gems', 'Kicks by Brian', 'Mama Mitumba', 'Westie Vintage', 'Eastlands Archive']
const t = (
  brand: string, name: string, category: Category, shape: Shape,
  price: number, size: string, condition: string, pal: number, seller = 0,
): Template => ({ brand, name, category, shape, price, size, condition, seller: S[seller % S.length], pal, photo: nextPhoto(shape) })

export const TEMPLATES: Template[] = [
  t('Nike', 'Air Max 90 “Infrared”', 'shoes', 'sneaker', 6500, 'EU 42', '9/10', 0, 2),
  t('Adidas', 'Samba OG', 'shoes', 'sneaker', 5800, 'EU 41', '8/10', 3, 2),
  t('Jordan', '1 Mid “Chicago”', 'shoes', 'hightop', 9200, 'EU 44', '9/10', 0, 2),
  t('New Balance', '550 White Green', 'shoes', 'sneaker', 7400, 'EU 43', '10/10', 2, 0),
  t('Converse', 'Chuck 70 Hi', 'shoes', 'hightop', 4200, 'EU 40', '8/10', 4, 5),
  t('Vans', 'Old Skool', 'shoes', 'sneaker', 3600, 'EU 42', '7/10', 4, 1),
  t('Puma', 'Suede Classic', 'shoes', 'sneaker', 3900, 'EU 39', '9/10', 5, 0),
  t('Nike', 'Dunk Low “Cobalt”', 'shoes', 'sneaker', 8800, 'EU 45', '10/10', 1, 2),
  t('Reebok', 'Club C 85', 'shoes', 'sneaker', 3400, 'EU 41', '8/10', 3, 1),
  t('Asics', 'Gel-Kayano 14', 'shoes', 'sneaker', 7800, 'EU 42', '9/10', 4, 2),
  t('Jordan', '4 Retro “Bred”', 'shoes', 'hightop', 12500, 'EU 43', '9/10', 4, 2),
  t('Adidas', 'Superstar', 'shoes', 'sneaker', 4600, 'EU 40', '8/10', 6, 5),
  t('Levi’s', 'Trucker Denim Jacket', 'tops', 'jacket', 3200, 'L', '8/10', 1, 4),
  t('Carhartt', 'Detroit Work Jacket', 'tops', 'jacket', 6900, 'XL', '7/10', 3, 4),
  t('Carhartt', 'Chunky Hoodie', 'tops', 'hoodie', 3800, 'L', '9/10', 2, 3),
  t('Champion', 'Reverse Weave Hoodie', 'tops', 'hoodie', 3500, 'M', '8/10', 5, 3),
  t('Nike', 'Vintage Swoosh Tee', 'tops', 'tee', 1600, 'M', '8/10', 6, 5),
  t('Stüssy', 'Stock Logo Tee', 'tops', 'tee', 2400, 'L', '10/10', 4, 0),
  t('Adidas', 'Track Jacket 90s', 'tops', 'jacket', 3300, 'M', '8/10', 1, 1),
  t('Ralph Lauren', 'Rugby Stripe Shirt', 'tops', 'tee', 1500, 'L', '9/10', 0, 3),
  t('Harley-Davidson', 'Faded Band Tee', 'tops', 'tee', 1800, 'XL', '7/10', 4, 5),
  t('Supreme', 'Box Logo Hoodie', 'tops', 'hoodie', 14500, 'M', '9/10', 0, 0),
  t('Patagonia', 'Fleece Pullover', 'tops', 'jacket', 5200, 'M', '9/10', 7, 4),
  t('Dickies', 'Eisenhower Jacket', 'tops', 'jacket', 3100, 'L', '8/10', 2, 1),
  t('Gucci', 'Leather Crossbody', 'bags', 'crossbody', 18500, 'One size', '9/10', 3, 0),
  t('Herschel', 'Little America Backpack', 'bags', 'backpack', 4200, 'One size', '9/10', 1, 3),
  t('Eastpak', 'Padded Pak’r', 'bags', 'backpack', 2800, 'One size', '8/10', 4, 3),
  t('Coach', 'Mini Shoulder Bag', 'bags', 'crossbody', 7900, 'One size', '8/10', 5, 0),
  t('Mitumba', 'Heavy Canvas Tote', 'bags', 'tote', 800, 'One size', '9/10', 6, 3),
  t('Longchamp', 'Le Pliage Tote', 'bags', 'tote', 4600, 'One size', '9/10', 7, 0),
  t('Fjällräven', 'Kånken Classic', 'bags', 'backpack', 5400, 'One size', '9/10', 6, 4),
  t('Kate Spade', 'Mini Crossbody', 'bags', 'crossbody', 3900, 'One size', '8/10', 5, 0),
  t('Nike', 'Heritage Duffle Tote', 'bags', 'tote', 1900, 'One size', '8/10', 4, 2),
  t('The North Face', 'Borealis Backpack', 'bags', 'backpack', 4900, 'One size', '9/10', 0, 4),
  t('Timberland', '6-inch Premium Boot', 'shoes', 'hightop', 8400, 'EU 43', '9/10', 3, 2),
  t('Nike', 'Cortez Leather', 'shoes', 'sneaker', 5100, 'EU 41', '8/10', 0, 2),
  t('Tommy Hilfiger', 'Colour-block Windbreaker', 'tops', 'jacket', 2900, 'L', '8/10', 1, 1),
  t('Ellesse', 'Heritage Tee', 'tops', 'tee', 1400, 'S', '9/10', 0, 5),
  t('Uniqlo', 'Oversized Sweat Hoodie', 'tops', 'hoodie', 1700, 'XL', '9/10', 7, 3),
  t('Zara', 'Weekender Tote', 'bags', 'tote', 1500, 'One size', '9/10', 3, 1),
]
