# CarX

## Integrantes del Proyecto

| Nombre | Correo Institucional | Usuario de GitHub |
| :--- | :--- | :--- |
| Joaquín Farias | `j.farias.2025@alumnos.urjc.es` | [@Joaco-art](https://github.com/Joaco-art) |
| Adrián Dueñas | `a.duenas.2025@alumnos.urjc.es` | [@AdrianDuego](https://github.com/AdrianDuego) |
| Fernando Cuesta | `f.cuesta.2025@alumnos.urjc.es` | [@Nando123456788](https://github.com/Nando123456788) |

---

## Descripción de CarX

**CarX** es una plataforma web dedicada a la exhibición y venta de vehículos nuevos, de ocasión y de segunda mano. 

---

### Página de Inicio (*Landing Page*)

La página principal cuenta con una vista a pantalla completa (*Hero section*) estructurada de la siguiente manera:

* **Navegación Superior (20% de la pantalla):** *Navbar* que integra la marca CarX junto a controles de navegación principales:
  * Acceso directo por marca.
  * Menú desplegable para filtrado rápido por marca.
  * Opciones de registro e inicio de sesión.

* **Sección Principal (80% de la pantalla):** Carrusel dinámico de imágenes a pantalla completa que expone los vehículos más destacados y con mayor número de visitas en la plataforma.

* **Transición al Catálogo:** Al desplazarse hacia abajo (*scroll*), se presenta un botón para acceder directamente a la interfaz principal.

---

### Interfaz del Catálogo de Vehículos

Al entrar en la sección, la organización de la sección se divide en:

* **Navegación Superior:** El *Navbar* permanece de forma fija en la parte superior.
* **Barra de Búsqueda:** Ubicada en la parte superior para realizar búsquedas generales.
* **Barra Lateral / *Sidebar* (20% del ancho):** Situada en el lado izquierdo, contiene los filtros de búsqueda de la página.
* **Contenido Principal (80% del ancho):** Cuadrícula o tabla (*Grid*) dedicada a mostrar las marcas. Cada marca tiene asociado sus vehículos disponibles.

## Funcionalidades de la Aplicación

### 1. Entidades del Sistema

* **Entidad Principal:**
  *  **Marca:** String
* **Atributos | Valores :**
  *  Nombre: String
  *  AñoFundación: Date (XXXX)
  *  País de origen: String 
  *  Calificación: Float rango 1-5
  *  Gama: String (Low-Cost, media, lujo) 
 
* **Entidades Secundarias (Catálogo / Clasificación):**
   * **Coche:** String
*  **Atributos**
   *  Matrícula: Cadena de 7 caracteres (1234ABC)
   *  Año de fabricación: Date (XXXX)
   *  Precio: Float (EUR)
   *  Kilometraje: Int (km)
   *  Estado del coche: String (Usado,Ocasión,Nuevo)
   *  Motor: String (Diesel/Gasolina/Eléctrico)
   *  Potencia: Float (cv)
   *  Número de puertas: Int rango 2-4
   *  Tipo de Cambio: String (Manual, Automático)
   *  Permite financiación: Boolean (Si/No)


### 2. Gestión de Imágenes

Cada imagen está asociada a la entidad principal (el conjunto de vehículos).

* **Relación:** Un vehículo puede tener una cantidad variable de imágenes asociadas.
* **Propósito:** Permitir la verificación visual del estado del vehículo en cualquier momento.

### 3. Buscador, Filtrado y Categorización

#### 3.1. Barra de Búsqueda
Se implementará una barra de búsqueda rápida enfocada en la entidad secundaria, permitiendo la localización de vehículos por **Marca** y **Modelo**.

#### 3.2. Filtros de Consulta
Para realizar búsquedas avanzadas sobre la entidad principal, se dispondrá de un sistema de filtrado basado en sus atributos:

1. **Marca**
2. **Modelo y Tipo de vehículo**
3. **Precio**
4. **Kilómetros**
5. **Año de fabricación**
6. **Número de puertas**
7. **Tipo de cambio** (Manual / Automático)
8. **Potencia**

# Resumen práctica 1
* **Página de Inicio:**
 <img width="953" height="471" alt="Captura de pantalla 2026-10-13 163137" src="https://github.com/user-attachments/assets/01f09dc7-1ca7-4479-8a28-6512bc4fabb4" />
 <img width="955" height="471" alt="Captura de pantalla 2026-10-13 163256" src="https://github.com/user-attachments/assets/48080a30-e928-4f7d-bb15-9f006a7d5267" />
 <img width="953" height="471" alt="Captura de pantalla 2026-10-13 163153" src="https://github.com/user-attachments/assets/8676ebe0-e2d7-4914-9ca6-a98567e4bfc4" />
 **Página de detalle:**
 <img width="956" height="470" alt="Captura de pantalla 2026-10-13 163346" src="https://github.com/user-attachments/assets/2d6db1b6-fc15-4300-b377-bf140c07707d" />
 <img width="950" height="472" alt="Captura de pantalla 2026-10-13 163318" src="https://github.com/user-attachments/assets/b0253e64-6fc4-416d-b26b-05d6bc88fa1b" />
 <img width="950" height="470" alt="Captura de pantalla 2026-10-13 163307" src="https://github.com/user-attachments/assets/27346e77-50e1-4080-a32e-dc77ea71e2cb" />
* **Página de añadir marca:**
 <img width="866" height="352" alt="Captura de pantalla 2026-10-13 163433" src="https://github.com/user-attachments/assets/1e192215-3a24-4a6a-b953-58581d7f158b" />
 <img width="947" height="467" alt="Captura de pantalla 2026-10-13 163418" src="https://github.com/user-attachments/assets/3f6bfe02-0902-4d1e-9f84-5ca6f519ab49" />
 <img width="947" height="469" alt="Captura de pantalla 2026-10-13 163401" src="https://github.com/user-attachments/assets/7bc13e59-7416-431a-b44b-f132b1c305e4" />



# Participación en la práctica
## Fernando Cuesta

* **Página de Detalle:**
  * Desarrollo completo de la estructura HTML.
  * Implementación y maquetación de los detalles visuales y de contenido.

* **Ajustes y Maquetación Web:**
  * Retoques y optimizaciones en la *grid* de la página principal.
  * Ajustes puntuales en otras páginas HTML.

* **Estructura y Gestión de Datos:**
  * Revisión y validación de la estructura de datos almacenada en el archivo `JSON`.

* **Documentación y Organización:**
  * Participación activa en la definición de la estructura del trabajo.
  * Colaboración directa en la redacción y organización de este `README.md`.

 * **Commits más significativos:**
* [Commit 1](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/4431242ac5ebf4f32629c1ada5bfcdafa3ff69d9)
* [Commit 2](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/b8d651a650e2b8cce44baf4baf622b97b67c2dac)
* [Commit 3](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/50a536bda94f7e75eb91bee8fdbf68a64bc008ee)
* [Commit 4](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/573f3f114b3f4f28a66714e1f76922b3352a5f54)
* [Commit 5](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/bc4eb9dc813d923890c4dca05c6e092f2562304a)

* **ficheros en los que más he participado:**
* [Página de detalle](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/detalle.html)
* [Página de inicio](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/index.html)
* [Estructura JSON](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/data.json)
* [Estilos css nativos](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/css/global.css)
* [Imagenes y logos](https://github.com/CodeURJC-FW-2026-27/webapp14/tree/main/assets)

## Joaquín Farias Ovelar

* **Página de inicio:**
  * Modificación del template de Boostrap 5 adaptado a nuestra temática.
  * Implementación de un nuevo navbar y footer para todas las páginas.

* **Ajustes SEO:**
  * Modificación y adición correcta de las etiquetas semánticas y comentarios en el código.
  * Ajustes puntuales en otras páginas HTML y estilos css.

* **Estructura y Gestión de Datos:**
  * Implementación inicial de la estructura de datos almacenada en el archivo `JSON`.

* **Documentación y Organización:**
  * Participación activa en la definición de la estructura del trabajo.
  * Colaboración directa en la redacción y organización de este `README.md`.
* **Commits más significativos:**
* [Commit 1](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/4ddbe1988b81bb100b388cc9c40f1890be871c0c)
* [Commit 2](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/bf6f7b6a70576a5da05ab091f81ec0a43b81ded5)
* [Commit 3](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/76dc3c5af8e882ff9b1eed0f24d60c64242d92a9)
* [Commit 4](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/46eaaf0efd677f52fb77422b06029b85a51ee2dd)
* [Commit 5](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/d2a45a2183db56b4719ca9fe8c6be91fa1072a99)
* **ficheros en los que más he participado:**
* [Página de inicio](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/index.html)
* [Página de detalle](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/detalle.html)
* [Estructura JSON](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/data.json)
* [Página de creación de entidad](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/createElement.html)
* [Estilos css nativos](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/css/global.css)


## Adrián Dueñas Gómez

* **Página de crear elementos entidad principal**
  * Desarrollo completo de la estructura HTML.
  * Implementación y maquetación de los detalles visuales y de contenido.
  * Formulario adaptado a las necesidades de la entidad principal con cada atributo necesario.
  * Se ha añadido un fichero CSS para acompañar los estilos de bootstrap.

* **Formulario de creación entidades secundarias**
  * Formulario adaptado a las necesidades de la entidad secundaria.
  * Implementación y maquetación de los detalles visuales y de contenido.

* *Ajustes SEO:**
  * Implementación de algunas necesidades extras del proyecto.

* **Documentación y Organización:**
  * Participación activa en la definición de la estructura del trabajo.
  * Colaboración directa en la redacción y organización de este `README.md`.
 
* **Commits más significativos:**
* [Commit 1](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/2bbdd3ba961ee7b5019a6d615e1d398db20eb12a)
* [Commit 2](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/59f92f810dd9e36e45d3dcdd2e5f3935bace4f59)
* [Commit 3](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/e71144c478394e3751a5c2e23134d8135c9e4878)
* [Commit 4](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/0e96d0435896ab9f1dc1d25c0a849705c86bc1cd)
* [Commit 5](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/2fec8e29ffbfdbf3b083fcc90bb65c66e388ab94)
* **ficheros en los que más he participado:**
* [Página de inicio](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/index.html)
* [Página de detalle](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/detalle.html)
* [Estilos pagina de creación de entidad principal](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/css/createEleStyles.css)
* [Página de creación de entidad principal](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/createElement.html)
* [Estilos css nativos](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/css/global.css)



# Participación en la práctica 2
## Fernando Cuesta

* **funcionalidades del router:**
  * implementación de la base  de datos y de los botones edit.
  * Participado en la calidación de los mismos.

* **cargar datos**
  * creado y tratado los json para que se cargen en una sola base de datos
  * cargado tammbien las imagenes.

* **htmls:**
  * he modificado gran parte de las plantillas para que funcionen con mustache y la db.

* **revisión de datos:**
  * he correguido algunos datos menores para la correcta funcionalidad.

 * **Commits más significativos:**
* [Commit 1](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/0cdb6807b53db4d565207ed6799389e768ba1eab)
* [Commit 2](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/01d07848ac2975b5a42f6837828b6c6465e860f6)
* [Commit 3](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/c1f28cbeb87658366115f6a0b9d9b48b12badf1b)
* [Commit 4](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/1b216d95f784840a70a3af8ca56cb750a4d4d16e)
* [Commit 5](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/9ee03ad3c5ee70882970c43b0af77c2f1a11c1f8)

* **ficheros en los que más he participado:**
* [router](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/router.js)
* [load_data](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/load_data.js)
* [data](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/data)
* [detail](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/detail.html)
* [brandValidator](https://github.com/CodeURJC-FW-2026-27/webapp14/main/brandValidator.js)
* [modelValidator](https://github.com/CodeURJC-FW-2026-27/webapp14/main/modelValidator.js)

## Adrián Dueñas

* **funcionalidades del router:**
  * Implementación de las inserciones de nuevas marcas y modelos a la base de datos
  * Implementación del borrado de modelos y de marcas.
  * Validaciones de formularios modelo y marcas

* **paginas success y error**
  * desarrollo de las plantillas error y success para que procesen los datos correctamente

* **htmls:**
  * he modificado los campos de los formularios para que se adapten bien al json y a la base.

* **revisión de datos:**
  * he correguido algunos datos menores para la correcta funcionalidad.

 * **Commits más significativos:**
* [Commit 1](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/a58504330ab4c9ac91fb8d2be9cd606c495fcd7d)
* [Commit 2](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/b5a5c9ee5f0d66b6f5662f9b294284500cdfdc46)
* [Commit 3](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/54f154953eaa5150f57351abb4643fb15fc10a66)
* [Commit 4](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/055b87cf8493bf4008622772d71f6ffcbb9a90e8)
* [Commit 5](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/f070c274df4f02909246ed3507ca994cf56700a9)

* **ficheros en los que más he participado:**
* [router](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/router.js)
* [success](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/develop3/views/success.html)
* [createElement](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/develop3/views/createElement.html)
* [detail](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/detail.html)
* [brandValidator](https://github.com/CodeURJC-FW-2026-27/webapp14/main/brandValidator.js)
* [modelValidator](https://github.com/CodeURJC-FW-2026-27/webapp14/main/modelValidator.js)
* [error](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/develop3/views/errorPage.html)
* [creatorBrands](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/develop3/src/creatorBrands.js)

## Joaquín Farias Ovelar

* **funcionalidades del router:**
  * implementación de la base  de datos y de los botones edit.
  * Participado en la calidación de los mismos.
  * Modularización del proyeto

* **Nuevos archivos js e iomportaciín exportación de módulos**
  * creado y tratado los js para simplificar el router

* **Mustache Partials:**
  * Implementación del header y footer y otras partes con Mustache para evitar la repetixión de código.

* **revisión de datos:**
  * he correguido algunos datos menores para la correcta funcionalidad.


### Commits Más Significativos
- [Commit 1](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/0cdb6807b53db4d565207ed6799389e768ba1eab)
- [Commit 2](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/01d07848ac2975b5a42f6837828b6c6465e860f6)
- [Commit 3](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/c1f28cbeb87658366115f6a0b9d9b48b12badf1b)
- [Commit 4](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/1b216d95f784840a70a3af8ca56cb750a4d4d16e)
- [Commit 5](https://github.com/CodeURJC-FW-2026-27/webapp14/commit/9ee03ad3c5ee70882970c43b0af77c2f1a11c1f8)

---

### Ficheros con Mayor Participación
- **[router](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/router.js)**: Control de rutas y lógica del servidor.
- **[load_data](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/load_data.js)**: Inicialización y carga de datos.
- **[data](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/data)**: Estructura de almacenamiento y persistencia.
- **[detail](https://github.com/CodeURJC-FW-2026-27/webapp14/blob/main/detail.html)**: Interfaz y plantilla visual de detalles.
- **[brandValidator](https://github.com/CodeURJC-FW-2026-27/webapp14/main/brandValidator.js)**: Validaciones de negocio para las marcas.
- **[modelValidator](https://github.com/CodeURJC-FW-2026-27/webapp14/main/modelValidator.js)**: Validaciones de integridad para los modelos de coches.
# Video explicativo: https://youtu.be/lRugIVFn3lM?si=AkBa0pmJd2gDLHMQ

