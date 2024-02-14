# Backend con Express, MongoDB y Autenticación con JWT - Tienda de abarrotes

El presente proyecto es una API para ventas de abarrotes, usando Express, MongoDB y autenticación con JWT.

Por defecto es ejecutada en:

```
http://localhost:5000
```

Tiene los siguientes endpoints, algunos de ellos protegidos para uso de cuentas tipo Admin únicamente:

## Users

### Endpoints públicos

#### Create user

Método: `POST`

```
http://localhost:5000/api/users
```

Body Example:

```
{
	"name": "User",
	"email": "email@example.com",
	"password": "mypassword",
	"isAdmin": "false"
}
```

En esta petición el atributo `email` debe ser único.

El atributo `isAdmin` es opcional, y solo acepta `"true"` o `"false"`. Por defecto se establece como `"false"`.

#### Get user data

Método: `GET`

```
http://localhost:5000/api/users
```

Autorización: `Bearer Token`

#### Login user

Método: `POST`

```
http://localhost:5000/api/users/login
```

Body Example:

```
{
	"email": "email@example.com",
	"password": "mypassword"
}
```

Como respuesta se obtiene la información del usuario y un `Token` útil para hacer peticiones, válido por 30 días.

#### Update user

Método: `PUT`

```
http://localhost:5000/api/users
```

Autorización: `Bearer Token`

En el Body enviar los parámetros a modificar (al menos uno):

`name`: No debe ser vacío

`isAdmin`: Debe ser `"true"` o `"false"`

`password`: Nueva contraseña (opcional)

`logout`: Esta opción solo se toma en cuenta si el campo `password` se envía. Si se establece como `"false"`, los tokens generados anteriormente para el usuario correspondiente al `Token` dado que son válidos, continúan siendo válidos. De lo contrario, todos los tokens generados anteriormente para el usuario se invalidan.

#### Soft Delete user

Método: `DELETE`

```
http://localhost:5000/api/users
```

Autorización: `Bearer Token`

En esta petición solamente se modifica el estado de la propiedad `isActive`.

### Endpoints privados

#### Get All users (Admin only)

Método: `GET`

```
http://localhost:5000/api/users/all
```

Autorización: `Bearer Token`

En esta petición se muestran todos los datos de los usuarios activos en la base de datos. Se necesita ser Admin para usar este endpoint.

## Products

### Endpoints públicos

#### Get All products

Método: `GET`

```
http://localhost:5000/api/products
```

Esta búsqueda acepta los siguientes query params:

`product_id`: Busca productos por su id.

`min_price`: Busca productos con precio mayor o igual al solicitado.

`max_price`: Busca productos con precio menor o igual al solicitado.

#### Get product by id

Método: `GET`

```
http://localhost:5000/api/products/:id
```

### Endpoints privados

#### Create product (Admin only)

Método: `POST`

```
http://localhost:5000/api/products
```

Body Example:

```
{
	"name": "Peras",
	"price": 15,
	"description": "Peras ricas",
	"sku": "ABCPERAS"
}
```

Autorización: `Bearer Token`

Los atributos requeridos son `name` y `price`. Este último corresponde a un número positivo.

#### Update product (Admin only)

Método: `PUT`

```
http://localhost:5000/api/products/:id
```

Autorización: `Bearer Token`

En el Body enviar los parámetros a modificar (al menos uno).

#### Soft Delete product (Admin only)

Método: `DELETE`

```
http://localhost:5000/api/products/:id
```

Autorización: `Bearer Token`

## Sales

### Endpoints públicos

#### Create sale

Método: `POST`

```
http://localhost:5000/api/sales
```

Body Example:

```
{
    "products": [
        {
            "id": "1111",
            "amount": 2
        },
        {
            "id": "2222",
            "amount": 1
        }
    ]
}
```

Autorización: `Bearer Token`

Response Example:

```
{
    "user": {
        "_id": "0000"
    },
    "products_amount": 3,
    "total_price": 32,
    "products": [
        {
            "product": {
                "_id": "1111"
            },
            "amount": 2,
            "sale_price": 20
        },
        {
            "product": {
                "_id": "2222"
            },
            "amount": 1,
            "sale_price": 12
        }
    ],
    "createdAt": "2024-02-14T02:26:17.321Z",
    "updatedAt": "2024-02-14T02:26:17.321Z",
    "__v": 0
}
```

Descripción de la respuesta:

`products_amount`: Muestra el total de productos comprados.

