# Clase N° 13 | Comparativa y evaluación de modelos

**Fuente:** [ML CLASE _ 13.pdf](ML%20CLASE%20_%2013.pdf), páginas 1–11. Transcripción por página. Las notas **Visual:** describen elementos observados y no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 13. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con etiqueta amarilla «Clase 13»; una persona de pie consulta una tableta y otra, sentada, usa una computadora portátil junto a un cubo turquesa. Ambas llevan auriculares.

## Página 2

### Clase N° 13 | Comparativa y evaluación de modelos

### Índice

- Clase N° 13 | Comparativa y evaluación de modelos
- La comparación de modelos como parte fundamental del proceso de aprendizaje automático
  - Criterios de comparación y herramientas para evaluar modelos
  - Interpretando la matriz de confusión
- Curva ROC y AUC: sensibilidad vs. especificidad
- Visualización comparativa: métricas, gráficos y toma de decisiones
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Una decisión que importa
- Ejercicio práctico

### Objetivos de la clase:

En esta clase vamos a consolidar todo lo aprendido hasta ahora, aplicándolo al análisis comparativo de distintos modelos de machine learning. Ya sabemos cómo preprocesar datos, entrenar algoritmos y evaluar su rendimiento. Ahora nos enfocaremos en responder una pregunta clave en cualquier proyecto de aprendizaje automático: ¿Cuál es el mejor modelo para este problema?

Para ello, analizaremos y compararemos el comportamiento de distintos algoritmos que ya conocemos (como regresión logística, KNN, árboles de decisión y random forest), aplicando las mismas métricas y criterios de evaluación sobre todos. Nos detendremos no solo en la precisión general, sino también en aspectos más sutiles como el comportamiento con clases desbalanceadas, la estabilidad en validación cruzada y la interpretabilidad.

Esta clase nos entrena para tomar decisiones fundamentadas, comparar enfoques distintos y asumir un rol más crítico y estratégico dentro del proceso de modelado.

## Página 3

### La comparación de modelos como parte fundamental del proceso de aprendizaje automático

Durante este curso exploramos y entrenamos distintos algoritmos: regresión logística, vecinos más cercanos, árboles de decisión, random forest, entre otros. Cada uno de ellos tiene comportamientos diferentes, ventajas específicas y limitaciones propias. Algunos son más fáciles de interpretar, otros tienden a ser más precisos. Algunos requieren un ajuste minucioso de parámetros, mientras que otros funcionan bien con configuraciones por defecto.

**Visual:** Ilustración de una persona con lupa ante un panel que compara «Decision Tree/Random Forest», «Logistic Regression» y «K-Nearest Neighbors» mediante árboles, puntos, redes, barras y líneas. Son gráficos esquemáticos, sin métricas numéricas legibles de un experimento.

Comparar modelos no es solo una cuestión de rendimiento numérico. Es una etapa crucial que nos permite poner en igualdad de condiciones distintas estrategias de resolución para un mismo problema, evaluarlas con criterios consistentes y comprender en profundidad cómo se comportan frente a los mismos datos. Esta práctica nos ayuda a evitar elecciones apresuradas basadas en intuiciones o preferencias personales, y a respaldar nuestras decisiones con evidencia concreta.

El análisis comparativo de modelos es también una instancia de reflexión sobre el contexto. No siempre el modelo con mayor precisión es el más conveniente. En algunos casos, puede ser preferible elegir un algoritmo que sea más fácil de explicar o que funcione bien sin necesitar muchos recursos computacionales. Evaluar múltiples opciones también nos permite detectar si un modelo simple está ofreciendo resultados similares a otros más complejos, o si ciertas configuraciones requieren demasiada intervención para obtener beneficios marginales.

En esta clase aprenderemos a comparar modelos desde una perspectiva amplia. Evaluaremos su desempeño con los mismos indicadores, aplicaremos validación cruzada para estimar su estabilidad y exploraremos cómo se comportan ante diferentes distribuciones de datos. Esta comparación sistemática nos permitirá tomar decisiones más informadas, fundamentadas y adecuadas a las necesidades del problema que estemos resolviendo.

## Página 4

### Criterios de comparación y herramientas para evaluar modelos

Al comparar distintos modelos de machine learning no se trata simplemente de ver cuál obtiene el mayor porcentaje de aciertos. La elección del mejor modelo depende de múltiples factores que deben ser considerados en conjunto. Cada modelo no solo se evalúa por lo bien que predice, sino también por cómo lo hace, con cuánta estabilidad y bajo qué condiciones.

