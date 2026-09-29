# Clase N° 3 | ¿Qué es Machine Learning?

**Fuente:** [ML CLASE _ 03.pdf](ML%20CLASE%20_%2003.pdf), páginas 1–13. Transcripción del contenido por página; las notas «Visual» describen elementos observados y no son parte del texto docente. Los encabezados institucionales repetidos muestran `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 3. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas, una con tableta y otra con computadora portátil, junto a un cubo turquesa.

## Página 2

### Clase N° 3 | ¿Qué es Machine Learning?

### Índice

- ¿Qué es el aprendizaje automático?
- Importancia y diferencias respecto a técnicas tradicionales
- Tipos de aprendizaje: supervisado y no supervisado
- Ciclo de vida de un proyecto de Machine Learning
  1. Recolección y comprensión de los datos
  2. Análisis exploratorio de datos (EDA) y limpieza
  3. Preprocesamiento y preparación de los datos
  4. Selección y entrenamiento del modelo
  5. Evaluación del modelo
  6. Implementación y monitoreo
  7. Mantenimiento y mejora continua
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Trabajando en Machine Learning en Talento Lab
- Ejercicio práctico
- Próximos pasos

### Objetivos de la clase:

En esta clase nos introduciremos al campo del aprendizaje automático, estableciendo una base conceptual sólida que servirá de punto de partida para el desarrollo de modelos en las etapas siguientes. Abordaremos qué es el Machine Learning y cuál es su rol dentro de la ciencia de datos, así como los principales tipos de aprendizaje que existen: supervisado y no supervisado. Finalmente, conoceremos cómo se estructura y organiza el ciclo de vida de un proyecto de Machine Learning, desde la recolección de datos hasta la implementación y puesta en producción de modelos predictivos. Todo esto nos permitirá comprender mejor cómo se integrarán estas prácticas en las próximas clases.

## Página 3

### ¿Qué es el aprendizaje automático?

El aprendizaje automático, conocido mundialmente como Machine Learning (ML), es una rama de la inteligencia artificial que permite a las computadoras aprender de los datos y realizar predicciones o tomar decisiones sin estar programadas de manera explícita para cada tarea.

A diferencia de un sistema tradicional donde un programador especifica todas las reglas y condiciones que debe seguir el programa, en Machine Learning el enfoque es diferente: el sistema “aprende” directamente de los datos históricos y ajusta su comportamiento para resolver un problema.

El aprendizaje automático es fundamental en el entorno actual, donde las organizaciones generan y almacenan grandes volúmenes de datos de manera constante. Desde recomendaciones de productos en un e-commerce hasta la predicción de fraudes en tarjetas de crédito, las soluciones de Machine Learning están presentes en muchos aspectos de la vida cotidiana y en múltiples sectores de la industria.

Lo que distingue a esta disciplina es su capacidad para generalizar. Es decir, un modelo de aprendizaje automático no sólo memoriza los datos con los que fue entrenado, sino que intenta identificar patrones y reglas subyacentes que le permitan predecir o clasificar nuevos datos que no ha visto antes.

El Machine Learning busca automatizar la capacidad de “aprender” de la experiencia (los datos) para luego aplicar ese aprendizaje a situaciones nuevas, reduciendo la necesidad de intervención humana constante.

**Visual:** Ilustración de documentos entrando a una figura robótica en una pantalla; a la derecha aparecen paneles con barras y un gráfico circular. Se lee «DATA EXTRACTION» en el robot; no hay valores numéricos de resultados.

## Página 4

### Importancia y diferencias respecto a técnicas tradicionales

El enfoque tradicional de programación se basa en definir una serie de reglas fijas. Por ejemplo, si quisiéramos crear un sistema que clasifique correos electrónicos como "spam" o "no spam", en un enfoque clásico tendríamos que definir manualmente decenas de reglas: si el asunto contiene determinadas palabras, si hay demasiados enlaces, si el remitente está en una lista negra, etc.

El problema es que este tipo de reglas son rígidas y difíciles de mantener, especialmente cuando la naturaleza de los datos cambia rápidamente, como ocurre en casi cualquier entorno real. Aquí es donde el Machine Learning aporta una ventaja significativa: permite que el sistema descubra automáticamente esas reglas y relaciones a partir de los propios datos, ajustando sus predicciones conforme se entrena con nuevos ejemplos.

El aprendizaje automático se vuelve indispensable en situaciones donde:

- Hay una gran cantidad de datos que no podemos revisar manualmente.
- Las relaciones entre las variables no son obvias o son muy complejas.
- Los datos evolucionan y las soluciones necesitan adaptarse a lo largo del tiempo.

Mientras que en la programación tradicional las reglas son estáticas y dependen de la capacidad humana para definirlas, en Machine Learning el modelo aprende y mejora continuamente a medida que se expone a más datos.

En la práctica, esto permite que las empresas puedan generar sistemas más robustos, que ahorren tiempo, reduzcan errores y logren resultados más precisos a partir de información histórica, algo clave para aplicaciones como la predicción de la demanda, la segmentación de clientes o la detección automática de anomalías.

**Visual:** Persona con tableta frente a una pantalla ilustrada con una línea de puntos, barras y otros controles; no hay ejemplos de spam etiquetados en el dibujo.

## Página 5

### Tipos de aprendizaje: supervisado y no supervisado

En el aprendizaje automático existen distintos enfoques o "tipos" de aprendizaje, y la elección entre ellos dependerá del tipo de problema que se quiera resolver y de la disponibilidad de datos. Los dos tipos principales que se utilizan en la mayoría de los proyectos son aprendizaje supervisado y aprendizaje no supervisado.

El aprendizaje supervisado es aquel en el que los datos con los que entrenamos al modelo ya vienen acompañados de una "etiqueta" o "respuesta" conocida. Por ejemplo, si quisiéramos predecir la demanda de un producto, tendríamos un historial con variables como la fecha, la categoría del producto, el precio y, como variable objetivo, la cantidad vendida. En este tipo de aprendizaje, el modelo analiza los datos históricos y busca patrones que expliquen la relación entre las características (features) y la variable objetivo.

Los problemas de aprendizaje supervisado más comunes se dividen en dos grandes categorías:

- Regresión, cuando la variable objetivo es continua (como predecir un monto en pesos, la temperatura, o la cantidad de unidades vendidas).
- Clasificación, cuando la variable objetivo es una categoría o clase (como determinar si un cliente es "fiel" o "ocasional", o si un correo es "spam" o "no spam").

El aprendizaje no supervisado, en cambio, se utiliza cuando no contamos con una variable objetivo o etiqueta en los datos. Aquí el objetivo es descubrir estructuras o patrones ocultos en la información. El modelo "aprende" sobre los datos sin saber de antemano cuál es la respuesta correcta.

Un ejemplo típico de aprendizaje no supervisado es el clustering, que busca agrupar datos similares entre sí. Un caso común sería segmentar a los clientes de una empresa en distintos grupos (clusters) según sus hábitos de compra, sin tener una etiqueta previa que indique a qué grupo pertenece cada cliente.

**Visual:** Dos personas observan un panel ilustrado con mapa, barras, líneas y círculos. Es una ilustración genérica de análisis; no compara visualmente los dos tipos de aprendizaje con datos concretos.

## Página 6

En síntesis, la diferencia clave radica en si el dataset tiene o no etiquetas que guíen al modelo.

- Si las tiene, estaremos ante un problema supervisado.
- Si no las tiene y buscamos patrones o agrupaciones, será un problema no supervisado.

Más adelante, en este curso, trabajaremos con ambos enfoques a través de ejemplos concretos.

### Ciclo de vida de un proyecto de Machine Learning

El aprendizaje automático no es solo un proceso de entrenamiento de modelos, sino que es parte de un ciclo de vida completo que va desde la recolección de datos hasta la implementación final del modelo en un entorno real.

Comprender este ciclo es fundamental porque nos permite visualizar el flujo de trabajo de principio a fin y entender que cada etapa influye directamente en la calidad de las predicciones que obtendremos.

Un proyecto típico de Machine Learning se puede dividir en las siguientes etapas:

**1. Recolección y comprensión de los datos**

Todo proyecto comienza con la obtención de los datos, que pueden provenir de diversas fuentes: bases de datos internas, archivos CSV o Excel, APIs, registros históricos, etc. Además de recolectar la información, es necesario entender su contexto: ¿qué representan las variables?, ¿cómo fueron recolectadas?, ¿qué limitaciones o sesgos podrían tener?

**2. Análisis exploratorio de datos (EDA) y limpieza**

Esta etapa ya la hemos trabajado previamente. Aquí se busca comprender la estructura y la calidad de los datos, identificar valores nulos, outliers o errores de carga, y realizar un análisis estadístico descriptivo. También es el momento de crear visualizaciones que nos permitan detectar patrones y relaciones entre las variables.

**Visual:** Persona rodeada de cuatro paneles ilustrados con líneas, barras, áreas y un gráfico circular. No es un diagrama de flujo con las siete etapas: las etapas figuran en el texto.

## Página 7

**3. Preprocesamiento y preparación de los datos**

Antes de entrenar cualquier modelo, es necesario transformar los datos para que puedan ser correctamente interpretados por los algoritmos. Esto incluye tareas como codificar variables categóricas, normalizar o estandarizar variables numéricas, crear nuevas variables (feature engineering) y dividir los datos en conjuntos de entrenamiento y prueba.

**4. Selección y entrenamiento del modelo**

Una vez que los datos están listos, elegimos qué tipo de algoritmo de Machine Learning vamos a utilizar. En función del problema, seleccionamos un modelo supervisado (como una regresión lineal o un árbol de decisión) o un modelo no supervisado (como K-Means para clustering). Luego, entrenamos el modelo utilizando el conjunto de datos de entrenamiento.

**5. Evaluación del modelo**

Después de entrenar el modelo, es necesario evaluar su desempeño utilizando el conjunto de prueba. Aquí analizamos métricas específicas según el tipo de problema (por ejemplo, MAE o R² para regresión; precisión, recall o F1-score para clasificación). En algunos casos, también se realiza validación cruzada y ajuste de hiperparámetros para mejorar la capacidad predictiva del modelo.

**6. Implementación y monitoreo**

Cuando el modelo cumple con los criterios de desempeño deseados, puede ser implementado en un entorno real: una plataforma web, una API, un sistema de recomendación o un dashboard interactivo, entre otros. A partir de allí, es importante monitorear su rendimiento en producción y reentrenarlo cuando cambien las condiciones de negocio o aparezcan nuevos datos.

**7. Mantenimiento y mejora continua**

Un modelo de Machine Learning no es una solución "estática". Debe ser mantenido y ajustado con el tiempo, ya que los datos evolucionan y las condiciones de mercado o comportamiento de los usuarios pueden cambiar.

En cada uno de estos pasos, el trabajo en equipo es clave: personas que se encargan del análisis exploratorio, otras que preparan los datos, especialistas en modelado y

## Página 8

profesionales que garantizan la correcta integración del modelo en los sistemas de la empresa.

El equipo de Talento Lab está a punto de transitar este ciclo completo para ayudar al cliente a predecir la demanda de sus productos y tomar decisiones más informadas.

### Reflexión final

Hoy dimos el primer paso hacia el aprendizaje automático, entendiendo no solo qué es Machine Learning, sino también por qué es una herramienta clave en el análisis de datos moderno y cómo se diferencia de otros enfoques tradicionales. Exploramos sus dos grandes ramas: supervisado y no supervisado, y aprendimos que detrás de cada modelo hay un ciclo de vida que va mucho más allá del entrenamiento de algoritmos.

Cada etapa que vimos —desde la recolección y análisis exploratorio de datos, hasta la implementación y el mantenimiento de modelos— es esencial para garantizar que las soluciones que desarrollemos sean eficientes, confiables y sostenibles a lo largo del tiempo.

Lo que viene es aún más interesante: comenzaremos a preparar nuestros datos específicamente para que puedan ser utilizados por algoritmos de Machine Learning, iniciando el diseño de nuestros propios modelos y pipelines. El equipo de Talento Lab ya está listo para poner manos a la obra, y nosotros también.

### Preguntas para reflexionar:

1. ¿De qué manera creés que el aprendizaje automático podría mejorar procesos o decisiones dentro de una empresa?
2. ¿Qué diferencias identificaste entre el aprendizaje supervisado y el no supervisado? ¿En qué tipo de situaciones aplicarías cada uno?
3. ¿Por qué es importante entender el ciclo de vida completo de un proyecto de Machine Learning antes de comenzar a construir un modelo?
4. ¿Cuáles te parecen que son los mayores desafíos al pasar de una etapa exploratoria de datos (EDA) a la fase de modelado con Machine Learning?

## Página 9

### Materiales y recursos adicionales:

- **Curso interactivo de Google Developers:** Este curso ofrece una [visión general de los conceptos básicos del aprendizaje automático](https://developers.google.com/machine-learning/intro-to-ml?hl=es-419), incluyendo los diferentes tipos y enfoques.
- **Módulo de Microsoft Learn:** Un módulo introductorio que [cubre desde los fundamentos hasta la implementación básica de modelos de Machine Learning](https://learn.microsoft.com/es-es/training/modules/introduction-to-machine-learning/) utilizando Python.
- **Guía de AWS:** Presenta una [arquitectura completa del ciclo de vida de un modelo de Machine Learning](https://aws.amazon.com/es/blogs/aws-spanish/arquitectura-del-ciclo-de-vida-de-un-modelo-de-machine-learning-en-aws-una-demo-completa/), incluyendo preparación de datos, entrenamiento, despliegue y monitoreo.
- **Premio Nobel de Física 2024:** John Hopfield y Geoffrey Hinton fueron galardonados por sus contribuciones esenciales al [desarrollo del aprendizaje automático con redes neuronales artificiales](https://elpais.com/ciencia/2024-10-08/premio-nobel-de-fisica.html).

## Página 10

### Trabajando en Machine Learning en Talento Lab

Después de la reunión técnica que compartieron, cada integrante del equipo de Talento Lab se llevó una tarea clara: comenzar a imaginar cómo los conceptos de aprendizaje automático se aplican a situaciones concretas. Silvia les pidió que, más allá de entender la teoría, pudieran empezar a pensar como diseñadores de soluciones basadas en datos.

Matías, por ejemplo, se mostró interesado en aplicar técnicas supervisadas para ayudar a un cliente del rubro logístico a predecir demoras en la entrega de productos. Sabrina, en cambio, pensó en segmentar a los usuarios de una plataforma de educación online según sus patrones de actividad, utilizando aprendizaje no supervisado. Luis, siempre enfocado en los reportes, propuso mapear el ciclo completo de un proyecto de ML a partir de un caso del sector bancario.

Como parte del equipo, vos también recibiste una tarea que marca el inicio de esta nueva etapa. Te toca pensar con mentalidad de proyecto, y comenzar a vincular los conceptos que vimos en clase con aplicaciones reales. Para eso, deberás resolver el siguiente ejercicio:

**Visual:** Logotipo «Talento Lab» junto al texto del caso; no se representa ningún modelo o resultado numérico.

## Página 11

### Ejercicio práctico

Este ejercicio no requiere código, pero sí pensamiento crítico. Te ayudará a anticipar el tipo de decisiones que deberás tomar en las próximas clases, cuando empieces a trabajar directamente con los datos y los modelos.

Tu tarea será la siguiente:

1. Seleccioná un caso o problema mencionado (puede ser del sector retail, salud, finanzas, educación, logística u otro) donde creas que el aprendizaje supervisado podría aplicarse para predecir o clasificar algo importante. Describí cuál sería la variable que el modelo debería predecir y por qué

   Podemos seleccionar alguno de estos temas: .

   - **Finanzas.** Predicción de incumplimiento de pagos: El banco pierde dinero cuando otorga préstamos a personas que luego no pueden pagar
   - **Salud.** Detección temprana de diabetes: La diabetes es una enfermedad silenciosa. Detectarla cuando ya hay síntomas graves complica el tratamiento.
   - **Retail / E-Commerce.** Predicción de fuga de clientes: Es mucho más costoso adquirir un cliente nuevo que retener a uno existente.
   - **Real estate / inmobiliaria.** Valoración de propiedades:Las tasaciones manuales son lentas y subjetivas. El mercado fluctúa rápidamente.
   - **Logística.** Estimación de tiempo de entrega: Las estimaciones actuales son promedios simples y suelen fallar en horas pico, generando frustración en el cliente.

2. Luego, pensá un ejemplo en el que el aprendizaje no supervisado pueda resultar útil. Explicá qué tipo de agrupamiento o segmentación podría hacerse y cómo podría beneficiar a la organización.
3. Por último, describí en 5 o 6 pasos cómo aplicarías el ciclo de vida de un proyecto de Machine Learning para resolver uno de los dos casos anteriores. No es necesario que detalles herramientas específicas, pero sí que reflejes una comprensión general del proceso.

## Página 12

### Próximos pasos

En las próximas clases comenzaremos a dar los primeros pasos concretos en la preparación de datos para Machine Learning. Nos enfocaremos en aprender a transformar y adaptar la información para que los algoritmos puedan trabajar con ella de manera eficiente.

Iniciaremos con la creación y selección de variables relevantes para nuestros modelos, proceso conocido como feature engineering, y abordaremos también técnicas fundamentales como la normalización y la codificación de variables categóricas. Estos conceptos serán claves para garantizar que los datos que alimenten nuestros futuros modelos sean consistentes y estén correctamente estructurados.

El equipo de Talento Lab está a punto de entrar en la etapa técnica del proyecto, donde la preparación y transformación de los datos será la base para el éxito de las próximas fases de modelado y evaluación de resultados.

## Página 13

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
