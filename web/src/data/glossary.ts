export interface GlossaryTerm {
  term: string
  definition: string
  day?: number
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Accuracy',
    definition:
      'Proporción de aciertos sobre el total. Puede ser alta con clases desbalanceadas y ocultar un recall malo.',
    day: 9,
  },
  {
    term: 'Baseline',
    definition: 'Modelo de referencia simple contra el que se compara una mejora.',
    day: 7,
  },
  {
    term: 'Clase positiva',
    definition: 'La clase que queremos detectar. En este proyecto, Machine failure = 1.',
    day: 9,
  },
  {
    term: 'Clasificación',
    definition: 'Tarea de predecir una categoría. Acá es binaria: falla o sana.',
    day: 10,
  },
  {
    term: 'Clustering',
    definition: 'Agrupar observaciones sin etiquetas. K-Means es un ejemplo.',
    day: 17,
  },
  {
    term: 'Codificación One-Hot',
    definition:
      'Representar categorías nominales con indicadores binarios, sin imponer un orden entre ellas.',
    day: 4,
  },
  {
    term: 'Cross-validation',
    definition:
      'Dividir train en pliegues para estimar y seleccionar. Los mismos pliegues no son una auditoría independiente.',
    day: 21,
  },
  {
    term: 'Data leakage',
    definition:
      'Usar información que no estará disponible al predecir, como los modos de falla o el conjunto de test.',
    day: 6,
  },
  {
    term: 'Desbalance de clases',
    definition: 'Una clase aparece mucho menos que la otra; la accuracy sola engaña.',
    day: 9,
  },
  {
    term: 'Estandarización',
    definition:
      'Restar la media y dividir por el desvío. Media y desvío se aprenden solo con train.',
    day: 5,
  },
  {
    term: 'F1-score',
    definition: 'Media armónica de precision y recall; útil cuando hay desbalance.',
    day: 12,
  },
  {
    term: 'Falso negativo (FN)',
    definition: 'Una falla real clasificada como sana. Es el error caro en mantenimiento.',
    day: 11,
  },
  {
    term: 'Falso positivo (FP)',
    definition: 'Una máquina sana clasificada como falla; una falsa alarma.',
    day: 11,
  },
  {
    term: 'Feature',
    definition: 'Variable de entrada que usa el modelo para predecir.',
    day: 3,
  },
  {
    term: 'GridSearchCV',
    definition:
      'Búsqueda de hiperparámetros con validación cruzada; el preprocessing se ajusta dentro de cada pliegue.',
    day: 21,
  },
  {
    term: 'joblib',
    definition:
      'Serialización de pipelines de scikit-learn: guarda preprocessing y modelo juntos para reproducir predicciones.',
    day: 22,
  },
  {
    term: 'K-Means',
    definition:
      'Clustering que alterna asignación de puntos y actualización de centroides; requiere elegir k y escalar.',
    day: 17,
  },
  {
    term: 'KNN',
    definition:
      'Clasificación por voto de los k vecinos más cercanos; es sensible a la escala de las variables.',
    day: 13,
  },
  {
    term: 'Matriz de confusión',
    definition: 'Tabla TN/FP/FN/TP que cruza la realidad con la predicción.',
    day: 11,
  },
  {
    term: 'MAE',
    definition: 'Error absoluto promedio; queda en la misma unidad que el target.',
    day: 8,
  },
  {
    term: 'MSE',
    definition: 'Error al cuadrado promedio; castiga más los errores grandes.',
    day: 8,
  },
  {
    term: 'Normalización',
    definition: 'Llevar los valores a un rango fijo, por ejemplo [0, 1].',
    day: 5,
  },
  {
    term: 'Overfitting',
    definition: 'El modelo memoriza train y no generaliza a test; se ve como una brecha entre ambos.',
    day: 15,
  },
  {
    term: 'Pipeline',
    definition:
      'Encadena preprocessing y modelo para que todo se ajuste dentro de cada fold de validación.',
    day: 20,
  },
  {
    term: 'Precision',
    definition: 'De todas las alertas, cuántas son fallas reales.',
    day: 12,
  },
  {
    term: 'Random Forest',
    definition: 'Ensemble de árboles que promedia predicciones y reduce la varianza.',
    day: 16,
  },
  {
    term: 'Recall',
    definition: 'De todas las fallas reales, cuántas detecta el modelo.',
    day: 12,
  },
  {
    term: 'Regresión lineal',
    definition: 'Modelo que ajusta una recta para predecir un valor continuo.',
    day: 7,
  },
  {
    term: 'Regresión logística',
    definition:
      'Modelo lineal que aplica la sigmoide para estimar la probabilidad de la clase positiva.',
    day: 10,
  },
  {
    term: 'ROC-AUC',
    definition:
      'Mide la discriminación entre clases a través de todos los umbrales; no fija un umbral operativo.',
    day: 23,
  },
  {
    term: 'RMSE',
    definition: 'Raíz del MSE; vuelve a la unidad del target y es sensible a outliers.',
    day: 8,
  },
  {
    term: 'R²',
    definition: 'Proporción de variación explicada por una regresión; no prueba causalidad.',
    day: 8,
  },
  {
    term: 'Split train/test',
    definition:
      'Separar filas para entrenar y evaluar. Test se toca una vez y no participa del ajuste.',
    day: 6,
  },
  {
    term: 'Target',
    definition: 'Variable que queremos predecir. Acá es Machine failure.',
    day: 9,
  },
  {
    term: 'Umbral',
    definition:
      'Punto de corte que convierte una probabilidad en clase; depende del costo de los errores.',
    day: 10,
  },
  {
    term: 'Underfitting',
    definition: 'Modelo demasiado simple: rinde mal tanto en train como en test.',
    day: 15,
  },
  {
    term: 'Verdadero negativo (TN)',
    definition: 'Una máquina sana clasificada correctamente como sana.',
    day: 11,
  },
  {
    term: 'Verdadero positivo (TP)',
    definition: 'Una falla real detectada correctamente.',
    day: 11,
  },
]
