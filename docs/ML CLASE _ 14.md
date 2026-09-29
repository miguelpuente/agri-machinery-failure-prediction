# Clase N° 14 | Proyecto guiado (Parte 1): Exploración, limpieza y preprocesamiento

**Fuente:** [ML CLASE _ 14.pdf](ML%20CLASE%20_%2014.pdf), páginas 1–11. Transcripción por página. Las notas **Visual:** describen elementos observados y no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 14. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con banda amarilla «Clase 14» y dos personas con auriculares: una de pie con tableta y otra sentada con portátil, junto a un cubo turquesa.

## Página 2

### Clase N° 14 | Proyecto guiado (Parte 1): Exploración, limpieza y preprocesamiento

### Índice

- Clase N° 14 | Proyecto guiado (Parte 1): Exploración, limpieza y preprocesamiento
- Breve introducción al contexto clínico del dataset
- ¿Por qué es un dataset valioso para esta clase?
- Descripción general de las variables
- Estructura del dataset
- Pasos que realizaremos en el cuaderno Colab
- Reflexión final
- Preguntas para reflexionar:
- Preparando el modelo para una clínica

### Objetivos de la clase:

En esta clase iniciaremos el desarrollo completo de un proyecto de Machine Learning aplicado, siguiendo el enfoque profesional del equipo de Talento Lab. El objetivo es abordar un caso real utilizando un dataset clínico auténtico, que servirá como ejemplo concreto del tipo de trabajo que luego deberán replicar los estudiantes en su Proyecto Final Integrador.

Durante esta primera parte, nos enfocaremos en el análisis exploratorio de datos (EDA), la limpieza y el preprocesamiento. A lo largo del documento se fundamentarán teóricamente los pasos que se llevarán a cabo, como la identificación de valores faltantes, la codificación de variables categóricas y la estandarización de datos numéricos. También se presentará la estructura del dataset seleccionado, se justificará su elección y se anticipará su potencial para aplicar los algoritmos trabajados en clases anteriores.

La implementación práctica —incluyendo el código, los gráficos y los comentarios detallados— se desarrollará íntegramente en el cuaderno Jupyter correspondiente, para que puedas seguir paso a paso el proceso y replicarlo de forma autónoma.

En la próxima clase, continuaremos con el entrenamiento y evaluación del modelo, la visualización de resultados y una reflexión final que cierre este proyecto guiado.

## Página 3

### Breve introducción al contexto clínico del dataset

En el ámbito de la salud, la capacidad de anticipar diagnósticos a partir de datos clínicos es una de las aplicaciones más relevantes y sensibles del aprendizaje automático. La predicción temprana de enfermedades no solo puede mejorar la calidad de vida de los pacientes, sino también optimizar los recursos del sistema sanitario, orientando intervenciones preventivas o tratamientos personalizados.

**Visual:** Ilustración de tres profesionales sanitarios con uniformes amarillos y blancos, estetoscopio, mascarilla y carpeta, rodeados de símbolos de corazón, píldoras, tubos, jeringa y botiquín; no representa una captura del dataset.

El dataset que trabajaremos en este proyecto guiado recopila información clínica de pacientes sometidos a estudios cardiovasculares. Su objetivo es identificar, a partir de variables como la edad, el sexo, el tipo de dolor en el pecho, la presión arterial, el colesterol, entre otras, la probabilidad de que un paciente presente una enfermedad cardíaca.

Este tipo de problema —la predicción de una condición médica a partir de múltiples indicadores— es representativo de los desafíos que enfrenta la ciencia de datos en contextos reales. Requiere una combinación cuidadosa de análisis exploratorio, tratamiento de datos faltantes, codificación de variables categóricas y elección de algoritmos adecuados, aspectos que abordaremos paso a paso en las próximas secciones.

El caso clínico que representa este dataset no solo es apropiado desde el punto de vista técnico, sino que también permite reflexionar sobre el impacto ético y práctico que puede tener un modelo de Machine Learning en escenarios donde las decisiones influyen directamente en la salud y el bienestar de las personas.

## Página 4

### ¿Por qué es un dataset valioso para esta clase?

