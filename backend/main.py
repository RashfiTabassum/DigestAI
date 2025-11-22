from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import uuid  # For generating session_id

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Request model from frontend
class ChatRequest(BaseModel):
    user_query: str

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Receive frontend data, generate session_id, and forward to n8n webhook
    """
    webhook_url = "https://rashfi.app.n8n.cloud/webhook/b3851d1d-5a4a-4113-96e9-2630a223e740"
    session_id = str(uuid.uuid4())  # generate a unique session ID

    payload = {
        "user_query": request.user_query,
        "session_id": session_id
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(webhook_url, json=payload, timeout=30.0)
            response.raise_for_status()
            webhook_response = response.json()
            # Return the webhook response directly
            return webhook_response
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error forwarding request: {str(e)}")

@app.get("/")
async def root():
    return {"message": "FastAPI Chat Endpoint Server"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



 # {{ $json.email }}

 # {{ $json.article_url }}