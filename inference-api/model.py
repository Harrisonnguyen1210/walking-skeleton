import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

data = [
  {"exercise": 1, "code": "SELECT * FROM students;", "grade": 100},
  {"exercise": 1, "code": "SELECT * FROM tudents", "grade": 90},
  {"exercise": 2, "code": "SELECT name FROM students;", "grade": 100},
  {"exercise": 2, "code": "SELECT * FROM students", "grade": 65},
]
df = pd.DataFrame(data)

preprocessor = ColumnTransformer(
  transformers=[
    ('code', CountVectorizer(ngram_range=(1, 3)), 'code'),
    ('exercise', 'passthrough', ['exercise'])
  ]
)

pipeline = Pipeline(steps=[
  ('preprocessor', preprocessor),
  ('regressor', LinearRegression())
])

X = df[['exercise', 'code']]
y = df['grade']

pipeline.fit(X, y)

joblib.dump(pipeline, 'grade_predictor.joblib')