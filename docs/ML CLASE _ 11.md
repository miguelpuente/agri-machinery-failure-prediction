# Clase N° 11 | Introducción al clustering

**Fuente:** [ML CLASE _ 11.pdf](ML%20CLASE%20_%2011.pdf), páginas 1–13. Transcripción por página; las notas «Visual» describen elementos observados, no forman parte del texto docente. Las páginas interiores llevan `/educacionBA` y los logotipos de Buenos Aires Ciudad, Agencia de Habilidades para el Futuro y Talento Tech.

## Página 1

«Talento Tech» — Machine Learning — Clase 11. Buenos Aires Ciudad.

**Visual:** Portada azul oscuro: franja amarilla «Clase 11» y dos personas ilustradas con auriculares, una de pie con una tableta y otra sentada con una computadora portátil junto a un cubo turquesa.

## Página 2

### Clase N° 11 | Introducción al clustering

### Índice

- Aprendizaje no supervisado
- El algoritmo K-Means: ¿cómo agrupar sin etiquetas?
  - ¿Cómo evaluamos un clustering sin etiquetas?
  - ¿Por qué K-Means puede fallar?
- Alternativas a K-Means
- Cómo interpretar los resultados del clustering
- Reflexión final
- Materiales y recursos adicionales:
- Preguntas para reflexionar:
- Talento Lab: Un patrón oculto

### Objetivos de la clase:

En esta clase nos introduciremos al aprendizaje no supervisado, una rama del machine learning que no se basa en etiquetas conocidas para entrenar modelos. El objetivo será comprender qué es el clustering o agrupamiento, para qué sirve y cómo se diferencia del aprendizaje supervisado que venimos utilizando en clases anteriores.

Aprenderemos a utilizar el algoritmo K-Means, una técnica simple pero poderosa para clasificar elementos en grupos según sus similitudes, y conoceremos dos herramientas clave para evaluar su desempeño: la inercia y el silhouette score. Al finalizar la clase, serás capaz de aplicar este tipo de técnica para explorar y segmentar conjuntos de datos, generando nuevas formas de interpretar la información.

## Página 3

### Aprendizaje no supervisado

En el campo del aprendizaje automático, el aprendizaje supervisado ha sido el protagonista en nuestras clases anteriores. Allí, trabajamos con conjuntos de datos que incluyen variables predictoras y una etiqueta o variable objetivo que guía al modelo a "aprender" una relación entre ambas. Sin embargo, no todos los problemas se presentan con las respuestas a la vista. A veces, los datos vienen sin etiquetas. ¿Qué podemos hacer en esos casos?

El aprendizaje no supervisado aborda justamente esta situación: busca patrones, relaciones o estructuras ocultas en los datos sin necesidad de una variable objetivo conocida. En lugar de enseñarle al modelo qué es lo correcto, se lo deja descubrir por sí mismo las agrupaciones o asociaciones presentes en el conjunto de datos. Este enfoque es particularmente útil en tareas exploratorias, cuando se quiere segmentar una población, reducir dimensiones o entender mejor la estructura interna de un dataset.

**Visual:** Esquema en inglés: una nube de puntos multicolores «Input Raw Data» pasa por «Interpretation» (anotación «Unknown Output / No Training Data Set»), «Algorithm» y «Processing» hasta «Output»; a la derecha aparecen tres grupos separados de puntos rojos, verdes y violetas. No muestra etiquetas previas ni valores de ejes.

Una de las aplicaciones más conocidas del aprendizaje no supervisado es el clustering, o agrupamiento, que consiste en dividir un conjunto de datos en grupos o “clusters” de elementos similares entre sí. Por ejemplo, una empresa puede querer segmentar a sus clientes en grupos según su comportamiento de compra, sin saber de antemano cuántos perfiles existen o cómo se deberían clasificar. También se puede aplicar en biología para clasificar especies, en marketing para identificar perfiles de consumidores, o en astronomía para agrupar galaxias según sus propiedades.

