# Clase N° 6 | Predecir con regresión lineal

**Fuente:** [ML CLASE _ 06.pdf](ML%20CLASE%20_%2006.pdf), páginas 1–13. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores repiten `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech. La ecuación múltiple de la página 3 contiene glifos no representados correctamente en el PDF; se señala sin completarlos por inferencia.

## Página 1

«Talento Tech» — Machine Learning — Clase 6. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas usando una tableta y una computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 6 | Predecir con regresión lineal

### Índice

- ¿Qué es la regresión lineal?
  - Ejemplos de usos de la regresión lineal:
- Entrenamiento de un modelo de regresión lineal con Scikit-learn
- Evaluación del modelo de regresión
  - MAE – Error absoluto medio
  - MSE – Error cuadrático medio
  - RMSE – Raíz del error cuadrático medio
  - R² – Coeficiente de determinación
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

En esta clase nos introduciremos al uso de modelos de regresión dentro del aprendizaje automático, comenzando con uno de los más simples y potentes: la regresión lineal. Exploraremos su lógica, su representación gráfica y cómo se aplica cuando el objetivo es predecir un valor numérico continuo. Aprenderemos a entrenar este tipo de modelo utilizando Scikit-learn y a evaluar su desempeño mediante distintas métricas, como MAE, MSE, RMSE y R², comprendiendo qué mide cada una y cuándo conviene utilizarlas.

Al finalizar la clase, seremos capaces de construir un modelo de regresión lineal sencillo, entrenarlo con datos reales y analizar sus resultados con criterios técnicos claros y razonados.

## Página 3

### ¿Qué es la regresión lineal?

La regresión lineal es uno de los modelos más simples y utilizados en Machine Learning supervisado. Su objetivo es predecir el valor de una variable numérica continua a partir de una o más variables independientes (también llamadas "predictoras" o "features").

Este modelo se basa en una idea muy intuitiva: ajustar una línea recta que represente la relación entre las variables. Si al observar un gráfico de dispersión entre dos variables se nota una tendencia creciente o decreciente, la regresión lineal intenta “dibujar” la mejor línea posible que pase entre los puntos, minimizando la distancia entre ellos y la recta.

La fórmula de una regresión lineal simple es:

`y = a·x + b`

Donde:

- x es la variable predictora (por ejemplo, cantidad de horas estudiadas),
- y es la variable objetivo (por ejemplo, puntaje en un examen),
- a es la pendiente de la recta (cuánto aumenta y cada vez que x aumenta en una unidad),
- b es el intercepto (el valor de y cuando x es cero).

En la práctica, cuando usamos varios predictores, la fórmula se amplía a una versión con múltiples coeficientes:

`y = a₁·x₁ + a₂·x₂ + ... + a[glifo ilegible]·x[glifo ilegible] + b`

Este tipo de regresión se llama regresión lineal múltiple y permite incorporar más información para hacer mejores predicciones.

**Visual:** Gráfico ilustrativo verde con ejes sin escala, cruces blancas dispersas y una recta ascendente que atraviesa la nube de puntos. La ecuación múltiple impresa muestra dos cuadros/glifos defectuosos después del último `a` y `x`; no es posible recuperar sus subíndices de esta fuente.

## Página 4

#### Ejemplos de usos de la regresión lineal:

- Predecir el precio de una casa en función de su tamaño en metros cuadrados, su ubicación y la cantidad de ambientes.
- Estimar el ingreso mensual de una persona en función de su edad, años de estudio y experiencia laboral.
- Anticipar la duración de una entrega en días, a partir de la distancia, el tipo de transporte y el clima.
- Calcular el valor esperado de un producto según las búsquedas que recibió en una tienda online, su historial de ventas y la época del año.

En todos estos casos, lo que queremos predecir es un número, no una categoría. Por eso, la regresión lineal es una herramienta clave cuando el problema no es “¿A qué clase pertenece esto?”, sino “¿Cuánto vale esto aproximadamente?”.

La regresión lineal se utiliza siempre que el objetivo del análisis sea predecir una variable numérica continua a partir de una o más variables independientes. Esto significa que lo que queremos estimar es un número, no una etiqueta o categoría.

A diferencia de los modelos de clasificación, que intentan responder a preguntas como “¿Este cliente es leal o no?”, “¿Este mail es spam?”, o “¿Este tumor es benigno o maligno?”, los modelos de regresión intentan predecir valores como “¿Cuánto va a costar?”, “¿Cuántas unidades se venderán?”, o “¿Cuál será el tiempo de espera?”.

**Visual:** Recuadro titulado «Regresión Lineal: Distancia vs. Días de Entrega» con casas como puntos y línea roja DESCENDENTE; eje vertical «Distancia a la Casa (km)» y horizontal «Días Estimados de Llegada». Se describe la dirección y los rótulos tal como aparecen, sin presentar la figura como evidencia empírica ni corregir la aparente contradicción con el ejemplo verbal.

## Página 5

La regresión lineal es especialmente útil cuando:

- La variable objetivo tiene un comportamiento aproximadamente lineal en relación con una o más variables independientes.
- Se necesita una solución rápida, interpretable y eficiente.
- El objetivo es obtener una estimación numérica aproximada, más que una decisión binaria o categórica.

La regresión lineal encuentra aplicaciones en una gran variedad de contextos del mundo real. Por ejemplo, en el área de marketing, puede utilizarse para predecir cuánto gastará un cliente durante el próximo mes a partir de su historial de compras, la cantidad de visitas al sitio web y el uso de cupones o descuentos. En el ámbito de la salud, permite estimar la duración de la internación de un paciente tomando en cuenta variables como la edad, el diagnóstico y ciertos valores de laboratorio.

En logística, es una herramienta valiosa para anticipar el tiempo estimado de entrega de productos, considerando el tipo de transporte, la distancia al destino y las condiciones de tránsito o clima. Incluso en el sector educativo, la regresión puede utilizarse para predecir el puntaje final de un estudiante en función de sus calificaciones previas, entregas de trabajos y rendimiento en evaluaciones parciales.

En todos estos casos, la regresión lineal permite convertir un conjunto de datos en una estimación numérica útil para la toma de decisiones. El modelo no busca decir “sí” o “no”, ni agrupar en categorías, sino estimar un valor con la mayor precisión posible. Por eso, antes de elegir regresión lineal como enfoque, es fundamental asegurarse de que el problema realmente sea de tipo numérico y continuo.

**Visual:** Persona dibujada frente a una composición de símbolos matemáticos esquemáticos; las expresiones decorativas no son fórmulas del ejercicio ni datos observados.

## Página 6

### Entrenamiento de un modelo de regresión lineal con Scikit-learn

Una vez que tenemos un conjunto de datos limpio y bien estructurado, y hemos definido qué variable queremos predecir, estamos listos para entrenar nuestro primer modelo de regresión lineal. Para eso, utilizamos una herramienta fundamental en el ecosistema de Python: la librería Scikit-learn.

Scikit-learn proporciona una clase llamada `LinearRegression`, que permite crear, entrenar y evaluar modelos de regresión lineal de forma simple y eficiente. El proceso comienza instanciando el modelo, luego se entrena utilizando el método `.fit()` y, una vez entrenado, se realizan predicciones con `.predict()`.

Supongamos que estamos trabajando con un dataset que contiene datos sobre propiedades inmobiliarias. Tenemos columnas como la superficie en metros cuadrados, la cantidad de habitaciones, y la antigüedad del inmueble. Si queremos predecir el precio de venta, seleccionamos esas columnas como variables predictoras, y la columna “precio” como variable objetivo. Con el modelo `LinearRegression`, lo entrenamos usando `.fit(X_train, y_train)` y luego predecimos con `.predict(X_test)`.

El modelo analiza la relación que existe entre las variables independientes y la variable a predecir, y ajusta una fórmula matemática que mejor representa esa relación. Esa fórmula toma la forma de una ecuación lineal con coeficientes, donde cada coeficiente indica cuánto influye cada variable en la predicción final.

Es importante entender que este modelo no memoriza los datos, sino que encuentra una estructura matemática general que le permite estimar valores aún cuando se enfrenta a nuevos ejemplos. Esa capacidad de generalizar —de aprender de los datos y aplicar lo aprendido a situaciones nuevas— es lo que lo convierte en una herramienta útil para predecir valores reales en contextos de negocio, salud, educación, transporte y muchos otros.

Entrenar un modelo de regresión lineal con Scikit-learn no es solo una cuestión de código; es también una oportunidad para pensar en los datos de manera estratégica: ¿qué variables explican realmente lo que quiero predecir? ¿Qué relación tienen entre sí? ¿Estoy capturando algo significativo o solo ruido?

Estas preguntas serán clave cuando pasemos a la etapa de evaluación del modelo, donde aprenderemos a interpretar los resultados y medir qué tan buenas son nuestras predicciones.

**Visual:** Logotipo de scikit-learn junto al texto; esta página menciona métodos pero no contiene un bloque de código ejecutable ni resultados del entrenamiento.

## Página 7

### Evaluación del modelo de regresión

Una vez que un modelo ha sido entrenado, necesitamos saber si realmente está funcionando bien. Evaluar un modelo significa medir de manera objetiva qué tan buenas son sus predicciones frente a los valores reales. Es decir, si el modelo predice que una casa se venderá en 100.000 pesos, pero en realidad se vendió por 120.000, ¿cuán grave es ese error? ¿Qué tan lejos estuvo el modelo de la realidad? ¿Y si ese error se repite mucho o solo fue un caso aislado?

La evaluación del modelo es lo que nos permite responder estas preguntas y, en consecuencia, tomar decisiones informadas sobre si el modelo es útil, si necesita mejoras o si debemos probar con otro enfoque. En los problemas de regresión —donde lo que queremos predecir es un número— existen distintas métricas que nos ayudan a cuantificar el rendimiento del modelo desde distintos ángulos. Veamos cuales son:

#### MAE – Error absoluto medio

El MAE, por sus siglas en inglés Mean Absolute Error, mide el promedio de las diferencias absolutas entre las predicciones del modelo y los valores reales. Es una forma directa de saber, en promedio, cuánto se equivoca el modelo.

Por ejemplo, si un modelo predice el precio de propiedades y el MAE es de 8.500, podemos decir que, en promedio, el modelo se equivoca por 8.500 pesos. Esta métrica es fácil de interpretar porque conserva las mismas unidades que la variable que se está prediciendo. Es útil cuando necesitamos dar una idea general del “margen de error” esperado.

En contextos como la predicción de gastos mensuales, tiempos de entrega o consumo energético, el MAE es muy valorado porque da una medida clara de cuánto podemos esperar que el modelo se desvíe de la realidad, sin exagerar los errores grandes.

**Visual:** Diagrama con puntos azules, recta ascendente verde, ejes «inputs» y «outputs» y segmentos verticales rojos que indican diferencias respecto de la recta; uno está rotulado «MAE». No hay valores numéricos en los ejes.

## Página 8

#### MSE – Error cuadrático medio

El MSE, o Mean Squared Error, también calcula la diferencia entre lo predicho y lo real, pero eleva al cuadrado cada error antes de promediar. Esto significa que penaliza mucho más los errores grandes que los pequeños.

Esta métrica es especialmente útil cuando queremos que el modelo sea muy sensible a los errores grandes. Por ejemplo, en un modelo que estima cuánto tiempo un paciente debe permanecer internado, un error de 10 días puede ser mucho más grave que uno de 1 día, y el MSE reflejará esa diferencia.

El principal inconveniente del MSE es que, al elevar los errores al cuadrado, sus unidades ya no coinciden con las de la variable original, lo que puede dificultar su interpretación directa. Sin embargo, es muy útil cuando se busca minimizar grandes desviaciones.

#### RMSE – Raíz del error cuadrático medio

El RMSE, o Root Mean Squared Error, es simplemente la raíz cuadrada del MSE. Tiene la ventaja de que, al tomar la raíz, recupera las unidades originales de la variable predicha, lo que facilita su interpretación. Al igual que el MSE, da más peso a los errores grandes, pero de forma más moderada.

Por eso, el RMSE se considera una métrica intermedia entre MAE y MSE: conserva sensibilidad a errores grandes, pero sin exagerarlos tanto, y sigue siendo fácil de explicar.

Si estamos estimando el valor de un vehículo o el tiempo de duración de un viaje, y queremos una medida que penalice errores importantes pero que aún sea entendible, el RMSE suele ser una excelente opción.

**Visual:** Gráfico de puntos azules y recta verde con dos cuadrados rojos de tamaños diferentes entre puntos y la recta; el mayor está rotulado «MSE». Ejes «inputs» y «outputs» sin escala numérica.

## Página 9

#### R² – Coeficiente de determinación

El R², conocido como coeficiente de determinación, es una métrica distinta a las anteriores. En lugar de medir el error promedio, evalúa qué proporción de la variabilidad de la variable objetivo puede ser explicada por el modelo.

Su valor va de 0 a 1 (aunque puede ser negativo si el modelo es peor que simplemente predecir el promedio). Un valor cercano a 1 indica que el modelo explica bien los datos, mientras que un valor cercano a 0 indica que el modelo no está captando la relación entre las variables.

El R² es muy útil cuando se quiere saber cuánto aporta el modelo respecto de no hacer ninguna predicción o usar una estimación promedio. Por ejemplo, si estamos prediciendo la duración de una entrega y el R² es de 0.85, eso indica que el 85% de la variabilidad en los tiempos de entrega se explica con las variables que estamos usando. Eso es una muy buena señal.

Sin embargo, hay que tener cuidado: un R² alto no garantiza que el modelo sea bueno. Puede haber sobreajuste, o puede que se estén explicando bien los datos de entrenamiento pero no los nuevos. Por eso, siempre conviene mirar varias métricas al mismo tiempo.

### Reflexión final

Hoy dimos un paso importante: pasamos de preparar datos a construir nuestro primer modelo predictivo completo. Conocimos la regresión lineal, no solo como una fórmula matemática, sino como una herramienta concreta para responder a preguntas que involucran números reales, estimaciones, proyecciones y decisiones basadas en datos.

Aprendimos que evaluar un modelo no se trata de obtener un único número mágico, sino de analizar distintos aspectos de su comportamiento: qué tan cerca está de los valores reales, cuánto se equivoca en promedio, qué tan graves son sus errores más grandes, y qué tanto logra explicar lo que ocurre en los datos.

Las métricas que usamos —MAE, MSE, RMSE, R²— no son solo fórmulas: son lentes distintas para mirar el desempeño de un modelo, y cada una nos ofrece una perspectiva que puede ayudarnos a mejorar, ajustar o replantear nuestras decisiones.

La regresión lineal es solo el comienzo. A partir de ahora, vamos a explorar modelos más complejos, y cada uno traerá nuevas ideas, nuevas métricas y nuevos desafíos. Pero lo que aprendimos hoy —que los modelos se construyen, se prueban y se justifican con criterio— será la base de todo lo que viene.

### Materiales y recursos adicionales:

Para seguir explorando y consolidando tus conocimientos sobre regresión lineal y su implementación en Python con Scikit-learn, te recomendamos los siguientes recursos:

## Página 10

- **Sklearn Regresión lineal: Una guía completa con ejemplos:** Este tutorial de DataCamp ofrece una [explicación detallada sobre la regresión lineal, su propósito y cómo implementarla utilizando Scikit-learn](https://www.datacamp.com/es/tutorial/linear-regression-in-python), incluyendo ejemplos prácticos.
- **Una Guía Para Principiantes Sobre La Regresión Lineal En Python Con Scikit-Learn:** Este artículo de DataSource.ai proporciona [una introducción a la regresión lineal en Python con Scikit-learn](https://www.datasource.ai/es/data-science-articles/una-guia-para-principiantes-sobre-la-regresion-lineal-en-python-con-scikit-learn), explicando cómo predecir el valor de una variable dependiente basándose en una variable independiente dada.
- **Regresión Lineal Python Sklearn [DESDE CERO]:** Este video tutorial en YouTube te [guía paso a paso en el uso de Scikit-learn para realizar regresiones lineales en Python](https://www.youtube.com/watch?v=9IZ6OPQWtpw), ideal para quienes prefieren el aprendizaje visual.
- **Video: "Las Mejores Métricas para Evaluar Modelos de Regresión con Scikit-learn":** Se explican [seis de las mejores métricas para evaluar modelos de regresión](https://www.youtube.com/watch?v=pho0pdqWMu8), calculadas a partir de los resultados obtenidos con Scikit-learn.

Estos recursos te permitirán profundizar en la teoría y práctica de la regresión lineal, así como familiarizarte con las herramientas más utilizadas en la industria para su implementación y evaluación.

### Preguntas para reflexionar:

1. ¿Por qué creés que es importante contar con varias métricas al momento de evaluar un modelo de regresión? ¿Qué podría pasar si solo consideramos una?
2. ¿En qué tipo de problemas reales te parece más útil aplicar un modelo de regresión lineal? ¿Y en cuáles creés que no sería suficiente?
3. ¿Cómo interpretarías un valor de R² cercano a cero en un modelo que, a simple vista, parece funcionar bien? ¿Qué otras métricas consultarías para entender qué está pasando?
4. Al entrenar tu modelo, ¿cómo decidiste qué variables usar? ¿Qué criterios aplicarías en el futuro para seleccionar o descartar variables antes de construir un modelo?

### Analizando métricas en Talento Lab

## Página 11

Una vez que el equipo de Talento Lab logró estabilizar su flujo de trabajo y preparar los datos del cliente, Silvia recibió una nueva solicitud: estimar el gasto promedio por cliente en función de variables como edad, ubicación, frecuencia de compra y tipo de producto. Ya no se trata de clasificar ni de identificar grupos, sino de predecir un valor numérico continuo, una cifra que pueda ayudar a anticipar ingresos, planificar promociones o definir perfiles de consumo.

Luis propuso utilizar regresión lineal como punto de partida. “Es un modelo fácil de interpretar, y si funciona bien, puede darnos respuestas rápidas y accionables”, explicó. Sabrina, por su parte, se encargará de preparar las variables numéricas, mientras Matías se concentrará en analizar qué métricas utilizarán para evaluar el rendimiento del modelo. Silvia les recuerda que no basta con hacer predicciones: es necesario justificar por qué un modelo funciona, cómo se comporta frente a diferentes escenarios, y qué tan confiables son sus resultados.

### Ejercicio práctico

Ahora es tu turno. Como parte del equipo, deberás replicar este primer modelo de regresión lineal utilizando un conjunto de datos real. El foco estará en construir un modelo funcional y evaluar su desempeño usando múltiples métricas.

1. Seleccioná un conjunto de datos que contenga al menos una variable numérica continua como objetivo a predecir (por ejemplo: precio, duración, cantidad, consumo, etc.). Puede ser uno de Kaggle, Datos Abiertos, UCI o una fuente confiable.
2. Realizá una preparación mínima del dataset: limpieza, selección de variables relevantes y división en conjuntos de entrenamiento y prueba.
3. Entrená un modelo de regresión lineal utilizando Scikit-learn. Luego, realizá predicciones sobre el conjunto de prueba.
4. Calculá al menos cuatro métricas: MAE, MSE, RMSE y R². Agregá una breve interpretación de cada resultado, explicando qué significa y cómo lo evaluarías en función del contexto del problema.
5. Documentá todo tu trabajo en un cuaderno Jupyter. Asegurate de incluir celdas de texto que expliquen tu razonamiento, tus elecciones y tus observaciones sobre los resultados obtenidos.

Este ejercicio no solo pone en práctica lo aprendido, sino que también te acerca a una situación real de análisis en proyectos de datos. El modelo que construyas acá puede

**Visual:** Logotipo «Talento Lab» junto al relato. No se presenta un dataset ni una tabla de métricas obtenidas.

## Página 12

servir como punto de partida para el modelo que presentarás en la etapa final del proyecto integrador.

### Próximos pasos

Con esta clase iniciamos formalmente el trabajo con modelos predictivos. A partir de ahora, vamos a profundizar en diferentes algoritmos de aprendizaje automático, cada uno con sus propias características, ventajas y desafíos.

En la próxima clase exploraremos la Regresión Logística, un modelo pensado para problemas de clasificación, en los que el objetivo no es predecir un valor numérico, sino determinar si una instancia pertenece a una categoría u otra. Será nuestra puerta de entrada al mundo de la clasificación binaria y de las métricas específicas que requiere este tipo de tareas, como la precisión, el recall, el F1-score y la matriz de confusión.

La experiencia adquirida hoy con la regresión lineal —desde el entrenamiento hasta la interpretación de resultados— servirá como base conceptual y práctica para seguir desarrollando tus habilidades como analista de datos y constructor de modelos. Lo importante es no perder de vista que cada modelo responde a un tipo de pregunta distinta, y que la elección correcta depende siempre del problema que queremos resolver.

## Página 13

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
