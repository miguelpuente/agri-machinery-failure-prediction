# Clase N° 10 | Random Forest

**Fuente:** [ML CLASE _ 10.pdf](ML%20CLASE%20_%2010.pdf), páginas 1–10. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 10. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con franja amarilla «Clase 10»; dos personas ilustradas con auriculares usan una tableta y una computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 10 | Random Forest

### Índice

- ¿Qué es un Random Forest?
- ¿Cómo funciona internamente un Random Forest?
  - Veamos cómo lo hace:
  - Muestreo con reemplazo (bootstrap)
  - Selección aleatoria de variables
  - Agregación de predicciones
- Ventajas y limitaciones de Random Forest
  - Ventajas:
  - Limitaciones:
  - ¿Cómo mide la importancia?
  - ¿Para qué sirve esta información?
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Del árbol al bosque: decisiones más robustas en Talento Lab
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

Conoceremos Random Forest, un modelo que combina múltiples árboles mediante voto mayoritario para ganar precisión y reducir el sobreajuste. Estudiaremos cómo logra robustez entrenando con subconjuntos aleatorios de datos y variables, y cómo permite identificar la importancia de cada predictor. Usaremos el dataset del Titanic para implementar y comparar este modelo frente al árbol individual. Al finalizar, podrás entrenar, evaluar e interpretar un Random Forest, comprendiendo por qué suele superar a los árboles simples.

## Página 3

### ¿Qué es un Random Forest?

Un Random Forest (o bosque aleatorio) es un modelo de aprendizaje automático que combina múltiples árboles de decisión para resolver problemas de clasificación o regresión. Su lógica se basa en una idea simple pero poderosa: varios modelos débiles, si son lo suficientemente diversos, pueden combinarse para formar un modelo fuerte.

En lugar de confiar en un único árbol —que puede sobreajustarse a los datos o volverse inestable ante pequeños cambios—, el Random Forest entrena muchos árboles de forma paralela, y luego combina sus predicciones. En tareas de clasificación, cada árbol “vota” por una clase y la clase más votada es la predicción final.

**Visual:** Esquema «Dataset» que se ramifica en «Decision Tree-1», «Decision Tree-2» … «Decision Tree-N». Cada árbol produce «Result-1», «Result-2» o «Result-N»; los resultados confluyen en «Majority Voting / Averaging» y de allí en «Final Result». Nodos verdes y azules ilustran ramas; no se presentan probabilidades numéricas.

La gran ventaja de este enfoque es que, al promediar las decisiones de varios modelos entrenados con cierta variabilidad, se logra una mejor capacidad de generalización, y se reducen los errores que podrían cometer los árboles individuales por sesgo o por exceso de ajuste.

Imaginá que diez médicos, de distintas especialidades, deben decidir si un paciente debe ser operado. Cada uno evalúa los estudios desde su criterio. Si 8 dicen que sí y 2 que no, probablemente se elija la opción más votada. Esa diversidad de opinión ayuda a reducir errores individuales y obtener una decisión más confiable.

De forma similar, un Random Forest combina la opinión de muchos árboles, cada uno entrenado con un subconjunto diferente de los datos, lo que le permite detectar patrones que un solo árbol podría pasar por alto.

Un Random Forest es un modelo de votación inteligente, donde la fuerza está en el conjunto. En las siguientes secciones veremos cómo se construye este bosque, y por qué su rendimiento suele ser superior al de un árbol aislado.

## Página 4

### ¿Cómo funciona internamente un Random Forest?

El funcionamiento de un Random Forest se basa en dos ideas fundamentales: diversidad de árboles y votación colectiva. Para lograr esa diversidad, el modelo introduce aleatoriedad controlada durante el entrenamiento de cada árbol.

#### Veamos cómo lo hace:

#### Muestreo con reemplazo (bootstrap)

Para entrenar cada árbol, el modelo no usa todo el conjunto de entrenamiento original. En cambio, selecciona una muestra aleatoria con reemplazo del conjunto original (lo que se llama un conjunto bootstrap).

Esto significa que algunos registros pueden repetirse en el mismo árbol y otros quedar afuera (lo que se conoce como out-of-bag).

Este simple paso ya genera variación entre los árboles, porque cada uno ve una versión distinta del conjunto de entrenamiento.

#### Selección aleatoria de variables

En cada división del árbol (cada nodo), el Random Forest no considera todas las variables disponibles, sino que selecciona aleatoriamente un subconjunto.

Por ejemplo, si hay 10 variables, puede probar solo con 3 de ellas para decidir cómo dividir el nodo.

Esto introduce aún más diversidad, porque cada árbol puede aprender patrones diferentes incluso si recibió datos similares.

El objetivo es evitar que todos los árboles aprendan lo mismo.

#### Agregación de predicciones