Uno de los primeros aspectos a tener en cuenta es la exactitud general, es decir, qué proporción de casos predice correctamente. Sin embargo, en muchos contextos, especialmente cuando las clases están desbalanceadas, esta métrica puede resultar engañosa. Por eso es importante incorporar otras medidas como la precisión, el recall, el F1-score o el área bajo la curva ROC, dependiendo del tipo de problema que se esté abordando.

**Visual:** Tablero ilustrado con un gráfico radial rotulado «Exactitud», «Precisión», «Recall» y «F1-Score»; a la derecha un flujo de particiones hacia un chip y los símbolos μ y σ; abajo aparecen «Interpretabilidad», «Caja Negra», un cronómetro, una matriz de casillas y una pequeña curva. No se muestran resultados medidos.

Otro factor clave es la estabilidad del modelo, que se puede estimar mediante validación cruzada. Un modelo que obtiene buenos resultados en una sola división de los datos, pero que varía mucho en otras particiones, no es confiable. Evaluar el rendimiento promedio y la desviación estándar entre distintos folds nos permite medir qué tan consistente es un modelo al enfrentarse a datos nuevos.

También debe considerarse el tiempo de entrenamiento y de predicción. En problemas reales, donde los modelos deben reentrenarse frecuentemente o ejecutarse en tiempo real, la eficiencia puede ser tan relevante como la precisión.

Además, hay modelos que ofrecen mayor interpretabilidad, lo que puede ser indispensable en áreas como la salud, la educación o el sistema judicial, donde entender cómo se tomó una decisión es tan importante como el resultado final. Otros modelos, aunque más precisos, se comportan como cajas negras, lo que puede limitar su uso en ciertos contextos.

Para llevar a cabo esta comparación, vamos a trabajar con herramientas que ya conocemos: `classification_report`, `cross_val_score`, gráficos de matriz de confusión y curvas ROC, entre otros. En esta clase vamos a integrarlas de forma estructurada para evaluar cada modelo desde distintos ángulos, con una mirada crítica y completa.

## Página 5

### Interpretando la matriz de confusión

Cuando evaluamos un modelo de clasificación binaria, una de las herramientas más útiles es la matriz de confusión. Esta matriz nos permite ver no solo cuántas predicciones fueron correctas, sino también cómo se equivocó el modelo, y en qué dirección. Es especialmente valiosa cuando estamos frente a clases desbalanceadas.

Una matriz de confusión de 2×2 tiene esta estructura:

| | Predicho: No | Predicho: Sí |
|---|---|---|
| Real: No | TN (verdadero negativo) | FP (falso positivo) |
| Real: Sí | FN (falso negativo) | TP (verdadero positivo) |

**Visual:** Tabla de tres columnas con cabeceras y etiquetas de fila amarillas; las cuatro celdas muestran TN, FP, FN y TP según la correspondencia real/predicho indicada arriba.

- TP: el modelo predijo “sí” y era “sí”.
- TN: el modelo predijo “no” y era “no”.
- FP: el modelo predijo “sí” pero era “no”.
- FN: el modelo predijo “no” pero era “sí”.

La matriz nos ayuda a entender el costo de los errores. Por ejemplo, en un problema de detección de fraude bancario, un falso negativo (no detectar un fraude) puede ser más grave que un falso positivo (frenar una transacción válida por sospecha).

Los indicadores como precisión, recall y F1-score se calculan a partir de esta matriz. Verla gráficamente nos permite detectar sesgos del modelo, como una tendencia a predecir siempre la clase mayoritaria.

### Curva ROC y AUC: sensibilidad vs. especificidad

En problemas de clasificación binaria, además de observar qué predijo el modelo, es muy útil saber con qué grado de certeza lo hizo. No todos los modelos nos devuelven simplemente una etiqueta (sí/no), sino que suelen calcular primero una probabilidad de pertenencia a la clase positiva. La curva ROC (Receiver Operating Characteristic) se basa justamente en esas probabilidades.

La curva ROC representa el compromiso entre dos métricas: la tasa de verdaderos positivos (TPR o recall) y la tasa de falsos positivos (FPR). A medida que vamos variando el umbral a partir del cual decidimos que algo pertenece a la clase positiva, estos valores cambian. El gráfico traza ese cambio.

- El eje x (horizontal) muestra la tasa de falsos positivos.

## Página 6

- El eje y (vertical) muestra la tasa de verdaderos positivos.

Un modelo ideal tendría un punto en el ángulo superior izquierdo (0 % de falsos positivos y 100 % de verdaderos positivos). La curva ROC de ese modelo cubriría una superficie grande, y es eso justamente lo que mide el AUC (Área Bajo la Curva). Cuanto más grande sea esa área, mejor capacidad tiene el modelo de separar correctamente ambas clases.