La diferencia principal entre aprendizaje supervisado y no supervisado radica entonces en la presencia (o ausencia) de una variable objetivo. Mientras en el primero el modelo intenta predecir una etiqueta conocida (como si una persona sobrevivió al Titanic o cuánto gastará el mes próximo), en el segundo el modelo simplemente busca organización dentro del caos, sin referencias externas.

Esta clase nos abrirá la puerta a un nuevo enfoque, en el que aprenderemos a usar algoritmos que exploran los datos para ayudarnos a interpretarlos desde otra perspectiva. El primero de estos algoritmos será el K-Means, una técnica de clustering que veremos en detalle a continuación.

## Página 4

### El algoritmo K-Means: ¿cómo agrupar sin etiquetas?

K-Means es uno de los algoritmos de clustering más utilizados y sencillos de entender en el mundo del aprendizaje no supervisado. Su objetivo es simple: dividir los datos en k grupos, llamados clusters, de modo tal que los elementos dentro de cada grupo sean lo más parecidos posible entre sí, y lo más diferentes posible respecto de los elementos de otros grupos. Pero, ¿cómo hace esto un algoritmo sin tener etiquetas?

**Visual:** Comparación «Before K-Means» / «After K-Means»: a la izquierda puntos grises dispersos en un plano; una flecha «K-Means» conduce a la derecha a tres grupos de cruces coloreadas en óvalos rojo, azul y verde. Los ejes no tienen unidades ni valores.

La idea central es bastante intuitiva. Primero, se elige un número kkk (cantidad de grupos deseados). Luego, el algoritmo sigue un proceso iterativo que, aunque parte de una asignación aleatoria, tiende a organizar el espacio de datos de manera coherente. El procedimiento general sigue estos pasos:

1. Seleccionar aleatoriamente kkk puntos del espacio de datos, que actuarán como los “centros” iniciales de los clusters.
2. Asignar cada punto del dataset al centro más cercano, según una medida de distancia (usualmente, la distancia euclidiana).
3. Recalcular los centros de cada cluster como el promedio de los puntos que lo integran.
4. Repetir los pasos 2 y 3 hasta que las asignaciones no cambien significativamente o se alcance un número máximo de iteraciones.

El resultado es una segmentación de los datos donde cada observación pertenece a uno y solo un grupo, y se ha minimizado la variación interna dentro de cada cluster. Por eso, K-Means se conoce también como un algoritmo de minimización de varianza intra-cluster.

**Nota de transcripción:** El PDF imprime «kkk» en varios pasajes al referirse al número de clusters; se conserva esa grafía en el texto de origen. En el diagrama y el ejercicio se utiliza «k».

## Página 5

Una ventaja clave de K-Means es su velocidad y simplicidad. Puede aplicarse incluso a grandes conjuntos de datos, con resultados interpretables. Sin embargo, tiene limitaciones importantes: requiere elegir de antemano el número de clusters kkk, es sensible a los valores atípicos, y puede converger a soluciones locales subóptimas dependiendo de la inicialización.

Como veremos más adelante en el cuaderno Jupyter, una visualización clara de los clusters ayuda mucho a interpretar los resultados de K-Means, especialmente cuando se trabaja con dos o tres variables. Pero su aplicación puede ir mucho más allá: desde segmentar clientes, hasta detectar patrones de comportamiento o identificar grupos naturales en datos complejos.

**Visual:** Persona ilustrada ante una ventana de aplicación con engranajes y un recuadro de líneas; no es una captura del cuaderno Jupyter ni un resultado de clustering.

### ¿Cómo evaluamos un clustering sin etiquetas?

Una de las mayores dificultades del aprendizaje no supervisado es la evaluación de los resultados. A diferencia de los modelos supervisados —donde podemos medir el error comparando predicciones con etiquetas reales—, en el clustering no tenemos una “respuesta correcta” contra la cual contrastar. Entonces, ¿cómo saber si el agrupamiento que generamos tiene sentido?

