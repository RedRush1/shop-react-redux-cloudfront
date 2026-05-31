import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";

type RegisterPayload = { name: string; password: string };
type RegisterResponse = { userId: string };
type LoginPayload = { username: string; password: string };
type LoginResponse = { token_type: string; access_token: string };

export function useRegister() {
  return useMutation<RegisterResponse, AxiosError, RegisterPayload>((values) =>
    axios
      .post<RegisterResponse>(`${API_PATHS.cart}/api/auth/register`, values)
      .then((r) => r.data)
  );
}

export function useLogin() {
  return useMutation<LoginResponse, AxiosError, LoginPayload>((values) =>
    axios
      .post<LoginResponse>(`${API_PATHS.cart}/api/auth/login`, values)
      .then((r) => r.data)
  );
}
