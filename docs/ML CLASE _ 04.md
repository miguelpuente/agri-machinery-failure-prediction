# Clase N° 4 | Transformación de datos: el primer paso hacia el modelo

**Fuente:** [ML CLASE _ 04.pdf](ML%20CLASE%20_%2004.pdf), páginas 1–15. Transcripción del contenido por página; las notas «Visual» describen elementos observados y no son parte del texto docente. Los encabezados institucionales repetidos muestran `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech. Los ejemplos de código se reproducen como aparecen en la fuente, sin correcciones de comportamiento.

## Página 1

«Talento Tech» — Machine Learning — Clase 4. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas, una con tableta y otra con computadora portátil, junto a un cubo turquesa.

## Página 2

### Clase N° 4 | Transformación de datos: el primer paso hacia el modelo

### Índice

- Objetivo de esta fase del pipeline
- Introducción a Feature Engineering
  - Ejemplo con fechas y márgenes:
  - Transformación de variables categóricas
    - Label Encoding
    - One-Hot Encoding
- Normalización y estandarización de variables numéricas
  - Normalización (Min-Max Scaling)
  - Estandarización (Z-score Scaling)
  - ¿Qué pasa si no escalo los datos?
- Detección y tratamiento de outliers
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Una jornada intensa en Talento Lab
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

En esta clase daremos inicio al proceso técnico de preparación de los datos, etapa clave para que los algoritmos de aprendizaje automático puedan operar de manera eficiente y obtener resultados confiables. Comenzaremos a trabajar sobre la transformación de variables, tanto categóricas como numéricas, aplicando técnicas como la codificación, la normalización y la estandarización. También introduciremos el concepto de ingeniería de características, entendiendo su importancia en la construcción de modelos efectivos. El objetivo es que al finalizar la clase, cada persona sea capaz de identificar qué transformaciones son necesarias en un dataset determinado, y cómo aplicarlas para que los datos estén listos para el entrenamiento de modelos en las próximas etapas.

## Página 3

### Objetivo de esta fase del pipeline

Una vez que los datos han sido explorados, limpiados y comprendidos en profundidad, comienza una etapa crítica en todo proyecto de aprendizaje automático: prepararlos para el modelo. Esta fase no suele ser visible en los resultados finales, pero es decisiva para que el algoritmo pueda aprender correctamente.

Los algoritmos de Machine Learning no trabajan directamente con datos "crudos". Requieren información organizada, cuantificable y libre de ambigüedades. Por eso, necesitamos transformar nuestros datos a un formato adecuado para que puedan ser interpretados y procesados sin errores.

Esta etapa incluye tareas como convertir texto en números, escalar valores que están en diferentes magnitudes, identificar y tratar valores extremos, y —más allá de eso— repensar qué variables son verdaderamente útiles para la tarea que queremos resolver. Todo esto forma parte de lo que se conoce como preparación o transformación de datos, y sin ella, incluso el mejor algoritmo de aprendizaje automático va a ofrecer resultados pobres o inconsistentes.

A partir de ahora, cada paso que demos estará orientado a convertir nuestros datos en un terreno fértil para que los modelos puedan aprender. Porque un modelo bien alimentado —con datos correctamente transformados— siempre tendrá una mayor capacidad de generalización, precisión y utilidad en contextos reales

### Introducción a Feature Engineering

Una de las claves del éxito en cualquier proyecto de Machine Learning no está únicamente en elegir el algoritmo adecuado, sino en cómo representamos los datos que le damos al modelo. Esta tarea se conoce como ingeniería de características, o feature engineering.

En términos simples, una feature es una columna o variable del conjunto de datos que contiene información relevante para el modelo. Cada fila (o instancia) representa un caso particular —por ejemplo, una compra, un cliente o un producto— y las columnas son las características que describen ese caso: precio, fecha, tipo de producto, ubicación, etc.

El feature engineering consiste en crear, seleccionar, transformar o eliminar características con el objetivo de mejorar el rendimiento del modelo. Es una combinación de intuición, análisis, experiencia con los datos y conocimiento del dominio del problema.

**Visual:** Persona trabajando en una computadora portátil ante un panel esquemático con una línea y etiquetas «MARCH», «30K», «TODAY 500K», «WEEK 500K» y «MONTH 500K». Es una ilustración; los rótulos no constituyen un dataset del ejercicio.

## Página 4

Veamos algunos ejemplos:

- En lugar de usar la fecha completa, podríamos extraer el mes o el día de la semana, si creemos que la demanda varía según la estacionalidad.
- Si tenemos una columna con "tipo de envío", podríamos transformarla en variables numéricas para que el modelo la interprete.
- También podríamos crear una nueva variable calculando el margen de ganancia a partir del precio de venta y el costo, si esa relación es importante para la tarea.

Una buena ingeniería de características puede aumentar significativamente la precisión del modelo, incluso más que cambiar de algoritmo. Por eso, en la práctica, se dice que "los datos bien trabajados son más importantes que los modelos sofisticados".

Es en esta etapa donde, como equipo de Talento Lab, empezamos a tomar decisiones importantes: ¿Qué variables conservamos? ¿Cuáles transformamos? ¿Hay información implícita que podríamos convertir en una nueva variable? Estas elecciones marcarán el rumbo del resto del proyecto.

#### Ejemplo con fechas y márgenes:

Estos tres comandos muestran cómo “fabricar” variables más expresivas a partir de campos existentes: dos rasgos temporales que capturan estacionalidad y un margen que resume la relación precio-costo. Son ejemplos típicos de feature engineering:

```python
# Suponemos que 'df' ya tiene una columna 'fecha_compra' en formato datetime
df['mes'] = df['fecha_compra'].dt.month # mes numérico (1-12)
df['dia_semana'] = df['fecha_compra'].dt.dayofweek # 0 = lunes, 6 = domingo