Para esto, se utilizan métricas internas que evalúan la cohesión y la separación de los clusters. En esta clase trabajaremos con dos de las más comunes: la inercia y el índice silhouette. Ambas nos ayudan a decidir si el número de grupos es adecuado y si las agrupaciones son consistentes.

La inercia es una medida de la compacidad de los clusters. Se calcula como la suma de las distancias cuadradas entre cada punto y el centroide de su grupo. Cuanto menor sea este valor, más compactos son los clusters. Esto sugiere que los puntos están bien agrupados en torno a sus respectivos centros. Sin embargo, la inercia tiende a disminuir a medida que se incrementa el número de clusters, por lo que no puede usarse sola para decidir cuál es el valor óptimo de kkk. En este contexto, una técnica útil es el “método del codo”, que consiste en

**Visual:** Gráfico del «método del codo»: eje horizontal «Number of clusters» con marcas 1–6, eje vertical «Diameter»; curva descendente pronunciada entre 1 y 3 que luego se aplana. La marca 3 está rodeada en rojo y señalada como «Elbow!». La etiqueta vertical dice «Diameter», aunque el texto circundante trata de inercia; no se ofrecen cifras numéricas de inercia.

## Página 6

graficar la inercia para distintos valores de kkk y buscar el punto donde la mejora comienza a estabilizarse: esa inflexión suele indicar una buena elección de kkk.

Por otro lado, el índice silhouette (o coeficiente de silueta) mide qué tan similar es un punto a los del mismo cluster en comparación con los de otros clusters. Este índice varía entre -1 y 1: valores cercanos a 1 indican que el punto está bien agrupado; valores cercanos a 0 indican que está en el límite entre dos grupos; y valores negativos sugieren que el punto podría estar mal asignado. A diferencia de la inercia, el índice silhouette puede utilizarse como una métrica comparativa entre diferentes agrupamientos y ayuda a validar si la segmentación es razonable.

Estas métricas no reemplazan el juicio crítico ni el conocimiento del dominio del problema, pero sí ofrecen herramientas objetivas para analizar y mejorar nuestras decisiones de modelado. En el cuaderno de esta clase aprenderemos a calcular ambas, visualizarlas y combinarlas con la interpretación del gráfico de clusters.

### ¿Por qué K-Means puede fallar?

El algoritmo K-Means es simple, rápido y muy utilizado, pero no está exento de limitaciones. Comprender en qué condiciones puede fallar es tan importante como saber aplicarlo correctamente.

Uno de los principales problemas de K-Means es su sensibilidad a los valores atípicos. Dado que el algoritmo calcula los centroides como promedios de los puntos dentro de cada grupo, un solo valor extremo puede alterar significativamente la posición del centroide, afectando el agrupamiento del resto de los puntos.

Además, asume que los grupos son esféricos y de tamaño similar, lo cual rara vez ocurre en la práctica. Si los clusters tienen formas alargadas, densidades diferentes o están parcialmente solapados, K-Means probablemente no podrá capturar bien la estructura subyacente. Este supuesto rígido hace que el algoritmo funcione bien en conjuntos de datos “limpios” y con separación clara entre los grupos, pero no tanto en datos complejos.

Otra limitación importante es su dependencia del valor de kkk. Elegir un número inadecuado de clusters puede llevar a resultados muy pobres. Si se define un valor muy bajo, se pierden matices importantes. Si es demasiado alto, se termina dividiendo artificialmente grupos que deberían permanecer unidos. Por eso, existen técnicas como el método del codo o el coeficiente de silhouette que ayudan a encontrar un valor adecuado.

**Visual:** Persona preocupada ante un monitor con símbolo de error. Es una ilustración de las limitaciones, no un gráfico de valores atípicos ni una excepción reproducible.

## Página 7

