import { create } from 'zustand';
import type { Product } from '../api/products.api';

export interface CartItem extends Product {
	quantity: number;
}

interface CartStore {
	items: CartItem[];
	addItem: (product: Product) => void;
}

export const useCartStore = create<CartStore>((set) => ({
	items: [],
	addItem: (product) =>
		set((state) => {
			const existing = state.items.find((item) => item.id === product.id);

			if (existing) {
				return {
					items: state.items.map((item) =>
						item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
					),
				};
			}

			return {
				items: [...state.items, { ...product, quantity: 1 }],
			};
		}),
}));