El AUC es un número entre 0 y 1:

- 1.0: modelo perfecto.
- 0.5: modelo que predice al azar.
- <0.5: modelo que clasifica peor que al azar (inviable).

Una de las ventajas del AUC-ROC es que no depende de un umbral específico, lo que lo convierte en una medida global del rendimiento del modelo, muy útil para comparar algoritmos en contextos con desbalance de clases.

**Visual:** Gráfico esquemático ROC: eje vertical «Sensibility / Ratio de verdaderos positivos» de 0 a 1; eje horizontal «1-Specifity / Ratio de Falsos positivos» de 0 a 1 (grafía tal como aparece). Curva naranja desde (0, 0) hasta (1, 1), por encima de una diagonal punteada; el área amarilla bajo la curva está rotulada «AUC Área debajo de la Curva ROC». No se indican valores AUC calculados.

Por ejemplo: si tenemos un modelo para predecir enfermedades poco frecuentes, puede tener alta accuracy simplemente prediciendo siempre “no enfermo”, pero un AUC bajo. La curva ROC expone este problema y nos ayuda a elegir mejor.

## Página 7

### Visualización comparativa: métricas, gráficos y toma de decisiones

Cuando comparamos modelos en el contexto real de un proyecto, no alcanza con una sola métrica. Cada medida nos muestra una parte del rendimiento del modelo, y solo al combinar varias perspectivas podemos construir un criterio sólido para elegir entre alternativas.

**Visual:** Dos personas con bata observan una pantalla y cuatro paneles ilustrativos con áreas, una línea ascendente, gráficos circulares y barras; las formas no están acompañadas por cifras ni representan resultados verificables de modelos específicos.

Las visualizaciones cumplen un rol fundamental en ese análisis comparativo. Nos permiten detectar patrones, errores sistemáticos o fortalezas específicas que pueden no ser evidentes al mirar solo los números.

Por ejemplo, al observar una matriz de confusión podemos notar que un modelo tiene alta precisión general, pero se equivoca casi siempre al predecir la clase minoritaria. Esto sería especialmente grave en contextos sensibles como diagnóstico médico o detección de fraude. En cambio, un modelo con un F1-score equilibrado entre clases puede ser preferido, aunque su accuracy global sea menor.

Del mismo modo, la curva ROC y el valor del AUC nos permiten visualizar y comparar el comportamiento de los modelos en todos los niveles posibles de umbral de decisión. Un modelo con mayor área bajo la curva será más confiable para discriminar entre clases, incluso cuando cambien las condiciones o se modifique el umbral de clasificación.

Visualizar estos resultados en conjunto —por ejemplo, con una tabla comparativa de métricas, matrices de confusión lado a lado y curvas ROC superpuestas— permite argumentar de forma clara y fundamentada por qué se elige un modelo sobre otro. No se trata simplemente de “ganar” en una métrica, sino de entender qué implicancias tiene cada elección para el problema que estamos resolviendo.

Comparar modelos, entonces, no es una carrera de números. Es un proceso de análisis integral que combina evidencia, contexto y criterio profesional.

## Página 8

### Reflexión final

A esta altura del curso, ya no se trata solamente de entrenar modelos que “funcionen”, sino de desarrollar la capacidad crítica para evaluar cuál de ellos es más adecuado para resolver un problema concreto. En esta clase aprendimos que la comparación de modelos no es una competencia de números, sino un proceso profundo de análisis, que requiere mirar el rendimiento desde múltiples perspectivas: exactitud, recall, F1-score, estabilidad, interpretabilidad y comportamiento ante clases desbalanceadas.

También vimos cómo las herramientas visuales —como la matriz de confusión o la curva ROC— nos permiten detectar patrones de error, evaluar trade-offs y tomar decisiones con mayor conciencia. Aprender a leer esas señales no solo mejora nuestros resultados, sino que nos convierte en personas que trabajan con datos de manera más profesional, más ética y más fundamentada.

Comparar modelos con seriedad y criterio es una de las competencias más importantes en cualquier proyecto de machine learning. Es el paso que transforma un experimento aislado en una solución confiable. Y, como veremos en las próximas clases, será también el punto de partida para diseñar y justificar modelos completos que integren todo lo que aprendimos hasta aquí.

### Materiales y recursos adicionales:

Para profundizar en los conceptos abordados en esta clase y explorar más sobre la creación de pipelines y la optimización de modelos en scikit-learn, te recomendamos los siguientes recursos:

- **AUC y Curva ROC en Aprendizaje Automático - DataCamp:** Este artículo ofrece [una guía completa sobre cómo la curva AUC-ROC evalúa los modelos](https://www.datacamp.com/es/tutorial/auc) de clasificación binaria, proporcionando información sobre el rendimiento del modelo en diferentes umbrales.
- **Clasificación: ROC y AUC - Google for Developers:** Una [explicación detallada sobre la curva ROC y el AUC](https://developers.google.com/machine-learning/crash-course/classification/roc-and-auc?hl=es-419), incluyendo cómo interpretarlos y aplicarlos en la evaluación de modelos de clasificación binaria.

Estos recursos están diseñados para reforzar y ampliar los conocimientos adquiridos en la clase, proporcionando diferentes perspectivas y enfoques sobre la comparación y evaluación de modelos de machine learning. Te recomiendo explorarlos para consolidar tu comprensión y preparación para las próximas etapas del curso.

## Página 9

### Preguntas para reflexionar:

1. ¿Qué factores deberías tener en cuenta al comparar dos modelos con resultados similares en términos de accuracy?
2. ¿En qué situaciones una matriz de confusión aporta más información que un simple porcentaje de aciertos?
3. ¿Por qué es útil la curva ROC y el valor AUC en contextos con clases desbalanceadas?
4. ¿Qué aprendiste al observar cómo se comportan diferentes modelos frente a los mismos datos? ¿Cómo te ayuda eso a tomar decisiones más fundamentadas al momento de elegir un modelo para usar en la práctica?

### Una decisión que importa

**Visual:** Logotipo grande «Talento Lab» sobre el relato. No hay matrices ni curvas con resultados reales en esta página.

En Talento Lab, el equipo se preparaba para presentar tres modelos candidatos a un nuevo cliente del sector salud. Habían trabajado con datos sensibles sobre pacientes y enfermedades poco frecuentes, y querían asegurarse de elegir la solución más adecuada. Silvia insistió: “No se trata solo de quién acierta más, sino de quién se equivoca menos donde no puede fallar”.

Matías comparó las métricas de cada modelo: la regresión logística tenía buena precisión, pero fallaba al detectar casos positivos. El árbol de decisión era más equilibrado, pero algo inestable. El random forest, más costoso de entrenar, mostraba un buen balance entre recall y precisión. Luis trazó las curvas ROC, Sabrina interpretó las matrices de confusión, y entre todos construyeron una tabla comparativa con lo esencial: rendimiento, estabilidad, explicabilidad y riesgos asociados.

Cuando presentaron los resultados al cliente, no mostraron una “solución ganadora”, sino un análisis claro y justificado. Eso marcó la diferencia.

## Página 10

### Ejercicio práctico

El objetivo de este ejercicio es que puedas comparar al menos dos modelos distintos aplicados al mismo problema, y que justifiques cuál elegirías para entregar como solución final.

1. Elegí al menos dos algoritmos que ya conozcas (por ejemplo, regresión logística, KNN, árbol de decisión, random forest).
2. Entrenalos utilizando el mismo conjunto de datos (puede ser el Titanic o uno de Kaggle).
3. Evaluá su rendimiento utilizando:
   - Matriz de confusión
   - Métricas de clasificación (precision, recall, F1-score)
   - Validación cruzada (`cross_val_score`)
   - Curva ROC y AUC (si es aplicable)
4. Registrá los resultados de forma organizada (puede ser en una tabla o en celdas separadas).
5. Redactá una breve justificación técnica indicando:
   - Qué modelo elegirías.
   - Por qué es el más adecuado según los datos y el problema.
   - Qué limitaciones encontraste en cada uno.

### Próximos pasos

En esta clase aprendimos a evaluar y comparar modelos de forma crítica, utilizando no solo métricas aisladas, sino también herramientas visuales e indicadores que nos permiten analizar el comportamiento global de cada algoritmo. Esta práctica es clave para tomar decisiones fundamentadas en cualquier proyecto de machine learning.

En las próximas dos clases, vamos a aplicar todo lo aprendido en un proyecto completo, guiado paso a paso. En la Clase 14 iniciaremos con la exploración de un nuevo dataset, el análisis del problema y la construcción de los pipelines iniciales. En la Clase 15, avanzaremos con la evaluación comparativa, la optimización y la generación de un modelo final presentable.

Ese recorrido servirá como modelo y preparación directa para la Clase 16, donde vas a presentar tu propio proyecto final integrador.

## Página 11

**Visual:** Contraportada azul oscuro con una red de líneas geométricas y las marcas «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad». No contiene texto docente adicional.
