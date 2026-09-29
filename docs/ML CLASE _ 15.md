# Clase N° 15 | Proyecto guiado (Parte 2): Modelado, evaluación y cierre

**Fuente:** [ML CLASE _ 15.pdf](ML%20CLASE%20_%2015.pdf), páginas 1–9. Transcripción por página. Las notas **Visual:** describen elementos observados y no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 15. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con franja amarilla «Clase 15»; junto a un cubo turquesa, una persona de pie consulta una tableta y otra está sentada con una computadora portátil, ambas con auriculares.

## Página 2

### Clase N° 15 | Proyecto guiado (Parte 2): Modelado, evaluación y cierre

### Índice

- Clase N° 15 | Proyecto guiado (Parte 2): Modelado, evaluación y cierre
- Comparar modelos y tomar decisiones informadas
- Modelos supervisados que vamos a comparar
  1. Regresión Logística
  2. Random Forest
- Pasos que realizaremos en el cuaderno Colab
- Reflexión final
- Preguntas para reflexionar:
- Comparar para decidir

### Objetivos de la clase:

En esta clase completaremos el proyecto guiado iniciado en la clase anterior, aplicando modelos de Machine Learning sobre los datos clínicos ya preprocesados. A partir del dataset limpio y transformado, entrenaremos distintos algoritmos supervisados, evaluaremos su rendimiento utilizando métricas específicas y analizaremos los resultados obtenidos desde una perspectiva crítica y profesional.

El objetivo es que cada estudiante pueda experimentar de forma práctica cómo se selecciona un modelo en función no solo de su precisión, sino también de su robustez, interpretabilidad y adecuación al contexto. Se buscará que el análisis no quede limitado a un único número, sino que se base en la combinación de varias herramientas: matriz de confusión, métricas de clasificación, curva ROC, y una tabla comparativa final.

Además, reflexionaremos sobre el rol del profesional en ciencia de datos a la hora de comunicar sus hallazgos, considerando tanto los aspectos técnicos como éticos que implica modelar sobre datos sensibles. Esta clase también dejará planteada la estructura que cada estudiante podrá seguir para llevar adelante su propio Proyecto Final Integrador, aplicando lo aprendido sobre un nuevo caso.

## Página 3

### Comparar modelos y tomar decisiones informadas

Una vez que los datos han sido limpiados y transformados, como hicimos en la clase anterior, estamos en condiciones de entrenar modelos de Machine Learning. Sin embargo, construir un único modelo no alcanza: parte fundamental del trabajo en ciencia de datos consiste en comparar múltiples algoritmos, evaluarlos críticamente y justificar cuál es el más adecuado para el problema que se quiere resolver.

Esto no se trata simplemente de “ver cuál acierta más”, sino de analizar el rendimiento de cada modelo desde distintas perspectivas. Algunas preguntas clave que orientan esta tarea son:

- ¿Cómo se comporta el modelo frente a casos positivos y negativos?
- ¿Qué tipo de errores comete con mayor frecuencia?
- ¿Es estable su rendimiento ante cambios en los datos?
- ¿Es comprensible su lógica de decisión, o se trata de una “caja negra”?
- ¿Se ajusta a las necesidades del dominio específico, en este caso, el ámbito clínico?

**Visual:** Ilustración de una persona pensativa frente a «YES» con marca de verificación y «NO» con una cruz, rodeada de signos de interrogación. No representa una matriz de confusión ni una decisión medida.

Para abordar esta comparación, vamos a entrenar distintos modelos supervisados sobre el mismo conjunto de entrenamiento y evaluarlos luego sobre un conjunto de prueba que el modelo nunca vio. Utilizaremos herramientas ya conocidas como la matriz de confusión, el accuracy, el precision, el recall, el F1-score, y también incorporaremos nuevas visualizaciones como la curva ROC, que nos permite observar la capacidad del modelo para distinguir entre clases.

Finalmente, construiremos una tabla comparativa que reúna todos los resultados clave, lo cual nos permitirá tomar una decisión fundamentada sobre qué modelo utilizar, considerando no solo su rendimiento numérico sino también otros factores como la interpretabilidad o la facilidad de implementación.

Este tipo de análisis no solo forma parte de las buenas prácticas profesionales, sino que será esencial para que cada estudiante pueda afrontar su propio proyecto final con una mirada crítica, fundamentada y responsable.

## Página 4