`total_price`: Muestra el precio total de compra.

`amount`: Especifica la cantidad de artículos comprados de cada producto distinto. La suma de todos los campos `amount` es igual a `products_amount`.

`sale_price`: Especifica el subtotal correspondiente a cada producto. La suma de todos los campos `sale_price` es igual a `total_price`.

#### Get sales from user

Método: `GET`

```
http://localhost:5000/api/sales
```

Autorización: `Bearer Token`

Response Example:

```
{
    "user": {
        "_id": "0000"
    },
    "sales_amount": 2,
    "total_products_amount": 5,
    "total_sales_price": 99,
    "sales": [
        {
            "user": {
                "_id": "0000"
            },
            "products_amount": 1,
            "total_price": 12,
            "products": [
                {
                    "product": {
                        "_id": "1111"
                    },
                    "amount": 1,
                    "sale_price": 12
                }
            ],
            "createdAt": "2024-02-14T01:19:24.579Z",
            "updatedAt": "2024-02-14T01:19:24.579Z",
            "__v": 0
        },
        {
            "user": {
                "_id": "0000"
            },
            "products_amount": 4,
            "total_price": 87,
            "products": [
                {
                    "product": {
                        "_id": "2222"
                    },
                    "amount": 3,
                    "sale_price": 60
                },
                {
                    "product": {
                        "_id": "3333"
                    },
                    "amount": 1,
                    "sale_price": 27
                }
            ],
            "createdAt": "2024-02-14T01:21:26.172Z",
            "updatedAt": "2024-02-14T01:21:26.172Z",
            "__v": 0
        }
    ]
}
```

Descripción de la respuesta:

`sales_amount`: Muestra la cantidad de compras realizadas por el usuario.

`total_products_amount`: Corresponde al total de productos comprados por el usuario. Es igual a la suma de todos los campos `products_amount`.

`total_sales_price`: Corresponde al total de las compras realizadas por el usuario. Es igual a la suma de todos los campos `total_price`.

### Endpoints privados

#### Get All sales (Admin only)

Método: `GET`

```
http://localhost:5000/api/sales/all
```

Autorización: `Bearer Token`

Muestra todas las ventas realizadas.

Esta búsqueda acepta los siguientes query params:

`user_id`: Busca ventas hechas por el usuario con id `user_id`.

`min_amount`: Busca ventas con una cantidad de artículos mayor o igual a la solicitada.

`max_amount`: Busca ventas con una cantidad de artículos menor o igual a la solicitada.

`min_price`: Busca ventas con un precio total mayor o igual al solicitado.

`max_price`: Busca ventas con un precio total menor o igual al solicitado.

#### Get Sales summary (Admin only)

Método: `GET`

```
http://localhost:5000/api/sales/summary
```

Autorización: `Bearer Token`

Esta búsqueda muestra un resumen de las compras realizadas por cada usuario activo.

Response Example:

```
{
    "all_sales_amount": 7,
    "all_products_amount": 22,
    "all_sales_price": 301.06,
    "by_user": [
        {
            "user": {
                "_id": "0000"
            },
            "sales_amount": 0,
            "total_products_amount": 0,
            "total_sales_price": 0
        },
        {
            "user": {
                "_id": "1111"
            },
            "sales_amount": 0,
            "total_products_amount": 0,
            "total_sales_price": 0
        },
        {
            "user": {
                "_id": "2222"
            },
            "sales_amount": 0,
            "total_products_amount": 0,
            "total_sales_price": 0
        },
        {
            "user": {
                "_id": "3333"
            },
            "sales_amount": 2,
            "total_products_amount": 5,
            "total_sales_price": 99
        },
        {
            "user": {
                "_id": "4444"
            },
            "sales_amount": 5,
            "total_products_amount": 17,
            "total_sales_price": 202.06
        }
    ]
}
```

Descripción de la respuesta:

`all_sales_amount`: Muestra el total de compras realizadas por los usuarios activos. Es igual a la suma de los campos `sales_amount`.

`all_products_amount`: Muestra el total de productos vendidos. Es igual a la suma de los campos `total_products_amount`.

`all_sales_price`: Muestra el total de precios de las ventas. Es igual a la suma de los campos `total_sales_price`.

## Mis datos de contacto

Para cualquier comentario puedes mandarme un correo electrónico a: [ivangm_01@hotmail.com](mailto:ivangm_01@hotmail.com "mailto:ivangm_01@hotmail.com").
