export type StockStatus = 'critical' | 'low' | 'ok' | 'overstock';

export interface Item {
  id: string;
  name: string;
  category: string;
  unit: string;
  stockBought: number;
  stockAvailable: number;
  costPerUnit: number;
  sellPerUnit: number;
  dailySales: number;
  supplier: string;
}

export interface WastageEntry {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  reason: WastageReason;
  value: number;
  date: string;
  note?: string;
}

export type WastageReason = 'Expired' | 'Damaged' | 'Spoiled' | 'Other';

export interface Recommendation {
  status: StockStatus;
  daysLeft: number;
  reorderQty: number;
  suggestion: string;
}

export const TARGET_COVER_DAYS = 6;

export const seedItems: Item[] = [
  {
    id: 'itm_milk',
    name: 'Milk 1L',
    category: 'Dairy',
    unit: 'pkt',
    stockBought: 120,
    stockAvailable: 24,
    costPerUnit: 52,
    sellPerUnit: 60,
    dailySales: 12,
    supplier: 'Amul Depot',
  },
  {
    id: 'itm_rice',
    name: 'Basmati Rice',
    category: 'Staples',
    unit: 'kg',
    stockBought: 100,
    stockAvailable: 48,
    costPerUnit: 78,
    sellPerUnit: 95,
    dailySales: 6.4,
    supplier: 'Sharma Traders',
  },
  {
    id: 'itm_atta',
    name: 'Whole Wheat Atta 5kg',
    category: 'Staples',
    unit: 'pack',
    stockBought: 40,
    stockAvailable: 12,
    costPerUnit: 210,
    sellPerUnit: 245,
    dailySales: 2.8,
    supplier: 'Sharma Traders',
  },
  {
    id: 'itm_curd',
    name: 'Curd 400g',
    category: 'Dairy',
    unit: 'cup',
    stockBought: 60,
    stockAvailable: 8,
    costPerUnit: 34,
    sellPerUnit: 42,
    dailySales: 4,
    supplier: 'Amul Depot',
  },
  {
    id: 'itm_oil',
    name: 'Sunflower Oil 1L',
    category: 'Cooking',
    unit: 'bottle',
    stockBought: 36,
    stockAvailable: 30,
    costPerUnit: 128,
    sellPerUnit: 149,
    dailySales: 1.1,
    supplier: 'Fortune Distributors',
  },
  {
    id: 'itm_sugar',
    name: 'Sugar',
    category: 'Staples',
    unit: 'kg',
    stockBought: 80,
    stockAvailable: 62,
    costPerUnit: 42,
    sellPerUnit: 50,
    dailySales: 2.2,
    supplier: 'Sharma Traders',
  },
  {
    id: 'itm_tea',
    name: 'Tea Powder 500g',
    category: 'Beverages',
    unit: 'pack',
    stockBought: 50,
    stockAvailable: 9,
    costPerUnit: 190,
    sellPerUnit: 225,
    dailySales: 2,
    supplier: 'Tata Tea Agency',
  },
  {
    id: 'itm_soap',
    name: 'Bath Soap',
    category: 'Personal care',
    unit: 'pc',
    stockBought: 144,
    stockAvailable: 130,
    costPerUnit: 28,
    sellPerUnit: 38,
    dailySales: 1.1,
    supplier: 'HUL Distributor',
  },
  {
    id: 'itm_detergent',
    name: 'Detergent 1kg',
    category: 'Household',
    unit: 'pack',
    stockBought: 30,
    stockAvailable: 5,
    costPerUnit: 96,
    sellPerUnit: 120,
    dailySales: 1.5,
    supplier: 'HUL Distributor',
  },
  {
    id: 'itm_chips',
    name: 'Potato Chips 50g',
    category: 'Snacks',
    unit: 'pkt',
    stockBought: 200,
    stockAvailable: 18,
    costPerUnit: 15,
    sellPerUnit: 20,
    dailySales: 9,
    supplier: 'Balaji Snacks',
  },
  {
    id: 'itm_eggs',
    name: 'Eggs 6-pack',
    category: 'Dairy',
    unit: 'pack',
    stockBought: 60,
    stockAvailable: 40,
    costPerUnit: 42,
    sellPerUnit: 54,
    dailySales: 5,
    supplier: 'Local Poultry',
  },
  {
    id: 'itm_cola',
    name: 'Cola 750ml',
    category: 'Beverages',
    unit: 'bottle',
    stockBought: 48,
    stockAvailable: 44,
    costPerUnit: 38,
    sellPerUnit: 45,
    dailySales: 0.8,
    supplier: 'Coca-Cola Depot',
  },
];

