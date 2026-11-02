// Campos y títulos de cada sección
const CFG={
 movements:{t:'Movimientos de dinero',f:[['date','Fecha','date'],['type','Tipo',['ingreso','egreso']],['account','Cuenta',['caja','banco']],['category','Categoría',['Ventas','Insumos','Sueldos','Alquiler','Servicios','Gas','Limpieza','Impuestos','Otros']],['description','Descripción'],['amount','Monto','number'],['currency','Moneda',['Bs','USD']]]},
 debts:{t:'Cuentas por cobrar y por pagar',f:[['kind','Tipo',['cobrar','pagar']],['party','Cliente / proveedor'],['description','Detalle'],['amount','Monto','number'],['paid','Pagado','number'],['due','Vence','date']]},
 products:{t:'Insumos (ingredientes y bebidas)',f:[['name','Insumo'],['unit','Unidad',['kg','g','L','ml','unid']],['stock','Stock','number'],['min','Mínimo','number'],['buy','Costo por unidad','number']]},
 dishes:{t:'Platos y recetas',f:[['name','Plato'],['category','Categoría',['Entrada','Plato principal','Sopa','Postre','Bebida','Otros']],['price','Precio de venta','number']]},
 parties:{t:'Clientes, proveedores y empleados',f:[['name','Nombre'],['type','Tipo',['cliente','proveedor','empleado']],['phone','Teléfono'],['email','Correo','email']]}};
