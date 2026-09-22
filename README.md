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