### Modelos supervisados que vamos a comparar

En esta clase vamos a entrenar y comparar al menos dos modelos de clasificación binaria, que ya hemos explorado en clases anteriores. La elección responde a criterios pedagógicos y profesionales: son algoritmos representativos, ampliamente utilizados en la industria y con características distintas entre sí, lo que nos permitirá contrastar enfoques y resultados.

**Visual:** Diagrama ilustrativo con una balanza, un analista y tres recuadros: gráfico de puntos y línea «Interpretable», un recuadro central «RF / high accuracy» rodeado de árboles y otro «Simple Tree» con un árbol pequeño. Las flechas conectan los enfoques; «high accuracy» es un rótulo de la ilustración, no un resultado numérico del caso clínico.

#### 1. Regresión Logística

Es un modelo lineal que estima la probabilidad de que una observación pertenezca a una clase u otra. Es fácil de interpretar, rápido de entrenar y muy utilizado en contextos clínicos y financieros. Nos permite observar la influencia relativa de cada variable sobre la predicción, lo que lo convierte en una herramienta valiosa cuando la explicabilidad es importante.

#### 2. Random Forest

Se trata de un modelo de tipo ensamble basado en árboles de decisión. Construye múltiples árboles sobre subconjuntos aleatorios del dataset y luego promedia sus resultados para obtener una predicción final. Suele ofrecer una alta precisión, es robusto ante datos ruidosos o incompletos, y maneja bien las variables categóricas y numéricas. A cambio, su lógica interna es más difícil de interpretar.

De forma opcional, se podrá agregar un tercer modelo como K-Nearest Neighbors (KNN) o Árbol de decisión simple, para observar cómo se comporta un enfoque más básico y directo.

El objetivo no es encontrar “el modelo perfecto”, sino comprender cómo varía el comportamiento de distintos algoritmos ante un mismo problema, y aprender a tomar decisiones fundadas a partir de evidencia empírica.

## Página 5

### Pasos que realizaremos en el cuaderno Colab

En esta clase trabajaremos de manera guiada en la segunda parte del proyecto de Machine Learning iniciado anteriormente, utilizando Google Colab como entorno de trabajo. Los pasos que abordaremos son:

**Visual:** Dibujo de unas manos escribiendo en una computadora portátil junto a un bloc y lápiz. La pantalla amarilla tiene trazos esquemáticos, sin código de Colab legible ni métricas.

- Definición de las variables predictoras y objetivo, utilizando los datos ya preprocesados.
- División del dataset en conjuntos de entrenamiento y prueba, para evaluar el rendimiento de los modelos de manera objetiva.
- Entrenamiento de al menos dos modelos supervisados, como regresión logística y random forest, utilizando el pipeline definido en la clase anterior.
- Evaluación del rendimiento de cada modelo, mediante métricas como accuracy, precision, recall y F1-score, así como la visualización de la matriz de confusión.
- Trazado de curvas ROC, para observar visualmente la capacidad de los modelos para discriminar entre las clases.
- Construcción de una tabla comparativa de métricas, que facilite la toma de decisiones informadas sobre qué modelo es más adecuado para este caso clínico.
- Reflexión técnica y narrativa, simulando una discusión dentro del equipo de Talento Lab sobre los resultados obtenidos y su posible aplicación en un contexto real.

Estos pasos constituyen la culminación del proyecto guiado, y servirán como plantilla para desarrollar el Proyecto Final Integrador, donde cada estudiante deberá aplicar este mismo enfoque con nuevos datos y objetivos.

## Página 6

### Reflexión final

Con esta clase completamos el recorrido de un proyecto completo de Machine Learning aplicado, trabajando desde los datos crudos hasta la elección fundamentada de un modelo final. Más allá de los resultados obtenidos, lo que importa aquí es el proceso: aprendimos a preparar los datos, a tomar decisiones informadas en cada etapa, a evaluar modelos con distintos indicadores y a reflexionar críticamente sobre cuál es el más adecuado según el contexto.

Este cierre marca un punto de inflexión en el curso. Hasta ahora, recorrimos juntos cada paso, con una guía estructurada y decisiones compartidas. Lo que comienza ahora es una etapa de autonomía, pero no de soledad: el conocimiento, las herramientas y la estructura ya están. Lo que queda por hacer es aplicar todo eso en un proyecto propio, con creatividad, responsabilidad y pensamiento crítico.

