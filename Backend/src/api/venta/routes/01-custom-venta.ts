export default {
  routes: [
    {
      method: 'POST',
      path: '/ventas/custom', 
      handler: 'venta.createCustomVenta', 
      config: {
      },
    },
  ],
};