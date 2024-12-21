# import io
# import random
# import time
# from pathlib import Path

# import modal
# from fastapi import Response
# import torch
# from diffusers import StableDiffusionPipeline

# # Define the app
# app = modal.App("stable-diffusion-web-app")

# # Define container dependencies
# image = (
#     modal.Image.debian_slim(python_version="3.12")
#     .pip_install(
#         "accelerate==0.33.0",
#         "diffusers==0.31.0",
#         "fastapi[standard]==0.115.4",
#         "huggingface-hub[hf_transfer]==0.25.2",
#         "sentencepiece==0.2.0",
#         "torch==2.5.1",
#         "torchvision==0.20.1",
#         "transformers~=4.44.0",
#     )
#     .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})  # Faster downloads
# )

# # Class-based model implementation
# # @app.cls(image=image, gpu="H100", timeout=600)
# @app.cls(image=image, gpu=modal.gpu.A10G(count=1))
# class StableDiffusion:
#     @modal.build()
#     @modal.enter()
#     def load_model(self):
#         print("Loading model...")
#         self.pipeline = StableDiffusionPipeline.from_pretrained(
#             "CompVis/stable-diffusion-v1-4",
#             # torch_dtype=torch.bfloat16,
#             torch_dtype=torch.bfloat16,
#         ).to("cuda")
#         print("Model loaded successfully!")

#     @modal.method()
#     def run_inference(self, prompt: str, seed: int = None) -> bytes:
#         seed = seed or random.randint(0, 2**32 - 1)
#         print(f"Seeding RNG with: {seed}")
#         torch.manual_seed(seed)
#         image = self.pipeline(prompt, num_inference_steps=20).images[0]

#         # Convert image to bytes
#         buffer = io.BytesIO()
#         image.save(buffer, format="PNG")
#         buffer.seek(0)
#         return buffer.getvalue()

#     @modal.web_endpoint(method="POST", docs=True)
#     def web(self, prompt: str, seed: int = None):
#         print(f"Received request: prompt={prompt}, seed={seed}")
#         try:
#             image_bytes = self.run_inference.local(prompt, seed)
#             return Response(content=image_bytes, media_type="image/png")
#         except Exception as e:
#             print(f"Error generating image: {e}")
#             return {"error": str(e)}



# @app.local_entrypoint()
# def main():
#     """For local testing"""
#     service = StableDiffusion()
#     prompt = input("Enter your image prompt: ")
#     image_bytes = service.run_inference.remote(prompt)
#     with open("output.png", "wb") as f:
#         f.write(image_bytes)
#     print("Image saved as output.png")





import io
import random
import time
from pathlib import Path
import os
import modal
from fastapi import Response, HTTPException, Request
import torch
from diffusers import StableDiffusionPipeline

# Define the app
app = modal.App("stable-diffusion-web-app")

# Define container dependencies
image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install(
        "accelerate==0.33.0",
        "diffusers==0.31.0",
        "fastapi[standard]==0.115.4",
        "huggingface-hub[hf_transfer]==0.25.2",
        "sentencepiece==0.2.0",
        "torch==2.5.1",
        "torchvision==0.20.1",
        "transformers~=4.44.0",
    )
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})  # Faster downloads
)

# Class-based model implementation
@app.cls(image=image, gpu=modal.gpu.A10G(count=1), secrets=[modal.Secret.from_name("API_KEY")])
class StableDiffusion:
    @modal.build()
    @modal.enter()
    def load_model(self):
        print("Loading model...")
        self.pipeline = StableDiffusionPipeline.from_pretrained(
            "CompVis/stable-diffusion-v1-4",
            torch_dtype=torch.bfloat16,
        ).to("cuda")
        # Load the API key from secrets
        self.API_KEY = os.environ["API_KEY"]
        print("Model loaded successfully!")

    @modal.method()
    def run_inference(self, prompt: str, seed: int = None) -> bytes:
        seed = seed or random.randint(0, 2**32 - 1)
        print(f"Seeding RNG with: {seed}")
        torch.manual_seed(seed)
        image = self.pipeline(prompt, num_inference_steps=20).images[0]

        # Convert image to bytes
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        buffer.seek(0)
        return buffer.getvalue()

    @modal.web_endpoint(method="POST", docs=True)
    def web(self, request: Request, prompt: str, seed: int = None):
        # API Key authentication
        api_key = request.headers.get("X-API-Key")
        if api_key != self.API_KEY:
            raise HTTPException(
                status_code=401,
                detail="Unauthorized"
            )

        print(f"Received request: prompt={prompt}, seed={seed}")
        try:
            image_bytes = self.run_inference.local(prompt, seed)
            return Response(content=image_bytes, media_type="image/png")
        except Exception as e:
            print(f"Error generating image: {e}")
            return {"error": str(e)}


@app.local_entrypoint()
def main():
    """For local testing"""
    service = StableDiffusion()
    prompt = input("Enter your image prompt: ")
    image_bytes = service.run_inference.remote(prompt)
    with open("output.png", "wb") as f:
        f.write(image_bytes)
    print("Image saved as output.png")
