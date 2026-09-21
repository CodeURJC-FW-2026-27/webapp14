# CarX

## Integrantes del Proyecto

| Nombre | Correo Institucional | Usuario de GitHub |
| :--- | :--- | :--- |
| Joaquín Farias | `j.farias.2025@alumnos.urjc.es` | [@Joaco-art](https://github.com/Joaco-art) |
| Adrián Dueñas | `a.duenas.2025@alumnos.urjc.es` | [@AdrianDuego](https://github.com/AdrianDuego) |
| Fernando Cuesta | `f.cuesta.2025@alumnos.urjc.es` | [@Nando123456788](https://github.com/Nando123456788) |

---

## Funcionalidades de la Aplicación

### 1. Entidades del Sistema

* **Entidad Principal:**
  * **Coche:** Representa el vehículo que está en venta. **Atributos**, matrícula, Año de fabricación, precio, kilometraje y estado del coche, motor(Diesel/Gasolina/Eléctrico), potencia(Caballos), Núm de puertas, Tipo de Cambio, Permite financiación (Si se tiene que pagar al contado o financiado) .

* **Entidades Secundarias (Catálogo / Clasificación):**
  * **Marca:** La marca del propio vehículo. **Atributos**, Una marca tiene asociados varios *Modelos*, Tipo de vehiculo(Carrocería), País de origen, Calificación.

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
