# Clase N° 8 | K-Nearest Neighbors

**Fuente:** [ML CLASE _ 08.pdf](ML%20CLASE%20_%2008.pdf), páginas 1–11. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores repiten `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 8. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas usando una tableta y una computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 8 | K-Nearest Neighbors

### Índice

- K-Nearest Neighbors: clasificar mirando alrededor
- La distancia como corazón del modelo
- Elegir el valor de k: precisión o estabilidad
- ¿Por qué escalar los datos antes de usar KNN?
- Ventajas y limitaciones del algoritmo KNN
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Una nueva mirada: clasificar por cercanía
- Consignas de la pre-entrega:
  - Pipeline completo
  - Organización y entregable
  - Requerimientos:
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

En esta clase exploraremos un nuevo enfoque para resolver problemas de clasificación binaria: el algoritmo de K vecinos más cercanos (KNN). A diferencia de los modelos anteriores, KNN no ajusta una fórmula: decide según los datos más cercanos al caso a predecir.

Veremos cómo funciona, por qué la distancia es clave en sus decisiones y cómo el parámetro k afecta la precisión del modelo. También analizaremos la importancia de escalar los datos para medir distancias sin sesgos.

Entrenaremos un modelo KNN con el dataset del Titanic, lo compararemos con la regresión logística y evaluaremos su desempeño con las mismas métricas (precisión, recall, F1 y matriz de confusión).

Al finalizar, podrás aplicar KNN en clasificación binaria, ajustar su sensibilidad mediante k y reconocer cuándo este enfoque resulta especialmente útil.

## Página 3

### K-Nearest Neighbors: clasificar mirando alrededor

El algoritmo de los K vecinos más cercanos (KNN) es uno de los métodos más intuitivos y fáciles de entender dentro del aprendizaje supervisado. Su lógica se basa en una idea simple pero poderosa: para saber a qué clase pertenece un nuevo caso, miramos las clases de los ejemplos más parecidos que ya conocemos.

No hay fórmulas ni funciones complicadas. El modelo no necesita ser entrenado en el sentido clásico, sino que almacena los datos del conjunto de entrenamiento y luego, al momento de clasificar un nuevo punto, calcula la distancia entre ese punto y todos los demás. A continuación, selecciona los k puntos más cercanos y vota según la mayoría de clases que encuentra.

Por ejemplo, si elegimos k = 5 y de los cinco vecinos más cercanos tres son clase 1 y dos son clase 0, el modelo clasificará el nuevo punto como clase 1. Si hay empate, el comportamiento dependerá del criterio de desempate definido por la implementación.

Este enfoque es especialmente útil cuando la relación entre variables no es lineal, o cuando no contamos con un modelo matemático claro que relacione las variables predictoras con la variable objetivo. KNN se apoya directamente en los datos disponibles y su proximidad, lo que lo hace muy flexible y a la vez sensible a cómo están distribuidos los datos.

### La distancia como corazón del modelo

En el algoritmo KNN, la noción de proximidad es fundamental. Cada vez que el modelo debe clasificar un nuevo caso, calcula la distancia entre ese punto y todos los demás ejemplos del conjunto de entrenamiento, y luego elige los k más cercanos para tomar una decisión.

Por eso, el concepto de distancia entre datos es el corazón del algoritmo. La forma en que medimos esa distancia influye directamente en el resultado. El tipo de distancia más común es la distancia euclidiana, que mide la separación "en línea recta" entre dos puntos en el espacio de variables. Si estamos trabajando con dos variables (x e y), la distancia euclidiana se parece a lo que usamos para medir en un plano cartesiano: la raíz cuadrada de la suma de los cuadrados de las diferencias.

Pero hay otros tipos de distancia que también pueden usarse, como la distancia de Manhattan (que mide la distancia como si solo pudiéramos movernos en ángulos rectos, como en una cuadrícula) o la distancia de Minkowski, que generaliza a ambas. En

**Visual:** Mano con lupa sobre una cuadrícula con puntos y rótulos pequeños; la imagen acompaña la idea de proximidad, pero no muestra una votación etiquetada de clases 0 y 1 ni distancias cuantificadas.

## Página 4

Scikit-learn, la distancia euclidiana es el valor por defecto, y suele funcionar bien en muchos casos prácticos.

Un punto clave es que todas las variables que se usan para calcular distancias deben estar en la misma escala, o al menos en escalas comparables. Si una variable está expresada en metros y otra en miles de pesos, una sola unidad de diferencia en una puede ser muchísimo más influyente que en la otra. Esto puede hacer que el modelo favorezca ciertas variables por encima de otras, no por su importancia real, sino por su escala numérica.

Por eso, antes de aplicar KNN, es indispensable escalar o normalizar las variables numéricas, para que todas tengan el mismo peso a la hora de calcular la distancia.

### Elegir el valor de k: precisión o estabilidad

Uno de los aspectos más importantes en el uso de KNN es decidir cuántos vecinos considerar. Ese número se representa con la letra k, y su elección puede cambiar por completo el comportamiento del modelo.

Si elegimos un valor muy bajo, como k = 1, el modelo se volverá muy sensible al ruido. Estará tomando decisiones en base a un único vecino, lo cual puede llevar a errores si ese vecino en particular es atípico o está mal clasificado. Es como decidir a qué equipo apoyar basándose en la camiseta de la primera persona que vemos: rápido, pero poco confiable.

Por otro lado, si usamos un valor muy alto, como k = 50, el modelo ganará en estabilidad, pero perderá capacidad de captar patrones locales. Puede terminar clasificando de forma incorrecta puntos que están claramente rodeados por una clase, solo porque en conjunto hay más vecinos de la otra. Es decir, demasiado consenso puede llevar a decisiones imprecisas, especialmente si las clases están desbalanceadas.

En general, valores bajos de k tienden a generar modelos más ajustados al conjunto de entrenamiento (con riesgo de sobreajuste), mientras que valores altos favorecen la generalización, pero pueden provocar subajuste si se ignoran patrones locales relevantes.

**Visual:** Dos ilustraciones esquemáticas: personas ante un tablero oscuro con mapas y gráficos, y una persona ante una computadora con engranajes y líneas. Ninguna muestra puntos clasificados para k = 1 o k = 50.

## Página 5

Una buena práctica es probar varios valores de k y evaluar el rendimiento del modelo con cada uno usando técnicas como validación cruzada o, en nuestro caso, comparando las métricas sobre el conjunto de prueba. En muchos casos, valores entre 3 y 15 suelen dar buenos resultados, pero no existe un valor universal: todo depende del problema y de los datos.

### ¿Por qué escalar los datos antes de usar KNN?

El algoritmo KNN basa todas sus decisiones en distancias numéricas entre puntos, por lo tanto, la escala de las variables tiene un impacto directo en la clasificación.

Imaginemos que estamos clasificando pasajeros del Titanic utilizando dos variables: `Age` (edad, en años) y `Fare` (tarifa pagada, en pesos). Una diferencia de 10 años en edad no tiene el mismo impacto que una diferencia de 300 en el valor de la tarifa. Si no escalamos las variables, KNN va a priorizar automáticamente la que tenga valores más grandes, porque esas diferencias pesan más en el cálculo de la distancia total, aunque no necesariamente sean más relevantes.

Esto genera un sesgo artificial: el modelo no está tomando decisiones en base a lo que importa, sino en base a lo que “mide más”.

Para evitar esto, es necesario llevar todas las variables a una misma escala. Hay varias formas de hacerlo:

- Normalización (`MinMaxScaler`): transforma todos los valores a un rango entre 0 y 1.
- Estandarización (`StandardScaler`): transforma los datos para que tengan media 0 y desviación estándar 1.

Ambos métodos son válidos, y la elección entre uno y otro depende del problema. En KNN, lo importante es que todas las variables estén en escalas comparables, no cuál técnica se use.

En resumen: antes de aplicar KNN, escalar los datos no es una opción, es una necesidad.

**Visual:** Dos personas ilustradas frente a gráficos de líneas, barras, anillos y triángulos. No se muestran valores de `Age` y `Fare` normalizados ni datos reales del Titanic.

## Página 6

### Ventajas y limitaciones del algoritmo KNN

El algoritmo KNN tiene una gran virtud: su simplicidad. No necesita entrenamiento, no construye fórmulas complejas ni ajusta parámetros internos. Simplemente observa los datos y toma decisiones en base a ellos, clasificando cada nuevo punto según las etiquetas de los ejemplos más cercanos. Esta característica lo convierte en un modelo accesible, transparente y muchas veces sorprendentemente eficaz.

Otra ventaja importante es su flexibilidad. KNN puede adaptarse bien a relaciones no lineales entre variables, y a patrones complejos que modelos más rígidos no podrían capturar. También se comporta bien en datasets pequeños o moderados, donde la cantidad de observaciones no genera una sobrecarga computacional.

Sin embargo, KNN también tiene sus límites. Al no entrenar un modelo, delega todo el esfuerzo al momento de la predicción, lo que lo hace lento y costoso computacionalmente cuando el conjunto de datos es grande. Clasificar un solo caso requiere calcular la distancia contra todos los demás, y eso puede escalar rápidamente en tiempo y recursos.

Además, es muy sensible al ruido y a los valores atípicos, especialmente cuando k es bajo. Un único caso mal etiquetado puede arrastrar decisiones incorrectas. También sufre en datasets con muchas dimensiones (muchas columnas numéricas), ya que la noción de distancia pierde efectividad cuando hay muchas variables irrelevantes o redundantes.

Por eso, aunque KNN puede ser una muy buena primera aproximación, rara vez es la solución final. Se lo valora como una herramienta de referencia, comparación o visualización, o en problemas específicos donde su lógica simple y directa aporta claridad y eficacia.

**Visual:** Persona preocupada ante un monitor con símbolo de error; ilustración de las limitaciones, no captura de una excepción ni medición de tiempo de ejecución.

## Página 7

### Reflexión final

En esta clase incorporamos una nueva forma de pensar la clasificación: no como una fórmula matemática, ni como una estimación de probabilidad, sino como una decisión basada en similitudes. El algoritmo de los k vecinos más cercanos (KNN) nos invita a detenernos en los datos, a mirarlos de cerca, y a confiar en que los casos parecidos suelen compartir la misma clase.

Aprendimos que esta lógica simple puede ser muy poderosa, pero también delicada. Que un valor de k muy bajo puede volver al modelo impulsivo, mientras que uno muy alto puede volverlo indiferente. Que sin escalar las variables, el modelo puede tomar decisiones arbitrarias. Y que, en problemas con muchas dimensiones o con ruido, KNN puede perder efectividad.

Sin embargo, también vimos que su transparencia, su capacidad para capturar relaciones no lineales, y su aplicabilidad en conjuntos pequeños o moderados, lo convierten en una herramienta valiosa, tanto para construir modelos como para entender mejor los datos.

A partir de ahora, el desafío será seguir ampliando nuestro repertorio: incorporar algoritmos que no solo observen, sino que también aprendan reglas. En la próxima clase lo haremos con los árboles de decisión, una técnica que transforma decisiones en estructuras lógicas, fáciles de visualizar e interpretar.

Seguimos avanzando, con más herramientas y más criterio para decidir cuándo usarlas.

### Materiales y recursos adicionales:

Aquí tienes una selección de recursos adicionales al contenido de la clase, que pueden ser útiles para profundizar en el tema:

- **Clasificar con K-Nearest-Neighbor: ejemplo en Python.** Un tutorial paso a paso que explica [cómo implementar KNN utilizando Scikit-learn](https://www.aprendemachinelearning.com/clasificar-con-k-nearest-neighbor-ejemplo-en-python/), incluyendo la preparación de datos, escalado y evaluación del modelo.
- **Algoritmo KNN: cómo funciona y ejemplos en Python.** Este artículo ofrece una [explicación detallada del funcionamiento del algoritmo KNN](https://www.themachinelearners.com/algoritmo-knn/), junto con ejemplos prácticos en Python.
- **Guía completa de K-Nearest Neighbors (con ejemplos de código en Python):** Un documento PDF que proporciona una [guía exhaustiva sobre KNN, incluyendo teoría y ejemplos de código](https://antonio-richaud.com/biblioteca/archivo/Guia-de-KNN/Guia-KNN-Antonio-Richaud.pdf).
- **KNN ALGORITMO en Español (K VECINOS MÁS CERCANOS) de CLASIFICACIÓN SUPERVISADA:** Un video explicativo sobre el [algoritmo KNN, su funcionamiento y aplicación](https://www.youtube.com/watch?v=XN6fChNqfbs) en problemas de clasificación.
- **K-Vecinos Más Cercanos (KNN) para Clasificación con Python:** Tutorial en video que muestra [cómo implementar KNN en Python utilizando Scikit-learn](https://www.youtube.com/watch?v=eOhTuHAU5Uk).

Estos recursos te permitirán profundizar en el algoritmo de los K vecinos más cercanos (KNN).

## Página 8

### Preguntas para reflexionar:

1. ¿En qué se diferencia el razonamiento que hace KNN del que realiza un modelo como la regresión logística? ¿Cuál te parece más “intuitivo” y por qué?
2. ¿Qué consecuencias podría tener elegir un valor de k demasiado bajo o demasiado alto en un problema real?
3. ¿Por qué es tan importante escalar las variables antes de aplicar KNN? ¿Qué podría pasar si no lo hacemos?
4. En un problema sensible como el diagnóstico médico, ¿creés que KNN sería una buena opción? ¿Qué limitaciones o ventajas podría tener en ese contexto?

### Una nueva mirada: clasificar por cercanía

Después de comparar los resultados del modelo de regresión logística, Silvia propuso que el equipo de Talento Lab probara un enfoque diferente. “Esta vez no vamos a entrenar una fórmula ni a estimar una probabilidad. Vamos a observar cómo se comportan los datos alrededor de cada caso”, explicó, mientras escribía “KNN” en la pizarra virtual.

Sabrina, curiosa, preguntó: “¿Vamos a tomar decisiones mirando a los vecinos?”. Luis, que ya había leído sobre el tema, asintió: “Exacto. Clasificamos a cada nuevo pasajero según lo que hicieron los más parecidos a él”. Matías, un poco escéptico, comentó que le parecía demasiado simple. Pero Silvia insistió: “Justamente por eso lo vamos a probar. A veces, mirar bien a los datos dice más que cualquier modelo matemático”.

El equipo decidió utilizar el mismo dataset del Titanic, pero esta vez ajustar el modelo según la cantidad de vecinos considerados y compararlo con lo visto en la clase anterior. El objetivo era no solo mejorar la predicción, sino también descubrir cuándo y por qué el nuevo modelo acertaba o se equivocaba.

**Visual:** Logotipo «Talento Lab» junto al relato; no hay una gráfica de comparación de modelos en esta página.

## Página 9

### Consignas de la pre-entrega:

#### Pipeline completo

Luis — Especialista en Business Intelligence.

Como Data Scientist en Talento Tech, llegaste al hito clave del proyecto. El cliente ya no busca solo "datos limpios"; necesita ver un Modelo Baseline funcional. Tu objetivo es entregar un Jupyter Notebook que recorra todo el ciclo de vida: desde la ingesta del dato crudo hasta la evaluación de métricas de negocio, pasando por una limpieza rigurosa.

**Objetivo:** Entrenar y evaluar un modelo predictivo con Regresión o Clasificación, justificando cada decisión técnica.

#### Organización y entregable

- Formato: Jupyter Notebook (.ipynb) o Google Colab.
- Estilo: El código debe estar ordenado y comentado. Usá celdas de texto (Markdown) para explicar tu razonamiento. No entregues solo código mudo.
- Anexo: Al final del notebook, incluí obligatoriamente el link a la fuente del dataset y referencias usadas.

#### Requerimientos:

- Selección del dataset: indicar origen, breve descripción del problema que aborda y justificación de su elección.
- Análisis exploratorio inicial (EDA): distribución de variables, detección de valores faltantes, análisis de correlaciones, visualizaciones básicas.
- Limpieza de datos: tratamiento de valores nulos, duplicados, outliers (si corresponde).
- Transformaciones básicas: codificación de variables categóricas, escalado de variables numéricas, creación o eliminación de variables (si fuera necesario).
- Selección de variables relevantes para el modelo.
- División del dataset en conjuntos de entrenamiento y prueba.

Se recomienda utilizar datasets moderados en tamaño y complejidad, preferentemente tabulares, para enfocarse en aplicar correctamente las etapas del proceso más que en resolver problemas técnicos complejos.

**Visual:** Retrato ilustrado de Luis junto a su nombre y función; no se incluye ningún dataset de ejemplo ni enlace concreto para la fuente exigida en el anexo.

## Página 10

### Ejercicio práctico

Esta es tu tarea:

1. Utilizá el mismo dataset del Titanic que trabajaste en clases anteriores. Asegurate de seleccionar variables numéricas relevantes y de escalarlas correctamente antes de aplicar el modelo.
2. Entrená un modelo de clasificación usando `KNeighborsClassifier` de Scikit-learn. Probá al menos dos valores distintos de k (por ejemplo, 3 y 7).
3. Evaluá el rendimiento del modelo con las siguientes métricas: precisión, recall, F1-score y matriz de confusión. Usá `classification_report` y `confusion_matrix`.
4. Agregá una celda de texto donde compares los resultados con los obtenidos usando regresión logística. ¿Mejoró el rendimiento? ¿Qué diferencias observás en los errores?

Recordá que KNN es un modelo muy sensible al valor de k, a la escala de los datos y a la distribución de las clases. La clave está en observar con criterio cómo y por qué toma sus decisiones.

### Próximos pasos

En esta clase conocimos un enfoque distinto para la clasificación: un modelo que no se basa en fórmulas ni en estimaciones matemáticas, sino en mirar alrededor, identificar patrones de cercanía y tomar decisiones por mayoría. KNN nos mostró que, en muchos casos, los datos por sí solos ya contienen la lógica necesaria para clasificar con éxito.

También aprendimos que esa simplicidad tiene sus límites: KNN puede ser muy eficaz con datasets pequeños y variables bien comportadas, pero se vuelve lento, ineficiente o poco preciso cuando hay muchas dimensiones, ruido o falta de escala. Entender cómo elegir el valor de k, cómo tratar los datos y cómo evaluar sus decisiones fue parte del desafío.

En la próxima clase vamos a conocer los árboles de decisión, un modelo que organiza decisiones en forma de ramas lógicas. A diferencia de KNN, este algoritmo aprende reglas concretas a partir de los datos, generando modelos interpretables y visuales que pueden ser muy útiles para explicar decisiones complejas.

Seguimos ampliando nuestra caja de herramientas, y con cada nuevo modelo, sumamos criterio para elegir cuál aplicar en cada problema real.

## Página 11

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
