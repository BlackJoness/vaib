"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Item do carrinho = 1 variante (cor + tamanho) com quantidade.
export type CartItem = {
  variantId: string;
  sku: string;
  nome: string;
  slug: string;
  cor: string;
  corHex: string;
  tamanho: string;
  preco: number;
  qtd: number;
};

type CartContextValue = {
  items: CartItem[];
  open: boolean;
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qtd">, qtd?: number) => void;
  remove: (variantId: string) => void;
  setQtd: (variantId: string, qtd: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((item: Omit<CartItem, "qtd">, qtd = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.variantId === item.variantId);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qtd: copy[i].qtd + qtd };
        return copy;
      }
      return [...prev, { ...item, qtd }];
    });
    setOpen(true); // abre o slide-over ao adicionar
  }, []);

  const remove = useCallback(
    (variantId: string) =>
      setItems((prev) => prev.filter((p) => p.variantId !== variantId)),
    [],
  );

  const setQtd = useCallback(
    (variantId: string, qtd: number) =>
      setItems((prev) =>
        prev.map((p) =>
          p.variantId === variantId ? { ...p, qtd: Math.max(1, qtd) } : p,
        ),
      ),
    [],
  );

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qtd, 0), [items]);
  const total = useMemo(
    () => items.reduce((s, i) => s + i.preco * i.qtd, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    open,
    count,
    total,
    add,
    remove,
    setQtd,
    clear,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
