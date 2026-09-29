# Clase N° 9 | Árboles de decisión

**Fuente:** [ML CLASE _ 09.pdf](ML%20CLASE%20_%2009.pdf), páginas 1–11. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 09. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro: dos personas ilustradas con auriculares usan una tableta y una computadora portátil a ambos lados de un cubo turquesa; el número de clase está en una banda amarilla.

## Página 2

### Clase N° 9 | Árboles de decisión

### Índice

- ¿Qué es un árbol de decisión?
  - Ejemplos:
  - ¿Cómo aprende un árbol a partir de los datos?
  - ¿Qué significa dividir recursivamente?
  - Profundidad del árbol y el riesgo de sobreajuste
- Ventajas y limitaciones de los árboles de decisión
  - Ventajas
  - Limitaciones
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Un árbol en el camino de Talento Lab
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

En esta clase veremos Árboles de Decisión: modelos basados en reglas lógicas y no en distancias o probabilidades. Aprenderemos su estructura jerárquica, el significado de sus nodos y cómo balancear su explicabilidad con el riesgo de sobreajuste. Entrenaremos un modelo con datos del Titanic para visualizarlo, evaluar su rendimiento y compararlo con algoritmos previos. Al finalizar, sabrás entrenar, interpretar y entender las ventajas y límites de estos modelos.

## Página 3

### ¿Qué es un árbol de decisión?

Un árbol de decisión es un modelo de aprendizaje supervisado que toma decisiones dividiendo los datos en pasos lógicos, como si siguiera un conjunto de reglas encadenadas del tipo “si… entonces…”. Su estructura se parece a un árbol invertido: parte de un nodo raíz, donde comienza la decisión, y se va ramificando en nodos internos hasta llegar a las hojas, que representan la clasificación final.

**Visual:** Diagrama de ejemplo comercial, distinto del clasificador del Titanic: desde «Calzados» se llega al nodo A, que se divide en «Zapatos deportivos» (nodo B) y «Botas de invierno» (nodo C). B tiene resultados «Venta de 100.000 unid.» (0.60, hoja 1) y «Venta de 75.000 unid.» (0.40, hoja 2); C tiene «Venta de 75.000 unid.» (0.70, hoja 3) y «Venta de 70.000 unid.» (0.30, hoja 4). Esas cantidades y probabilidades pertenecen a la imagen, no al texto del modelo.

Cada nodo interno del árbol evalúa una condición sobre una variable (por ejemplo, “¿La edad es menor a 30?”). Según la respuesta (sí o no), el árbol deriva por una u otra rama, hasta llegar a una hoja que contiene una clase predicha. Esta estructura permite representar decisiones complejas de forma clara, lógica y secuencial.

Una de las principales virtudes de los árboles de decisión es que son fáciles de interpretar y explicar. Se comportan como un conjunto de “reglas de decisión” que podemos seguir paso a paso, lo que los convierte en una excelente herramienta cuando necesitamos modelos que no solo funcionen, sino que también sean comprensibles por personas no técnicas.

#### Ejemplos:

- En salud, un árbol podría ayudar a decidir si una persona debe hacerse un estudio médico, con reglas como: “¿Tiene más de 50 años?” → sí → “¿Tiene antecedentes familiares?” → sí → Sugerir estudio preventivo.
- En crédito, un banco puede usar un árbol para decidir si aprueba un préstamo: “¿El ingreso mensual es mayor a 100.000?” → no → “¿Tiene otra fuente de ingresos?” → sí → Aprueba el préstamo.

## Página 4

- En educación, una universidad podría utilizar un árbol para predecir si un estudiante aprobará un curso, basándose en variables como asistencia, nota de parciales y entregas.

Un árbol de decisión es como un mapa de decisiones guiadas por condiciones, que permite clasificar observaciones sin necesidad de fórmulas matemáticas complejas. Su lógica secuencial y su capacidad de interpretación lo convierten en una herramienta ideal para modelos que deben ser explicables y auditables.

### ¿Cómo aprende un árbol a partir de los datos?

