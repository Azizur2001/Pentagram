# # test
# import modal
# from fastapi import FastAPI, Response
# import io
# import torch
# from diffusers import StableDiffusionPipeline

# # Initialize Modal App
# app = modal.App("stable-diffusion-app")

# # Dependencies
# image = (
#     modal.Image.debian_slim(python_version="3.12")
#     .pip_install(
#         "torch==2.5.1",
#         "torchvision==0.20.1",
#         "diffusers==0.31.0",
#         "transformers==4.44.0",
#         "accelerate==0.33.0",
#         "fastapi[standard]==0.115.4"
#     )
# )

# # Class for Stable Diffusion Pipeline
# @app.cls(image=image, gpu="A10G", timeout=600)
# class StableDiffusion:
#     @modal.build()
#     @modal.enter()
#     def load_model(self):
#         """Load the Stable Diffusion model."""
#         self.pipeline = StableDiffusionPipeline.from_pretrained(
#             "CompVis/stable-diffusion-v1-4",
#             torch_dtype=torch.float16
#         ).to("cuda")

#     @modal.method()
#     def run_inference(self, prompt: str) -> bytes:
#         """Run inference to generate an image."""
#         image = self.pipeline(prompt).images[0]
#         with io.BytesIO() as buffer:
#             image.save(buffer, format="PNG")
#             return buffer.getvalue()

# # FastAPI App
# fastapi_app = FastAPI()
# stable_diffusion = StableDiffusion()

# @fastapi_app.post("/web")  # Explicitly define the /web route
# async def web_endpoint(prompt: str):
#     """FastAPI endpoint for image generation."""
#     try:
#         print(f"Generating image for: {prompt}")
#         image_bytes = stable_diffusion.run_inference.remote(prompt)
#         return Response(content=image_bytes, media_type="image/png")
#     except Exception as e:
#         print(f"Error: {e}")
#         return {"error": str(e)}

# # Expose FastAPI app via Modal
# @app.function(image=image)
# def fastapi_entrypoint():
#     return fastapi_app

# # Local Testing Entry Point
# @app.local_entrypoint()
# def main():
#     """Local entrypoint for testing."""
#     service = StableDiffusion()
#     prompt = input("Enter a prompt: ")
#     result = service.run_inference.remote(prompt)
#     print("Image generated successfully.")


# # # test 2
# import modal
# import io
# import torch
# from diffusers import StableDiffusionPipeline
# from fastapi import Response

# # Define Modal App
# app = modal.App("stable-diffusion-app")

# # Dependencies
# image = (
#     modal.Image.debian_slim(python_version="3.12")
#     .pip_install(
#         "torch==2.5.1",
#         "torchvision==0.20.1",
#         "diffusers==0.31.0",
#         "transformers==4.44.0",
#         "accelerate==0.33.0",
#         "fastapi[standard]==0.115.4"
#     )
# )

# # Class-based Inference Service
# @app.cls(image=image, gpu="A10G", timeout=600)
# class StableDiffusion:
#     @modal.build()
#     @modal.enter()
#     def initialize_pipeline(self):
#         """Load the Stable Diffusion pipeline into GPU."""
#         self.pipeline = StableDiffusionPipeline.from_pretrained(
#             "CompVis/stable-diffusion-v1-4",
#             torch_dtype=torch.float16
#         ).to("cuda")

#     @modal.method()
#     def generate_image(self, prompt: str) -> bytes:
#         """Generate an image and return it as bytes."""
#         image = self.pipeline(prompt).images[0]
#         with io.BytesIO() as buffer:
#             image.save(buffer, format="PNG")
#             return buffer.getvalue()

#     # @modal.web_endpoint(method="POST")
#     # def web(self, prompt: str):
#     #     """Exposed web endpoint to generate image via POST request."""
#     #     try:
#     #         print(f"Generating image for: {prompt}")
#     #         image_bytes = self.generate_image.local(prompt)
#     #         return Response(content=image_bytes, media_type="image/png")
#     #     except Exception as e:
#     #         print(f"Error: {e}")
#     #         return {"error": str(e)}
#     @modal.web_endpoint(method="POST")
#     def web(self, request: dict):
#         try:
#             prompt = request.get("prompt")
#             if not prompt:
#                 return {"error": "Prompt field is required"}
#             print(f"Generating image for: {prompt}")
#             image_bytes = self.run_inference.local(prompt)
#             return Response(content=image_bytes, media_type="image/png")
#         except Exception as e:
#             print(f"Error: {e}")
#             return {"error": str(e)}



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



# with API key

# import io
# import os
# from dotenv import load_dotenv
# from fastapi import Response, HTTPException, Query, Request
# import torch
# from diffusers import StableDiffusionPipeline
# import modal

# # Load the .env file from the backend directory
# load_dotenv(dotenv_path="./backend/.env")

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

# @app.cls(image=image, gpu=modal.gpu.A10G(count=1), secrets=[modal.Secret.from_name("API_KEY")])
# class StableDiffusion:
#     @modal.build()
#     @modal.enter()
#     def load_model(self):
#         print("Loading model...")
#         self.pipeline = StableDiffusionPipeline.from_pretrained(
#             "CompVis/stable-diffusion-v1-4",
#             torch_dtype=torch.bfloat16,
#         ).to("cuda")
#         self.API_KEY = os.environ["API_KEY"]
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
#     def web(self, request: Request, prompt: str, seed: int = None):
#         # API Key authentication
#         api_key = request.headers.get("X-API-Key")
#         if api_key != self.API_KEY:
#             raise HTTPException(
#                 status_code=401,
#                 detail="Unauthorized"
#             )

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