La elección de este dataset se basa en múltiples razones pedagógicas y técnicas que lo convierten en un excelente punto de partida para el desarrollo guiado de un modelo de Machine Learning completo.

**Visual:** Dibujo de un corazón anatómico amarillo y gris con estetoscopio delante de una línea de electrocardiograma; a su lado, un profesional de salud con bata. Es ilustrativo, no un registro clínico.

En primer lugar, el problema que plantea —la detección de enfermedad cardíaca a partir de variables clínicas— es claro, relevante y fácil de entender, lo que facilita la interpretación de los resultados y el vínculo con situaciones del mundo real. Además, se trata de un caso clásico de clasificación supervisada, uno de los ejes principales que hemos trabajado a lo largo del curso.

Desde el punto de vista estructural, el dataset presenta una combinación equilibrada de variables numéricas y categóricas, lo cual permite aplicar en la práctica distintas estrategias de preprocesamiento: imputación de valores faltantes, codificación de categorías, escalado de datos, entre otras. Esta diversidad lo convierte en una excelente oportunidad para revisar y consolidar todos los procedimientos aprendidos en clases anteriores.

Otra fortaleza es que los datos incluyen valores faltantes reales, lo que habilita una discusión concreta sobre distintas técnicas de imputación y sobre las decisiones que debe tomar un equipo de ciencia de datos ante este tipo de situaciones.

Por último, el volumen del dataset (920 registros) es adecuado para un entorno educativo. Permite realizar pruebas, entrenamientos y validaciones sin tiempos de espera excesivos, incluso trabajando en Google Colab, y al mismo tiempo es lo suficientemente amplio como para observar patrones, evaluar modelos y aplicar validación cruzada.

Por lo tanto, se trata de un conjunto de datos lo suficientemente realista y desafiante como para desarrollar un proyecto sólido, pero también accesible y manejable como para que cada estudiante pueda seguir el proceso paso a paso y replicarlo en su Proyecto Final Integrador.

## Página 5

### Descripción general de las variables

El dataset utilizado en esta clase está compuesto por 16 variables, que combinan datos numéricos, categóricos y de identificación. A continuación se presenta una descripción general de cada una, destacando su tipo de dato y, cuando es pertinente, los valores posibles que puede tomar.

**Visual:** Dos ilustraciones de hospital: arriba, una paciente sentada en una cama con otras dos personas; abajo, un profesional con una planilla al lado de un paciente acostado junto a un suero. No son tablas de variables ni fotografías de pacientes reales.

Entre las variables numéricas encontramos características como la edad (`age`), la presión arterial en reposo (`trestbps`), el nivel de colesterol (`chol`), la frecuencia cardíaca máxima alcanzada (`thalch`) y el valor de `oldpeak`, que representa la depresión del segmento ST observada en el electrocardiograma durante el ejercicio. Estas variables son fundamentales para el análisis cuantitativo y permitirán aplicar técnicas como la normalización o estandarización.

Las variables categóricas aportan información clínica cualitativa. Por ejemplo, `sex` indica el sexo del paciente (con valores "Male" y "Female"), `cp` describe el tipo de dolor en el pecho (como "typical angina" o "asymptomatic"), `restecg` refiere a los resultados del electrocardiograma en reposo, y `thal` resume los resultados de una prueba de esfuerzo con talio. También se incluyen indicadores booleanos como `fbs` (azúcar en sangre en ayunas mayor a 120 mg/dl) y `exang` (presencia de angina inducida por ejercicio), registrados como valores `True` o `False`.

El campo `num` será nuestra variable objetivo en este proyecto. Representa el grado de enfermedad cardíaca diagnosticada en el paciente, codificado como un número entero de 0 a 4. Para esta clase, lo convertiremos en una variable binaria, donde 0 indicará "sin enfermedad" y cualquier otro valor (1 a 4) indicará "presencia de enfermedad". Esto nos permitirá trabajar con un modelo de clasificación binaria, tal como lo hemos hecho en clases anteriores.

