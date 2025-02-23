import Cookies from 'js-cookie';

export const setCookie = (key: string, value: any, options?: Cookies.CookieAttributes) => {
  // Si el valor no es una cadena, lo convertimos a JSON.
  const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
  Cookies.set(key, valueToStore, { ...options });
};

export const getCookie = (key: string): any => {
  const cookieValue = Cookies.get(key);
  if (!cookieValue) return null; // Si no existe, retorna null.
  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    // Si no se puede parsear (no es JSON válido), se retorna el valor original.
    return cookieValue;
  }
};

export const removeCookie = (key: string) => {
  Cookies.remove(key);
};