# Nueva característica: margen de ganancia
df['margen'] = df['precio_venta'] - df['costo']
```

#### Transformación de variables categóricas

En todo conjunto de datos es común encontrar columnas que no contienen números, sino categorías. Por ejemplo: el nombre de una ciudad, el tipo de producto, el género de una persona, el método de pago o la marca de un artículo. A estas columnas las llamamos variables categóricas.

Una variable categórica es aquella que toma un conjunto limitado y definido de valores posibles, normalmente representados como texto o etiquetas. Estas variables pueden ser de dos tipos:

**Visual:** El ejemplo de Python está impreso en un recuadro oscuro; los comentarios largos se ajustan visualmente al ancho del recuadro, aquí reunidos en líneas completas. No hay salida de ejecución ni gráficos de resultado.

## Página 5

- Nominales: no tienen un orden específico (por ejemplo, "rojo", "azul", "verde").
- Ordinales: representan una jerarquía o un orden (por ejemplo, "bajo", "medio", "alto").

Las variables categóricas son muy frecuentes en los datos del mundo real y, en muchos casos, contienen información clave para entender el comportamiento de los fenómenos que queremos modelar. Sin embargo, existe un problema: los algoritmos de Machine Learning no pueden trabajar directamente con texto.

Los modelos necesitan entradas numéricas, por lo que debemos transformar esas categorías en números de una manera que conserve su significado sin inducir errores. Este proceso se conoce como codificación de variables categóricas. A continuación, veremos las dos técnicas más comunes para esta tarea:

#### Label Encoding

Consiste en asignar a cada categoría un número entero. Por ejemplo, la variable “Género” con valores “Masculino”, “Femenino” y “Otro” se codificaría como:

- Masculino → 0
- Femenino → 1
- Otro → 2

Es una técnica sencilla y rápida, pero solo debe usarse cuando hay un orden lógico entre las categorías, como en una variable ordinal. Si usamos Label Encoding con variables nominales, el modelo podría interpretar que hay una jerarquía donde no la hay, lo que generaría errores.

#### One-Hot Encoding

Esta técnica crea una nueva columna para cada categoría, con valores binarios (0 o 1) que indican si ese registro pertenece o no a la categoría.

Por ejemplo, si tenemos una variable “Color” con tres categorías: “Rojo”, “Azul” y “Verde”, el resultado sería:

| Rojo | Azul | Verde |
| --- | --- | --- |
| 1 | 0 | 0 |
| 0 | 1 | 0 |
| 0 | 0 | 1 |

**Visual:** Tabla de tres columnas con encabezado azul; cada fila activa una sola categoría, como se reproduce arriba. El ejemplo de «Género» aparece en viñetas, no en un gráfico.

## Página 6

Este método es más seguro cuando trabajamos con variables nominales, ya que no introduce ningún orden implícito entre categorías.

El inconveniente es que puede generar muchas columnas nuevas si la variable tiene muchos valores diferentes (por ejemplo, una columna “Ciudad” con 300 nombres distintos). En esos casos, puede ser conveniente agrupar categorías poco frecuentes en un grupo “Otros”, o usar técnicas más avanzadas como embeddings (aunque no lo abordaremos en este curso).

Transformar correctamente las variables categóricas es un paso indispensable para que los modelos puedan interpretarlas. Como parte del equipo de Talento Lab, esta es una de las tareas que tendrás que abordar en datasets reales, asegurándote de elegir el método adecuado según el tipo de variable, su significado y el modelo que se vaya a utilizar.

#### Ejemplo de codificación de variables:

El primer bloque asigna números consecutivos a una etiqueta ordinal, mientras que el segundo crea columnas binarias para cada opción nominal.

```python
from sklearn.preprocessing import LabelEncoder
import pandas as pd

