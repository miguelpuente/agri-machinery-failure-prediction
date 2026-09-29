# Clase N° 12 | Creación de pipelines

**Fuente:** [ML CLASE _ 12.pdf](ML%20CLASE%20_%2012.pdf), páginas 1–11. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 12. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con franja amarilla «Clase 12»; dos personas ilustradas con auriculares utilizan una tableta y una computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 12 | Creación de pipelines

### Índice

- ¿Qué es un pipeline y por qué lo necesitamos?
  - ¿Cómo se construye un pipeline?
- Automatización del flujo completo
- Introducción a GridSearchCV para optimización
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:

### Objetivos de la clase:

En esta clase vamos a dar un paso fundamental hacia la organización y profesionalización de nuestros modelos. Hasta ahora, pre procesamos datos, entrenamos algoritmos y evaluamos su rendimiento, pero realizamos cada paso por separado. Nuestro objetivo ahora será integrar todo ese flujo de trabajo en un único bloque reproducible y automatizado, utilizando la herramienta `Pipeline` de scikit-learn.

Aprenderemos a construir pipelines que encadenan múltiples etapas, como la transformación de datos y el entrenamiento de modelos, asegurando consistencia y evitando errores comunes. También introduciremos el uso de `GridSearchCV`, una técnica que nos permite probar múltiples combinaciones de hiperparámetros de forma automática para encontrar la mejor configuración posible.

Todo esto nos permitirá consolidar nuestras habilidades como personas que trabajan con modelos de aprendizaje automático, reduciendo errores, ganando eficiencia y preparando nuestras soluciones para el mundo real.

## Página 3

### ¿Qué es un pipeline y por qué lo necesitamos?

En ciencia de datos, muchas veces repetimos la misma secuencia de pasos: limpiamos los datos, los transformamos (por ejemplo, con escalado), entrenamos un modelo, hacemos predicciones, evaluamos los resultados… y volvemos a empezar con otro modelo o configuración. Cada uno de esos pasos requiere cuidado: si aplicamos una transformación en el conjunto de entrenamiento y nos olvidamos de aplicarla igual en el conjunto de prueba, el modelo puede fallar o darnos resultados engañosos.

Un pipeline es una herramienta que nos permite encadenar todas las etapas del flujo de trabajo en un solo objeto, de forma ordenada, transparente y reutilizable. Es como armar una “línea de producción” para nuestros modelos, donde cada paso ocurre siempre en el mismo orden, sin saltos ni repeticiones innecesarias.

**Visual:** Diagrama «Valid Pipeline» con una marca verde: dentro de un recuadro punteado, «Imputation» → … → «Feature Encoding» → «Regressor or Classifier». Ilustra que la imputación y codificación preceden al estimador final; no incluye código ni datos.

Podemos pensarlo como una cinta transportadora en una fábrica: los datos entran por un extremo, pasan por cada estación de procesamiento (normalización, imputación, codificación, etc.) y al final del recorrido salen las predicciones del modelo. Esta estructura garantiza que todo el proceso sea coherente, automatizado y, sobre todo, fácil de reutilizar o compartir con otras personas.

Supongamos que tenemos un modelo que funciona bien. Si queremos probarlo con otro dataset o volver a aplicarlo más adelante, no queremos tener que reescribir cada paso o correr el riesgo de olvidarnos algo. Con un pipeline, podemos guardar todo el flujo y aplicarlo de nuevo, cambiando solo lo necesario.

Además, los pipelines son compatibles con herramientas de validación cruzada y búsqueda de hiperparámetros, lo que nos permite evaluar el rendimiento del modelo de forma realista y ajustar sus parámetros sin romper la cadena de procesamiento.Nos permiten trabajar con mayor limpieza, menor margen de error y mayor capacidad de reproducción.

## Página 4

### ¿Cómo se construye un pipeline?

Una vez que entendemos la idea general de lo que es un pipeline, el siguiente paso es conocer cómo se construye uno en la práctica. En Python, y más específicamente en la biblioteca scikit-learn, los pipelines se construyen a partir de una clase llamada `Pipeline`, que nos permite encadenar pasos consecutivos que se ejecutarán en orden cuando se entrene o se utilice un modelo.

Cada uno de esos pasos puede ser:

- Una transformación (por ejemplo, escalar variables, completar valores faltantes o codificar variables categóricas), o
- Un estimador final, como un modelo de regresión logística, un árbol de decisión o cualquier otro algoritmo de clasificación o regresión.

