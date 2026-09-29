# Clase N° 7 | Regresión logística

**Fuente:** [ML CLASE _ 07.pdf](ML%20CLASE%20_%2007.pdf), páginas 1–13. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores repiten `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech. Se reproducen las denominaciones de métricas tal como aparecen en la fuente, sin corregirlas silenciosamente.

## Página 1

«Talento Tech» — Machine Learning — Clase 7. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas usando una tableta y una computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 7 | Regresión logística

### Índice

- ¿Qué es un problema de clasificación?
- La regresión logística como herramienta para clasificar decisiones binarias
- Diferencias entre regresión lineal y regresión logística
  - Ejemplos concretos
- Métricas para evaluar modelos de clasificación
  - Precisión (accuracy): cuántas veces acierta el modelo en total
  - Recall (sensibilidad): qué tan bien detecta los casos positivos
  - F1-score: el equilibrio entre precisión y sensibilidad
  - Matriz de confusión: ver en detalle cómo se equivoca el modelo
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Tomando decisiones en Talento Lab
- Ejercicio práctico

### Objetivos de la clase:

En esta clase nos introduciremos en el mundo de la clasificación binaria, utilizando como punto de partida la regresión logística. Aprenderemos a identificar cuándo un problema requiere predecir una categoría en lugar de un valor numérico, y entenderemos cómo la regresión logística, a pesar de su nombre, permite estimar la probabilidad de que un caso pertenezca a una clase u otra.

Exploraremos cómo se entrena este tipo de modelo, qué salida produce, y cómo se traduce esa salida probabilística en una decisión. Además, nos detendremos en el análisis de métricas específicas para problemas de clasificación, como la precisión, el recall, el F1-score y la matriz de confusión, entendiendo qué nos dice cada una y en qué situaciones conviene priorizarla.

Al finalizar la clase, cada estudiante será capaz de entrenar un modelo de regresión logística para resolver un problema de clasificación binaria, evaluar su rendimiento con las métricas adecuadas y reflexionar sobre la calidad de sus decisiones predictivas.

## Página 3

### ¿Qué es un problema de clasificación?

En el aprendizaje automático, un problema de clasificación se presenta cuando el objetivo no es predecir un número, sino determinar a qué categoría pertenece un caso. En lugar de obtener una salida como “42,3” o “156.000”, lo que buscamos es una etiqueta como “sí” o “no”, “positivo” o “negativo”, “apto” o “no apto”.

En este tipo de problemas, la variable objetivo es categórica, y el modelo intenta predecir una de las clases posibles a partir de un conjunto de variables predictoras. Dentro de la clasificación, existe un caso particular —y muy común— llamado clasificación binaria, en el que solo hay dos clases posibles. Esto es precisamente lo que abordaremos en esta clase con la regresión logística.

Los problemas de clasificación están por todas partes. Por ejemplo, en el ámbito de la salud, uno de los desafíos más estudiados en Machine Learning es predecir si un paciente tiene una determinada enfermedad en base a sus análisis clínicos. En ese caso, las clases podrían ser “sano” y “no sano”.

Otro caso frecuente aparece en la detección de spam: los algoritmos analizan el contenido de un correo electrónico y deciden si pertenece a la clase “spam” o “correo legítimo”. En ambos casos, el modelo no estima una cantidad, sino que toma una decisión sobre la pertenencia a un grupo.

Un problema de clasificación no siempre tiene solo dos clases. A veces existen múltiples categorías posibles (por ejemplo, predecir el género de una película: acción, drama, comedia, etc.), y en esos casos hablamos de clasificación multiclase. Pero en esta etapa del curso vamos a enfocarnos en el caso más simple: dos clases, lo que nos permitirá entender los conceptos esenciales antes de avanzar hacia modelos más complejos.

**Visual:** Persona sentada rodeada de formas geométricas de diferentes tipos y fichas con esas formas; ilustración de agrupación por categorías, no un gráfico de resultados experimentales.

## Página 4

### La regresión logística como herramienta para clasificar decisiones binarias

La regresión logística es un modelo que permite resolver problemas de clasificación binaria, es decir, situaciones en las que la respuesta esperada solo puede tomar uno de dos posibles valores. A pesar de su nombre, no se utiliza para problemas de regresión numérica como la regresión lineal, sino que se emplea para predecir clases, como “sí / no”, “positivo / negativo”, o “sobrevive / no sobrevive”.

La lógica del modelo parte de una idea simple: se construye una fórmula similar a la de la regresión lineal, pero en lugar de usarla para predecir un valor directamente, se la transforma para que el resultado esté siempre entre 0 y 1, y pueda interpretarse como una probabilidad. Esa transformación se realiza con una función llamada sigmoide, que aplasta cualquier número real dentro de ese rango.

El resultado que nos devuelve el modelo no es una clase directamente, sino una probabilidad. Por ejemplo, al analizar un pasajero del Titanic, el modelo puede indicar que tiene un 82% de probabilidad de haber sobrevivido. Para tomar una decisión final, se aplica un umbral de corte, comúnmente del 0,5: si la probabilidad es mayor a 0,5, se predice la clase 1 (“sí”); si es menor, se predice la clase 0 (“no”).

La fuerza de la regresión logística está en que permite convertir un problema de clasificación en uno de estimación de probabilidades, lo que abre muchas posibilidades en la toma de decisiones. Por ejemplo, una empresa no solo puede saber si un cliente cancelará su suscripción, sino qué tan probable es que eso ocurra. Esa información es mucho más rica que una respuesta binaria cerrada.

Aunque existen algoritmos de clasificación más complejos, la regresión logística es una excelente puerta de entrada al mundo de los clasificadores, porque es fácil de entrenar, rápida de interpretar y suficiente para muchos problemas prácticos.

**Visual:** A la izquierda, fórmula impresa `f(x) = 1 / (1 + e⁻ˣ)` y gráfico de curva sigmoide roja: eje horizontal marcado aproximadamente de −6 a 6, eje vertical marcado 0, 0,5 y 1. La curva cruza 0,5 en x = 0 y se aproxima a 0 y a 1 hacia los extremos. La fórmula se muestra como figura, no aparece en el texto extraído del PDF.

## Página 5

### Diferencias entre regresión lineal y regresión logística

Aunque ambos modelos comparten el nombre "regresión", su propósito y su forma de trabajar son muy distintos.

La regresión lineal busca predecir un valor numérico continuo. Modela una relación lineal entre las variables predictoras y el valor objetivo. La salida del modelo puede ser cualquier número real, desde valores negativos hasta positivos, sin restricciones.

En cambio, la regresión logística busca predecir la probabilidad de pertenecer a una clase. Aunque internamente calcula una combinación lineal de las variables, después transforma ese resultado usando una función sigmoide, asegurándose de que la salida sea un número entre 0 y 1, que puede interpretarse como una probabilidad. El objetivo final es asignar una clase (por ejemplo, 0 o 1) a cada observación.

Por esta razón, aplicar regresión lineal en un problema de clasificación sería inadecuado. Aunque podríamos forzar un modelo lineal para que prediga valores cercanos a 0 o 1, esos valores no tendrían una interpretación probabilística válida, y el modelo sería propenso a cometer errores graves, especialmente en los extremos.

#### Ejemplos concretos

Imaginemos que trabajamos para una empresa de seguros que quiere predecir el monto de los reclamos que recibirá un cliente en un año. Aquí el resultado esperado es un número: puede ser $0, $2.000 o $50.000. El monto no pertenece a categorías, sino que es un valor continuo que puede tomar muchas formas. En este caso, usaríamos regresión lineal, porque queremos obtener una estimación numérica que luego podría ser usada para calcular riesgos, precios o primas.

Ahora pensemos en otro escenario: la empresa quiere predecir si un cliente presentará o no un reclamo en el próximo año. Ahora no importa el monto, sino simplemente sí o no. Aquí estamos frente a un problema de clasificación binaria. En este caso, usaríamos regresión logística, porque no buscamos un número continuo sino una decisión categórica basada en una probabilidad.

Otro ejemplo podría encontrarse en el sector educativo. Si quisiéramos predecir la nota final de un

**Visual:** Ilustración de un teléfono con gráfico de barras, billetes y monedas junto al ejemplo del monto; otra de una docente y una alumna frente a una pizarra junto al ejemplo educativo. Son ilustraciones, no datasets ni predicciones calculadas.

## Página 6

estudiante en un examen a partir de sus notas parciales, usaríamos regresión lineal. Pero si el objetivo fuera predecir si el estudiante aprobará o no el curso, el problema sería binario, y la herramienta adecuada sería la regresión logística.

En pocas palabras: la diferencia clave es el tipo de pregunta que queremos responder. Si queremos saber "cuánto", usamos regresión lineal. Si queremos saber "sí o no", usamos regresión logística.

### Métricas para evaluar modelos de clasificación

Una vez que entrenamos un modelo de clasificación, necesitamos saber qué tan buenas son sus predicciones. Pero a diferencia de los modelos de regresión —donde medíamos cuánto se alejaba un número del valor real—, en clasificación lo que nos interesa es evaluar decisiones: ¿el modelo acertó o se equivocó al asignar una clase?

Por eso, usamos métricas específicas, que nos permiten analizar distintos aspectos del comportamiento del modelo. Algunas de ellas miden cuántas veces acierta en general, otras se centran en qué tan bien detecta los casos positivos, o en cómo se comporta frente a errores de clasificación. Cada métrica nos da una perspectiva distinta, y la elección correcta depende del problema y de las consecuencias de equivocarse.

#### Precisión (accuracy): cuántas veces acierta el modelo en total

La precisión, también conocida como accuracy, es quizás la métrica más intuitiva: mide el porcentaje total de aciertos del modelo. Se calcula dividiendo la cantidad de predicciones correctas por el total de predicciones realizadas.

En otras palabras, nos dice con qué frecuencia el modelo “le pega” a la clase correcta, sin distinguir si fue un caso positivo o negativo. Por ejemplo, si un modelo clasificó correctamente a 92 de 100 personas como “sobrevive” o “no sobrevive”, entonces su precisión es del 92%.

La precisión es útil cuando las clases están relativamente balanceadas, es decir, cuando hay más o menos la misma cantidad de casos positivos y negativos. Pero puede resultar engañosa en situaciones donde una clase aparece con mucha más frecuencia que la otra.

Imaginemos un modelo que intenta predecir si una persona está enferma, y resulta que solo el 1% de la población tiene esa enfermedad. Si el modelo predice siempre “no está enfermo”, acertará el 99% de las veces, pero no servirá de nada, porque no detectará ningún caso positivo. En ese tipo de problemas, necesitamos otras métricas que nos digan cómo se comporta el modelo específicamente con los casos positivos.

**Visual:** Diana azul con impactos cerca del centro y rótulo «ACCURATE»; es una metáfora visual de los aciertos, no una matriz de confusión.

## Página 7

#### Recall (sensibilidad): qué tan bien detecta los casos positivos

El recall, también llamado sensibilidad o tasa de verdaderos positivos, mide la capacidad del modelo para detectar correctamente los casos positivos. De todos los casos que realmente eran positivos, ¿cuántos fue capaz de identificar como tales?

Esta métrica es especialmente importante cuando los falsos negativos son costosos o peligrosos. Por ejemplo, en medicina, si un modelo debe detectar si una persona tiene una enfermedad grave, nos importa mucho no dejar pasar casos verdaderamente positivos, aunque a veces se equivoque con algunos negativos.

Un modelo con alto recall no se pierde los casos positivos, aunque eso signifique clasificar erróneamente a algunos casos negativos como positivos. En contextos como la detección de fraude, diagnóstico médico o control de calidad, el recall suele ser más importante que la precisión general, porque lo peor que puede pasar es no detectar un problema cuando realmente existe.

Volviendo al caso del Titanic: si quisiéramos un modelo que detecte a todas las personas que sobrevivieron, sin importar si a veces se equivoca con quienes no lo hicieron, estaríamos priorizando el recall.

#### F1-score: el equilibrio entre precisión y sensibilidad

El F1-score es una métrica que combina la precisión y el recall en un solo valor, usando la media armónica de ambas. Sirve para responder una pregunta clave: ¿el modelo logra un buen equilibrio entre acertar en general y detectar los casos positivos?

Un modelo puede tener una alta precisión pero un bajo recall, o viceversa. El F1-score penaliza esos desequilibrios. Si uno de los dos valores es muy bajo, el F1 también será bajo. Por eso, se lo considera una métrica más exigente y equilibrada que mirar precisión o recall por separado.

Esta métrica es muy útil cuando las clases están desbalanceadas o cuando los errores tienen consecuencias distintas según el tipo de caso.

Por ejemplo, en detección de spam, un modelo con alta precisión pero bajo recall podría dejar pasar muchos correos no deseados. Y uno con alto recall pero baja precisión podría filtrar muchos correos legítimos. El F1-score ayuda a evaluar si el modelo está logrando un compromiso razonable entre ambos extremos.

**Visual:** Personaje con megáfono y sobre de correo encima, ilustración alusiva a avisos y mensajes; no representa una medición de recall.

## Página 8

Entonces, el F1-score es ideal cuando no queremos priorizar ciegamente una métrica sobre la otra, sino encontrar un punto medio que refleje el rendimiento general del modelo en tareas críticas o sensibles.

#### Matriz de confusión: ver en detalle cómo se equivoca el modelo

La matriz de confusión es una herramienta fundamental para entender el comportamiento de un modelo de clasificación. En lugar de resumir el rendimiento en un solo número, nos muestra cómo se distribuyen los aciertos y errores, desglosando las predicciones en una tabla que permite un análisis más fino.

Esta matriz tiene cuatro elementos:

- Verdaderos positivos (VP): casos positivos que el modelo predijo correctamente como positivos.
- Falsos negativos (FN): casos positivos que el modelo predijo incorrectamente como negativos.
- Falsos positivos (FP): casos negativos que el modelo predijo incorrectamente como positivos.
- Verdaderos negativos (VN): casos negativos que el modelo predijo correctamente como negativos.

Por ejemplo, en un modelo que predice si una persona sobrevivió al Titanic, un verdadero positivo sería alguien que efectivamente sobrevivió y el modelo lo predijo correctamente. Un falso negativo sería una persona que sobrevivió pero que el modelo clasificó como si no lo hubiera hecho.

La matriz de confusión no sólo nos ayuda a calcular otras métricas, como precisión o recall, sino que también permite identificar patrones de error. ¿El modelo confunde muchos negativos con positivos? ¿Se le escapan los positivos? Esa información es clave para decidir ajustes, cambiar el umbral de clasificación o incluso rediseñar el modelo.

Cuando las decisiones basadas en el modelo tienen consecuencias reales —como rechazar un crédito, indicar un tratamiento médico o bloquear un contenido en línea—, la matriz de confusión es una herramienta esencial para entender en qué se está equivocando el modelo y por qué.

**Visual:** Persona frente a símbolos matemáticos decorativos. Pese al título, no se imprime ninguna matriz con filas, columnas o cantidades; los cuatro casos aparecen como viñetas textuales.

## Página 9

### Reflexión final

Con esta clase ingresamos de lleno al universo de la clasificación binaria, y dimos nuestros primeros pasos con la regresión logística, un modelo que a pesar de su nombre, no predice números sino decisiones. Aprendimos que detrás de cada predicción hay una estimación de probabilidad, y que esa probabilidad se transforma en una elección: sí o no, positivo o negativo, 1 o 0.

También comprendimos que evaluar un modelo de clasificación no se trata solo de contar cuántas veces acierta. Algunas situaciones exigen mirar más allá del número total de aciertos, y poner el foco en cómo y cuándo se equivoca el modelo. Métricas como la precisión, el recall, el F1-score y la matriz de confusión nos permiten interpretar el rendimiento de forma mucho más rica y útil.

Este conocimiento es fundamental, porque no todos los errores son iguales, y las consecuencias de equivocarse pueden variar mucho según el contexto. A partir de ahora, cada vez que construyas un modelo de clasificación, vas a tener las herramientas para analizarlo con criterio, y tomar decisiones basadas en algo más que un porcentaje general de aciertos.

En las próximas clases, seguiremos explorando nuevos algoritmos de clasificación, como K-Nearest Neighbors (KNN) y árboles de decisión, y veremos cómo se comportan frente a distintos tipos de datos. Pero todo lo aprendido hoy —el enfoque probabilístico, la lógica binaria y la evaluación detallada— será la base sobre la cual vamos a construir.

## Página 10

### Materiales y recursos adicionales:

Para seguir explorando y consolidando tus conocimientos sobre la clasificación binaria, y la regresión logística, te recomendamos los siguientes recursos:

- **Regresión logística – Teoría:** Una explicación detallada sobre la [regresión logística, su funcionamiento y aplicaciones prácticas](https://aprendeia.com/algoritmo-regresion-logistica-machine-learning-teoria/).
- **Regresión logística en Python con Scikit-learn:** Guía paso a paso para [implementar regresión logística utilizando Python y Scikit-learn](https://www.datacamp.com/es/tutorial/understanding-logistic-regression-python).
- **Regresión Logística Binaria conceptos:** Explicación en video sobre los [conceptos fundamentales de la regresión logística binaria](https://www.youtube.com/watch?v=gCTy_R-MPGk), ideal para quienes prefieren el aprendizaje visual.
- **Métricas de Clasificación – Aprende a Evaluar tu Modelo:** Análisis detallado sobre [la matriz de confusión y cómo interpretar sus resultados](https://www.juanbarrios.com/la-matriz-de-confusion-y-sus-metricas/) en el contexto de modelos de clasificación.

Estos recursos te permitirán profundizar en los conceptos abordados en la clase y reforzar tu comprensión sobre la regresión logística y las métricas de evaluación en problemas de clasificación binaria.

### Preguntas para reflexionar:

1. ¿Por qué creés que la regresión logística es más adecuada que la regresión lineal para resolver problemas de clasificación binaria?
2. ¿Qué ventajas tiene trabajar con probabilidades en lugar de decisiones binarias directas? ¿En qué tipo de casos te parece valioso conocer "qué tan probable" es un resultado?
3. En un problema sensible (por ejemplo, detección de fraude o enfermedad), ¿te parece más importante maximizar la precisión o el recall? ¿Por qué?
4. ¿Cómo interpretarías un modelo con precisión alta pero F1-score bajo? ¿Qué te diría eso sobre su comportamiento?

## Página 11

### Tomando decisiones en Talento Lab

Luego del primer intento de modelado con regresión lineal, los resultados no fueron del todo alentadores. Silvia lo resumió en una frase: “Intentamos predecir una decisión con una herramienta diseñada para predecir cantidades”. A partir de allí, el equipo de Talento Lab entendió que era momento de cambiar de enfoque.

En la reunión de cierre, Sabrina propuso aplicar regresión logística para abordar un nuevo objetivo: predecir si un pasajero del Titanic sobrevivió o no, en función de algunas características conocidas como clase, edad, sexo y cantidad de familiares a bordo. Luis recordó que ahora no se trataría de estimar un número, sino de tomar una decisión binaria basada en una probabilidad. “Esta vez no queremos saber cuánto gastará, sino si vivirá o no”, bromeó, antes de abrir su cuaderno de trabajo.

### Ejercicio práctico

Ahora es tu turno. Silvia fue clara con la consigna: cada integrante del equipo debe entrenar un modelo de clasificación y evaluar sus decisiones con criterio. No bastaba con decir “acertó” o “se equivocó”. Necesitamos que saber cómo se equivocó, con qué frecuencia y en qué dirección.

1. Usá el dataset del Titanic (o un dataset binario similar) y preparalo para entrenar un modelo de regresión logística. Seleccioná al menos 3 o 4 variables predictoras, y definí claramente cuál es la variable objetivo.
2. Entrená el modelo con `LogisticRegression` de Scikit-learn. Mostrá cómo se comporta en términos de precisión general (accuracy).
3. Calculá las siguientes métricas de evaluación: precisión, recall, F1-score, e imprimí la matriz de confusión. Usá `classification_report` y `confusion_matrix`.
4. Agregá una celda de texto interpretando los resultados obtenidos: ¿el modelo acierta más en los positivos o en los negativos? ¿Qué tipo de errores comete más?

Recordá: la evaluación de un modelo no se reduce a un número. En problemas reales, entender cómo y cuándo se equivoca es tan importante como saber cuánto acierta.

**Visual:** Logotipo «Talento Lab» junto al relato; no hay tabla de resultados ni salida de `confusion_matrix` en esta página.

## Página 12

### Próximos pasos

Con esta clase dimos un paso clave en el camino del aprendizaje automático supervisado: dejamos de predecir valores para comenzar a tomar decisiones. Aprendimos a construir un modelo de regresión logística y a evaluar sus decisiones con métricas específicas que nos permiten entender no solo cuántas veces acierta, sino cómo y cuándo se equivoca.

En la próxima clase vamos a conocer un modelo muy distinto, pero igualmente poderoso: el algoritmo de los k vecinos más cercanos (KNN). Este enfoque no parte de una fórmula matemática fija, sino que busca patrones directamente en los datos, tomando decisiones según la “vecindad” de cada caso.

Vamos a aprender cómo funciona este método, cómo se comporta con diferentes valores de k, y por qué la elección de la métrica de distancia y la escala de las variables pueden afectar fuertemente sus resultados. También lo compararemos con la regresión logística para entender en qué casos uno puede ser preferible al otro.

Seguimos avanzando en el camino de construir modelos más variados y robustos, pero siempre manteniendo una mirada crítica sobre sus decisiones.

## Página 13

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