# LABEL ENCODING – apropiado para categorías con orden implícito
le = LabelEncoder()
df['nivel_riesgo_cod'] = le.fit_transform(df['nivel_riesgo'])
# 'Bajo', 'Medio', 'Alto' → 0,1,2

# ONE-HOT ENCODING – seguro cuando no hay jerarquía
df = pd.get_dummies(df, columns=['tipo_envio'], prefix='envio')
# genera columnas 'envio_Estandar', 'envio_Express', etc. con 0/1
```

**Visual:** Código impreso en un recuadro oscuro; no se muestra una tabla de salida. La correspondencia de códigos indicada es una afirmación del documento, no un resultado de ejecución.

## Página 7

### Normalización y estandarización de variables numéricas

Además de transformar las variables categóricas en números, es fundamental prestar atención a las variables numéricas: aquellas que ya están expresadas como cantidades, porcentajes, precios, temperaturas, unidades vendidas, etc.

A simple vista podría parecer que esas columnas están listas para ser utilizadas por los modelos. Sin embargo, hay un detalle muy importante: las escalas.

#### ¿Cuál es la escala de una variable?

La escala se refiere al rango de valores que puede tomar una variable. Por ejemplo:

- La variable “Precio” podría tener valores entre 100 y 100.000.
- La variable “Cantidad” tal vez vaya de 1 a 50.
- La variable “Descuento” podría expresarse como un número entre 0 y 1.

Estas diferencias de escala pueden afectar negativamente el rendimiento de algunos modelos, ya que ciertas variables numéricamente más grandes pueden "dominar" al resto, incluso si no son más importantes en términos predictivos.

Para solucionar este problema usamos técnicas de escalado de variables. Las más comunes son:

#### Normalización (Min-Max Scaling)

Consiste en re-escalar los valores de una variable para que queden dentro de un rango definido, usualmente entre 0 y 1. Se aplica con la fórmula:

`X_normalizado = (X - Xmínimo) / (Xmáximo - Xmínimo)`

Esto asegura que el valor más bajo de la variable se convierta en 0 y el más alto en 1, y que todos los demás valores queden proporcionalmente en ese rango.

Es especialmente útil cuando:

- Sabemos que los datos tienen un rango acotado.
- Vamos a utilizar modelos basados en distancias, como K-Nearest Neighbors o K-Means.

## Página 8

#### Estandarización (Z-score Scaling)

Esta técnica transforma los datos para que tengan media 0 y desviación estándar 1. Se aplica con la fórmula:

`X_estandarizado = (X - media) / desviación estándar`

Esto significa que, tras la transformación, la mayoría de los valores estarán entre -2 y 2, y los valores extremos estarán más alejados, pero con una distribución centrada. Es más adecuada cuando:

- Los datos no tienen un rango fijo.
- Se usarán modelos que asumen una distribución normal (como regresión logística, SVM o redes neuronales).

#### ¿Qué pasa si no escalo los datos?

Depende del modelo. Algunos modelos como los árboles de decisión, los Random Forest o los Gradient Boosting no son sensibles a la escala de los datos. Pero muchos otros —especialmente los que hacen cálculos geométricos o estadísticos más puros— sí se ven fuertemente afectados si las variables están en escalas distintas.

En síntesis: normalizar o estandarizar no mejora la información en sí, pero sí mejora cómo el modelo interpreta esa información.

Como parte del equipo de Talento Lab, tu trabajo incluirá saber cuándo conviene escalar los datos, cómo hacerlo, y qué técnica es la más adecuada según el problema que estás resolviendo y el modelo que vas a aplicar.

#### Ejemplo de escalado:

En este ejemplo se contrastan las dos técnicas de escalado mencionados: la normalización compacta los valores entre 0 y 1—útil para algoritmos basados en distancias—mientras que la estandarización centra y escala la distribución, lo que ayuda a métodos que asumen normalidad de los datos.

```python
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# --- Normalización Min-Max (0-1) ---
minmax = MinMaxScaler()
df['precio_norm'] = minmax.fit_transform(df[['precio']])

