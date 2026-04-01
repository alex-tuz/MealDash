import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../api/products.api';

export interface CartItem extends Product {
	quantity: number;
}

const MIN_ITEM_QUANTITY = 1;
const CART_STORAGE_KEY = 'meal-dash-cart';

interface CartStore {
	items: CartItem[];
	addItem: (product: Product) => void;
	removeItem: (productId: string) => void;
	incrementItem: (productId: string) => void;
	decrementItem: (productId: string) => void;
	setItemQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;
	reorder: (orderItems: Array<{ productId: string; quantity: number; name: string; image: string; unitPrice: number; shopId?: string }>) => { addedCount: number; message: string };
}

export const useCartStore = create<CartStore>()(
	persist(
		(set) => ({
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
			removeItem: (productId) =>
				set((state) => ({
					items: state.items.filter((item) => item.id !== productId),
				})),
			incrementItem: (productId) =>
				set((state) => ({
					items: state.items.map((item) =>
						item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
					),
				})),
			decrementItem: (productId) =>
				set((state) => ({
					items: state.items
						.map((item) =>
							item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
						)
						.filter((item) => item.quantity >= MIN_ITEM_QUANTITY),
				})),
			setItemQuantity: (productId, quantity) =>
				set((state) => {
					if (!Number.isFinite(quantity)) {
						return state;
					}

					const normalizedQuantity = Math.floor(quantity);

					if (normalizedQuantity < MIN_ITEM_QUANTITY) {
						return {
							items: state.items.filter((item) => item.id !== productId),
						};
					}

					return {
						items: state.items.map((item) =>
							item.id === productId ? { ...item, quantity: normalizedQuantity } : item,
						),
					};
				}),
			clearCart: () => set({ items: [] }),
			reorder: (orderItems) => {
				let addedCount = 0;


				set((state) => {
					const newItems = [...state.items];

					for (const orderItem of orderItems) {
						const existingIndex = newItems.findIndex((item) => item.id === orderItem.productId);

						if (existingIndex >= 0) {
							newItems[existingIndex] = {
								...newItems[existingIndex],
								quantity: newItems[existingIndex].quantity + orderItem.quantity,
							};
						} else {
							newItems.push({
								id: orderItem.productId,
								shopId: orderItem.shopId || '',
								name: orderItem.name,
								image: orderItem.image,
								price: orderItem.unitPrice,
								category: '',
								quantity: orderItem.quantity,
							});
						}
						addedCount++;
					}

					return { items: newItems };
				});

				return {
					addedCount,
					message: `${addedCount} item${addedCount !== 1 ? 's' : ''} added to cart from order`,
				};
			},
		}),
		{
			name: CART_STORAGE_KEY,
		},
	),
);

export const selectCartItems = (state: CartStore): CartItem[] => state.items;

export const selectCartTotalItems = (state: CartStore): number =>
	state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartStore): number =>
	state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