### Preguntas para reflexionar:

1. ¿Qué criterios consideramos para decidir cuál modelo era más adecuado para este problema? ¿Nos apoyamos sólo en los números o también en otras dimensiones?
2. ¿Qué tipo de error te parece más grave en este contexto clínico: un falso positivo (diagnosticar enfermedad cuando no la hay) o un falso negativo (no detectarla cuando sí existe)? ¿Por qué?
3. ¿Qué ventajas y limitaciones que encontras en los modelos que probamos? ¿Cuáles son más fáciles de explicar a un equipo no técnico?
4. ¿Cómo podría cambiar tu elección de modelo si tuvieras que implementarlo en un sistema real, donde el tiempo de respuesta o la interpretación del resultado también son relevantes?
5. ¿Qué aprendizajes te llevás de esta experiencia para aplicar en tu Proyecto Final Integrador?

## Página 7

### Comparar para decidir

**Visual:** Logotipo «Talento Lab» encima del relato; retratos ilustrados de Silvia y Luis junto a sus intervenciones. No aparece la tabla comparativa ni resultados medidos.

Después de una semana de intenso trabajo con el nuevo cliente del sector salud, el equipo de Talento Lab dejó listo un pipeline de preprocesamiento completamente funcional. Los datos ya están limpios, transformados y preparados para entrenar modelos que puedan predecir la presencia de enfermedad cardíaca a partir de información clínica.

En la reunión de planificación, Silvia —la Project Manager— fue clara: “Ahora que tenemos los datos bien preparados, necesitamos evaluar diferentes modelos y quedarnos con el que mejor se adapte a este caso. Pero no solo me interesa cuál acierta más: quiero saber cómo se equivoca, si detecta bien los casos positivos, y si podemos explicarle su lógica a los médicos que van a usarlo”.

Luis propuso comenzar por algo simple y transparente, como la regresión logística. Sabrina, en cambio, sugirió probar también con Random Forest, “porque suele capturar relaciones más complejas y no se ve afectado por escalas ni correlaciones entre variables”. Matías tomó nota de ambas propuestas y propuso armar una tabla comparativa clara para que el equipo pudiera tomar una decisión informada.

Tu rol en esta etapa es aplicar ambos modelos, compararlos en base a sus métricas y visualizaciones, y ayudar al equipo a elegir con evidencia cuál es más conveniente para esta situación clínica.

## Página 8

### Ejercicio práctico

Tu tarea en esta clase será completar el proyecto iniciado en la clase anterior, entrenando y evaluando al menos dos modelos de clasificación binaria.

Para eso, deberás:

1. Dividir los datos en conjuntos de entrenamiento y prueba.
2. Entrenar los modelos seleccionados utilizando el pipeline definido anteriormente.
3. Evaluar el rendimiento de cada modelo utilizando:
   - Matriz de confusión
   - Accuracy, precision, recall, F1-score
   - Curva ROC
4. Construir una tabla comparativa de métricas clave.
5. Redactar una reflexión técnica sobre cuál modelo es más adecuado y por qué.
6. (Opcional) Guardar el pipeline + modelo elegido para reutilizarlo en producción.

Este ejercicio es un modelo directo del tipo de trabajo que deberás realizar en tu Proyecto Final Integrador: elegir un problema, preparar los datos, probar distintos enfoques y justificar cada decisión con criterio técnico y responsabilidad profesional.

### Próximos pasos

Con esta clase damos por finalizado el proyecto guiado de Machine Learning, que nos permitió recorrer de manera práctica todas las etapas del desarrollo de un modelo predictivo: desde la exploración y limpieza de datos hasta el entrenamiento, evaluación y selección del algoritmo más adecuado.

A partir de la próxima clase, comenzará una nueva etapa: el Proyecto Final Integrador. Cada estudiante deberá aplicar lo aprendido sobre un nuevo conjunto de datos, seleccionando un problema relevante que pueda resolverse mediante técnicas de aprendizaje automático.

Durante esta etapa, se fomentará el trabajo autónomo pero con acompañamiento docente. El proyecto final no sólo consolidará los conocimientos adquiridos, sino que también permitirá desarrollar criterios propios y enfrentar los desafíos reales que implica tomar decisiones con datos.

## Página 9

**Visual:** Contraportada azul oscuro con red geométrica, «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad»; no hay contenido docente adicional.