Lo interesante es que un pipeline no distingue entre transformaciones “manuales” y modelos entrenables: todos se integran en una secuencia con reglas claras. De esta forma, evitamos errores como transformar sólo el conjunto de entrenamiento pero no el de prueba, o aplicar diferentes escalados sin querer.

**Visual:** Esquema «Invalid Pipeline» marcado con una cruz roja: «Feature Encoding» → … → «Regressor or Classifier» → «Imputation». El aviso en inglés dice «The estimator object must not be an intermediate step»; muestra que el estimador aparece antes de la imputación, en lugar de quedar al final.

Un pipeline en scikit-learn se construye como una lista de pasos, donde cada paso tiene un nombre (por ejemplo "escalador" o "modelo") y una función asociada (como `StandardScaler()` o `LogisticRegression()`). Al entrenar el pipeline, todas las transformaciones se ajustan en orden y, por último, se entrena el modelo. Al hacer predicciones, los datos pasan por el mismo flujo antes de llegar al estimador final.

Además, podemos utilizar pipelines para encapsular modelos complejos, incluyendo varios pasos de preprocesamiento. Esto no solo reduce el riesgo de errores, sino que también hace que el código sea más ordenado, reutilizable y fácil de compartir.

En pocas palabras, un pipeline nos permite concentrarnos en el análisis y en la toma de decisiones, delegando en una estructura sólida la ejecución de tareas repetitivas y críticas para el buen funcionamiento del modelo.

## Página 5

### Automatización del flujo completo

A medida que trabajamos con conjuntos de datos más complejos o proyectos más grandes, se vuelve fundamental contar con una forma estructurada y repetible de procesar los datos y entrenar modelos. Aquí es donde los pipelines muestran todo su potencial: no solo sirven para unir pasos aislados, sino que permiten automatizar el flujo completo de trabajo en un modelo de machine learning.

Un pipeline bien diseñado se encarga de realizar, de manera consistente, todos los pasos que antes hacíamos manualmente: desde la transformación de los datos hasta el ajuste y la validación del modelo. Esto no solo reduce errores, sino que también mejora la eficiencia y la trazabilidad del proceso.

Por ejemplo, supongamos que queremos aplicar el mismo modelo a distintos conjuntos de datos. Si hicimos todo “a mano”, corremos el riesgo de olvidarnos un paso o de aplicar una transformación con parámetros diferentes. Pero si encapsulamos el proceso en un pipeline, podemos reutilizarlo en distintos contextos sin modificar su lógica interna. Basta con cambiar el conjunto de datos y volver a ejecutarlo.

Además, automatizar el flujo nos permite integrar el pipeline con otras herramientas de scikit-learn, como la validación cruzada (`cross_val_score`) o la búsqueda de hiperparámetros (`GridSearchCV`), que veremos más adelante. De esta manera, no solo entrenamos el modelo una vez, sino que podemos probar múltiples configuraciones sin tener que reescribir pasos intermedios.

Otro beneficio importante es que, al automatizar, reducimos el riesgo de fugas de información (data leakage), una de las fallas más comunes en proyectos reales. Un pipeline se asegura de que todo el procesamiento se realice en el orden correcto, sin que el conjunto de prueba “vea” datos del conjunto de entrenamiento.

Automatizar el flujo completo usando pipelines no es solo una comodidad: es una mejora en la calidad, reproducibilidad y escalabilidad de nuestros modelos. Es el paso natural para cualquier persona que quiera aplicar machine learning con solidez y rigor profesional.

**Visual:** Dos ilustraciones editoriales: personas con cascos trabajando ante una red de tuberías y válvulas, y una persona con portátil frente a engranajes, un esquema de nodos y una línea de puntos. Representan organización y automatización; no son capturas de un pipeline ejecutado.

## Página 6

### Introducción a GridSearchCV para optimización

Hasta ahora, cada vez que entrenamos un modelo, tuvimos que tomar decisiones sobre ciertos parámetros que afectan su comportamiento. Por ejemplo, el valor de `C` en una regresión logística, la profundidad máxima de un árbol de decisión (`max_depth`), o la cantidad de vecinos en KNN (`n_neighbors`). Estos parámetros se llaman hiperparámetros, y elegirlos correctamente puede marcar una gran diferencia en el rendimiento del modelo.

