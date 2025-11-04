
interface StrapiRoute {
  method: string;
  path: string;
  handler: string;
}
interface StrapiRoutesFile {
  routes: StrapiRoute[];
}
const customVentas: StrapiRoutesFile = {
  routes: [
    {
      method: "POST",
      path: "/registrar-venta",
      handler: "venta.createCustomVenta",
    },
  ],
};
export default customVentas;