export const seedWastage: WastageEntry[] = [
  {
    id: 'wst_1',
    itemId: 'itm_curd',
    itemName: 'Curd 400g',
    quantity: 6,
    reason: 'Expired',
    value: 204,
    date: '2026-10-21',
  },
  {
    id: 'wst_2',
    itemId: 'itm_chips',
    itemName: 'Potato Chips 50g',
    quantity: 4,
    reason: 'Damaged',
    value: 60,
    date: '2026-10-20',
  },
  {
    id: 'wst_3',
    itemId: 'itm_eggs',
    itemName: 'Eggs 6-pack',
    quantity: 2,
    reason: 'Damaged',
    value: 84,
    date: '2026-10-19',
  },
  {
    id: 'wst_4',
    itemId: 'itm_milk',
    itemName: 'Milk 1L',
    quantity: 3,
    reason: 'Expired',
    value: 156,
    date: '2026-10-18',
  },
  {
    id: 'wst_5',
    itemId: 'itm_atta',
    itemName: 'Whole Wheat Atta 5kg',
    quantity: 1,
    reason: 'Expired',
    value: 210,
    date: '2026-10-16',
  },
];

export const chartData = [
  { day: 'Sat', sales: 24800, wastage: 620 },
  { day: 'Sun', sales: 31200, wastage: 480 },
  { day: 'Mon', sales: 22400, wastage: 810 },
  { day: 'Tue', sales: 26900, wastage: 350 },
  { day: 'Wed', sales: 29800, wastage: 540 },
  { day: 'Thu', sales: 33400, wastage: 430 },
  { day: 'Fri', sales: 35100, wastage: 290 },
];

export const weather = {
  condition: 'Warm & humid',
  temperature: 28,
  rainChance: 64,
  humidity: 71,
  location: 'Pune, Maharashtra',
  advice: 'Dairy spoils 1.5x faster today. Sell curd and milk first.',
};

export function getRecommendation(item: Item): Recommendation {
  const daily = Math.max(item.dailySales, 0.1);
  const daysLeft = item.stockAvailable / daily;
  const reorderQty = Math.max(0, Math.ceil(item.dailySales * TARGET_COVER_DAYS - item.stockAvailable));

  let status: StockStatus = 'ok';
  if (daysLeft <= 2) status = 'critical';
  else if (daysLeft <= 4) status = 'low';
  else if (daysLeft > 30) status = 'overstock';

  const roundedDays = Math.max(0, Math.round(daysLeft));
  let suggestion: string;
  if (status === 'overstock') {
    suggestion = `Enough for ${Math.round(daysLeft)} days — don't reorder.`;
  } else if (reorderQty > 0) {
    suggestion = `Order ${reorderQty} ${item.unit}${reorderQty === 1 ? '' : 's'} — run out in ${roundedDays} ${roundedDays === 1 ? 'day' : 'days'}.`;
  } else {
    suggestion = `Stock is healthy for ${roundedDays} days.`;
  }

  return { status, daysLeft, reorderQty, suggestion };
}

const priorityWeight: Record<StockStatus, number> = {
  critical: 0,
  low: 1,
  ok: 2,
  overstock: 3,
};

export function sortedByPriority(items: Item[]) {
  return [...items].sort((a, b) => {
    const ra = getRecommendation(a);
    const rb = getRecommendation(b);
    return priorityWeight[ra.status] - priorityWeight[rb.status] || ra.daysLeft - rb.daysLeft;
  });
}

export function stockValue(items: Item[]) {
  return items.reduce((sum, item) => sum + item.stockAvailable * item.costPerUnit, 0);
}

export function totalWastage(entries: WastageEntry[]) {
  return entries.reduce((sum, entry) => sum + entry.value, 0);
}

export const statusLabel: Record<StockStatus, string> = {
  critical: 'Critical',
  low: 'Low',
  ok: 'OK',
  overstock: 'Overstock',
};

export const wastageReasons: WastageReason[] = ['Expired', 'Damaged', 'Spoiled', 'Other'];