Una forma ingenua de encontrar la mejor combinación sería probar muchas configuraciones a mano y quedarnos con la que da mejores resultados. Pero este proceso es lento, propenso a errores y difícil de repetir. Para resolver esto, scikit-learn ofrece una herramienta poderosa: `GridSearchCV`.

`GridSearchCV` es una estrategia de búsqueda sistemática y automatizada que evalúa todas las combinaciones posibles de los hiperparámetros que le indiquemos. El nombre proviene de la idea de una “rejilla” (grid) de parámetros: el usuario define qué valores quiere probar para cada hiperparámetro, y la herramienta se encarga de entrenar un modelo con cada combinación.

**Visual:** Comparación «Grid Search» frente a «Random Search»: el primero muestra puntos distribuidos regularmente en una malla, el segundo puntos repartidos de forma irregular; encima de ambos se dibuja una curva y varios puntos de muestreo. La imagen no proporciona puntuaciones concretas ni detalla parámetros de un modelo.

Pero `GridSearchCV` no se limita a probar combinaciones: también evalúa cada modelo con validación cruzada. Esto significa que cada combinación se prueba no una sola vez, sino varias, sobre diferentes particiones del conjunto de entrenamiento, para obtener una estimación más robusta del rendimiento. Al finalizar, la herramienta nos informa cuál fue la mejor configuración y nos entrega un modelo ya entrenado con esos parámetros óptimos.

Una gran ventaja es que `GridSearchCV` se integra perfectamente con pipelines. Esto significa que podemos ajustar los hiperparámetros del modelo sin romper la estructura del pipeline, e incluso podemos incluir en la búsqueda decisiones relacionadas con el preprocesamiento (por ejemplo, usar o no escalado, o probar distintos métodos de imputación).

## Página 7

`GridSearchCV` es la herramienta ideal para:

- Evaluar múltiples configuraciones sin escribir código repetitivo.
- Evitar el sesgo de seleccionar “a ojo” los hiperparámetros.
- Mejorar el rendimiento de los modelos de forma objetiva.
- Integrar ajuste fino y validación en un mismo flujo de trabajo.

Con esta técnica, damos un paso más hacia un uso más preciso, reproducible y profesional del aprendizaje automático.

### Reflexión final

En esta clase dimos un paso clave hacia la profesionalización de nuestro trabajo con modelos. Aprendimos que no basta con entrenar modelos que funcionen bien: también necesitamos que sean reproducibles, ordenados y fácilmente ajustables. Los pipelines nos permitieron automatizar tareas que antes hacíamos manualmente, y `GridSearchCV` nos dio una herramienta poderosa para encontrar configuraciones óptimas sin perder tiempo ni precisión.

A partir de ahora, cada nuevo modelo que construyamos podrá integrarse dentro de un flujo claro, reutilizable y más robusto frente a errores. Con esto, dejamos atrás el trabajo artesanal y entramos en el terreno de las buenas prácticas del machine learning moderno.

### Materiales y recursos adicionales:

Para profundizar en los conceptos abordados en esta clase y explorar más sobre la creación de pipelines y la optimización de modelos en scikit-learn, te recomendamos los siguientes recursos:

- **Documentación oficial de scikit-learn sobre pipelines:** Una guía detallada sobre [cómo construir y utilizar pipelines](https://scikit-learn.org/stable/modules/compose.html) para encadenar transformaciones y modelos.
- **Documentación oficial de scikit-learn sobre GridSearchCV:** Explicación: [cómo realizar búsquedas exhaustivas de hiperparámetros](https://scikit-learn.org/stable/modules/grid_search.html) utilizando validación cruzada.
- **Introducción a pipelines en scikit-learn:** Este video ofrece una explicación clara y práctica sobre [cómo construir y utilizar pipelines en scikit-learn](https://www.youtube.com/watch?v=VsdrHPJS1fI). Aprenderás a encadenar transformaciones y modelos de manera eficiente.
- **GridSearchCV para optimizar modelos de Machine Learning:** En este tutorial se explica [cómo utilizar GridSearchCV para optimizar los hiperparámetros de un modelo de Machine Learning en scikit-learn](https://www.youtube.com/watch?v=i9mlfvgzHgM). Es una guía paso a paso que te ayudará a mejorar el rendimiento de tus modelos.

## Página 8

### Preguntas para reflexionar:

1. ¿Qué ventajas ofrece el uso de pipelines frente a ejecutar cada paso del flujo de trabajo por separado? ¿Qué problemas comunes ayuda a evitar?
2. ¿Qué riesgos corremos si no automatizamos correctamente el flujo de preprocesamiento y modelado? Pensá en errores como el data leakage o la inconsistencia entre entrenamiento y prueba.
3. ¿En qué situaciones tiene sentido usar `GridSearchCV`? ¿Cuándo es preferible ajustarse a valores por defecto, y cuándo vale la pena explorar combinaciones de hiperparámetros?
4. ¿Qué impacto tiene la validación cruzada dentro de `GridSearchCV` en los resultados del modelo? ¿Por qué es importante evaluar el rendimiento sobre diferentes particiones del conjunto de entrenamiento?
5. ¿Qué aspectos de tu flujo de trabajo podrían beneficiarse si estructurás tus proyectos usando pipelines y automatización desde el comienzo?

### Talento Lab: Un patrón oculto

**Visual:** El encabezado de la historia aparece solo al pie, después de un gran espacio en blanco; el relato continúa en la página 9. No hay un gráfico o fotografía en esta página.

## Página 9

**Visual:** Logotipo «Talento Lab» de gran tamaño y dos retratos ilustrados pequeños junto a los parlamentos de Silvia y Sabrina; no hay métricas ni tablas de comparación de modelos.

Después de varias semanas de trabajo, el equipo de Talento Lab se enfrentaba a un nuevo desafío. Un cliente había solicitado una comparación entre varios modelos para predecir si una persona se suscribiría a un nuevo servicio digital, utilizando un conjunto de datos anónimo que ya incluía cientos de registros.

“Ya sabemos escalar, imputar, entrenar modelos y comparar resultados…”, comentó Matías, “pero tenemos que hacer todo eso con tres modelos distintos, con sus propias configuraciones, y sin cometer errores”.

Silvia tomó la palabra: “No podemos estar copiando y pegando bloques de código para cada uno. Necesitamos un flujo ordenado. Propongo usar pipelines para estandarizar el proceso y luego ajustarlos con `GridSearchCV`. Así, no solo comparamos modelos, sino que además buscamos la mejor versión de cada uno”.

Sabrina organizó cada pipeline: preprocesamiento + modelo. Luis definió los valores a probar para cada hiperparámetro. Y con un par de líneas, ejecutaron todo el procedimiento. Lo que antes llevaba horas, ahora estaba automatizado y documentado.

El informe final fue claro, replicable y convincente. El cliente eligió el modelo ganador con argumentos. Y el equipo de Talento Lab confirmó algo que ya intuía: cuando el trabajo se organiza bien, los resultados hablan por sí solos.

## Página 10

### Ejercicio práctico

Ahora te toca a vos aplicar lo aprendido. A partir de un conjunto de datos como el del Titanic o cualquier otro que elijas, construí un flujo completo de trabajo utilizando un pipeline.

1. Elegí un modelo supervisado que ya conozcas (por ejemplo, regresión logística, árbol de decisión o random forest).
2. Construí un pipeline que incluya al menos:
   a. una transformación (como escalado o imputación),
   b. y el modelo elegido.
3. Evaluá el pipeline con validación cruzada usando `cross_val_score`.
4. Luego usá `GridSearchCV` para probar distintas combinaciones de hiperparámetros (por ejemplo, distintos valores de `C`, `max_depth`, `n_estimators`, etc.).
5. Informá:
   a. la mejor combinación de hiperparámetros encontrada,
   b. y la puntuación promedio obtenida en validación cruzada.
6. Reflexioná: ¿El modelo con parámetros óptimos mejoró respecto al original? ¿Qué aprendiste del proceso?

### Próximos pasos

Con esta clase finalizamos el desarrollo de herramientas para automatizar y optimizar nuestros flujos de trabajo en machine learning. A partir de aquí, nos enfocaremos en evaluar modelos de forma comparativa y estratégica, utilizando todo lo aprendido para seleccionar la mejor alternativa según los datos disponibles y los objetivos del análisis. En la próxima clase, realizaremos una comparación sistemática de distintos modelos, aplicando métricas y técnicas que ya conocemos para justificar decisiones. Luego, más adelante encararemos la construcción completa de un modelo de aprendizaje automático, desde los datos crudos hasta la entrega final.

## Página 11

**Visual:** Contraportada azul oscuro con red de líneas geométricas y marcas «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad». No hay contenido docente adicional.