Una vez que todos los árboles fueron entrenados, cada uno realiza su predicción. En clasificación, se realiza una votación por mayoría: la clase más votada es la predicción final.

**Visual:** Diagrama «DATASET» de círculos de colores con registros X1–X10, tres muestras distintas «BAGGING» (algunas etiquetas repetidas), tres bloques «DECISION TREE I/II/III», símbolo de suma y «Output». Ilustra el muestreo de datos y agregación; no hay resultados numéricos medidos.

## Página 5

Esta combinación reduce la varianza del modelo y mejora la estabilidad, sin necesidad de podar árboles ni ajustar demasiados hiperparámetros.

Este proceso de “entrenar árboles variados y combinarlos” es una técnica de ensamble conocida como bagging (Bootstrap Aggregating), y es lo que convierte a Random Forest en un modelo potente, estable y poco propenso al sobreajuste.

### Hiperparámetros

Los hiperparámetros son las "perillas" de ajuste que configuras antes de entrenar el modelo. No se aprenden de los datos; tú los defines para controlar la complejidad, evitar el sobreajuste (overfitting) y mejorar la precisión.

- `n_estimators`: Número de árboles (100 por defecto)
- `max_depth`: Profundidad máxima de cada árbol
- `min_samples_split`: Mínimo de muestras para dividir un nodo
- `min_samples_leaf`: Mínimo de muestras en un nodo hoja
- `max_features`: Número de variables a considerar en cada división

### Ventajas y limitaciones de Random Forest

El modelo Random Forest es uno de los algoritmos más utilizados en la práctica por su equilibrio entre rendimiento, robustez y facilidad de uso. Sin embargo, como todo modelo, tiene sus fortalezas y debilidades.

#### Ventajas:

- Alta precisión en clasificación: al combinar muchos árboles, mejora el rendimiento respecto a un árbol individual, especialmente cuando hay ruido o patrones sutiles en los datos.
- Menor riesgo de sobreajuste: la aleatoriedad en los datos y en las variables ayuda a evitar que los árboles memoricen los datos.
- Funciona bien con muchos tipos de datos: puede trabajar con variables numéricas, categóricas, y no necesita escalado.
- Mide la importancia de las variables: permite saber cuáles predictores aportan más al modelo, lo que es muy útil para interpretar o reducir la dimensionalidad.
- Estable frente a cambios en los datos: pequeñas variaciones en los datos no generan grandes cambios en el modelo.

## Página 6

#### Limitaciones:

- Pérdida de interpretabilidad: aunque cada árbol es interpretable, el conjunto completo es difícil de explicar con reglas claras. Se vuelve una “caja gris”.
- Mayor costo computacional: entrenar y evaluar muchos árboles consume más tiempo y memoria que un modelo simple.
- No es ideal para datos con muchas variables irrelevantes o altamente correlacionadas: aunque puede manejarlo, su rendimiento se puede ver afectado.

Random Forest es un modelo de referencia confiable: se puede usar como base comparativa o como solución final en muchos problemas reales. Es especialmente recomendable cuando se prioriza la precisión y la estabilidad, incluso si se pierde un poco de explicabilidad.

### Importancia de las variables en Random Forest

Una de las grandes ventajas de Random Forest frente a otros modelos “de caja negra” es que permite calcular la importancia relativa de cada variable. Es decir, nos da una idea clara de cuánto contribuye cada predictor a la calidad de las decisiones del modelo.

#### ¿Cómo mide la importancia?

Cada vez que un árbol dentro del bosque divide los datos, lo hace basándose en una variable que ayuda a separar las clases. Random Forest suma la mejora en la “pureza” de los nodos (por ejemplo, usando Gini) que genera cada variable a lo largo de todos los árboles, y luego promedia esos valores.

Así obtiene un puntaje por variable, que representa su influencia promedio en el rendimiento general del modelo.

#### ¿Para qué sirve esta información?

- Para entender qué factores están guiando al modelo, incluso si no podemos visualizar todos los árboles.
- Para identificar variables irrelevantes que podrían eliminarse para simplificar futuros modelos.
- Para hacer selección de características (feature selection), conservando solo las más útiles.
- Para comunicar resultados a otros sectores, explicando cuáles variables están teniendo más impacto.

## Página 7

En el caso del Titanic, un Random Forest puede ayudarnos a detectar que variables como `Sex_encoded` (género) y `Pclass` (clase del pasaje) son mucho más importantes que `SibSp` (hermanos o pareja a bordo), y ajustar nuestras estrategias en función de eso.

Esta capacidad de introspección, aunque no tan detallada como la visualización de un árbol individual, agrega valor interpretativo a un modelo poderoso y robusto.

### Reflexión final

