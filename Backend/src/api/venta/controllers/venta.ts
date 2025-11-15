'use strict';

import { factories } from '@strapi/strapi';

interface CreateVentaRequestBody {
  usuarioId: number;
  productosVendidos: Array<{
    id: number;
    cantidad: number;
  }>;
}

interface Producto {
  id: number;
  stock_actual: number;
  precio_venta: number;
}

export default factories.createCoreController('api::venta.venta', ({ strapi }) => ({
  
  async createCustomVenta(ctx) {
    
    const { usuarioId, productosVendidos } = ctx.request.body as CreateVentaRequestBody;

    if (!productosVendidos || productosVendidos.length === 0) {
      return ctx.throw(400, 'No hay productos en la venta.');
    }

    let totalCalculado = 0;
    const detallesParaCrear = [];
    const productosParaValidar: Producto[] = [];

    for (const item of productosVendidos) {
      
      const producto = await strapi.db.query('api::producto.producto').findOne({
        where: { id: item.id }
      }) as Producto | null;
      
      if (!producto) {
        return ctx.throw(404, `Producto con ID ${item.id} no encontrado.`);
      }

      if (producto.stock_actual < item.cantidad) {
        return ctx.throw(400, `Stock insuficiente para el producto. Stock: ${producto.stock_actual}, Solicitado: ${item.cantidad}`);
      }
      
      const precioVenta = producto.precio_venta;
      totalCalculado += precioVenta * item.cantidad;

      detallesParaCrear.push({
        producto: producto.id,
        cantidad: item.cantidad,
        precio_unitario: precioVenta,
      });
      
      productosParaValidar.push(producto);
    }

    try {
      const nuevaVenta = await strapi.db.query('api::venta.venta').create({
        data: {
          total: totalCalculado,
          users_permissions_user: usuarioId, 
          publishedAt: new Date(),
          fecha: new Date(), 
        },
      });

      for (let i = 0; i < productosVendidos.length; i++) {
        const item = productosVendidos[i];
        const detalle = detallesParaCrear[i];
        const producto = productosParaValidar[i];
        
        await strapi.db.query('api::producto.producto').update({
          where: { id: item.id },
          data: {
            stock_actual: producto.stock_actual - item.cantidad,
          },
        });

        await strapi.db.query('api::detalle-venta.detalle-venta').create({
          data: {
            ...detalle,
            venta: nuevaVenta.id,
            publishedAt: new Date(),
          },
        });
        
        await strapi.db.query('api::inventario.inventario').create({
            data: {
                producto: item.id,
                cantidad_movida: -item.cantidad, 
                fecha_movimiento: new Date(),
                descripcion_mov: `Venta registrada con ID: ${nuevaVenta.id}`,
                publishedAt: new Date(),
            }
        });
      }

      return this.transformResponse(nuevaVenta);

    } catch (error) {
      strapi.log.error('Error al crear la venta:', error);
      return ctx.throw(500, 'Error interno al procesar la venta.', error);
    }
  },
}));

