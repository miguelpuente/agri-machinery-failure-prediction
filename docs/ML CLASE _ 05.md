# Clase N° 5 | División y validación del dataset

**Fuente:** [ML CLASE _ 05.pdf](ML%20CLASE%20_%2005.pdf), páginas 1–11. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores repiten `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 5. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas, una con una tableta y otra con una computadora portátil, junto a un cubo turquesa.

## Página 2

### Clase N° 5 | División y validación del dataset

### Índice

- División del dataset: entrenamiento vs. prueba
- Overfitting y underfitting: el arte de no pasarse ni quedarse corto
  - ¿Cómo se detectan estos fenómenos?
  - ¿Cómo se previenen el underfitting y el overfitting?
- Introducción a la validación cruzada
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- ¿Y si el modelo aprendió de memoria?
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

En esta clase vamos a introducir herramientas fundamentales para entrenar y evaluar modelos de aprendizaje automático de manera confiable. Aprenderemos a dividir un conjunto de datos en entrenamiento y prueba, y a comprender por qué esta separación es necesaria para evitar errores de interpretación y sobreajuste. Además, presentaremos dos conceptos clave: overfitting y underfitting, que nos ayudarán a diagnosticar si un modelo está aprendiendo lo suficiente o demasiado. Finalmente, conoceremos el enfoque de la validación cruzada, una técnica poderosa que nos permitirá evaluar modelos de forma más robusta, especialmente cuando contamos con pocos datos. Al finalizar esta clase, cada persona será capaz de implementar estos procesos en un proyecto real, sentando las bases para entrenar sus primeros modelos a partir de la próxima clase.

## Página 3

### División del dataset: entrenamiento vs. prueba

Cuando entrenamos un modelo de Machine Learning, lo que estamos haciendo —en el fondo— es enseñarle a reconocer patrones. Pero para saber si realmente aprendió, necesitamos ponerlo a prueba con datos que no haya visto durante el entrenamiento.

Si usamos el mismo conjunto de datos tanto para entrenar como para evaluar el modelo, corremos el riesgo de engañarnos: el modelo puede parecer muy preciso simplemente porque ya “conocía” esos datos, no porque haya aprendido a generalizar. Esto es como evaluar a una persona con las mismas preguntas exactas que estudió: puede obtener un resultado perfecto, pero no sabemos si entendió el tema o solo memorizó.

Por eso, la práctica estándar en Machine Learning es dividir el dataset en al menos dos partes: un conjunto para entrenar el modelo, y otro para probar cómo se comporta frente a nuevos datos. Esta simple estrategia permite obtener una evaluación más honesta y prevenir uno de los errores más comunes en proyectos de ML: el sobreajuste (overfitting).

El conjunto de entrenamiento (o training set) es la porción del dataset que se utiliza para entrenar el modelo. En esta etapa, el algoritmo analiza los datos y ajusta sus parámetros internos para minimizar el error entre lo que predice y lo que realmente ocurre. Cuantos más datos tenga esta parte, mejor podrá el modelo identificar patrones complejos. Sin embargo, si usamos todo el dataset para entrenar, no podremos verificar si ese aprendizaje se generaliza a nuevos casos.

El conjunto de prueba (o test set) es la parte del dataset que queda reservada y se utiliza únicamente para evaluar el rendimiento del modelo una vez que ya fue entrenado. Este conjunto no debe usarse nunca durante el entrenamiento, porque su función es simular datos del “mundo real”, aquellos que el modelo encontrará cuando esté en producción. Si el modelo rinde bien sobre estos datos nuevos, es una buena señal de que aprendió de manera efectiva.

La división más común es 80/20, donde el 80% de los datos se usan para entrenamiento y el 20% restante para

**Visual:** Dos ilustraciones: una persona con elementos de análisis y gráficos circulares y de líneas; debajo, dos personas frente a gráficos de barras y líneas. Son dibujos esquemáticos, no resultados medidos de un modelo.

## Página 4

prueba. En algunos casos se usa 70/30 o incluso 90/10, dependiendo del tamaño del dataset y del problema.

Si el conjunto de datos es muy pequeño, hacer una sola división puede ser arriesgado. Más adelante, en esta misma clase, veremos una técnica más robusta llamada validación cruzada que permite aprovechar mejor la información disponible.

Si entrenamos y evaluamos un modelo con los mismos datos, los resultados pueden parecer excelentes, pero no reflejarán el verdadero rendimiento del modelo sobre datos nuevos. Esto puede llevar a tomar decisiones equivocadas basadas en un modelo que no generaliza, sino que repite lo que ya vio.

No hacer esta división es como construir un puente y ensayarlo solo con las condiciones del plano original: puede parecer perfecto, hasta que le toca el primer viento fuerte. Separar los datos permite testear la “resistencia real” del modelo.

### Overfitting y underfitting: el arte de no pasarse ni quedarse corto

El overfitting, o sobreajuste, ocurre cuando un modelo aprende demasiado bien los datos de entrenamiento. A simple vista, esto puede parecer algo positivo: el modelo logra predicciones casi perfectas sobre los datos con los que fue entrenado. Pero el problema es que ese rendimiento excepcional no se mantiene cuando el modelo se enfrenta a datos nuevos. ¿Por qué? Porque en lugar de aprender patrones generales, el modelo memorizó detalles específicos, incluidos errores, valores atípicos y ruido propio del conjunto de entrenamiento.

Un modelo sobreajustado se vuelve demasiado complejo, con demasiadas reglas o condiciones internas. Se adapta tan bien a los ejemplos conocidos que pierde capacidad para generalizar. Es como un estudiante que se aprendió de memoria cada pregunta del simulacro de examen, pero no entiende el tema: cuando le cambian el enunciado, no sabe qué hacer.

Detectar el sobreajuste es crucial, porque genera una falsa sensación de éxito. Si no lo controlamos, podríamos implementar modelos que funcionan bien en pruebas internas pero fallan al ser usados en situaciones reales.

**Visual:** Manos sosteniendo hojas con gráficos de líneas y de sectores y una calculadora ilustrada. No se muestra una curva real de sobreajuste.

## Página 5

El underfitting, o subajuste, es el caso opuesto. Aquí, el modelo no logra captar los patrones relevantes ni siquiera en los datos de entrenamiento. Suele ocurrir cuando el modelo es demasiado simple para la complejidad del problema, o cuando no se le da suficiente tiempo o información para aprender.

Un modelo subajustado comete errores sistemáticos: predice mal tanto en el entrenamiento como en la prueba. Es como un estudiante que solo entendió lo básico del tema y no puede resolver ejercicios, ni siquiera los más parecidos a los ejemplos de clase.

Este problema puede deberse a una elección inapropiada del algoritmo, a una mala representación de los datos (por ejemplo, no haber transformado bien las variables), o a un entrenamiento insuficiente.

#### ¿Cómo se detectan estos fenómenos?

Una forma sencilla de detectar overfitting y underfitting es comparar el rendimiento del modelo sobre el conjunto de entrenamiento y sobre el de prueba:

- Si el modelo tiene alta precisión en entrenamiento pero baja en prueba, probablemente esté sobreajustado.
- Si el modelo tiene baja precisión en ambos conjuntos, probablemente esté subajustado.
- Si el modelo rinde de forma razonablemente buena en ambos conjuntos, está logrando una generalización adecuada.

Esta comparación puede hacerse observando métricas numéricas (como precisión, error, etc.) o incluso mediante gráficos que muestran la evolución del rendimiento.

#### ¿Cómo se previenen el underfitting y el overfitting?

Prevenir el underfitting requiere, en general, dotar al modelo de mayor capacidad para aprender. Esto puede lograrse utilizando algoritmos más expresivos o complejos, seleccionando mejor las variables que se incluyen en el modelo o permitiéndole más tiempo y más datos durante el entrenamiento. En algunos casos, el problema no es el modelo en sí, sino que los datos han sido transformados de manera deficiente o que se ha eliminado información valiosa en el proceso de limpieza. Por eso, mejorar la representación de los datos, incorporar nuevas características relevantes o incluso entrenar por más iteraciones puede marcar una diferencia.

**Visual:** Persona frente a una pantalla ilustrada con una línea ascendente y paneles de interfaz; no hay datos numéricos de evaluación en la ilustración.

## Página 6

El overfitting, en cambio, plantea un desafío distinto. Aquí el problema no es que el modelo aprenda poco, sino que aprende demasiado: capta patrones reales pero también se queda con detalles irrelevantes, errores y ruido del conjunto de entrenamiento. Para evitarlo, una de las estrategias básicas es dividir correctamente los datos en conjuntos de entrenamiento y prueba, garantizando que el modelo sea evaluado con ejemplos que no ha visto. Otra práctica clave es la validación cruzada, una técnica que permite estimar el rendimiento del modelo de forma más robusta y confiable, evitando depender de una sola división de datos.

Además, existen técnicas específicas para limitar la complejidad de los modelos, como la regularización, que penaliza a aquellos modelos que intentan ajustarse demasiado a los datos. También es importante revisar el conjunto de variables utilizadas: reducir el ruido, eliminar columnas que no aportan valor y simplificar la estructura del modelo puede ayudar a lograr una mayor capacidad de generalización.

En definitiva, diseñar modelos efectivos en aprendizaje automático implica encontrar un equilibrio delicado entre dos extremos: evitar que el modelo sea demasiado simple como para capturar los patrones del problema, pero también cuidarse de que no se vuelva tan específico que pierda capacidad de adaptación. Ese punto medio —donde el modelo aprende lo suficiente para generalizar, pero sin sobreajustarse— es uno de los objetivos más importantes y desafiantes de esta disciplina.

### Introducción a la validación cruzada

Hasta ahora, vimos que una forma común de evaluar un modelo consiste en dividir el conjunto de datos en dos partes: una para entrenar el modelo, y otra para probarlo. Esta estrategia, conocida como train/test split, funciona bien en muchos casos, pero tiene una limitación importante: la evaluación del modelo depende exclusivamente de cómo se haya hecho esa división.

Imaginemos que dividimos los datos de forma aleatoria y, por azar, el conjunto de prueba queda compuesto por casos muy fáciles o muy difíciles. En ese caso, la evaluación del modelo podría ser engañosa: parecer mejor o peor de lo que realmente es. Además, si el conjunto de datos es pequeño, perder una parte de los datos para prueba puede dejar muy poca información disponible para entrenar.

Para resolver este problema existe una técnica conocida como validación cruzada. A diferencia de la división simple en entrenamiento y prueba, la validación cruzada evalúa el modelo varias veces, utilizando diferentes particiones del conjunto de datos. La idea es sencilla: se divide el dataset en varios fragmentos o “pliegues” (generalmente cinco o diez), y se entrena el modelo varias veces, cada vez dejando uno de esos pliegues como prueba y usando los demás para entrenamiento. Así, cada parte del dataset cumple el rol de “prueba” al menos una vez.

**Visual:** Mano con lupa sobre un tablero de cuadrícula con puntos y pequeñas etiquetas; es un recurso gráfico alusivo al análisis, no una representación etiquetada de pliegues K-Fold.

## Página 7

Este proceso se conoce como K-Fold Cross Validation. La letra K indica en cuántas partes se divide el conjunto de datos. Por ejemplo, en una validación cruzada de 5 pliegues, se entrenan 5 modelos distintos, cada uno evaluado con un segmento distinto del dataset. Finalmente, se calcula el rendimiento promedio de todas esas evaluaciones, lo que nos da una medida mucho más confiable de la verdadera capacidad del modelo para generalizar.

Una de las grandes ventajas de la validación cruzada es que permite usar todo el dataset, tanto para entrenamiento como para prueba, pero de manera controlada y sin sobreajustar. Es una técnica especialmente útil cuando se cuenta con pocos datos, cuando se están comparando diferentes modelos, o cuando se desea tener una estimación más estable del rendimiento del algoritmo.

Con esta explicación estamos dando nuestros primeros pasos en la comprensión de la validación cruzada. A medida que avancemos en el curso, comenzaremos a implementarla con modelos reales utilizando herramientas de la librería scikit-learn. Comprender esta técnica no solo mejora nuestras evaluaciones técnicas, sino que también nos obliga a pensar con más rigor sobre cómo medimos el éxito de un modelo.

### Reflexión final

A medida que nos acercamos al momento de entrenar nuestros primeros modelos, es fundamental entender que el aprendizaje automático no consiste solamente en aplicar un algoritmo y observar los resultados. Gran parte del trabajo está en evaluar correctamente cómo y cuánto está aprendiendo ese modelo. Y para eso, necesitamos diseñar procesos que nos permitan medir su rendimiento de forma confiable.

En esta clase aprendimos que dividir los datos no es una cuestión secundaria, sino una práctica esencial para evitar errores comunes como el sobreajuste. También vimos que un modelo puede fallar por ser demasiado simple o demasiado complejo, y que la clave está en encontrar un punto de equilibrio. Finalmente, exploramos la validación cruzada como una estrategia más robusta para evaluar modelos, especialmente útil cuando no queremos depender de una sola partición de los datos.

Con estos conceptos incorporados, estamos listos para avanzar hacia la próxima etapa del curso: el entrenamiento de modelos reales. Pero lo haremos con una mirada más atenta, sabiendo que un buen modelo no es solo el que aprende, sino el que generaliza. Y generalizar, en definitiva, es lo que nos permite llevar nuestras soluciones del laboratorio al mundo real.

## Página 8

### Materiales y recursos adicionales:

- **División del conjunto de datos original.** Este artículo del curso de aprendizaje automático de Google [explica cómo dividir un conjunto de datos en conjuntos de entrenamiento, validación y prueba](https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets?hl=es-419), y la importancia de cada uno en el proceso de modelado.
- **Validación cruzada.** Artículo de Amazon Machine Learning que [describe la técnica de validación cruzada, su propósito y cómo implementarla](https://docs.aws.amazon.com/es_es/machine-learning/latest/dg/cross-validation.html) para evaluar modelos de aprendizaje automático.
- **Conjuntos de datos de entrenamiento, validación y prueba.** En este artículo se describen las [opciones para configurar los datos de entrenamiento y las divisiones de datos de validación](https://learn.microsoft.com/es-es/azure/machine-learning/how-to-configure-cross-validation-data-splits?view=azureml-api-1) junto con la configuración de validación cruzada para los experimentos de aprendizaje automático automatizado (ML automatizado).
- **Cross-Validation: definición e importancia en Machine Learning.** Este artículo explica [qué es la validación cruzada](https://learn.microsoft.com/es-es/dotnet/machine-learning/how-to-guides/train-machine-learning-model-cross-validation-ml-net), su importancia en la evaluación de modelos predictivos y las técnicas más utilizadas.

### Preguntas para reflexionar:

1. ¿Qué consecuencias puede tener entrenar y evaluar un modelo con los mismos datos? ¿Por qué esta práctica puede llevar a una falsa sensación de rendimiento?
2. En tus propias palabras, ¿cómo podrías explicar la diferencia entre overfitting y underfitting? ¿Qué señales te permitirían detectar cada uno?
3. ¿Qué ventajas tiene la validación cruzada respecto a una simple división entre entrenamiento y prueba? ¿En qué situaciones considerás que su uso es especialmente recomendable?
4. ¿Qué desafíos prácticos podrían surgir al implementar una validación cruzada en un proyecto real? ¿Cómo te asegurarías de interpretarla correctamente?

## Página 9

### ¿Y si el modelo aprendió de memoria?

El modelo que había impresionado al equipo de Talento Lab resultó ser una advertencia más que un logro. Lo que parecía un éxito —una precisión de más del 98%— fue en realidad una ilusión: el modelo había aprendido demasiado bien... los datos que ya conocía.

Tras el llamado de atención de Silvia, la consigna fue clara: no basta con entrenar un modelo, hay que saber evaluarlo de manera rigurosa y honesta. Cada integrante del equipo asumió un nuevo compromiso: documentar cuidadosamente el proceso de división de datos, identificar posibles señales de sobreajuste o subajuste, y aplicar técnicas de validación más robustas para asegurarse de que el modelo esté aprendiendo a generalizar, no a repetir.

Ahora es tu turno de contribuir. Para completar esta etapa, deberás aplicar todo lo aprendido en esta clase y reflexionar sobre cómo tus decisiones afectan el comportamiento del modelo.

### Ejercicio práctico

1. Cargá el [dataset del Titanic (este mismo que venís utilizando en clases anteriores)](https://drive.google.com/file/d/1PD0A9xtChEvgEtL4uEkwiJZ4KGaQSk5h/view?usp=drive_link) y preparalo para el modelado, asegurándote de tratar los valores faltantes y seleccionar las variables que usarás como entrada y salida.
2. Dividí el dataset en conjuntos de entrenamiento y prueba. Probá al menos dos proporciones distintas (por ejemplo, 80/20 y 70/30) usando `train_test_split` de scikit-learn.
3. Entrená un modelo de clasificación simple, como una regresión logística, sobre cada partición, y medí su desempeño en ambos conjuntos (entrenamiento y prueba). Documentá los resultados.
4. Reflexioná sobre lo observado: ¿El modelo se desempeñó mejor con una proporción que con otra? ¿Detectás señales de overfitting o underfitting?
5. Aplicá validación cruzada (5-fold) sobre el mismo modelo. Compará el rendimiento promedio obtenido con esta técnica respecto de las divisiones simples. ¿Qué diferencias encontrás? ¿Cuál te parece más confiable?

Todo tu trabajo debe estar documentado en un cuaderno Jupyter (Google Colab), incluyendo tanto el código como los comentarios explicativos en celdas de texto. Recordá: lo importante no es solo el resultado del modelo, sino el proceso que seguís para evaluarlo correctamente —como haría cualquier profesional de Talento Lab frente a un cliente real.

**Visual:** Logotipo «Talento Lab» junto a la narración; no se presenta una tabla de resultados ni una salida de código.

## Página 10

### Próximos pasos

Con esta clase dejamos atrás una etapa muy importante: la preparación de los datos. A partir de ahora, vamos a comenzar a construir y entrenar nuestros primeros modelos de aprendizaje automático.

En la próxima clase vamos a explorar el primer algoritmo que trabajaremos en profundidad: la Regresión Lineal. Vamos a ver cómo funciona, en qué tipo de problemas se aplica y cómo se entrena paso a paso. Además, aprenderemos a evaluar su desempeño utilizando distintas métricas, como MAE, MSE, RMSE y R².

Entramos en una etapa más experimental del curso, en la que no solo vamos a aplicar lo que venimos aprendiendo, sino que también empezaremos a comparar modelos, interpretar resultados y tomar decisiones basadas en datos. El trabajo realizado hasta ahora, incluyendo la correcta división del dataset y la validación cruzada, será la base sobre la que construiremos modelos más sólidos y confiables.

## Página 11

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
