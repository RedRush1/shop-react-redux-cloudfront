import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem, CartApiItem } from "~/models/CartItem";
import { Product } from "~/models/Product";

function authHeaders() {
  return { Authorization: `Basic ${localStorage.getItem("authorization_token")}` };
}

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const [cartRes, productsRes] = await Promise.all([
      axios.get<CartApiItem[]>(`${API_PATHS.cart}/api/profile/cart`, { headers: authHeaders() }),
      axios.get<Product[]>(`${API_PATHS.product}/products`),
    ]);
    return cartRes.data.map((item) => ({
      product:
        productsRes.data.find((p) => p.id === item.product_id) ??
        ({ id: item.product_id } as Product),
      count: item.count,
    }));
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartApiItem[]>(`${API_PATHS.cart}/api/profile/cart`, values, {
      headers: authHeaders(),
    })
  );
}

export function useDeleteCart() {
  return useMutation(() =>
    axios.delete(`${API_PATHS.cart}/api/profile/cart`, {
      headers: authHeaders(),
    })
  );
}