# --- Estandarización Z-score (media 0, σ 1) ---
zscore = StandardScaler()
df['cantidad_std'] = zscore.fit_transform(df[['cantidad']])
```

**Visual:** Fórmula de Z-score y bloque de código en recuadro oscuro; no hay distribución empírica ni gráfico con valores medidos.

## Página 9

### Detección y tratamiento de outliers

En el análisis de datos reales, es muy común encontrarse con valores que se alejan significativamente del resto. Estos valores extremos, conocidos como outliers o valores atípicos, pueden tener distintas causas y efectos. Un outlier puede surgir por un simple error humano al cargar los datos, por un comportamiento verdaderamente inusual del sistema que se está analizando, o incluso por una diferencia en la interpretación de una variable (por ejemplo, si alguien carga un número entero en lugar de un porcentaje).

Imaginemos, por ejemplo, que estamos trabajando con una columna de precios de productos y que la mayoría de los registros están entre los 1.000 y los 10.000 pesos. Si aparece un valor de 250.000, probablemente estemos frente a un outlier. Ahora bien, ¿es un error o es una venta legítima y excepcional? Esa es una de las preguntas que debemos hacernos antes de decidir cómo actuar.

Los outliers no solo alteran la percepción de los datos cuando los analizamos visualmente; también pueden tener un efecto muy fuerte en ciertos modelos de Machine Learning. Esto sucede porque muchos algoritmos —como la regresión lineal o los modelos basados en distancias— se ven muy influenciados por los extremos. Unos pocos valores muy altos o muy bajos pueden alterar la media, distorsionar coeficientes o sesgar las predicciones.

Para detectar outliers, existen diferentes enfoques. A veces basta con observar un gráfico de dispersión, un histograma o un boxplot para notar que hay puntos que “se escapan” del comportamiento general. Otras veces se recurre a criterios estadísticos, como considerar outlier a todo dato que se encuentre a más de tres desviaciones estándar de la media, o utilizar el rango intercuartílico para establecer límites razonables. También hay métodos automáticos y más complejos que se utilizan cuando se trabaja con grandes volúmenes de datos o sistemas en tiempo real, pero no los abordaremos en esta instancia del curso.

Una vez que se detectan los valores atípicos, hay que decidir qué hacer con ellos. No existe una única respuesta correcta. En algunos casos, lo mejor será eliminarlos si se comprueba que son errores o registros residuales. En otros, se podrá corregirlos manualmente si se identifica el motivo del desvío. También es posible “caparlos”, es decir, limitar su valor a un máximo o mínimo razonable. Incluso puede ser útil transformarlos mediante funciones matemáticas —como el logaritmo— para suavizar su impacto. Y por supuesto, puede suceder que el outlier sea un dato real y útil, que conviene conservar para que el modelo aprenda a manejar esos casos excepcionales.

**Visual:** Dos ilustraciones de personas ante pantallas con gráficos de líneas, barras y círculos esquemáticos. No hay una figura estadística con puntos o umbrales etiquetados: los valores 1.000, 10.000 y 250.000 se dan en el texto.

## Página 10

Lo más importante es no aplicar soluciones automáticas. Los outliers deben analizarse con atención, considerando el contexto y el propósito del modelo. A veces son errores que hay que corregir; otras veces son señales valiosas que conviene preservar.

En Talento Lab, por ejemplo, si se detectan compras inusuales con montos extremadamente altos, el equipo deberá evaluar si se trata de errores de carga o de operaciones reales, y decidir qué hacer con esa información antes de pasar a la etapa de modelado. Como verás, los outliers no solo afectan los números: también desafían nuestra capacidad de interpretar y tomar decisiones informadas.

### Reflexión final

Transformar los datos puede parecer una tarea puramente técnica, pero en realidad es una de las etapas más estratégicas de todo proyecto de aprendizaje automático. En esta clase vimos que no alcanza con que los datos estén limpios: también deben estar listos para ser comprendidos por los algoritmos.

Aprendimos que elegir, codificar, escalar y ajustar correctamente las variables no solo mejora el rendimiento de un modelo, sino que puede marcar la diferencia entre una solución útil y una que no aporta valor. Además, vimos cómo los valores atípicos, si no se tratan adecuadamente, pueden distorsionar nuestros resultados sin que nos demos cuenta.

A partir de este punto, comenzamos a movernos hacia el corazón del Machine Learning. Todo lo que hicimos hasta ahora —explorar, limpiar, transformar— tiene un propósito: enseñarle al modelo a aprender de manera efectiva. Lo que viene es el inicio de esa enseñanza: el entrenamiento, la validación y la evaluación de nuestros primeros modelos.

Pero ningún modelo aprende bien si los datos no fueron preparados con criterio y responsabilidad. Esa es, justamente, la fortaleza que empezamos a construir hoy.

### Materiales y recursos adicionales:

#### Lecturas recomendadas

- **Feature Engineering en Español - Coursera.** Un curso en línea que explora los beneficios de utilizar herramientas como Vertex AI Feature Store, cómo mejorar la exactitud de los modelos de aprendizaje automático y [cómo descubrir cuáles columnas de datos producen los atributos más útiles](https://www.coursera.org/learn/feature-engineering-es?utm_source=chatgpt.com).
- **Técnicas de Feature Engineering | Algoretico.** Este artículo profundiza en diversas técnicas de ingeniería de características, destacando su papel crucial en la [transformación y creación de nuevas variables](https://algoretico.it/es/magazine/tech/feature-engineering?utm_source=chatgpt.com) para mejorar el rendimiento de los modelos.

## Página 11

#### Videos

- **La INGENIERÍA DE CARACTERÍSTICAS (feature engineering).** Este video ofrece una explicación detallada sobre [qué es la ingeniería de características, su importancia en el aprendizaje automático y cómo aplicarla](https://www.youtube.com/watch?v=H7XkA5pSaps) para mejorar el rendimiento de los modelos.
- **Escalamiento, Normalización y Estandarización de Datos con Python para Ciencia de Datos.** En este video se aborda la problemática ocasionada por tener diferentes escalas en los datos y [se explican técnicas de escalamiento, normalización y estandarización utilizando Python](https://www.youtube.com/watch?v=-VuR14Qyl7E&list=PLat2DtY8K7YU_KKVCUvQkCbTM0cNrsCOP&index=1), fundamentales para el preprocesamiento en proyectos de ciencia de datos.

### Preguntas para reflexionar:

1. ¿Por qué es necesario transformar los datos antes de entrenar un modelo de Machine Learning? ¿Qué problemas podría generar no hacerlo?
2. ¿En qué situaciones sería más apropiado usar One-Hot Encoding y en cuáles convendría utilizar Label Encoding? ¿Qué consecuencias podría tener una elección incorrecta?
3. ¿Cómo influye la escala de las variables numéricas en el comportamiento de los modelos? ¿Qué técnicas existen para resolver posibles desbalances?
4. Frente a la presencia de valores atípicos en un dataset, ¿qué criterios utilizarías para decidir si conservarlos, corregirlos o eliminarlos?

## Página 12

### Una jornada intensa en Talento Lab

Finalizada la reunión de planificación, el equipo de Talento Lab se dividió tareas para preparar el conjunto de datos recibido por el cliente, una empresa del sector consumo masivo que busca optimizar su estrategia de distribución regional.

Sabrina organizó el entorno técnico para realizar pruebas, mientras Matías y Luis detectaron que algunas variables venían en formato de texto, otras tenían rangos de valores muy dispares, y había registros atípicos que generaban sospechas. Silvia, por su parte, dejó en claro que esta etapa es tan importante como el modelado: “No podemos esperar que el algoritmo funcione bien si no le damos datos en condiciones de ser comprendidos”.

Ahora es tu turno. Como parte del equipo, te corresponde aplicar algunas de las transformaciones fundamentales que permitirán que el modelo pueda ser entrenado en etapas futuras. No se trata solo de aplicar técnicas: se trata de tomar decisiones informadas, documentar tus elecciones y justificar por qué cada transformación es necesaria.

**Visual:** Logotipo «Talento Lab» junto al relato; no hay captura del dataset del cliente.

## Página 13

### Ejercicio práctico

Utilizando el dataset titanic (lo podes encontrar [ACA](https://drive.google.com/file/d/1NGiCEP8_2hILAC8nOQvC_UZlYzgenv0f/view?usp=drive_link)) o utilizando un dataset real (por ejemplo, uno de Kaggle, Datos.gob.ar o un conjunto de datos propio), realizá las siguientes tareas dentro de un cuaderno Jupyter (Google Colab).

1. Identificá variables categóricas y numéricas dentro del dataset. Analizá si alguna columna con texto puede codificarse y con qué técnica (Label o One-Hot Encoding).
2. Aplicá técnicas de codificación sobre al menos dos variables categóricas. Justificá tu elección explicando por qué usaste cada técnica.
3. Escalá o estandarizá al menos dos variables numéricas. Indicá qué técnica usaste en cada caso (Min-Max o Z-score) y por qué sería conveniente hacerlo, pensando en un modelo hipotético.
4. Buscá posibles outliers. Usá un gráfico (boxplot, histograma o scatterplot) para visualizarlos y explicá qué decisión tomarías: ¿los conservarías, los eliminarías o aplicarías alguna transformación?

Documentá todo tu trabajo con comentarios y celdas de texto claras. Este notebook es parte de tu entrenamiento como miembro del equipo técnico de Talento Lab, y puedes compartirlo para ser revisado por tus compañeros como si estuvieras participando en una revisión de código colaborativa.

## Página 14

### Próximos pasos

En la próxima etapa del curso comenzaremos a trabajar directamente con los algoritmos de aprendizaje automático. Ya con los datos correctamente transformados, es momento de dar el siguiente paso: entrenar nuestros primeros modelos.

Vamos a explorar cómo se lleva a cabo el proceso de entrenamiento, cómo dividir los datos en conjuntos de entrenamiento y prueba, y cómo evaluar la calidad de las predicciones. También veremos cómo elegir qué tipo de modelo aplicar según el problema que queremos resolver, y qué métricas utilizar para medir su desempeño.

El equipo de Talento Lab está a punto de entrar en la fase central del proyecto. La calidad del trabajo realizado hasta ahora será determinante para que el modelo pueda aprender de forma efectiva. Lo que se viene es la parte más emocionante: empezar a ver los primeros resultados predictivos.

## Página 15

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
