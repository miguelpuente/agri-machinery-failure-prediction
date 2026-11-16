import type { Day, NotebookLink } from '../types'

const REPO = 'https://github.com/miguelpuente/agri-machinery-failure-prediction/blob/main/notebooks'
const COLAB =
  'https://colab.research.google.com/github/miguelpuente/agri-machinery-failure-prediction/blob/main/notebooks'

const PREENTREGA: NotebookLink = {
  title: 'Pre-Entrega',
  githubUrl: `${REPO}/preentrega.ipynb`,
  colabUrl: `${COLAB}/preentrega.ipynb`,
}

const ENTREGA_FINAL: NotebookLink = {
  title: 'Entrega Final',
  githubUrl: `${REPO}/entrega-final.ipynb`,
  colabUrl: `${COLAB}/entrega-final.ipynb`,
}

export const WEEK_LABELS = {
  1: 'Semana 1 · Datos y preparación',
  2: 'Semana 2 · Regresión y clasificación',
  3: 'Semana 3 · Vecinos, árboles y clustering',
  4: 'Semana 4 · Pipelines y proyecto final',
} as const

export const DAYS: Day[] = [
  {
    day: 1,
    week: 1,
    weekLabel: WEEK_LABELS[1],
    topic: 'Ingesta de datos',
    title: 'Leer el dataset AI4I sin romper tipos',
    subtitle:
      'Cargar el CSV oficial de AI4I con Polars y verificar shape, tipos y columnas antes de modelar.',
    conceptSummary:
      'Todo pipeline empieza con una carga confiable. El dataset tiene 10.000 filas y 14 columnas; Machine failure es el objetivo y las columnas TWF, HDF, PWF, OSF y RNF describen modos de falla que no deben usarse como predictoras.',
    keyTakeaway:
      'Si el separador o el decimal están mal, los sensores se leen como texto y el modelo entrena sobre basura.',
    codeSnippet: `import polars as pl

df = pl.read_csv("data/raw/ai4i2020.csv")
print(df.shape)  # (10000, 14)
print(df.schema)
print(df.select(pl.col("Machine failure").mean()))`,
    labId: 'pandas-inspector',
    labTitle: 'Inspector de lectura CSV',
    labInstruction:
      'Alterná el separador y el decimal hasta que la tabla tenga 14 columnas y los sensores sean numéricos.',
    challenge:
      'Abrí el CSV descargado y explicá por qué UDI y Product ID no son predictores.',
    notebook: PREENTREGA,
    quiz: {
      prompt:
        'El CSV se leyó con una sola columna llamada "UDI;Product ID;Type;...". ¿Qué parámetro falta en la lectura?',
      options: [
        'separator=";" para indicar el delimitador real',
        'has_header=False para ocultar los títulos',
        'ignore_errors=True para descartar filas',
        'infer_schema_length=0 para forzar texto',
      ],
      correctIndex: 0,
      explanation:
        'Polars asume coma por defecto. Si el archivo usa punto y coma, hay que pasar separator=";" (o el nombre equivalente de la librería) para separar las columnas.',
    },
  },
  {
    day: 2,
    week: 1,
    weekLabel: WEEK_LABELS[1],
    topic: 'Limpieza de datos',
    title: 'Limpiar sin borrar señales de falla',
    subtitle:
      'AI4I no trae nulos ni duplicados; el riesgo está en los 459 outliers de velocidad y torque.',
    conceptSummary:
      'La limpieza del proyecto eliminó 0 duplicados y 0 filas por faltantes. Se detectaron 459 filas fuera de los límites IQR: 418 en velocidad rotacional y 69 en torque, con solapamiento posible. No se borraron: un pico de torque puede ser justamente la antesala de una falla.',
    keyTakeaway:
      'Limpiar no es borrar todo lo raro; es decidir con evidencia qué se conserva y qué se documenta.',
    codeSnippet: `from agrofail.clean import clean, detect_outliers

cleaned = clean(raw)  # deduplica y descarta nulos en target/predictores
outliers = detect_outliers(cleaned)
print(cleaned.height, outliers.height)  # 10000, 459`,
    labId: 'nulls-imputation',
    labTitle: 'Simulador de nulos y outliers',
    labInstruction:
      'Inyectá nulos didácticos y compará media, mediana y descarte; después mirá el efecto del outlier de torque.',
    challenge:
      'Compará la media de torque con y sin el valor máximo. ¿Cuánto se mueve y qué decisión tomarías?',
    notebook: PREENTREGA,
    quiz: {
      prompt: '¿Por qué el proyecto no elimina los 459 outliers detectados?',
      options: [
        'Porque pueden ser señales reales de falla y la política es reportarlos sin borrarlos',
        'Porque Polars no permite eliminar filas',
        'Porque el dataset tiene menos de 10.000 filas',
        'Porque el target es categórico y no admite outliers',
      ],
      correctIndex: 0,
      explanation:
        'Los límites IQR son banderas estadísticas, no límites físicos. Un torque extremo puede describir una falla real; eliminarlo borraría la señal que queremos aprender.',
    },
  },
  {
    day: 3,
    week: 1,
    weekLabel: WEEK_LABELS[1],
    topic: 'Feature engineering',
    title: 'Variables derivadas con criterio',
    subtitle:
      'Probamos ΔT, potencia y desgaste acumulado; el modelo entregado conserva los cinco sensores originales.',
    conceptSummary:
      'Una variable derivada puede capturar física del equipo: la diferencia de temperatura, la potencia aproximada (torque × rpm) o el desgaste por minuto. En este proyecto las exploramos, pero la entrega final mantiene los cinco sensores para no inflar el modelo sin evidencia.',
    keyTakeaway:
      'Una feature nueva solo entra si mejora la validación y tiene una interpretación defendible.',
    codeSnippet: `df = df.with_columns(
    (pl.col("Process temperature [K]") - pl.col("Air temperature [K]")).alias("temp_diff"),
    (pl.col("Torque [Nm]") * pl.col("Rotational speed [rpm]")).alias("power"),
)
print(df.select("temp_diff", "power").describe())`,
    labId: 'feature-engineering',
    labTitle: 'Constructor de variables derivadas',
    labInstruction:
      'Elegí dos sensores y mirá la variable derivada; después decidí si la llevarías al modelo.',
    challenge:
      'Calculá la correlación de temp_diff con la falla y escribí si la incluirías en la entrega.',
    notebook: PREENTREGA,
    quiz: {
      prompt: '¿Cuándo conviene agregar una variable derivada al modelo?',
      options: [
        'Cuando mejora la validación y tiene una interpretación defendible',
        'Siempre que aumente el número de columnas',
        'Solo si tiene correlación exactamente 1 con el target',
        'Cuando el dataset tiene valores nulos',
      ],
      correctIndex: 0,
      explanation:
        'Más columnas no es mejor por definición. La variable debe aportar información medible y una explicación de dominio que resista la revisión.',
    },
  },
  {
    day: 4,
    week: 1,
    weekLabel: WEEK_LABELS[1],
    topic: 'Codificación categórica',
    title: 'Codificar Type: L, M y H',
    subtitle:
      'Type tiene tres categorías sin orden. One-Hot evita que el modelo invente una jerarquía.',
    conceptSummary:
      'Type describe calidad de producto: L tiene 6000 filas (3,92% de fallas), M 2997 (2,77%) y H 1003 (2,09%). Label Encoding asigna 0, 1 y 2, y sugiere un orden que no existe. One-Hot crea tres indicadores binarios y deja que el modelo aprenda el efecto de cada categoría.',
    keyTakeaway:
      'Para categorías nominales, One-Hot es la opción segura; el encoder se ajusta solo con train.',
    codeSnippet: `from agrofail.features import fit_encode_and_scale, apply_encode_and_scale

transformer = fit_encode_and_scale(train_selected)
train_encoded = apply_encode_and_scale(train_selected, transformer)
print(transformer.output_columns)`,
    labId: 'categorical-encoding',
    labTitle: 'Encoder interactivo',
    labInstruction:
      'Cambiá entre Label Encoding y One-Hot y mirá cómo queda la matriz de features.',
    challenge:
      '¿Qué pasa si aparece una categoría nueva en test? Revisá handle_unknown="ignore" en el pipeline.',
    notebook: PREENTREGA,
    quiz: {
      prompt: '¿Qué codificación usarías para Type (L, M, H)?',
      options: [
        'One-Hot, porque las categorías no tienen un orden numérico real',
        'Label Encoding, porque L < M < H',
        'Ninguna: Type se debe descartar',
        'Sumar los códigos para crear una sola variable',
      ],
      correctIndex: 0,
      explanation:
        'L, M y H son etiquetas de calidad, no una escala numérica. One-Hot evita imponer una distancia inventada entre categorías.',
    },
  },
  {
    day: 5,
    week: 1,
    weekLabel: WEEK_LABELS[1],
    topic: 'Escalamiento',
    title: 'Escalar sensores sin fuga',
    subtitle:
      'La regresión logística necesita escalar; los árboles no. La media y el desvío se aprenden solo en train.',
    conceptSummary:
      'Estandarizar resta la media y divide por el desvío: cada sensor queda en unidades de desvío. Normalizar lleva los valores a un rango fijo. En el proyecto, StandardScaler se ajusta dentro del pipeline de regresión logística; los árboles usan los valores originales porque sus cortes no dependen de la escala.',
    keyTakeaway:
      'Ajustar el escalado con todo el dataset antes del split es fuga de información.',
    codeSnippet: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler().fit(X_train)
X_train_scaled = scaler.transform(X_train)
X_test_scaled = scaler.transform(X_test)  # nunca fit sobre test`,
    labId: 'feature-scaling',
    labTitle: 'Normalización vs estandarización',
    labInstruction:
      'Cambiá la escala y observá cómo se mueven los puntos, la media y el desvío.',
    challenge:
      '¿Qué sensor tiene el mayor desvío? ¿Cómo cambia su peso visual al estandarizar?',
    notebook: PREENTREGA,
    quiz: {
      prompt: '¿Dónde se ajusta StandardScaler en una evaluación honesta?',
      options: [
        'Solo con las filas de train, y después se aplica a test',
        'Con todo el dataset antes de separar train/test',
        'Con test, para que quede centrado en la evaluación',
        'Fila por fila, sin estadísticas globales',
      ],
      correctIndex: 0,
      explanation:
        'La media y el desvío son parámetros aprendidos. Si se calculan con test, la evaluación ve información del conjunto de prueba y deja de ser independiente.',
    },
  },
  {
    day: 6,
    week: 1,
    weekLabel: WEEK_LABELS[1],
    topic: 'Partición y fuga de datos',
    title: 'Separar train/test y evitar leakage',
    subtitle:
      '8000 filas para entrenar y 2000 para evaluar: 68 fallas en test. Las columnas de modo de falla se excluyen.',
    conceptSummary:
      'El split es estratificado 80/20 con semilla 42: train 8000 filas y 271 fallas; test 2000 filas y 68 fallas. TWF, HDF, PWF, OSF y RNF revelan el resultado y usarlas sería leakage. UDI y Product ID son identificadores, no predictores.',
    keyTakeaway:
      'El test se toca una vez; si participa del ajuste, deja de ser una evaluación honesta.',
    codeSnippet: `from agrofail.split import split

train, test = split(cleaned)
print(train.shape, test.shape)  # (8000, 14) (2000, 14)
print(test["Machine failure"].sum())  # 68`,
    labId: 'train-test-leakage',
    labTitle: 'Detector de leakage',
    labInstruction:
      'Activá y desactivá columnas y mirá cuáles harían trampa en la predicción.',
    challenge:
      'Si agregás TWF como predictor, ¿por qué el F1 sube de golpe? Explicá el engaño.',
    notebook: PREENTREGA,
    quiz: {
      prompt: '¿Cuál de estas columnas es leakage para predecir Machine failure?',
      options: [
        'PWF, porque describe un modo de falla específico',
        'Type, porque es una categoría',
        'Torque, porque es un sensor continuo',
        'UDI, porque es un identificador',
      ],
      correctIndex: 0,
      explanation:
        'TWF, HDF, PWF, OSF y RNF son modos de falla que componen el resultado. Incluirlos equivale a mirar la respuesta antes de predecirla.',
    },
  },
  {
    day: 7,
    week: 2,
    weekLabel: WEEK_LABELS[2],
    topic: 'Regresión supervisada',
    title: 'Regresión lineal: temperatura de proceso',
    subtitle:
      'La temperatura de proceso sigue a la ambiente: pendiente 0,6499, intercepto 115,04 y R² 0,7676.',
    conceptSummary:
      'Una regresión lineal busca la recta que minimiza la suma de residuos al cuadrado. En AI4I, predecir la temperatura de proceso a partir de la ambiente da una relación fuerte: por cada kelvin ambiente, el proceso sube alrededor de 0,65 K. El R² de 0,7676 indica cuánta variación explica el modelo.',
    keyTakeaway:
      'La recta es un modelo, no una ley física; un R² alto no demuestra causalidad.',
    codeSnippet: `from sklearn.linear_model import LinearRegression

X = df.select("Air temperature [K]").to_numpy()
y = df.select("Process temperature [K]").to_numpy()
model = LinearRegression().fit(X, y)
print(model.coef_, model.intercept_, model.score(X, y))`,
    labId: 'linear-regression-fit',
    labTitle: 'Recta de mejor ajuste',
    labInstruction:
      'Mové pendiente e intercepto y compará tus residuos con la recta óptima.',
    challenge:
      '¿Qué pasa con R² si ajustás la recta solo con las primeras 100 filas?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'La pendiente 0,6499 significa que...',
      options: [
        'por cada kelvin de temperatura ambiente, la de proceso sube 0,65 K en promedio',
        'la temperatura de proceso siempre está 0,65 K arriba',
        'el R² del modelo es 0,65',
        'el error absoluto medio es 0,65 K',
      ],
      correctIndex: 0,
      explanation:
        'La pendiente describe el cambio promedio en la variable dependiente por cada unidad de la independiente. No es una constante física ni una métrica de error.',
    },
  },
  {
    day: 8,
    week: 2,
    weekLabel: WEEK_LABELS[2],
    topic: 'Métricas de regresión',
    title: 'MAE, MSE, RMSE y R²',
    subtitle:
      'MAE 0,5878 K; RMSE 0,7153 K; R² 0,7676 sobre la regresión de temperatura.',
    conceptSummary:
      'MAE mide el error absoluto promedio en kelvin. MSE lo eleva al cuadrado y castiga más los errores grandes. RMSE vuelve a kelvin y es más sensible a outliers. R² compara el modelo contra predecir la media. En clasificación no usamos estas métricas: el objetivo es binario.',
    keyTakeaway:
      'Elegí la métrica según la unidad y el costo del error; no mezcles métricas de regresión con un target binario.',
    codeSnippet: `from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

pred = model.predict(X)
print(mean_absolute_error(y, pred))
print(np.sqrt(mean_squared_error(y, pred)))
print(r2_score(y, pred))`,
    labId: 'regression-metrics',
    labTitle: 'Métricas de regresión en acción',
    labInstruction:
      'Movés un punto atípico y mirás cuánto cambian MAE, RMSE y R².',
    challenge:
      '¿Por qué RMSE es mayor o igual que MAE? Demostralo con un ejemplo de dos errores.',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: '¿Qué métricas quedan expresadas en kelvin?',
      options: [
        'MAE y RMSE',
        'R² y accuracy',
        'F1 y precision',
        'Solo el coeficiente de determinación',
      ],
      correctIndex: 0,
      explanation:
        'MAE y RMSE conservan la unidad del target. R² es adimensional y las métricas de clasificación no aplican a una regresión.',
    },
  },
  {
    day: 9,
    week: 2,
    weekLabel: WEEK_LABELS[2],
    topic: 'Diagnóstico del target',
    title: 'El target desbalanceado: 339 fallas',
    subtitle:
      '339 fallas en 10.000 filas (3,39%). Un modelo que siempre dice "sano" acierta 96,6% y no detecta nada.',
    conceptSummary:
      'El target está desbalanceado: 339 fallas (3,39%) y 9661 máquinas sanas. La accuracy premia a la clase mayoritaria. La regresión logística baseline acierta 96,75% pero solo detecta 7 de 68 fallas en test, con recall 10,29%. Por eso miramos precision, recall, F1 y la matriz de confusión.',
    keyTakeaway:
      'Con clases desbalanceadas, la accuracy sola es una métrica tramposa.',
    codeSnippet: `print(raw["Machine failure"].value_counts())
print(raw["Machine failure"].mean())  # 0.0339`,
    labId: 'target-diagnostics',
    labTitle: 'Diagnóstico del target',
    labInstruction:
      'Cambiá el umbral y mirá cómo accuracy y recall se separan.',
    challenge:
      '¿Cuántas fallas detecta un modelo que siempre predice 0? ¿Cuál es su accuracy?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'Un modelo que siempre predice "sano"...',
      options: [
        'acierta alrededor de 96,6% y tiene recall 0 para las fallas',
        'tiene F1 alto porque acierta la mayoría',
        'detecta las 339 fallas',
        'no se puede evaluar con una matriz de confusión',
      ],
      correctIndex: 0,
      explanation:
        'La clase mayoritaria domina la accuracy. Al no predecir nunca la clase positiva, el recall es cero y el modelo es inútil para mantenimiento.',
    },
  },
  {
    day: 10,
    week: 2,
    weekLabel: WEEK_LABELS[2],
    topic: 'Clasificación binaria',
    title: 'Regresión logística y sigmoide',
    subtitle:
      'La sigmoide convierte un puntaje lineal en probabilidad; el umbral decide la alerta.',
    conceptSummary:
      'La regresión logística calcula z = w·x + b y aplica 1/(1+e^-z). El resultado es una probabilidad; con umbral 0,5 se convierte en clase. Bajar el umbral detecta más fallas, pero también genera más falsas alarmas. El umbral es una decisión operativa, no un detalle matemático.',
    keyTakeaway:
      'El umbral traduce probabilidad en acción; elegilo con el costo de los errores sobre la mesa.',
    codeSnippet: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

p = sigmoid(0.8 * torque - 2.0)
print(p, p >= 0.5)`,
    labId: 'logistic-sigmoid',
    labTitle: 'Sigmoide interactiva',
    labInstruction:
      'Mové peso y sesgo; después mové el umbral y mirá la tasa de alertas.',
    challenge:
      'Encontrá un umbral que detecte al menos 40 fallas en test. ¿Cuántas falsas alarmas aparecen?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'Bajar el umbral de decisión...',
      options: [
        'aumenta el recall y suele aumentar las falsas alarmas',
        'aumenta la precision sin costo',
        'no cambia la matriz de confusión',
        'elimina los falsos negativos sin generar falsos positivos',
      ],
      correctIndex: 0,
      explanation:
        'Un umbral más bajo marca más casos como falla: se detectan más positivos reales, pero también más sanos se clasifican como falla.',
    },
  },
  {
    day: 11,
    week: 2,
    weekLabel: WEEK_LABELS[2],
    topic: 'Evaluación de clasificación',
    title: 'Matriz de confusión: 68 fallas en test',
    subtitle:
      'El árbol tuneado deja 21 fallas sin detectar y 9 falsas alarmas en 2000 filas de test.',
    conceptSummary:
      'La matriz de confusión cruza realidad y predicción: TN 1923, FP 9, FN 21, TP 47. En mantenimiento, el error caro es el falso negativo, porque es una parada no planificada. El falso positivo es una revisión innecesaria. El modelo elige un equilibrio; no elimina el problema.',
    keyTakeaway:
      'Mirá los cuatro números, no solo el porcentaje de acierto.',
    codeSnippet: `from sklearn.metrics import confusion_matrix

cm = confusion_matrix(y_test, pred, labels=[0, 1])
print(cm)  # [[1923, 9], [21, 47]]`,
    labId: 'confusion-matrix',
    labTitle: 'Matriz de confusión',
    labInstruction:
      'Cambiá el umbral y observá cómo se mueven los falsos negativos y los falsos positivos.',
    challenge:
      '¿Qué umbral minimiza las falsas alarmas sin perder más de 30 fallas?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'Un falso negativo en mantenimiento significa...',
      options: [
        'una falla real que el modelo no detectó',
        'una falsa alarma que generó una revisión innecesaria',
        'una falla que se evitó a tiempo',
        'un dato faltante en el dataset',
      ],
      correctIndex: 0,
      explanation:
        'El falso negativo es la falla real clasificada como sana. Es el error más caro cuando una parada no planificada tiene costo operativo.',
    },
  },
  {
    day: 12,
    week: 2,
    weekLabel: WEEK_LABELS[2],
    topic: 'Métricas de clasificación',
    title: 'Accuracy, precision, recall y F1',
    subtitle:
      'Precision 0,8393, recall 0,6912 y F1 0,7581 para el árbol tuneado.',
    conceptSummary:
      'Precision = TP/(TP+FP): de las alertas, cuántas son reales. Recall = TP/(TP+FN): de las fallas, cuántas detectamos. F1 es la media armónica de ambas. En un target con 3,39% de positivos, F1 es más informativo que accuracy porque obliga a mirar la clase minoritaria.',
    keyTakeaway:
      'Precision y recall compiten; F1 resume el equilibrio, pero el costo operativo decide.',
    codeSnippet: `from sklearn.metrics import precision_score, recall_score, f1_score

print(precision_score(y_test, pred, zero_division=0))
print(recall_score(y_test, pred, zero_division=0))
print(f1_score(y_test, pred, zero_division=0))`,
    labId: 'imbalanced-metrics',
    labTitle: 'Métricas de clasificación',
    labInstruction:
      'Movés el umbral y ves precision, recall y F1 en vivo.',
    challenge:
      'Compará el F1 del árbol tuneado (0,7581) con el Random Forest (0,6286). ¿Qué modelo elegirías y por qué?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt:
        'Con 3,39% de casos positivos, ¿qué métrica es más informativa que accuracy?',
      options: [
        'F1, porque combina precision y recall sobre la clase minoritaria',
        'La media del target',
        'El número de filas del dataset',
        'R², porque mide proporción de varianza',
      ],
      correctIndex: 0,
      explanation:
        'F1 obliga a mirar los aciertos y errores de la clase positiva. Accuracy puede ser alta simplemente por acertar la clase mayoritaria.',
    },
  },
  {
    day: 13,
    week: 3,
    weekLabel: WEEK_LABELS[3],
    topic: 'Clasificación por cercanía',
    title: 'KNN: votar entre vecinos',
    subtitle:
      'KNN no aprende una ecuación: guarda los datos y vota entre los k vecinos más cercanos.',
    conceptSummary:
      'Con k=5, cada consulta mira sus cinco vecinos y asigna la clase mayoritaria. Es un modelo basado en instancias: no hay coeficientes globales, y la elección de k y la escala cambian el resultado. En este proyecto no fue el modelo final, pero es una excelente herramienta para entender distancia y voto.',
    keyTakeaway:
      'KNN es simple de explicar y caro de consultar: necesita los datos y una buena métrica de distancia.',
    codeSnippet: `from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(n_neighbors=5).fit(X_train, y_train)
print(knn.predict(X_test[:5]))`,
    labId: 'knn-canvas',
    labTitle: 'Lienzo de votación KNN',
    labInstruction:
      'Hacé clic para ubicar una consulta, cambiá k y mirá el voto de los vecinos.',
    challenge:
      '¿Qué pasa con k=1 y k=15? ¿Cuál es más estable frente a ruido?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'KNN con k=5...',
      options: [
        'vota entre los 5 vecinos más cercanos a la consulta',
        'entrena 5 árboles y promedia',
        'elige las 5 features más importantes',
        'usa 5 capas de transformación',
      ],
      correctIndex: 0,
      explanation:
        'KNN es basado en instancias: para cada consulta busca sus k vecinos más cercanos y decide por votación o promedio.',
    },
  },
  {
    day: 14,
    week: 3,
    weekLabel: WEEK_LABELS[3],
    topic: 'Escalamiento en distancias',
    title: 'Por qué KNN exige escalar',
    subtitle:
      'Sin escalar, el torque (3,8 a 76,6 Nm) domina sobre ΔT (7,6 a 12,0 K).',
    conceptSummary:
      'KNN mide distancias. Si una variable tiene un rango mucho mayor, pesa más sin que nadie lo haya decidido. Estandarizar pone a todas en unidades de desvío y evita que la unidad de medida elija por nosotros. La escala es una decisión del modelo, no un detalle cosmético.',
    keyTakeaway:
      'Toda distancia exige una decisión de escala; documentala.',
    codeSnippet: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler().fit(X_train)
X_train_scaled = scaler.transform(X_train)
knn = KNeighborsClassifier(n_neighbors=5).fit(X_train_scaled, y_train)`,
    labId: 'knn-scaling',
    labTitle: 'KNN con y sin escala',
    labInstruction:
      'Alterná la escala y mirá cómo cambian los vecinos de la consulta.',
    challenge:
      '¿Qué pasa si escalás con la media de todo el dataset en lugar de train?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'Sin escalar, la distancia euclidiana está dominada por...',
      options: [
        'la variable con mayor rango o desvío',
        'la variable con menor media',
        'el target',
        'el número de filas del dataset',
      ],
      correctIndex: 0,
      explanation:
        'La distancia suma diferencias al cuadrado. Una variable con rango grande aporta más magnitud y domina el cálculo si no se estandariza.',
    },
  },
  {
    day: 15,
    week: 3,
    weekLabel: WEEK_LABELS[3],
    topic: 'Modelos basados en árboles',
    title: 'Árboles: profundidad y sobreajuste',
    subtitle:
      'El proyecto eligió profundidad 8 y 3 muestras mínimas por hoja; el F1 de test fue 0,7581.',
    conceptSummary:
      'Un árbol parte el espacio con preguntas si-entonces. Poca profundidad subajusta; demasiada memoriza ruido. La curva real de este proyecto muestra el F1 de train subiendo sin parar mientras el de test se estanca o cae. La poda y los mínimos por hoja controlan la complejidad.',
    keyTakeaway:
      'La brecha train-test es la señal de sobreajuste; no la ocultes con una métrica única.',
    codeSnippet: `from sklearn.tree import DecisionTreeClassifier

tree = DecisionTreeClassifier(max_depth=8, min_samples_leaf=3, random_state=42)
tree.fit(X_train, y_train)
print(tree.get_depth(), tree.get_n_leaves())`,
    labId: 'decision-tree-depth',
    labTitle: 'Profundidad y sobreajuste',
    labInstruction:
      'Movés la profundidad y comparás el F1 de train con el de test.',
    challenge:
      '¿En qué profundidad empieza a caer el F1 de test? ¿Coincide con la elección del proyecto?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'Una brecha grande entre F1 de train y F1 de test indica...',
      options: [
        'sobreajuste: el modelo memorizó el entrenamiento',
        'siempre leakage de datos',
        'que el modelo es lineal',
        'que el dataset es demasiado pequeño en todos los casos',
      ],
      correctIndex: 0,
      explanation:
        'El sobreajuste se ve como un rendimiento alto en train que no se replica en test. La causa puede ser complejidad excesiva, ruido o pocas muestras.',
    },
  },
  {
    day: 16,
    week: 3,
    weekLabel: WEEK_LABELS[3],
    topic: 'Ensambles de árboles',
    title: 'Random Forest: importancia de variables',
    subtitle:
      'El bosque reparte la importancia: torque 31,7%, rpm 23,3%, desgaste 16,9%.',
    conceptSummary:
      'Un Random Forest entrena muchos árboles sobre muestras y variables distintas, y promedia. Reduce la varianza del árbol individual a costa de interpretabilidad. La importancia de variables es una señal útil, no una prueba causal. En el baseline, el bosque logró F1 0,6286 y perdió 35 fallas.',
    keyTakeaway:
      'Un ensamble estabiliza la predicción; la importancia agregada no reemplaza el análisis de dominio.',
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

forest = RandomForestClassifier(n_estimators=100, random_state=42)
forest.fit(X_train, y_train)
print(forest.feature_importances_)`,
    labId: 'random-forest-ensemble',
    labTitle: 'Importancia de variables',
    labInstruction:
      'Ordená las variables y compará el bosque con el árbol individual.',
    challenge:
      '¿Por qué Type aporta poco? ¿Qué harías antes de concluir que no importa?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'La importancia de variables de un Random Forest...',
      options: [
        'es una señal agregada del modelo, no una prueba de causalidad',
        'demuestra causalidad entre sensor y falla',
        'es idéntica a la correlación de Pearson',
        'solo se puede calcular en regresión',
      ],
      correctIndex: 0,
      explanation:
        'La importancia mide cuánto usa el bosque cada variable para reducir impureza, condicionada por el modelo y los datos. No prueba que la variable cause la falla.',
    },
  },
  {
    day: 17,
    week: 3,
    weekLabel: WEEK_LABELS[3],
    topic: 'Aprendizaje no supervisado',
    title: 'K-Means paso a paso',
    subtitle:
      'K-Means alterna asignación y actualización de centroides hasta estabilizarse.',
    conceptSummary:
      'K-Means busca k grupos minimizando la distancia al centroide. Es sensible a la inicialización y a la escala. No usa etiquetas: es aprendizaje no supervisado. En AI4I lo usamos para explorar regímenes operativos, no para predecir la falla.',
    keyTakeaway:
      'Clustering describe estructura; no valida por sí solo una hipótesis de negocio.',
    codeSnippet: `from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=4, n_init=10, random_state=42)
kmeans.fit(X_scaled)
print(kmeans.labels_[:10])`,
    labId: 'kmeans-stepper',
    labTitle: 'K-Means paso a paso',
    labInstruction:
      'Avanzá etapa por etapa: inicializar, asignar y actualizar centroides.',
    challenge:
      '¿Qué cambia con k=2 y k=6? ¿Cómo elegirías k?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'K-Means necesita que elijamos...',
      options: [
        'k y una escala razonable para las variables',
        'las etiquetas de falla',
        'un target binario',
        'un split estratificado',
      ],
      correctIndex: 0,
      explanation:
        'K-Means es no supervisado: no usa etiquetas. Sí requiere elegir k y decidir cómo se miden las distancias, lo que incluye la escala.',
    },
  },
  {
    day: 18,
    week: 3,
    weekLabel: WEEK_LABELS[3],
    topic: 'Clustering en datos reales',
    title: 'K-Means sobre AI4I: regímenes operativos',
    subtitle:
      'Cuatro clústeres sobre rpm, torque y desgaste: el de mayor torque concentra 9,26% de fallas.',
    conceptSummary:
      'En AI4I, los clústeres no son etiquetas de falla: describen combinaciones de operación. El clúster de torque alto (50,71 Nm promedio, 1392 rpm) tiene 236 fallas en 2548 filas, un 9,26%. El de torque bajo tiene 1,09%. Es una pista para segmentar el mantenimiento, no un predictor validado.',
    keyTakeaway:
      'Un clúster puede orientar la operación, pero necesita validación y no reemplaza el modelo supervisado.',
    codeSnippet: `centers = scaler.inverse_transform(kmeans.cluster_centers_)
print(centers)
print(df.group_by(kmeans.labels_).agg(pl.len(), pl.col("Machine failure").sum()))`,
    labId: 'kmeans-real',
    labTitle: 'K-Means sobre AI4I',
    labInstruction:
      'Mostrá los clústeres y compará sus tasas de falla.',
    challenge:
      '¿El clúster de mayor riesgo tiene más fallas absolutas o solo mayor tasa? Explicá la diferencia.',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'El clúster con mayor tasa de falla en AI4I agrupa...',
      options: [
        'operación de torque alto y velocidad moderada',
        'operación de torque bajo y velocidad alta',
        'máquinas sin desgaste',
        'el clúster más numeroso del dataset',
      ],
      correctIndex: 0,
      explanation:
        'El clúster de mayor riesgo tiene torque promedio de 50,71 Nm y 1392 rpm, con 9,26% de fallas. Es una descripción operativa, no una etiqueta causal.',
    },
  },
  {
    day: 19,
    week: 4,
    weekLabel: WEEK_LABELS[4],
    topic: 'Metodología de proyecto',
    title: 'Pre-Entrega: orden antes de modelar',
    subtitle:
      'Antes de modelar: dataset, EDA, limpieza, transformaciones, selección y split.',
    conceptSummary:
      'La Pre-Entrega exige seis secciones y evidencia reproducible. En este proyecto cada sección tiene su módulo y sus tests: load, eda, clean, features, select y split. El orden importa: el split ocurre antes de ajustar encoding o escalado.',
    keyTakeaway:
      'Un pipeline ordenado se puede auditar; un notebook sin orden no.',
    codeSnippet: `from agrofail.clean import clean
from agrofail.features import fit_encode_and_scale
from agrofail.select import select_features
from agrofail.split import split

train, test = split(clean(raw))
transformer = fit_encode_and_scale(select_features(train))`,
    labId: 'pre-entrega-checklist',
    labTitle: 'Checklist de Pre-Entrega',
    labInstruction:
      'Marcá cada sección y mirá qué falta para cerrar la entrega.',
    challenge:
      'Abrí notebooks/preentrega.ipynb y verificá que las seis secciones tengan salida real.',
    notebook: PREENTREGA,
    quiz: {
      prompt: '¿Cuál es el orden correcto de la preparación?',
      options: [
        'Split antes de ajustar encoding y escalado',
        'Encoding y escalado antes del split, con todo el dataset',
        'Modelar antes de limpiar para ver el efecto',
        'Escalar cada fila por separado',
      ],
      correctIndex: 0,
      explanation:
        'El split debe ocurrir antes de aprender parámetros de transformación. Si el encoder o el scaler ven test, la evaluación deja de ser independiente.',
    },
  },
  {
    day: 20,
    week: 4,
    weekLabel: WEEK_LABELS[4],
    topic: 'Arquitectura de flujos',
    title: 'Pipeline y ColumnTransformer',
    subtitle:
      'Pipeline encadena transformaciones y modelo; ColumnTransformer aplica una receta por tipo de columna.',
    conceptSummary:
      'Un Pipeline evita olvidar pasos y mantiene el ajuste dentro de cada fold. ColumnTransformer permite one-hot para Type y escalado para sensores en una sola receta. En el proyecto, la regresión logística escala; los árboles usan passthrough.',
    keyTakeaway:
      'Si el preprocesamiento no está dentro del pipeline, la validación cruzada miente.',
    codeSnippet: `from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

pre = ColumnTransformer([
    ("type", OneHotEncoder(handle_unknown="ignore"), ["Type"]),
    ("sensors", StandardScaler(), numeric_columns),
])
pipe = Pipeline([("pre", pre), ("model", LogisticRegression(max_iter=1000))])`,
    labId: 'sklearn-pipeline',
    labTitle: 'Constructor de pipeline',
    labInstruction:
      'Ordená los pasos y verificá que el modelo reciba las features correctas.',
    challenge:
      '¿Dónde se ajusta el escalado en una validación cruzada? Marcá el orden.',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'Un Pipeline de scikit-learn evita...',
      options: [
        'ajustar el preprocessing fuera de cada fold de validación',
        'guardar el modelo entrenado',
        'evaluar sobre test',
        'leer el CSV original',
      ],
      correctIndex: 0,
      explanation:
        'Al encapsular preprocessing y modelo, GridSearchCV reajusta todo dentro de cada fold. Así no hay fuga desde las filas de validación.',
    },
  },
  {
    day: 21,
    week: 4,
    weekLabel: WEEK_LABELS[4],
    topic: 'Optimización sistemática',
    title: 'GridSearchCV: buscar sin fuga',
    subtitle:
      'La grilla oficial de 5 pliegues: F1 0,7096 ± 0,0436 para el árbol elegido (depth 8, leaf 3).',
    conceptSummary:
      'GridSearchCV prueba combinaciones y elige por F1 medio en validación cruzada. La grilla del proyecto exploró profundidad 4/8 y hojas 1/3; la celda ganadora fue 8/3. Una grilla más amplia (2 a 12 y hojas 1, 3, 5 y 10) muestra que el óptimo de CV puede caer en otra celda: la elección no es magia, es una decisión con presupuesto.',
    keyTakeaway:
      'La validación cruzada estima y selecciona con los mismos pliegues; no es una auditoría independiente.',
    codeSnippet: `from sklearn.model_selection import GridSearchCV

search = GridSearchCV(
    tree,
    {"max_depth": [4, 8], "min_samples_leaf": [1, 3]},
    scoring="f1", cv=5, refit=True,
)
search.fit(X_train, y_train)
print(search.best_params_, search.best_score_)`,
    labId: 'gridsearch-heatmap',
    labTitle: 'Mapa de calor de GridSearchCV',
    labInstruction:
      'Pasá el mouse por la grilla y compará la celda elegida con el óptimo.',
    challenge:
      '¿Por qué no elegiríamos la celda de mayor F1 de CV sin mirar la estabilidad?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'GridSearchCV elige...',
      options: [
        'la combinación con mejor F1 medio en validación cruzada',
        'la combinación con mejor F1 en test',
        'la combinación más rápida de entrenar',
        'la que tiene más hiperparámetros',
      ],
      correctIndex: 0,
      explanation:
        'La búsqueda se hace solo con train y validación cruzada. Test queda fuera; si se usara para elegir, dejaría de ser una evaluación independiente.',
    },
  },
  {
    day: 22,
    week: 4,
    weekLabel: WEEK_LABELS[4],
    topic: 'Persistencia y despliegue',
    title: 'joblib: guardar y recuperar el modelo',
    subtitle:
      'joblib serializa el pipeline completo; el modelo guardado debe reproducir las mismas predicciones.',
    conceptSummary:
      'Guardar solo el clasificador pierde el escalado y el encoder. En el proyecto, el artefacto es un Pipeline entrenado; al cargarlo, las mismas filas deben dar las mismas probabilidades. La versión de scikit-learn importa: un artefacto viejo puede no cargar en otro entorno.',
    keyTakeaway:
      'Persistí el pipeline, no solo el modelo; verificá la reproducibilidad después de cargar.',
    codeSnippet: `import joblib

joblib.dump(pipe, "models/decision_tree.joblib")
loaded = joblib.load("models/decision_tree.joblib")
assert (loaded.predict(X_test) == pipe.predict(X_test)).all()`,
    labId: 'joblib-serialization',
    labTitle: 'Guardar y recuperar',
    labInstruction:
      'Guardá, recargá y compará las predicciones antes y después.',
    challenge:
      '¿Qué pasa si cargás el modelo con otra versión de scikit-learn? Documentá el riesgo.',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: '¿Qué conviene guardar con joblib?',
      options: [
        'El pipeline completo, con preprocessing y modelo',
        'Solo los coeficientes del clasificador',
        'Solo el CSV de entrenamiento',
        'Solo la tabla de métricas',
      ],
      correctIndex: 0,
      explanation:
        'El pipeline conserva encoder, scaler y clasificador en el orden correcto. Guardar solo el clasificador obliga a reconstruir el preprocessing y abre la puerta a inconsistencias.',
    },
  },
  {
    day: 23,
    week: 4,
    weekLabel: WEEK_LABELS[4],
    topic: 'Selección de modelos',
    title: 'Comparar modelos con la misma vara',
    subtitle:
      'F1 0,1772 (LR), 0,6286 (RF), 0,3095 (DT), 0,7581 (DT tuneado), todos sobre el mismo test.',
    conceptSummary:
      'Comparar modelos exige el mismo split, las mismas features y la misma métrica. El árbol tuneado gana en F1 y en fallas perdidas (21 frente a 35 del Random Forest), pero su ROC-AUC (0,8877) es menor que la del bosque (0,9653). No hay un ganador absoluto: hay un equilibrio para el costo de mantenimiento.',
    keyTakeaway:
      'Elegí con varios criterios y documentá el costo de cada tipo de error.',
    codeSnippet: `from agrofail.compare import compare_models

table = compare_models(results)
for row in table.rows:
    print(row.name, row.f1, row.fn)`,
    labId: 'model-comparison',
    labTitle: 'Comparador de modelos',
    labInstruction:
      'Ordená por F1, ROC-AUC o fallas perdidas y mirá cómo cambia el ganador.',
    challenge:
      'Si el costo de una falla perdida es 10 veces el de una falsa alarma, ¿qué modelo elegirías?',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: 'El árbol tuneado gana en F1, pero el Random Forest tiene mejor...',
      options: [
        'ROC-AUC',
        'accuracy',
        'número de hojas',
        'tiempo de carga',
      ],
      correctIndex: 0,
      explanation:
        'El Random Forest alcanza ROC-AUC 0,9653 frente a 0,8877 del árbol tuneado. Es mejor separando probabilidades, aunque el árbol tuneado logra mejor F1 con el umbral evaluado.',
    },
  },
  {
    day: 24,
    week: 4,
    weekLabel: WEEK_LABELS[4],
    topic: 'Proyecto integrador',
    title: 'Proyecto final: del sensor a la alerta',
    subtitle:
      'Carga, limpieza, features, split, modelo, evaluación y límites: el flujo completo sobre AI4I.',
    conceptSummary:
      'El proyecto completo: 10.000 filas, 3,39% de fallas, split 8000/2000, cuatro modelos comparados y un árbol tuneado con F1 0,7581 y 21 fallas perdidas. Los límites: datos sintéticos, validación interna, sin umbral optimizado y sin validación agrícola de campo.',
    keyTakeaway:
      'Un modelo es una parte del sistema; la decisión operativa incluye umbral, costo, monitoreo y datos nuevos.',
    codeSnippet: `from agrofail.clean import clean
from agrofail.split import split
# El flujo completo del repositorio:
raw = load_dataset()
clean_df = clean(raw)
train, test = split(clean_df)
# Entrenar, ajustar y evaluar con las métricas del proyecto.`,
    labId: 'final-project',
    labTitle: 'Flujo completo del proyecto',
    labInstruction:
      'Recorré las etapas y mirá el resultado final y sus límites.',
    challenge:
      'Escribí una recomendación de una página para un productor: qué alerta, con qué umbral y qué hacer.',
    notebook: ENTREGA_FINAL,
    quiz: {
      prompt: '¿Cuál es un límite declarado del proyecto?',
      options: [
        'Datos sintéticos y falta de validación agrícola de campo',
        'No tiene métricas de evaluación',
        'No usó separación train/test',
        'El target no es binario',
      ],
      correctIndex: 0,
      explanation:
        'AI4I es un dataset industrial sintético. El encuadre agropecuario es didáctico y el proyecto no demuestra validez operativa en campo.',
    },
  },
]

export const TOTAL_DAYS = DAYS.length