Por último, vale mencionar que la variable `id` cumple una función de identificación interna y no será utilizada como predictor en el modelo, mientras que `dataset` indica la procedencia original del dato (Cleveland, Hungary, Switzerland o VA Long Beach), lo cual podría usarse como variable contextual o eliminarse según el enfoque que adoptemos.

Esta combinación de variables permite aplicar una gran variedad de técnicas de preprocesamiento y modelado, lo que hace de este conjunto de datos una herramienta ideal para practicar el desarrollo completo de un pipeline de aprendizaje automático supervisado.

## Página 6

### Estructura del dataset

La estructura del dataset responde a un formato tabular clásico, ampliamente utilizado en problemas de clasificación supervisada. Cada fila representa un paciente distinto y cada columna corresponde a una variable que aporta información relevante para predecir la presencia o ausencia de enfermedad cardíaca.

Desde el punto de vista didáctico, este dataset presenta múltiples oportunidades para poner en práctica conceptos clave:

- Incluye valores faltantes reales en varias columnas (como `trestbps`, `chol`, `slope`, `ca` o `thal`), lo que permite aplicar técnicas de imputación y discutir su impacto.
- Contiene variables categóricas con múltiples niveles, lo que hace necesario implementar codificaciones adecuadas (como one-hot o label encoding) y reflexionar sobre las implicancias de cada enfoque.
- Presenta una mezcla balanceada de atributos numéricos y cualitativos, lo que habilita la construcción de pipelines de preprocesamiento combinados, utilizando herramientas como `ColumnTransformer`.
- La variable objetivo (`num`) se presta naturalmente a un enfoque de clasificación binaria, pero también puede ser utilizada para tareas más avanzadas como clasificación multiclase o detección de riesgo progresivo, dependiendo del nivel de profundidad que se desee alcanzar.

Estas características convierten al dataset en una plataforma ideal para consolidar los aprendizajes del curso y transitar, paso a paso, por todas las etapas del ciclo de vida de un modelo de Machine Learning: desde la exploración inicial hasta la generación de predicciones e interpretación de métricas.

## Página 7

### Pasos que realizaremos en el cuaderno Colab

En esta clase trabajaremos de manera guiada en el desarrollo de las primeras etapas de un proyecto completo de Machine Learning, utilizando Google Colab como entorno de trabajo. Los pasos que abordaremos son:

**Visual:** Diagrama vertical titulado «Pipeline Preprocesamiento» con flechas: «Carga del Dataset y Visualización Inicial» → «Exploración de Variables» → «Tratamiento de Valores Faltantes» → «Codificación de Variables Categóricas» → «Estandarización de Variables Numéricas» → «División: Entrenamiento y Prueba» → «Listo para Clasificación». Incluye iconos pequeños y ejemplos esquemáticos; no es una captura de ejecución de Colab.

1. Carga del dataset y visualización inicial de los datos.
2. Exploración de variables: revisión de tipos de datos, valores únicos y distribución de la variable objetivo.
3. Detección y tratamiento de valores faltantes, utilizando estrategias como imputación por la media o por la categoría más frecuente.
4. Codificación de variables categóricas, empleando técnicas adecuadas según el caso (one-hot encoding o label encoding).
5. Estandarización de variables numéricas, preparando los datos para el entrenamiento posterior.
6. División del dataset en conjunto de entrenamiento y prueba.
7. Construcción de un pipeline de preprocesamiento, integrando todos los pasos anteriores en una única estructura reutilizable.

Estos pasos nos permitirán dejar los datos listos para aplicar un modelo de clasificación en la próxima clase, donde completaremos el pipeline, evaluaremos el rendimiento del modelo y discutiremos los resultados obtenidos.

## Página 8

### Reflexión final

Con esta clase comenzamos a integrar de forma sistemática todo lo aprendido en el curso, enfrentándonos a un caso real que requiere aplicar habilidades técnicas, criterio analítico y buenas prácticas de trabajo en equipo. Más allá del código, cada decisión que tomamos en el análisis y preprocesamiento de los datos tiene un impacto directo en la calidad del modelo que construiremos. Por eso, es fundamental que no solo sigas los pasos, sino que comprendas el “por qué” de cada acción. Esta etapa del proyecto es mucho más que una preparación técnica: es una oportunidad para desarrollar pensamiento crítico y adquirir confianza en el diseño de soluciones basadas en datos.

