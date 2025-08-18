from fastapi import FastAPI, Request
import joblib
import pandas as pd

server = FastAPI()

model = joblib.load("model.joblib")


@server.post("/inference-api/predict")
async def predict(request: Request):
    data = await request.json()

    input_data = pd.DataFrame(
        {"exercise": [data.get("exercise")], "code": [data.get("code")]}
    )

    prediction = model.predict(input_data)[0]

    return {"prediction": prediction}
