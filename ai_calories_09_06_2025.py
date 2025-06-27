from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

# Sample data
data = {
    'exercise_name': ['Push-up', 'Crunch', 'Squat', 'Lunge', 'Plank', 'Burpee',
                      'Mountain Climber', 'Jumping Jack', 'Deadlift', 'Pull-up',
                      'Deadlift', 'Running'],
    'calories': [0.30, 0.40, 0.50, 0.70, 2.00, 1.20, 0.90, 0.50, 1.00, 0.80, 0.40, 0.20],
    'totalSets': [30, 15, 30, 30, 2, 2, 3, 4, 50, 50, 30, 2],
    'coins': [3, 2, 3, 3, 5, 5, 3, 2, 5, 5, 4, 5],
    'totalSeconds': ["NULL", "NULL", "NULL", "NULL", 60, 60, 40, 20, "NULL", "NULL", "NULL", 600],
    'secondsPerSet': [2, 3, 3, 4, 1, 1, 1, 1, 6, 4, 2, 1],
}

# Create DataFrame
df = pd.DataFrame(data)

# Preprocess totalSeconds
df['totalSeconds'] = pd.to_numeric(df['totalSeconds'], errors='coerce').fillna(0)
df['is_duration_based'] = df['totalSeconds'].apply(lambda x: 1 if x > 0 else 0)

# Split datasets
df_duration = df[df['is_duration_based'] == 1]
df_reps = df[df['is_duration_based'] == 0]

# TF-IDF
vectorizer = TfidfVectorizer()
X_all = vectorizer.fit_transform(df['exercise_name'])

# Re-align TF-IDF with subsets
X_duration = X_all[df['is_duration_based'] == 1].toarray()
X_reps = X_all[df['is_duration_based'] == 0].toarray()

# Targets
y_duration = df_duration[['calories', 'coins', 'totalSets', 'totalSeconds', 'secondsPerSet']]
y_reps = df_reps[['calories', 'coins', 'totalSets', 'totalSeconds', 'secondsPerSet']]

# Train both models
model_duration = RandomForestRegressor(n_estimators=100, random_state=42)
model_reps = RandomForestRegressor(n_estimators=100, random_state=42)

model_duration.fit(X_duration, y_duration)
model_reps.fit(X_reps, y_reps)

# Prediction function
def predict_exercise(exercise_name: str):
    vec = vectorizer.transform([exercise_name]).toarray()

    # Heuristic for duration-based vs rep-based
    duration_based_exercises = ['Running', 'Plank', 'Jump Rope', 'Cycling', 'Swimming', 'Crunch', 'Mountain Climber']
    if exercise_name.lower() in [e.lower() for e in duration_based_exercises]:
        pred = model_duration.predict(vec)[0]
    else:
        pred = model_reps.predict(vec)[0]

    labels = ['calories', 'coins', 'totalSets', 'totalSeconds', 'secondsPerSet']
    return dict(zip(labels, pred))

# Use input or hardcoded test
new_exercise = input("Enter exercise name: ")
predicted = predict_exercise(new_exercise)

print(f"\nPredicted values for '{new_exercise}':")
for key, val in predicted.items():
    print(f"{key}: {val:.2f}")