### Preguntas para reflexionar:

1. ¿Qué impacto puede tener la forma en que tratamos los valores faltantes sobre el rendimiento y la confiabilidad de un modelo de clasificación?
2. ¿Por qué es importante codificar correctamente las variables categóricas antes de entrenar un modelo? ¿Qué problemas podrían surgir si no lo hacemos?
3. ¿Qué beneficios aporta construir un pipeline de preprocesamiento en lugar de realizar cada transformación por separado?
4. ¿Cómo influye la escala de las variables numéricas en el comportamiento de algunos algoritmos de Machine Learning?
5. ¿Qué criterios podrías utilizar para decidir si una variable debe ser descartada, imputada o transformada durante la limpieza de datos?

## Página 9

### Preparando el modelo para una clínica

**Visual:** Logotipo «Talento Lab» de gran tamaño y cuatro retratos ilustrados pequeños, alineados con los parlamentos de Silvia, Sabrina, Luis y Matías. No hay imagen del archivo de pacientes.

El equipo de Talento Lab fue convocado por una clínica que busca implementar un sistema de apoyo a la decisión médica. El objetivo es utilizar modelos predictivos para anticipar si un paciente podría estar en riesgo de padecer una enfermedad cardíaca, a partir de una serie de variables clínicas recolectadas en los chequeos regulares.

Silvia, la Project Manager, recibió un archivo con los datos de pacientes extraídos de un sistema histórico que integra información de distintas sedes. Aunque la calidad general del dataset es buena, el equipo ya identificó algunas inconsistencias: hay valores faltantes, variables categóricas con diferentes formatos y una mezcla de escalas en las variables numéricas.

En una reunión interna, Sabrina, la Data Engineer, propuso organizar el trabajo en dos etapas: primero realizar una exploración exhaustiva de los datos y preparar un pipeline robusto de preprocesamiento, y luego entrenar distintos modelos para comparar su desempeño.

Luis recordó que este enfoque es el que más se alinea con las buenas prácticas del curso de ML que están implementando como parte de su estrategia de formación interna.

Antes de pasar al modelado, Matías (Data Analyst) compartió el archivo con vos y te pidió que realices una primera limpieza del dataset, identifiques los principales problemas, y construyas un pipeline que deje los datos listos para entrenar. “Necesitamos que ese pipeline esté sólido —dijo—. Pensá que después vamos a comparar modelos con validación cruzada, y no queremos sorpresas a mitad de camino.”

## Página 10

### Ejercicio práctico

Tu tarea en esta clase es preparar el conjunto de datos clínicos para el entrenamiento de un modelo de clasificación que prediga la presencia de enfermedad cardíaca. Para eso, deberás:

1. Cargar el dataset y realizar un análisis exploratorio detallado.
2. Identificar y resolver los valores faltantes presentes en distintas columnas.
3. Codificar las variables categóricas según corresponda.
4. Estandarizar las variables numéricas.
5. Dividir el dataset en conjuntos de entrenamiento y prueba.
6. Construir un pipeline de preprocesamiento reutilizable que integre todos estos pasos.

El resultado de esta clase será un pipeline listo para entrenar y evaluar modelos en la siguiente etapa del proyecto.

### Próximos pasos

En la próxima clase continuaremos con la segunda parte de este proyecto guiado. Utilizaremos el pipeline de preprocesamiento construido en esta instancia para entrenar distintos modelos de clasificación, evaluar su rendimiento con métricas específicas (como precisión, recall y F1-score), y visualizar sus resultados mediante matrices de confusión y curvas ROC. Además, discutiremos los criterios para seleccionar el modelo más adecuado según el contexto del problema, y dejaremos una plantilla estructural que sirva de guía para el Proyecto Final Integrador de cada estudiante. Será el cierre técnico de este caso práctico, y un punto de partida para que cada persona pueda replicar el proceso de forma autónoma con nuevos datasets.

## Página 11

**Visual:** Contraportada azul oscuro con red de líneas geométricas, «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad»; sin contenido docente adicional.