En esta clase dimos el salto a los ensambles: combinar modelos simples para crear soluciones más fuertes. Random Forest nos demostró que la diversidad y la votación colectiva compensan los errores individuales, mejorando la estabilidad y la generalización. Aunque sacrificamos explicabilidad detallada, ganamos la capacidad de medir la importancia de las variables. Consolidamos conceptos como sobreajuste y aleatoriedad, quedando preparados para abordar modelos más complejos con una base sólida.

### Materiales y recursos adicionales:

Aquí tienes una selección de recursos adicionales al contenido de la clase, para ampliar tu conocimiento teórico y práctico sobre los bosques de árboles:

- **Descripción del modelo:** Scikit-learn también ofrece [ejemplos sobre cómo evaluar la importancia de las características](https://scikit-learn.org/stable/auto_examples/ensemble/plot_forest_importances.html) utilizando un bosque de árboles.
- **Visualización de la importancia de variables:** Herramientas como Minitab permiten [visualizar la importancia relativa de las variables en modelos de Random Forest](https://support.minitab.com/es-mx/minitab/help-and-how-to/statistical-modeling/predictive-analytics/how-to/random-forests-classification/interpret-the-results/relative-variable-importance-chart/), facilitando la interpretación de los resultados.
- **Using Random Forest For Feature Importance And Feature Selection:** Una publicación que discute [cómo utilizar Random Forest para la selección de características](https://medium.com/%40prasannarghattikar/using-random-forest-for-feature-importance-118462c40189), con ejemplos de código en Python.
- **Permutation Importance vs Random Forest Feature Importance:** Ejemplos prácticos que muestran [cómo comparar la importancia de características basada en la impureza con la importancia por permutación](https://scikit-learn.org/stable/auto_examples/inspection/plot_permutation_importance.html) en el conjunto de datos del Titanic.

## Página 8

### Preguntas para reflexionar:

1. ¿Qué ventaja concreta ofrece Random Forest frente a un único árbol de decisión? ¿En qué tipo de problema esto puede marcar la diferencia?
2. ¿Cómo contribuyen la aleatoriedad y la combinación de modelos al rendimiento de un Random Forest?
3. Si un modelo Random Forest obtiene buena precisión pero las variables más importantes no coinciden con lo esperado, ¿qué podrías investigar?
4. ¿Qué desventaja tiene Random Forest en relación a la interpretabilidad? ¿Cómo podrías compensar esa pérdida?

### Del árbol al bosque: decisiones más robustas en Talento Lab

Después de analizar en profundidad los árboles de decisión, Sabrina planteó una inquietud al equipo de Talento Lab: “¿Y si un solo árbol no alcanza? ¿Y si en lugar de elegir uno, usamos muchos?”. Luis recordó haber leído sobre un enfoque que hacía justamente eso, y Silvia propuso que lo pusieran a prueba.

Así comenzaron a trabajar con Random Forest, combinando múltiples árboles para obtener predicciones más estables. Esta vez, no bastaba con entender una sola secuencia de decisiones: había que ver qué tan bien se comportaba el modelo general, y también qué variables estaban guiando las decisiones colectivas.

**Visual:** Logotipo grande «Talento Lab» al lado del relato; no hay una comparación gráfica de métricas entre modelos.

## Página 9

### Ejercicio práctico

Tu objetivo es claro: evaluar si el bosque realmente supera al árbol solitario, y entender en qué situaciones eso puede marcar la diferencia.

1. Utilizá el dataset del Titanic y preparalo como hiciste en las clases anteriores.
2. Entrená un modelo de clasificación usando `RandomForestClassifier` de Scikit-learn. No limites la cantidad de árboles, usá los valores por defecto para comenzar.
3. Evaluá su rendimiento con las métricas habituales: precisión, recall, F1-score y matriz de confusión. Comparalo con el árbol individual que entrenaste en la clase anterior.
4. Visualizá la importancia de las variables (`feature_importances_`) y construí un gráfico de barras que muestre qué predictores tuvieron más peso en el modelo.
5. Escribí una breve reflexión: ¿el Random Forest mejoró la predicción respecto al árbol? ¿Se volvió más difícil de explicar? ¿Qué variables fueron clave?

**Bonus:** probá entrenar el modelo con `n_estimators=10`, `50` y `100`, y compará si hay diferencias en el rendimiento o la estabilidad.

### Próximos pasos

En la próxima clase vamos a cambiar de enfoque: dejaremos de sumar modelos para centrarnos en organizar todo el flujo de trabajo. Aprenderemos a usar pipelines en Scikit-learn, una herramienta que nos permite encadenar pasos como limpieza, transformación y modelado de manera ordenada y reproducible. También introduciremos la validación cruzada, una técnica clave para evaluar modelos de forma más justa y robusta.

Seguimos creciendo: del árbol al bosque, y del bosque a todo el ecosistema.

## Página 10

**Visual:** Contraportada azul oscuro con una trama de líneas geométricas y los logotipos «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
