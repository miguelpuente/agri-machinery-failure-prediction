# Clase N° 1 | Conceptos básicos

**Fuente:** [ML CLASE _ 01.pdf](ML%20CLASE%20_%2001.pdf), páginas 1–14. Transcripción del contenido por página; las notas «Visual» describen elementos observados en la página y no forman parte del texto docente. Los encabezados institucionales repetidos muestran `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 1. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro con dos personas ilustradas, una con tableta y otra con computadora portátil, a ambos lados de un cubo turquesa.

## Página 2

### Clase N° 1 | Conceptos básicos

### Índice

- Presentación del curso y estructura de trabajo
- Google Colab
  - ¿Por qué trabajamos con Google Colab?
  - Google Colab nos permite:
  - ¿Y si quiero trabajar en mi propia computadora?
- Kaggle
- Revisión de formatos de datasets
  - CSV
  - Excel (.xlsx/.xls)
  - Otros formatos comunes (JSON, TXT y otros)
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Ejercicio práctico

### Objetivo de la clase:

En esta primera clase, el propósito es introducir a las personas al curso de Machine Learning, presentando los objetivos generales y el recorrido formativo que desarrollarán a lo largo de la cursada. Se busca familiarizar al estudiante con la dinámica de trabajo, que combinará encuentros virtuales, materiales de estudio y ejercicios prácticos para consolidar los aprendizajes.

Además, en esta instancia se presentarán las herramientas colaborativas que utilizaremos durante todo el trayecto, enfocándonos especialmente en Google Colab y Kaggle, como entornos de desarrollo y experimentación en la nube. Finalmente, abordaremos una revisión de los formatos de datos estructurados más comunes, tales como CSV y Excel, para sentar las bases sobre las que trabajaremos con datasets reales en las siguientes clases.

## Página 3

### Presentación del curso y estructura de trabajo

El objetivo es que, al finalizar la cursada, cada estudiante sea capaz de desarrollar de forma autónoma un proyecto completo de Machine Learning, que abarque todas sus etapas: desde la preparación de los datos hasta la implementación de modelos y la comunicación de los resultados obtenidos.

La dinámica del curso combinará encuentros virtuales sincrónicos, donde los docentes presentarán los temas y resolverán dudas, junto con material teórico de apoyo y actividades prácticas que las personas deberán realizar en Google Colab. Además, durante las clases se utilizarán datasets reales o simulados, provenientes de distintas plataformas como Kaggle, que permitirán aplicar lo aprendido de manera progresiva.

El curso está diseñado para que cada clase combine teoría y práctica, asegurando que los conceptos se comprendan y se lleven a la acción de manera inmediata. La última etapa de la formación incluirá un proyecto final integrador, en el que cada estudiante o grupo diseñará un pipeline de Machine Learning de principio a fin.

A lo largo de la cursada, se utilizarán herramientas de código abierto, priorizando el trabajo colaborativo, la autonomía en la resolución de problemas y la reflexión crítica sobre las decisiones técnicas que acompañan cada etapa de un proyecto de ML.

**Visual:** Ilustración de una montaña amarilla vista a través de una mira circular, con una bandera en la cima; acompaña la presentación del objetivo del curso, sin representar etapas técnicas.

## Página 4

### Google Colab

Durante este curso, vamos a estar utilizando Google Colab como nuestro entorno principal de desarrollo. Google Colab es una herramienta basada en la nube que permite escribir y ejecutar código Python directamente desde un navegador web, sin necesidad de instalaciones locales. Su facilidad de uso y su integración con Google Drive la convierten en una opción ideal para trabajar de manera colaborativa y almacenar los notebooks de forma organizada.

A esta altura del trayecto formativo, ya es un entorno familiar para quienes cursan, pero es importante recordar algunas de sus ventajas clave: permite el uso de recursos gratuitos como GPUs o TPUs, facilita la documentación del código con celdas de texto (Markdown) y permite compartir notebooks fácilmente con otras personas, ya sea para trabajo en equipo o para la entrega de proyectos.

En este curso de Machine Learning, Google Colab será fundamental para construir modelos, procesar datos y realizar pruebas en tiempo real. Además, nos servirá para documentar cada paso del proyecto, integrando código y análisis en un mismo lugar. Si bien ya contamos con experiencia previa en su uso, será clave aprovechar las buenas prácticas que hemos aprendido: mantener los notebooks ordenados, comentar el código de forma clara y organizar las carpetas de Google Drive para tener acceso rápido a datasets y archivos de trabajo.

#### ¿Por qué trabajamos con Google Colab?

Una de las grandes ventajas de este trayecto formativo es que todo el desarrollo de los modelos de Machine Learning puede realizarse directamente en Google Colab, sin necesidad de instalar software ni configurar entornos en nuestra computadora personal.

**Google Colab nos permite:**

- Ejecutar código Python desde cualquier navegador web, sin instalar nada localmente.
- Trabajar de forma interactiva con el docente, compartiendo notebooks y observando en tiempo real lo que hace cada integrante del equipo.
- Evitar problemas de compatibilidad o instalación de librerías, ya que el entorno de ejecución ya viene preparado con las principales bibliotecas de Machine Learning (como pandas, scikit-learn, matplotlib, seaborn, entre muchas otras).

**Visual:** Logotipo amarillo «CO» de Google Colaboratory junto al nombre de la herramienta; no hay captura de interfaz.

## Página 5

**Google Colab nos permite (continuación):**

- Aprovechar recursos gratuitos de procesamiento, incluyendo acceso a GPUs y TPUs, algo especialmente útil para modelos más complejos o conjuntos de datos grandes.
- Almacenar automáticamente el trabajo en Google Drive, permitiendo que el estudiante pueda acceder a sus notebooks desde cualquier dispositivo conectado a Internet.
- Compartir fácilmente el trabajo con otros, algo clave para proyectos grupales o entregas al docente.

Además, trabajar en Colab te entrena en el uso de herramientas colaborativas basadas en la nube, un entorno cada vez más común en contextos profesionales.

#### ¿Y si quiero trabajar en mi propia computadora?

Aunque todo el curso está diseñado para que pueda completarse íntegramente desde Google Colab, y durante las clases vas a ver al docente trabajando con esa herramienta, también es posible desarrollar el proyecto final en una computadora personal. En ese caso, es importante tener en cuenta qué herramientas y configuraciones son necesarias.

Para trabajar localmente, vas a necesitar:

1. Instalar Python 3.10 o superior, disponible desde el sitio oficial https://www.python.org.
2. Instalar un entorno de desarrollo, como:
   - Visual Studio Code (recomendado por su ligereza y extensiones útiles) https://code.visualstudio.com/
   - Jupyter Notebook o JupyterLab (si se desea replicar la experiencia notebook de Colab) https://jupyter.org/

Instalar las siguientes librerías (usadas a lo largo del curso): Pandas, Numpy, Matplotlib, seaborn y scikit-learn. Lo haces desde la terminal con este comando:

```sh
pip install pandas numpy matplotlib seaborn scikit-learn
```

3. Tener una carpeta organizada para datasets y notebooks, que funcione como entorno de trabajo.

Opcionalmente, también podés crear un entorno virtual para aislar las dependencias del proyecto y evitar conflictos con otras instalaciones.

## Página 6

### Kaggle

Además de Google Colab, otra herramienta clave que vamos a utilizar durante este curso es Kaggle, una plataforma ampliamente reconocida en la comunidad de ciencia de datos y Machine Learning. Kaggle es mucho más que un repositorio de datasets: es un entorno colaborativo donde es posible acceder a bases de datos públicas, participar en competencias de modelado y compartir notebooks con soluciones a problemas reales.

Durante el trayecto formativo anterior, ya trabajamos con Kaggle para descargar datasets y realizar análisis exploratorios. En esta etapa del curso, profundizaremos su uso enfocándonos en encontrar datasets que sirvan como base para desarrollar modelos de aprendizaje automático. También podremos utilizar notebooks ya existentes de otros usuarios como referencia o inspiración para nuestras propias soluciones.

Kaggle será especialmente útil para identificar problemas reales que otras personas ya han resuelto o en los que han trabajado, permitiendo así incorporar nuevas ideas y enfoques a nuestros proyectos. Además, la plataforma nos facilita descargar datasets en formatos listos para utilizar en Google Colab, manteniendo así un flujo de trabajo ágil y eficiente.

Al igual que en cursos anteriores, es importante que cada persona mantenga su cuenta activa y revisada, ya que varias de las prácticas del curso estarán vinculadas a datasets que extraeremos directamente desde Kaggle.

**Visual:** Logotipo «kaggle» junto a una ilustración de servidores apilados; no se muestra un dataset específico.

## Página 7

### Revisión de formatos de datasets

En Machine Learning y ciencia de datos, es esencial conocer y manejar correctamente los formatos de archivos que contienen la información con la que vamos a trabajar. En este curso, nos encontraremos principalmente con datasets en formatos estructurados, que son aquellos que organizan la información en filas y columnas, facilitando su procesamiento y análisis.

#### CSV

El formato CSV (Comma-Separated Values) es uno de los más utilizados en el ámbito de la ciencia de datos y Machine Learning debido a su simplicidad, versatilidad y compatibilidad con prácticamente cualquier herramienta de análisis. Se trata de un archivo de texto plano en el que los datos se organizan en filas y columnas, siendo las columnas separadas comúnmente por comas. Cada línea del archivo representa una fila o registro, y cada valor dentro de la fila corresponde a una columna del dataset.

Un aspecto clave del CSV es su carácter ligero y portable, lo que facilita su uso en entornos colaborativos como Google Colab, Kaggle o GitHub. Además, Pandas cuenta con funciones nativas como `read_csv()` y `to_csv()` que permiten importar y exportar datos en este formato de manera rápida y sencilla. Aunque CSV es un estándar ampliamente aceptado, no siempre es tan homogéneo como parece. En la práctica, es común encontrarse con variaciones dependiendo del país o del sistema desde el que se haya generado el archivo. Algunos CSV utilizan punto y coma (;) como separador en lugar de coma, especialmente en países donde la coma se utiliza para los decimales. Otros archivos pueden venir con tabulaciones, o incluso con separadores personalizados como el símbolo pipe (|).

Otro detalle importante es la presencia o no de encabezados (headers). En algunos CSV la primera fila incluye los nombres de las columnas, mientras que en otros los encabezados están ausentes, lo que obliga a asignarlos manualmente al cargar los datos.

El manejo de codificaciones también es un tema a considerar. Muchos archivos CSV están guardados con la codificación UTF-8, pero otros pueden venir en latin1 u otros formatos regionales, lo que puede provocar errores al momento de la carga si no se especifica correctamente el parámetro de encoding. Además, los CSV no admiten ciertos tipos de información compleja como jerarquías o relaciones entre tablas (como sí lo hacen otros formatos, por ejemplo, una base de datos relacional). Sin embargo, para la gran mayoría de los proyectos de Machine Learning, donde se trabaja con datasets tabulares y bien estructurados, el CSV es una opción ideal por su facilidad para integrarse con los pipelines de procesamiento de datos.Por todo esto, CSV es el “lenguaje común” de los datasets y dominar sus variantes es un paso indispensable para cualquier persona que trabaje con datos.

**Visual:** Icono de un documento con líneas verdes y una etiqueta «CSV»; no hay tabla de valores.

## Página 8

#### Excel (.xlsx/.xls)

El formato Excel, con extensiones como .xlsx o .xls, es otro de los más comunes en la manipulación de datos, sobre todo en entornos empresariales donde muchas organizaciones almacenan y gestionan información utilizando hojas de cálculo. Aunque es más pesado y menos universal que el CSV, Excel es extremadamente versátil y permite almacenar grandes volúmenes de datos con funcionalidades adicionales, como fórmulas, estilos y múltiples hojas (o tabs) dentro de un mismo archivo.

Para proyectos de Machine Learning, generalmente no nos interesan las celdas con fórmulas o el formato visual (colores, bordes, filtros aplicados). Lo que sí nos importa es la estructura tabular que Excel ofrece para trabajar con filas y columnas de datos, de forma muy similar a un CSV.

A diferencia del CSV, Excel permite tener múltiples hojas en un solo archivo, lo que implica que al momento de cargarlo debemos indicar en qué hoja específica se encuentran los datos que vamos a procesar. En Pandas, esto se resuelve fácilmente con la función `read_excel()`, que también permite leer todas las hojas a la vez o una sola en particular mediante el parámetro `sheet_name`.

Otro detalle importante es que los archivos Excel pueden almacenar diferentes tipos de datos dentro de una misma hoja, como números, fechas, texto y celdas vacías, lo que puede generar ciertos desafíos al momento de convertir la información en un DataFrame de Pandas. Por ejemplo, puede que tengamos columnas que aparentan ser numéricas, pero que contienen celdas vacías o textos “incrustados” que requieren limpieza.

Además, los archivos Excel suelen venir con encabezados (headers) en la primera fila, aunque en ocasiones pueden tener varias filas de títulos, subtítulos o notas antes de llegar a la tabla de datos propiamente dicha. En estos casos, es necesario ajustar el parámetro `skiprows` al importar el archivo para ignorar las filas que no forman parte del dataset.

Por último, al ser un formato más complejo, los archivos Excel son menos eficientes en términos de peso y portabilidad. Aunque son ideales para trabajos internos y reportes, no siempre son la mejor opción cuando se necesita compartir grandes volúmenes de datos o integrarlos en procesos automatizados, donde el CSV suele ser la alternativa más liviana.

Dicho esto, es frecuente encontrarse con Excel en las etapas iniciales de un proyecto, especialmente cuando se trata de información proporcionada por clientes o por áreas administrativas que lo utilizan como herramienta de gestión. Por eso, es fundamental saber cómo importar y adaptar estos datos para nuestros flujos de trabajo en Python y scikit-learn.

**Visual:** Logotipo verde de Excel con una «X» y una cuadrícula; no muestra datos legibles.

## Página 9

#### Otros formatos comunes (JSON, TXT y otros)

Además de los formatos CSV y Excel, en el mundo del análisis de datos es habitual encontrarse con otros tipos de archivos que pueden aparecer en distintas etapas de un proyecto o ser utilizados como fuentes de información complementaria.

Uno de los más relevantes es JSON (JavaScript Object Notation). Este formato es ampliamente utilizado para almacenar y transferir datos estructurados, especialmente en aplicaciones web y APIs. A diferencia de CSV y Excel, que presentan una estructura puramente tabular, JSON permite representar estructuras jerárquicas y anidadas, es decir, datos que tienen relaciones entre sí en distintos niveles. Por ejemplo, un JSON puede contener una lista de productos y dentro de cada producto una lista de sus características.

Desde el punto de vista técnico, los archivos JSON son fáciles de manipular en Python utilizando tanto la librería estándar `json` como la función `read_json()` de Pandas. Sin embargo, en muchos casos es necesario “aplanar” o normalizar los datos antes de convertirlos en un DataFrame listo para ser analizado, debido a que las estructuras anidadas pueden dificultar el trabajo con librerías como scikit-learn, que requieren una estructura tabular.

Otro formato frecuente es TXT (archivo de texto plano), que suele contener datos delimitados por tabulaciones, espacios u otros caracteres especiales. Este tipo de archivo se encuentra en situaciones como registros de logs, reportes simples o exportaciones de sistemas antiguos. Si bien es similar en esencia al CSV, el TXT no siempre sigue una estructura estandarizada, por lo que es común tener que inspeccionarlo manualmente o utilizar funciones como `read_csv()` en Pandas, especificando manualmente el delimitador correcto.

También es posible cruzarse con archivos en formato TSV (Tab-Separated Values), que es una variante del CSV donde los campos están separados por tabulaciones en lugar de comas. Su manejo es prácticamente idéntico al del CSV, ajustando el delimitador correspondiente al momento de la carga.

Por último, en contextos más especializados, podrían aparecer formatos como Parquet o Feather, optimizados para almacenar grandes volúmenes de datos de manera comprimida y eficiente. Estos formatos son comunes en entornos de Big Data, aunque no serán el foco en este curso. Reconocer y saber adaptar distintos formatos de datos es una competencia básica para cualquier persona que trabaje en proyectos de Machine Learning. Tener la capacidad de leer, inspeccionar y transformar datos provenientes de diferentes fuentes permite una mayor flexibilidad y agilidad en el desarrollo de soluciones.

**Visual:** Identificadores gráficos «{JSON} JavaScript Object Notation» y un icono de archivo «TXT»; no se representa una estructura JSON ni un archivo TXT concreto.

## Página 10

### Reflexión final

En este primer encuentro, hemos sentado las bases para el trayecto que iniciaremos a lo largo de este curso. Repasamos las herramientas principales que nos acompañarán durante todo el proceso, como Google Colab y Kaggle, que ya forman parte del ecosistema habitual de cualquier equipo de ciencia de datos. También profundizamos en los formatos de datos más comunes que encontraremos al trabajar con datasets reales, con especial atención al CSV y Excel, que serán parte recurrente de nuestros proyectos.

Comprender bien desde el inicio dónde y cómo se encuentran los datos nos permitirá abordar las próximas etapas con mayor claridad y eficiencia. Cada modelo de Machine Learning comienza con datos concretos, y el modo en que los recibimos, procesamos y organizamos es tan importante como el propio algoritmo que desarrollaremos. Lo que sigue será adentrarnos en el mundo del aprendizaje automático y comenzar a construir nuestras primeras soluciones predictivas.

### Materiales y recursos adicionales:

- **Introducción a Google Colab para principiantes: ¿Qué es? ¿Cómo se usa?:** Este video ofrece una [explicación detallada sobre qué es Google Colab y cómo utilizarlo](https://youtu.be/9g61bnipcSs), ideal para reforzar lo visto en clase.
- **TOP sitios para descargar datasets (Excel - CSV) para analistas de datos:** En este video, se presentan [diversas fuentes donde puedes obtener datasets en formatos Excel y CSV](https://youtu.be/gVYc13Wj2Z8), lo cual es útil para practicar análisis de datos.
- **Te damos la bienvenida a Colaboratory - Colab - Google:** La página oficial de Google Colab proporciona [una guía completa sobre cómo utilizar esta herramienta](https://colab.research.google.com/?hl=es), incluyendo características y funcionalidades.
- **¿Cómo utilizar datasets de Kaggle en Google Colab?:** Este tutorial explica paso a paso [cómo importar datasets desde Kaggle directamente en Google Colab](https://datos.ninja/tutorial/como-utilizar-datasets-de-kaggle-en-google-colab/), facilitando el flujo de trabajo en tus proyectos de análisis de datos.
- **15 conjuntos de datos de Excel para principiantes en análisis de datos:** Este artículo recopila [15 datasets en formato Excel ideales para quienes se inician en el análisis de datos](https://hackernoon.com/lang/es/15-conjuntos-de-datos-de-excel-para-principiantes-en-analisis-de-datos), ofreciendo oportunidades para practicar diversas técnicas analíticas.

## Página 11

### Preguntas para reflexionar:

1. ¿Por qué es importante tener un entorno de trabajo colaborativo y en la nube, como Google Colab, al desarrollar proyectos de Machine Learning?
2. ¿Qué ventajas y desventajas identificás entre trabajar con un archivo CSV y un archivo Excel cuando realizás un análisis de datos?
3. ¿Cómo creés que influye la correcta identificación del formato de los datos (CSV, Excel, JSON, etc.) en la eficiencia de un proyecto de análisis o modelado?
4. ¿Qué otros formatos de datos conocés o has utilizado anteriormente, y en qué contextos creés que podrían aparecer en proyectos reales?

### Storytelling

#### Presentación de la empresa

Talento Lab es una startup de consultoría en datos ubicada en Buenos Aires, enfocada en transformar grandes volúmenes de información en soluciones estratégicas para empresas de distintos sectores. Con un equipo ágil y especializado, Talento Lab desarrolla proyectos que van desde la exploración de datos hasta la implementación de modelos de Machine Learning, ayudando a sus clientes a tomar decisiones basadas en evidencia.

**Equipo de Talento Lab:**

| Integrante | Función |
| --- | --- |
| Luis | Especialista en Business Intelligence |
| Silvia | Project Manager y Data Scientist |
| Matías | Data Analyst |
| Sabrina | Data Engineer |

**Visual:** Logotipo «Talento Lab» y cuatro retratos ilustrados junto a los nombres y funciones reproducidos en la tabla.

## Página 12

### ¡Tu primer día en Talento Lab!

En esta oportunidad, Talento Lab inicia un nuevo proyecto con una empresa del sector retail que busca mejorar la predicción de la demanda de sus productos. El equipo se encuentra en la etapa inicial, donde es fundamental revisar las herramientas que utilizarán durante todo el proceso y dejar listo el entorno de trabajo.

Antes de comenzar con la exploración de datos y la construcción de modelos, el equipo decide asegurarse de que todo el flujo de trabajo esté bien organizado. Para ello, revisan los entornos de desarrollo que emplearán, como Google Colab y Kaggle, plataformas colaborativas donde podrán procesar y analizar datos en la nube. También revisan los primeros datasets proporcionados por el cliente, que en su mayoría están en formato CSV, aunque también hay algunos archivos Excel.

El equipo sabe que una correcta configuración de las herramientas desde el inicio es fundamental para garantizar la eficiencia del proyecto. Esta primera instancia se enfocará en familiarizarse con los entornos de trabajo y con los formatos de datos que estarán presentes a lo largo de todo el proceso.

### Ejercicio práctico

El equipo de Talento Lab ya recibió los primeros datasets del nuevo cliente y Silvia necesita que todo el equipo deje listo el entorno de trabajo para comenzar con el análisis exploratorio en las próximas reuniones.

Como parte del equipo, tu tarea es:

1. Crear un nuevo notebook en Google Colab y vincularlo a tu Google Drive para asegurar un flujo de trabajo ordenado y accesible.
2. Descargar desde Kaggle un dataset de tu interés (puede ser uno sencillo de ventas, clientes, productos, etc.).
3. Cargar el dataset en tu notebook de Colab y verificar que el archivo esté correctamente importado. Podés usar Pandas para visualizar las primeras filas del archivo con `head()`.
4. Identificar y comentar en el notebook el formato del dataset que elegiste (CSV, Excel, etc.) y detallar brevemente si encontraste alguna particularidad en el separador, los encabezados o la codificación del archivo.

Este ejercicio permitirá sentar las bases del proyecto y que más adelante puedan revisar tu notebook y asegurar que todo esté listo para la limpieza y el preprocesamiento en las siguientes etapas del proyecto.

**Visual:** Logotipo «Talento Lab» junto a la introducción del caso; no hay captura de Colab ni del dataset.

## Página 13

### Próximos pasos

En las próximas clases comenzaremos a introducirnos en el mundo del aprendizaje automático. A partir del entorno de trabajo que ya tenemos preparado, daremos un paso adelante para revisar conceptos clave que nos permitirán entender qué es Machine Learning, cómo se clasifican sus tipos y cuál es el ciclo de vida que sigue un proyecto de estas características. También repasaremos cómo preparar los datos para que puedan ser utilizados por los algoritmos, abordando técnicas de preprocesamiento más específicas que aseguran que la información esté en condiciones óptimas para construir modelos confiables.

A medida que avancemos, iremos conociendo algunos de los algoritmos más populares y aplicados en la industria, tanto en problemas de regresión como de clasificación. Estas primeras semanas serán la base sobre la cual construiremos nuestras soluciones predictivas, siempre acompañando la teoría con prácticas concretas en Colab.

Con cada paso, nos acercaremos un poco más al desafío de diseñar un pipeline completo de Machine Learning que nos permita resolver problemas reales, tal como lo hace el equipo de Talento Lab en sus proyectos profesionales.

## Página 14

**Visual:** Contraportada azul oscuro: trama geométrica de líneas a la izquierda y logotipos «Buenos Aires aprende», «Agencia de Habilidades para el Futuro» y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