El aprendizaje en un árbol de decisión ocurre de forma recursiva: el modelo va dividiendo el conjunto de datos en partes cada vez más homogéneas, tomando decisiones una variable a la vez. En cada paso, el árbol elige la mejor condición posible para dividir los datos y separar las clases de la forma más clara.

La pregunta clave que se hace el algoritmo es: “¿Cuál de estas variables, y con qué umbral, me permite separar mejor los datos?”

Para responder esa pregunta, el árbol utiliza un criterio de división. Los dos más comunes son:

- Gini: mide la “impureza” de una partición. Cuanto menor es el índice de Gini, más homogéneo es el grupo.
- Entropía: viene de la teoría de la información y mide cuán desordenado está un grupo de datos. Al igual que Gini, busca dividir para reducir el desorden.

Ambos criterios apuntan al mismo objetivo: crear nodos cada vez más puros, es decir, que contengan ejemplos mayoritariamente de una sola clase.

**Visual:** Persona de espaldas frente a un poste con varias flechas direccionales; ilustración conceptual de opciones, no gráfico cuantitativo de Gini o entropía.

## Página 5

### ¿Qué significa dividir recursivamente?

Imaginemos que al principio el árbol analiza la variable `GrupoDemográfico` y ve que separa bastante bien entre sobrevivientes y no sobrevivientes. Entonces, crea una primera división con esa variable.

**Visual:** Árbol dibujado para pasajeros: la raíz «Grupo Demográfico» se bifurca en «Persona Tipo A» y «Persona Tipo B». Ambas ramas preguntan «Clase de Pasajero» (Primera, Segunda, Tercera). En A, Primera y Segunda terminan en «Sobrevivió»; Tercera pasa a «Edad»: `> 38.500` conduce a «Falleció» y `≤ 38.500` a «Puerto de Embarque», donde C y Q conducen a «Sobrevivió» y S a «Falleció». En B, Primera y Tercera conducen a «Falleció»; Segunda pregunta «Edad», con `> 12` → «Falleció» y `≤ 12` → «Sobrevivió». Debajo de las hojas se muestran pequeñas barras azul/rojo sin leyenda de valores exactos.

Luego, dentro de cada grupo (por ejemplo, Persona de tipo A), analiza otras variables como `Clase de Pasajero` o `Edad`, buscando nuevas divisiones que mejoren la clasificación. Este proceso continúa hasta que se alcanza alguna de las siguientes condiciones:

- Se llega a un grupo perfectamente puro (solo una clase).
- Se alcanza una profundidad máxima predefinida.
- Ya no hay mejoras significativas al dividir.

Este proceso da lugar a una estructura jerárquica de decisiones, donde cada camino desde la raíz a una hoja representa una “regla” aprendida a partir de los datos.

## Página 6

### Profundidad del árbol y el riesgo de sobreajuste

Una de las grandes ventajas de los árboles de decisión es que pueden ajustarse muy bien a los datos, dividiendo hasta que cada grupo contenga observaciones perfectamente clasificadas. Pero esa misma capacidad puede volverse un problema: si el árbol se vuelve demasiado profundo, comienza a memorizar el conjunto de entrenamiento, en lugar de aprender patrones generales.

**Visual:** Tres esquemas con puntos negros y curvas azules sobre ejes rojos: «underfitting» ajusta una recta que no sigue bien los puntos, «correcto» una curva suave y «overfitting» una curva muy ondulada que sigue cada punto. Es una comparación conceptual de ajuste, no una medición del Titanic.

Este fenómeno se conoce como sobreajuste (overfitting): el modelo funciona muy bien con los datos que ya vio, pero pierde capacidad de generalizar cuando se enfrenta a nuevos casos.

Un árbol sobreajustado suele tener:

- Muchas ramas con decisiones muy específicas.
- Hojas que contienen muy pocos casos (incluso uno solo).
- Muy alta precisión en el entrenamiento, pero bajo rendimiento en la prueba.

Para evitar esto, es importante limitar la complejidad del árbol, lo que se puede hacer de varias maneras:

- Limitar la profundidad (`max_depth`): evitar que crezca indefinidamente.
- Establecer una cantidad mínima de muestras por hoja (`min_samples_leaf`).
- Podar el árbol: eliminar ramas que no aportan mejora significativa (en Scikit-learn esto se hace con parámetros al momento de entrenar).

Imaginá un árbol que clasifica pasajeros del Titanic y llega a ramas como:

“Sexo = male, Edad < 8, Pclass = 2, Parch = 1, Fare > 30.25…”

Ese nivel de detalle probablemente no generaliza bien. Tal vez solo haya dos personas con esas características en todo el dataset, y crear una regla solo para ellas no ayuda a predecir nuevos casos. Un buen árbol es como una buena explicación: clara, general y suficiente, sin obsesionarse con los detalles irrelevantes.

## Página 7

### Ventajas y limitaciones de los árboles de decisión

Los árboles de decisión son una de las herramientas más populares del aprendizaje automático, y no es casual: combinan claridad, potencia y versatilidad. Pero como todo modelo, tienen sus luces y sombras.

#### Ventajas

- Fáciles de entender e interpretar: Cada decisión puede explicarse como una regla lógica. Esto los hace ideales cuando necesitamos justificar predicciones frente a otras personas.
- Funcionan con datos mixtos: Pueden trabajar con variables numéricas y categóricas sin necesidad de codificar ni escalar.
- No requieren suposiciones matemáticas: A diferencia de la regresión lineal o logística, no requieren que las variables estén relacionadas de forma lineal ni que tengan distribución normal.
- Permiten visualizar el proceso de decisión: Gracias a herramientas como `plot_tree`, es posible ver el árbol completo, algo muy útil en contextos educativos o profesionales.

#### Limitaciones

- Propensos al sobreajuste: Si no se limitan su profundidad o el tamaño mínimo de muestras, pueden volverse muy específicos y memorizar los datos.
- Sensibles a pequeñas variaciones: Un pequeño cambio en los datos puede generar un árbol totalmente distinto, lo que afecta su estabilidad.
- No son los mejores en precisión: Por sí solos, rara vez superan a modelos como Random Forest o XGBoost, especialmente en problemas complejos.
- Poco efectivos con variables correlacionadas o muchas dimensiones: Si hay muchas variables que se solapan o datos muy dispersos, el árbol puede volverse poco eficiente.

Los árboles de decisión son excelentes modelos base, sobre todo cuando se prioriza la interpretación, la simplicidad o la comunicación. Pero deben usarse con criterio y, en contextos más complejos, pueden necesitar ser complementados o reemplazados por modelos más robustos.

## Página 8

### Reflexión final

Con esta clase, sumamos a nuestra caja de herramientas un modelo que no solo predice, sino que piensa con lógica: los árboles de decisión nos mostraron que se puede aprender a clasificar formulando reglas claras, tomando caminos que se bifurcan según las características de cada caso.

Aprendimos que su mayor fortaleza es la interpretabilidad: cada predicción puede explicarse paso a paso, algo especialmente valioso cuando necesitamos modelos transparentes y auditables. Pero también entendimos que esa facilidad para adaptarse puede convertirse en una trampa si no se controla: cuando un árbol crece sin límites, corre el riesgo de sobreajustar los datos y perder la capacidad de generalizar.

El desafío, como siempre, está en el equilibrio: entre precisión y simplicidad, entre detalle y generalización, entre aprender y memorizar.

### Materiales y recursos adicionales:

Aquí tienes una selección de recursos adicionales al contenido de la clase, para explorar y proporcionar más contexto al tema tratado:

- **Árboles de decisión con Python: regresión y clasificación:** Este artículo ofrece una [explicación detallada sobre la implementación de árboles de decisión en Python](https://cienciadedatos.net/documentos/py07_arboles_decision_python) utilizando la biblioteca scikit-learn. Incluye ejemplos prácticos y aborda tanto la clasificación como la regresión.
- **Crea un Árbol de Decisión en Python:** Un tutorial paso a paso que guía al lector en la [creación de un árbol de decisión en Python](https://www.aprendemachinelearning.com/arbol-de-decision-en-python-clasificacion-y-prediccion/). Utiliza un ejemplo divertido relacionado con la música para ilustrar el proceso.
- **Visualización de un árbol de decisión:** Este recurso explica [cómo visualizar árboles de decisión en Python](https://interactivechaos.com/es/python/scenario/visualizacion-de-un-arbol-de-decision) utilizando herramientas como `export_graphviz` y `plot_tree` de scikit-learn. Incluye ejemplos con el conjunto de datos "tips" de seaborn.
- **Scikit-learn: Árboles de decisión** La [documentación oficial de scikit-learn traducida al español](https://qu4nt.github.io/sklearn-doc-es/modules/tree.html), que cubre las clases `DecisionTreeClassifier` y `DecisionTreeRegressor`, junto con ejemplos de uso.

## Página 9

### Preguntas para reflexionar:

1. ¿Qué diferencias encontrás entre la forma de tomar decisiones de un árbol y la de modelos como la regresión logística o KNN?
2. ¿Por qué un árbol muy profundo puede ser peligroso para la generalización de un modelo?
3. ¿En qué tipos de contextos reales puede ser ventajoso usar árboles de decisión? ¿Y en cuáles podrían no ser la mejor opción?
4. ¿Qué significa que un árbol es interpretable? ¿Por qué esa propiedad puede ser importante en algunos proyectos?

### Un árbol en el camino de Talento Lab

Después de probar con modelos como la regresión logística y KNN, el equipo de Talento Lab se encontró ante una necesidad nueva: no solo querían saber si el modelo acertaba, sino también entender cómo tomaba sus decisiones.

Fue entonces cuando Silvia propuso trabajar con árboles de decisión. “Necesitamos algo que podamos mostrar, analizar, y si hace falta, discutir”, dijo. Sabrina, que venía preocupada por la opacidad de los últimos modelos, asintió: “Si el cliente nos pide que justifiquemos por qué predecimos lo que predecimos, un árbol va a ser más útil que una fórmula difícil de explicar”.

Así, el equipo se puso manos a la obra para entrenar su primer árbol.

**Visual:** Logotipo grande «Talento Lab» encima del relato; no se incluye un árbol entrenado ni métricas.

## Página 10

### Ejercicio práctico

La consigna es simple y desafiante: construir un modelo eficaz, interpretarlo, visualizarlo y analizar qué decisiones toma y por qué.

1. Utilizá el dataset del Titanic que venís trabajando. Asegurate de preparar los datos correctamente (codificación, limpieza, etc.) si no lo hiciste en una clase anterior.
2. Entrená un modelo de clasificación utilizando `DecisionTreeClassifier` de Scikit-learn.
3. Visualizá el árbol resultante usando `plot_tree` o una herramienta similar. Asegurate de mostrar los nodos, las condiciones y las clases predichas.
4. Evaluá el rendimiento del modelo con las métricas conocidas: precisión, recall, F1-score y matriz de confusión.
5. Agregá una celda de texto donde interpretes al menos una ruta de decisión completa (por ejemplo: “si es mujer y viaja en 1ra clase y tiene menos de 3 familiares → predice que sobrevivió”).

**Bonus:** probá entrenar un árbol sin limitar su profundidad, y luego otro con `max_depth=3`. Compará sus resultados y explicá qué diferencias observás.

### Próximos pasos

En la próxima clase vamos a combinar muchos árboles en un solo modelo: el Random Forest. Esta técnica toma la lógica de los árboles de decisión, la potencia mediante el uso de múltiples modelos, y mejora la precisión y la estabilidad del resultado final. Veremos cómo este enfoque logra reducir el sobreajuste y ofrecer predicciones más robustas, sin perder del todo la capacidad de interpretación.

Seguimos avanzando, aprendiendo no solo a modelar, sino también a elegir con criterio la herramienta adecuada para cada situación.

## Página 11

**Visual:** Contraportada azul oscuro con líneas geométricas formando una malla y logotipos «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad». No hay texto docente adicional.
