import { rest } from "msw";
import API_PATHS from "~/constants/apiPaths";
import { availableProducts, orders, products, cart } from "~/mocks/data";
import { CartApiItem } from "~/models/CartItem";
import { Order } from "~/models/Order";
import { AvailableProduct, Product } from "~/models/Product";

export const handlers = [
  rest.get(`${API_PATHS.product}/products`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(), ctx.json<Product[]>(products));
  }),
  rest.get(`${API_PATHS.bff}/product`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(), ctx.json<Product[]>(products));
  }),
  rest.put(`${API_PATHS.bff}/product`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.delete(`${API_PATHS.bff}/product/:id`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  // /product/available removed — using real Lambda at API_PATHS.product/products
  rest.get(`${API_PATHS.bff}/product/:id`, (req, res, ctx) => {
    const product = availableProducts.find((p) => p.id === req.params.id);
    if (!product) {
      return res(ctx.status(404));
    }
    return res(
      ctx.status(200),
      ctx.delay(),
      ctx.json<AvailableProduct>(product)
    );
  }),
  // Auth endpoints
  rest.post(`${API_PATHS.cart}/api/auth/register`, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ userId: "mock-user-id" }));
  }),
  rest.post(`${API_PATHS.cart}/api/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ token_type: "Basic", access_token: "bW9jay11c2VyOm1vY2stcGFzcw==" })
    );
  }),
  // Cart endpoints
  rest.get(`${API_PATHS.cart}/api/profile/cart`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(), ctx.json<CartApiItem[]>(cart));
  }),
  rest.put(`${API_PATHS.cart}/api/profile/cart`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json<CartApiItem[]>(cart));
  }),
  rest.delete(`${API_PATHS.cart}/api/profile/cart`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  // Order endpoints (via cart API)
  rest.get(`${API_PATHS.cart}/api/profile/cart/order`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(), ctx.json<Order[]>(orders));
  }),
  rest.put(`${API_PATHS.cart}/api/profile/cart/order`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ order: orders[0] }));
  }),
  // Legacy order management endpoints
  rest.get(`${API_PATHS.order}/order/:id`, (req, res, ctx) => {
    const order = orders.find((p) => p.id === req.params.id);
    if (!order) {
      return res(ctx.status(404));
    }
    return res(ctx.status(200), ctx.delay(), ctx.json(order));
  }),
  rest.delete(`${API_PATHS.order}/order/:id`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.put(`${API_PATHS.order}/order/:id/status`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
