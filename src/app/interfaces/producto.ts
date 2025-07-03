import { EstadoProducto } from "../enum/estado-producto";

export interface Producto {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    estado: EstadoProducto
    idCategoria: number;
}