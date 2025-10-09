// 🚀 Tipos compartidos para la gestión de profesores/recipients

export interface Person {
  id?: number;
  nombre_completo: string;
  correo: string;
  cargo: string;
  area: string;
}

export type PersonFormData = Omit<Person, 'id'>;
