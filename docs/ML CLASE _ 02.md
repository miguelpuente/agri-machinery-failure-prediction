# Clase N° 2 | Módulos y datos

**Fuente:** [ML CLASE _ 02.pdf](ML%20CLASE%20_%2002.pdf), páginas 1–12. Transcripción del contenido por página; las notas «Visual» describen elementos observados y no son parte del texto docente. Los encabezados institucionales repetidos muestran `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 2. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro; dos personas ilustradas con tableta y computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 2 | Módulos y datos

### Índice

- El módulo Pandas
- El módulo Matplotlib
- El módulo Seaborn
- El módulo Plotly
  - Instalación y uso
- EDA, limpieza y consolidación de datos
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Otro día de trabajo en Talento Lab
- Próximos pasos

### Objetivos de la clase:

El propósito de esta clase es reforzar y profundizar el uso de herramientas clave en el análisis y visualización de datos que las personas ya han utilizado en etapas anteriores de la formación. Retomaremos librerías fundamentales como Pandas, Matplotlib, Seaborn y Plotly para consolidar las habilidades necesarias en la manipulación, limpieza y visualización de datos. Además, revisaremos las principales técnicas de Análisis Exploratorio de Datos (EDA), limpieza y consolidación de datasets. Todo esto servirá como base sólida para abordar, en las próximas clases, la preparación específica de datos orientada a proyectos de Machine Learning.

## Página 3

### El módulo Pandas

Pandas es una de las librerías más populares y utilizadas dentro del ecosistema Python para la manipulación y análisis de datos estructurados. Su nombre proviene de “Panel Data”, un término estadístico relacionado con conjuntos de datos que combinan dimensiones temporales y transversales. La librería fue creada por Wes McKinney en 2008 para facilitar la manipulación de datos financieros y rápidamente se expandió a otros campos de la ciencia de datos y la ingeniería.

El objetivo principal de Pandas es brindar herramientas eficientes y flexibles para trabajar con datos tabulares (filas y columnas), muy similares a las que encontramos en hojas de cálculo o bases de datos relacionales. A través de Pandas, es posible cargar, transformar, limpiar y analizar datos de manera sencilla, sin necesidad de recurrir a procesos complejos o escribir grandes volúmenes de código.

Una de las mayores ventajas de Pandas es su capacidad para integrarse sin problemas con otras librerías de Python, como NumPy, Matplotlib, Seaborn y scikit-learn, formando así un flujo de trabajo coherente para proyectos de análisis y Machine Learning.

Entre sus características principales podemos destacar:

- Permite leer y escribir datos desde y hacia múltiples fuentes, como CSV, Excel, bases SQL, JSON o archivos de texto.
- Cuenta con dos estructuras de datos clave: Series (vectores unidimensionales) y DataFrames (tablas bidimensionales).
- Ofrece métodos eficientes para filtrar, ordenar, agrupar y transformar datos, facilitando tareas como la limpieza y el preprocesamiento.
- Posee funciones optimizadas para el manejo de datos faltantes, la generación de estadísticas descriptivas y la creación de nuevas variables a partir de operaciones simples o complejas.

Además, Pandas es altamente escalable, lo que permite trabajar desde pequeños datasets hasta millones de registros sin comprometer la eficiencia, siempre que se sigan buenas prácticas de optimización.

En este curso, Pandas será una herramienta esencial tanto en las etapas de EDA (análisis exploratorio de datos) como en las fases de preprocesamiento y consolidación de datos antes de entrenar nuestros modelos de Machine Learning.

**Visual:** Logotipo «pandas» con barras verticales de distintos tamaños y dos cuadros de color; no es un gráfico de datos.

## Página 4

### El módulo Matplotlib

Matplotlib es una de los módulos (o librería) más clásicas y utilizadas para la creación de gráficos en Python. Fue desarrollada por John D. Hunter en 2003 y su objetivo fue proporcionar a la comunidad científica una alternativa en Python al entorno de visualización de datos de MATLAB.

Matplotlib permite crear gráficos estáticos, personalizables y de alta calidad que son fundamentales para comunicar de manera visual los hallazgos obtenidos en el análisis de datos. En el contexto de Machine Learning y ciencia de datos, una buena visualización es clave para detectar patrones, correlaciones y comportamientos anómalos que podrían pasar desapercibidos si sólo observamos los datos en formato tabular.

Uno de los puntos fuertes de Matplotlib es su gran flexibilidad. Permite construir desde gráficos simples hasta visualizaciones más complejas, ajustando prácticamente todos los elementos visuales, como colores, tipos de línea, títulos, leyendas y escalas.

Entre sus capacidades básicas se encuentran:

- Crear gráficos de líneas, ideales para representar series temporales o tendencias.
- Generar gráficos de barras y gráficos de dispersión para comparar categorías o estudiar la relación entre dos variables.
- Configurar de manera detallada los ejes, títulos y etiquetas para mejorar la claridad de la presentación.
- Exportar las visualizaciones a múltiples formatos, como .png, .pdf o .svg, para ser usadas en informes o presentaciones.

En este curso utilizaremos Matplotlib principalmente como una herramienta de base para construir las visualizaciones que acompañarán nuestro proceso de EDA (análisis exploratorio de datos) y durante la evaluación de modelos de Machine Learning. Más adelante, complementaremos estas capacidades con librerías más modernas y especializadas como Seaborn y Plotly.

Matplotlib funciona de manera integrada con Pandas, lo que permite generar gráficos directamente desde DataFrames, optimizando el flujo de trabajo.

### El módulo Seaborn

Seaborn es una librería de visualización de datos en Python que está construida sobre

**Visual:** Logotipo «matplotlib» con una pequeña figura polar en una letra y logotipo «seaborn» con un círculo que representa barras y una distribución. No se muestran visualizaciones de datasets concretos.

## Página 5

Matplotlib, pero que ofrece una sintaxis más simple y gráficos con una estética predeterminada mucho más atractiva y profesional. Fue desarrollada por Michael Waskom y es ampliamente utilizada en el mundo de la ciencia de datos debido a su facilidad para crear visualizaciones estadísticas con menos líneas de código y mayor claridad visual.

Seaborn está especialmente diseñada para facilitar la exploración de datos y la representación de relaciones entre variables, lo que la convierte en una herramienta fundamental durante el proceso de EDA (Exploración de Datos).

Entre sus principales características se destacan:

- Permite crear gráficos estadísticos con facilidad, como gráficos de dispersión con líneas de regresión (regplot), boxplots y violinplots que resumen la distribución de una variable, o gráficos de barras categóricas.
- Ofrece una integración directa con los DataFrames de Pandas, lo que permite generar visualizaciones rápidamente a partir de datos tabulares.
- Simplifica la creación de gráficos complejos que con Matplotlib podrían requerir más líneas de código, como mapas de calor (heatmaps) para representar correlaciones entre variables o pairplots para comparar múltiples variables a la vez.
- Aplica de manera automática estilos visuales más profesionales, con una paleta de colores coherente y etiquetas más legibles.

A diferencia de Matplotlib, que prioriza la flexibilidad total en el control de cada detalle gráfico, Seaborn apuesta por la simplicidad y productividad cuando el objetivo es explorar datos rápidamente y comunicar hallazgos de manera clara.

Durante este curso utilizaremos Seaborn para facilitar el análisis visual de la estructura interna de los datos, ayudándonos a identificar patrones, outliers y relaciones entre variables antes de aplicar cualquier modelo de Machine Learning. Más adelante, complementaremos las capacidades de Seaborn con Plotly, que nos permitirá dar un paso adicional hacia la interactividad.

## Página 6

### El módulo Plotly

Plotly es una librería de visualización avanzada que permite crear gráficos interactivos en Python. A diferencia de Matplotlib y Seaborn, que se centran en gráficos estáticos, Plotly facilita la construcción de visualizaciones dinámicas, es decir, aquellas que permiten al usuario interactuar con los datos: hacer zoom, desplazar, filtrar y explorar puntos específicos al pasar el cursor por el gráfico.

Plotly es especialmente útil cuando queremos presentar resultados a clientes o equipos que no tienen conocimientos técnicos, ya que facilita la creación de dashboards y reportes más amigables y visuales.

Algunas de las principales características de Plotly son:

- Permite crear gráficos de líneas, barras, dispersión, mapas de calor, gráficos de pastel y dashboards interactivos de manera sencilla.
- Ofrece la posibilidad de exportar los gráficos en HTML para ser integrados en páginas web o presentaciones.
- Se integra de manera natural con Google Colab y Jupyter Notebooks, permitiendo visualizar los gráficos directamente en el entorno de trabajo.
- Además de gráficos básicos, también es posible desarrollar gráficos avanzados, como mapas geográficos interactivos o gráficos 3D, útiles en contextos más específicos.

Otra ventaja importante es que Plotly permite modificar la visualización directamente desde el navegador: las personas que consultan el gráfico pueden, por ejemplo, seleccionar rangos de datos o inspeccionar valores concretos sin tener que modificar el código.

Durante este curso, Plotly se utilizará en aquellas situaciones donde necesitemos que nuestras visualizaciones sean explorables e interactivas, como parte del análisis exploratorio o para presentar resultados finales de forma profesional.

Plotly, junto con las otras herramientas vistas (Pandas, Matplotlib y Seaborn), conforma un kit completo para abordar la visualización de datos desde diferentes niveles: desde lo más básico hasta lo más interactivo y dinámico.

**Visual:** Logotipo «plotly», cuyos trazos verticales recuerdan barras; no es una captura de una visualización interactiva.

## Página 7

#### Instalación y uso

Si estás usando Google Colab, todas estas librerías ya vienen instaladas. Si decidiste usar algún editor de código, la instalación se hace con pip desde la terminal. Podés instalar las librerías ejecutando el siguiente comand:

```sh
Python -m pip install pandas matplotlib plotly seaborn
```

### EDA, limpieza y consolidación de datos

Cuando se habla de proyectos de Machine Learning o de análisis de datos en general, suele pensarse directamente en los modelos predictivos y en los resultados finales. Sin embargo, uno de los pasos más importantes y a veces más laboriosos es la etapa previa al modelado, conocida como EDA (Exploratory Data Analysis, o Análisis Exploratorio de Datos) y el proceso de limpieza y consolidación de datos.

El EDA es una metodología que busca conocer en profundidad la estructura y las características de un conjunto de datos antes de aplicar cualquier modelo o realizar inferencias. Esta fase es indispensable porque permite identificar patrones, tendencias y relaciones entre variables, así como también detectar anomalías, errores y aspectos que requieren atención. Un análisis exploratorio bien realizado ayuda a entender qué información es valiosa para el proyecto y qué datos podrían ser irrelevantes o incluso engañosos.

Durante el EDA, se analizan aspectos básicos pero esenciales como la distribución de las variables, la presencia de valores atípicos (outliers), la existencia de datos faltantes y la relación entre las distintas columnas del dataset. Se aplican métricas estadísticas descriptivas (media, mediana, desviación estándar) y se realizan visualizaciones que facilitan la comprensión de los datos más allá de la tabla. Estas visualizaciones suelen ser gráficas sencillas como histogramas, gráficos de dispersión, diagramas de caja o mapas de calor de correlación.

Luego del EDA, es habitual que aparezcan "problemas" en la calidad de los datos, lo que nos lleva al siguiente paso: la limpieza. Trabajar con datos del mundo real implica casi siempre lidiar con inconsistencias, errores y registros incompletos. Pueden encontrarse datos duplicados, valores nulos o inválidos, columnas mal tipadas (por ejemplo, columnas numéricas que contienen texto) y errores humanos o de sistema en la carga original de los

**Visual:** Persona con portapapeles frente a cuatro paneles ilustrados con gráficos circulares, de barras y de área; gráficos esquemáticos, sin ejes ni valores para transcribir.

## Página 8

datos. La limpieza consiste en corregir o eliminar estos problemas para garantizar que los algoritmos trabajen con información precisa y coherente.

En algunos casos, la limpieza implicará eliminar registros que tengan información incompleta, mientras que en otros será más adecuado imputar esos valores faltantes (por ejemplo, reemplazarlos por la media o la mediana de la columna) o crear categorías específicas que los contemplen. El tipo de limpieza dependerá del contexto y de la naturaleza de los datos.

Finalmente, llegamos a la consolidación de datos, un proceso mediante el cual combinamos y unificamos información que puede provenir de múltiples fuentes. Es habitual que los datos de un proyecto no estén contenidos en un solo archivo o tabla, sino que estén distribuidos en distintos documentos, hojas de Excel o incluso bases de datos. Consolidar los datos significa integrar esta información de manera ordenada y consistente, resolviendo posibles diferencias en los formatos, nombres de columnas o estructuras de las tablas.

Esta consolidación es fundamental porque nos permite tener una única "versión de la verdad" sobre la cual realizar análisis posteriores y entrenar modelos de Machine Learning. Además, mejora la eficiencia del flujo de trabajo y reduce el riesgo de errores cuando se combinan datos de distintas fuentes.

Estas tres actividades —el análisis exploratorio, la limpieza y la consolidación de datos— no solo son pasos previos a la aplicación de algoritmos, sino que son la base que garantizará la calidad de los resultados y la fiabilidad del modelo final. No existe buen modelo de Machine Learning sin datos bien explorados, limpios y correctamente integrados.

### Reflexión final

A lo largo de esta clase repasamos herramientas clave que forman parte de la “caja de herramientas” de cualquier persona que trabaja en ciencia de datos. Volvimos a encontrarnos con Pandas, Matplotlib, Seaborn y Plotly, que no sólo nos permiten manipular datos, sino también visualizar la información de manera clara y eficiente. Además, comprendimos la importancia de realizar un análisis exploratorio cuidadoso y de garantizar la calidad de los datos mediante procesos de limpieza y consolidación.

Sin importar lo sofisticado que pueda llegar a ser un modelo de Machine Learning, si los datos con los que trabajamos no son confiables o no reflejan la realidad de manera adecuada, los resultados estarán lejos de ser útiles. El valor de un análisis sólido y de un pipeline bien construido reside en comenzar desde la base: datos limpios, organizados y bien comprendidos.

**Visual:** Dos personas ante un monitor y paneles con figuras estadísticas estilizadas (línea, círculos y barras), sin datos cuantitativos identificables.

## Página 9

Lo que sigue será adentrarnos en los conceptos propios del aprendizaje automático y comenzar a preparar esos datos para convertirlos en insumos valiosos para nuestros futuros modelos.

### Materiales y recursos adicionales:

- **Gráficos Interactivos en Python con Pandas y Plotly:** Este video te guía en la [creación de gráficos interactivos utilizando Pandas y Plotly](https://www.youtube.com/watch?v=Zt3tzGjLmPA), facilitando la visualización dinámica de datos.
- **Análisis Exploratorio de Datos - Clase Práctica:** En esta clase práctica en video, se aborda el [proceso de Análisis Exploratorio de Datos](https://www.youtube.com/watch?v=LTbnv7gs-WY), incluyendo técnicas de limpieza y visualización para una mejor comprensión de los datasets.
- **ANÁLISIS EXPLORATORIO DE DATOS con Python:** Este tutorial ofrece una [introducción práctica al Análisis Exploratorio de Datos utilizando Python](https://www.youtube.com/watch?v=wBu0hQQVdcE), cubriendo desde la carga de datos hasta la visualización de patrones y tendencias.
- **Guía práctica de introducción al Análisis Exploratorio de Datos:** Este documento proporciona una [guía detallada sobre cómo realizar un Análisis Exploratorio de Datos](https://datos.gob.es/sites/default/files/doc/file/analisis_exploratorio_de_datos_2021.pdf), incluyendo técnicas de limpieza y preparación de datos.
- **Python Seaborn Tutorial Para Principiantes - Empezar a visualizar datos:** Este tutorial introduce los [fundamentos de la visualización de datos estadísticos en Python utilizando Seaborn](https://www.datacamp.com/es/tutorial/seaborn-python-tutorial), desde DataFrames de Pandas hasta gráficos complejos.
- **Exploración de datos, una guía completa:** Este artículo profundiza en la exploración de datos, destacando su importancia en la [preparación y análisis de datos mediante herramientas de visualización y técnicas estadísticas](https://www.astera.com/es/type/blog/data-exploration/).

### Preguntas para reflexionar:

1. ¿Qué diferencias notaste entre Matplotlib, Seaborn y Plotly a la hora de crear visualizaciones? ¿En qué situaciones elegirías cada una?
2. ¿Por qué creés que el Análisis Exploratorio de Datos (EDA) es una etapa crítica antes de aplicar modelos de Machine Learning?
3. ¿Qué riesgos podrías enfrentar si trabajás con datos que no han sido correctamente limpiados o consolidados?
4. ¿Qué beneficios aporta Pandas al flujo de trabajo cuando se combinan tareas de análisis y visualización de datos?

## Página 10

### Otro día de trabajo en Talento Lab

Luego de una jornada intensa de repaso técnico, el equipo de Talento Lab se prepara para sistematizar todo lo trabajado durante el día. Silvia ha convocado una breve reunión de cierre con el objetivo de que cada integrante del equipo pueda documentar lo explorado hasta el momento. La meta es clara: entregar un informe preliminar al cliente del sector retail que detalle el estado actual del dataset y los próximos pasos antes de aplicar modelos predictivos.

Matías, con su enfoque metódico, ya ha detectado columnas con valores faltantes y duplicados que podrían interferir con futuros análisis. Luis propone incluir algunas visualizaciones claras para presentar mejor los hallazgos, mientras Sabrina empieza a organizar una estrategia de consolidación para dejar el dataset listo para las siguientes fases.

Como parte del equipo, tu aporte también es clave: deberás contribuir al análisis con una exploración y limpieza inicial del dataset. Este trabajo no solo servirá como base del proyecto final, sino que también te permitirá practicar y afianzar herramientas esenciales para cualquier proyecto de Machine Learning.

**Visual:** Logotipo «Talento Lab» junto al relato, sin captura de informe ni dataset.

## Página 11

### Ejercicio práctico

1. Usá Pandas para cargar un dataset real (puede ser uno de Kaggle, o uno que ya tengas). Preferentemente, usá un archivo en formato .csv o .xlsx.
2. Realizá un análisis exploratorio aplicando las herramientas que vimos hoy:
   - Revisá la estructura general del dataset.
   - Detectá valores nulos, duplicados o inconsistencias.
   - Analizá los tipos de datos de cada columna.
3. Creá al menos dos visualizaciones:
   - Una que explore la distribución de una variable numérica.
   - Otra que represente la relación entre dos variables (por ejemplo, un gráfico de dispersión, un boxplot o un gráfico de barras cruzado).
4. Documentá tus hallazgos directamente en tu notebook. ¿Qué problemas detectaste? ¿Qué columnas podrían requerir limpieza o transformación antes de construir un modelo?

Este ejercicio no solo te permitirá practicar habilidades técnicas fundamentales, sino que también te entrenará para comunicar tus observaciones de manera clara y profesional —tal como lo haría un miembro real del equipo de Talento Lab frente a un cliente.

### Próximos pasos

En la próxima etapa comenzaremos a introducirnos en los fundamentos del aprendizaje automático, entendiendo qué es exactamente Machine Learning, cuáles son sus tipos principales y cómo se estructura el ciclo de vida de un proyecto de este tipo. Será un momento clave para pasar de la exploración de datos a pensar en cómo automatizar la detección de patrones y la toma de decisiones basada en algoritmos.

A partir de las siguientes clases, abordaremos también la preparación de los datos para que puedan ser utilizados por estos modelos, aplicando técnicas específicas de preprocesamiento, como la ingeniería de características y la normalización. Estos conceptos serán fundamentales para que el equipo de Talento Lab y, por extensión, cada estudiante pueda avanzar en el diseño de soluciones predictivas con datos reales.

Lo que sigue será el comienzo de la transición: de analizar los datos a entrenar modelos que aprendan de ellos.

## Página 12

**Visual:** Contraportada azul oscuro con trama geométrica de líneas y marcas «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
