from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Combine TF-IDF features with user weight
import numpy as np

data = {
    'exercise_name': ['Running', 'Swimming', 'Jump Rope', 'Weightlifting', 'Yoga'],
    'calories_burned': [10, 8, 12, 6, 3],
    'user_weight': [70, 70, 75, 80, 65]
}

# Create a DataFrame
df = pd.DataFrame(data)

# TF-IDF Vectorization
vectorizer = TfidfVectorizer()
X_exercise = vectorizer.fit_transform(df['exercise_name'])

X_combined = np.hstack([X_exercise.toarray(), df[['user_weight']].values])

# Target variable: calories burned
y = df['calories_burned']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_combined, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Predict the calories for the test set
y_pred = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse}')

# Make predictions
exercise_name = "Running"
user_weight = 70

# Transform the exercise name into TF-IDF vector
exercise_vector = vectorizer.transform([exercise_name])

# Combine with user weight
input_features = np.hstack([exercise_vector.toarray(), np.array([[user_weight]])])

# Predict calories burned
predicted_calories = model.predict(input_features)
print(f'Predicted calories burned for {exercise_name} with weight {user_weight}: {predicted_calories[0]}')