Por último, K-Means no garantiza una solución óptima. El resultado final depende de los centroides iniciales que se asignan aleatoriamente. Por eso, muchas implementaciones modernas del algoritmo (como `KMeans` de scikit-learn) repiten el proceso varias veces con diferentes inicializaciones y se quedan con la mejor solución hallada.

K-Means es un algoritmo eficaz cuando se usa en contextos apropiados, pero puede fallar si no se controlan adecuadamente las condiciones del conjunto de datos o si se fuerza su aplicación en situaciones para las que no fue diseñado.

### Alternativas a K-Means

Existen alternativas a K-Means, y conocerlas es fundamental para elegir la herramienta adecuada según el tipo de datos que se desea agrupar. Si bien K-Means es uno de los algoritmos de clustering más populares por su sencillez y velocidad, no siempre es la mejor opción.

**Visual:** Dos diagramas de dispersión del mismo conjunto de anillos concéntricos, titulados «DBSCAN» y «KMeans». DBSCAN colorea el círculo central rojo, el anillo intermedio verde y el externo azul, dejando puntos dispersos negros como ruido; KMeans divide ambos anillos en sectores de colores que mezclan radios y colorea también el centro en más de un grupo. Muestran diferencias cualitativas en formas no convexas, sin cifras de rendimiento.

Una de las alternativas más destacadas es DBSCAN (Density-Based Spatial Clustering of Applications with Noise). Este algoritmo se basa en la densidad de puntos: forma clusters allí donde hay una concentración de puntos suficientemente alta y deja como “ruido” los puntos que están demasiado dispersos. Esto lo hace especialmente útil cuando los datos tienen formas de clusters irregulares o incluyen mucho ruido. Además, DBSCAN no requiere definir de antemano la cantidad de clusters, lo cual puede ser una ventaja en muchos escenarios.

Otra alternativa interesante es Mean Shift, un algoritmo que busca densidades máximas en el espacio de características. Es más lento que K-Means, pero tiene la ventaja de detectar automáticamente el número de clusters, adaptándose a la estructura de los datos sin necesidad de que el usuario lo especifique.

## Página 8

En contextos donde se requiere considerar la probabilidad de pertenencia de un punto a un cluster, se pueden utilizar Modelos de Mezcla Gaussiana (GMM, por sus siglas en inglés). A diferencia de K-Means, que asigna cada punto a un único grupo, GMM permite que un punto tenga una probabilidad asociada a cada cluster, lo que resulta útil cuando los datos tienen una distribución superpuesta o compleja.

También existen algoritmos jerárquicos, como Agglomerative Clustering, que construyen un árbol de agrupamientos desde los elementos individuales hasta formar un solo cluster. Son útiles cuando se desea explorar distintos niveles de agrupación o construir dendrogramas, ya que si bien K-Means es una excelente herramienta de partida, existen numerosos algoritmos que pueden ofrecer mejores resultados según la forma, densidad y complejidad de los datos. Elegir con criterio es parte del aprendizaje que propone el trabajo con Machine Learning.

**Visual:** Dendrograma verde «Hierarchical agglomerative clustering» con hojas individuales a–h que se unen en pares y luego en conjuntos mayores; flecha ascendente «Bottom-up approach». No representa un ejemplo de mezcla gaussiana. Debajo, ilustración de dos personas frente a gráficos de líneas y barras; no hay métricas legibles correspondientes a un clustering real.

### Cómo interpretar los resultados del clustering

Interpretar correctamente los resultados de un proceso de clustering es tan importante como aplicarlo. A diferencia de los modelos supervisados, donde se puede comparar la predicción con un valor real, en el clustering no hay “etiquetas correctas” a las que apuntar. Por eso, el análisis posterior debe enfocarse en el significado y utilidad de los grupos encontrados.

El primer paso es analizar el perfil de cada cluster. Una vez que se ejecutó el algoritmo (por ejemplo, K-Means) y se asignaron etiquetas de grupo a cada fila, es fundamental explorar qué características comparten los datos de cada cluster. Esto puede hacerse mediante estadísticas descriptivas, visualizaciones o incluso contando cuántos elementos hay en cada grupo. El objetivo es responder preguntas como: ¿Qué distingue al cluster 0 del cluster 1? ¿Qué valores de las variables tienden a aparecer en cada grupo?

Otra estrategia útil es visualizar los clusters. Si se trabaja con dos o tres variables numéricas, se puede crear un gráfico de dispersión donde los puntos estén coloreados según el grupo asignado. Esto ayuda a ver si los grupos están bien separados o si hay mucho solapamiento. Cuando se trabaja con muchas variables, es común reducir la

## Página 9

dimensionalidad del dataset (por ejemplo, con PCA) para graficar en 2D o 3D sin perder la estructura general.

También es importante prestar atención a la coherencia interna de los clusters. Métricas como la inercia (dentro de K-Means) o el silhouette score sirven para evaluar cuán compactos y separados están los grupos. Si los valores obtenidos son bajos, puede ser señal de que los clusters no reflejan bien la estructura de los datos. En ese caso, conviene revisar si el número de clusters elegido fue adecuado o si el algoritmo es el más apropiado para el problema.

Por último, hay que pensar en el valor práctico del clustering. No basta con encontrar agrupamientos matemáticamente válidos: deben ser útiles para tomar decisiones. Por ejemplo, si se agruparon clientes según su comportamiento, ¿pueden usarse esos grupos para diseñar campañas personalizadas? Si se analizaron ciudades según variables sociales, ¿sirven los clusters para entender problemáticas comunes?

Interpretar los resultados del clustering no es un paso automático. Requiere análisis, visualización y, sobre todo, una mirada crítica sobre qué tan relevantes y utilizables son los grupos formados en el contexto del problema que se está abordando.

### Reflexión final

El clustering representa una poderosa herramienta cuando se desea explorar datos sin contar con etiquetas o categorías predefinidas. A lo largo de esta clase, comprendimos que técnicas como K-Means permiten descubrir patrones ocultos en conjuntos de datos, segmentando observaciones en grupos con características similares. Esta agrupación no solo puede facilitar la comprensión de un conjunto complejo, sino que también puede ser el punto de partida para decisiones estratégicas más informadas.

Hemos aprendido que elegir correctamente el número de clusters, interpretar los resultados con criterio y aplicar métricas como la inercia y el silhouette score son pasos fundamentales para que el análisis tenga valor real. Sin embargo, más allá de los cálculos y las métricas, el valor del clustering reside en su capacidad para generar insights: una segmentación que revela comportamientos de clientes, identifica regiones con problemáticas similares o clasifica documentos según su contenido, puede ser más útil que cualquier promedio o estadística global.

## Página 10

### Materiales y recursos adicionales:

Para finalizar, te proponemos una selección de materiales y recursos adicionales que pueden enriquecer la comprensión y aplicación del algoritmo K-Means:

- **K-Means Clustering in Python: A Practical Guide – Real Python:** Un tutorial detallado que abarca [desde la teoría hasta la implementación práctica de K-Means en Python](https://realpython.com/k-means-clustering-python/), incluyendo la evaluación de resultados y la construcción de pipelines..
- **scikit-learn – Clustering:** Documentación oficial de scikit-learn sobre [algoritmos de clustering, incluyendo K-Means y sus variantes](https://scikit-learn.org/stable/modules/clustering.html).
- **Conjunto de datos sintéticos:** Una herramienta para generar datos sintéticos y experimentar con diferentes configuraciones de clusters. **Nota:** no se detectó destino de hipervínculo para este recurso en el PDF.

### Preguntas para reflexionar:

1. ¿En qué situaciones sería más útil aplicar un algoritmo de clustering como K-Means en lugar de uno supervisado? Pensá en casos donde no contás con etiquetas previas y necesitás explorar o segmentar los datos.
2. ¿Qué consecuencias podría tener elegir un valor incorrecto para “k”? Reflexioná sobre cómo esto afecta la calidad de los clústeres y el análisis posterior.
3. ¿Por qué es importante estandarizar o normalizar los datos antes de aplicar K-Means? Considerá cómo las escalas de las variables influyen en la formación de clústeres.
4. ¿Qué ventajas y desventajas tiene el uso de la inercia como criterio para evaluar un modelo de clustering? ¿Y qué aporta el silhouette score como métrica complementaria? Pensá en qué tipo de información brinda cada una y cómo te ayudaría a tomar decisiones.

## Página 11

### Talento Lab: Un patrón oculto

El equipo de Talento Lab había recibido una nueva solicitud por parte del área de Producto de una startup tecnológica que desarrollaba una app de bienestar. La empresa tenía datos de miles de personas usuarias: hábitos de sueño, cantidad de pasos diarios, frecuencia cardíaca promedio, tiempo de uso de la app, entre otros. Pero no sabían cómo segmentarlas para ofrecer recomendaciones personalizadas.

Silvia propuso aplicar técnicas de clustering para agrupar a las personas según su comportamiento. “No tenemos etiquetas, pero sí un montón de información”, dijo. Matías se entusiasmó con la idea de probar K-Means, recordando que era ideal para este tipo de problemas donde el objetivo era descubrir patrones ocultos.

Mientras Sabrina preparaba los datos y los estandarizaba, Luis exploraba diferentes valores de k y evaluaba los resultados con la inercia y el silhouette score, buscando el equilibrio entre simplicidad y calidad en los clústeres. Descubrieron, por ejemplo, que un grupo dormía poco y caminaba mucho, otro tenía alto tiempo en pantalla y frecuencia cardíaca elevada, y un tercero mostraba parámetros muy equilibrados.

Esa información les permitió sugerir estrategias personalizadas para cada grupo, como mejorar la calidad del sueño o reducir el sedentarismo. Habían logrado transformar datos sin etiquetas en decisiones concretas.

**Visual:** Logotipo «Talento Lab» grande junto al relato y pequeños retratos ilustrados de Silvia y Luis al lado de sus intervenciones; no hay tabla de registros de la aplicación ni gráficos de segmentos cuantificados.

## Página 12

### Ejercicio práctico

Retomando el dataset del Titanic con el que venís trabajando, tu desafío será aplicar clustering con K-Means para explorar si es posible encontrar grupos ocultos de pasajeros y pasajeras con características similares.

1. Seleccioná un subconjunto de variables numéricas del dataset que te parezca útil para aplicar K-Means.
2. Recordá estandarizar las variables antes de entrenar el modelo.
3. Aplicá K-Means con distintos valores de k (por ejemplo, entre 2 y 6) y evaluá los resultados utilizando la inercia y el silhouette score.
4. Elegí el valor de k que te parezca más razonable y visualizá los clústeres resultantes (por ejemplo, con un scatterplot de dos variables).
5. Finalmente, reflexioná: ¿Los clústeres encontrados tienen algún sentido práctico? ¿Podés describir las características de cada grupo?

### Próximos pasos

En la próxima clase vamos a cambiar de enfoque: dejaremos de sumar modelos para centrarnos en organizar todo el flujo de trabajo. Aprenderemos a usar pipelines en Scikit-learn, una herramienta que nos permite encadenar pasos como limpieza, transformación y modelado de manera ordenada y reproducible. También introduciremos la validación cruzada, una técnica clave para evaluar modelos de forma más justa y robusta.

Seguimos creciendo: del árbol al bosque, y del bosque a todo el ecosistema.

## Página 13

**Visual:** Contraportada azul oscuro con trama de líneas geométricas y marcas «Buenos Aires aprende», Agencia de Habilidades para el Futuro y «Buenos Aires Ciudad». No hay contenido didáctico adicional.
