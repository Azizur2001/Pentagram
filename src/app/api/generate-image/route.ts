// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     // Parse the incoming request body to get the `text` parameter
//     const { text } = await request.json();

//     console.log("Prompt received:", text);

//     // Define the endpoint
//     const modalEndpoint =
//       "https://rahmanazizur946--stable-diffusion-web-app-stablediffusion-web.modal.run";

//     // Send the POST request to the Modal API
//     const response = await fetch(
//       `${modalEndpoint}?prompt=${encodeURIComponent(text)}`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "image/png", // Expecting an image in response
//         },
//       }
//     );

//     // Check for errors
//     if (!response.ok) {
//       console.error("Modal API error:", response.statusText);
//       throw new Error(`Failed to fetch image. Status: ${response.status}`);
//     }

//     // Get the image as a Buffer and convert to Base64
//     const imageBuffer = await response.arrayBuffer();
//     const imageBase64 = Buffer.from(imageBuffer).toString("base64");
//     const imageUrl = `data:image/png;base64,${imageBase64}`;

//     // Return the image URL
//     return NextResponse.json({
//       success: true,
//       imageUrl,
//     });
//   } catch (error) {
//     console.error("Error fetching image:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch image from Modal API" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the incoming request body to get the `text` parameter
    const { text } = await request.json();

    console.log("Prompt received:", text);

    // Define the endpoint
    const modalEndpoint =
      "https://rahmanazizur946--stable-diffusion-web-app-stablediffusion-web.modal.run";

    // Send the POST request to the Modal API
    const response = await fetch(
      `${modalEndpoint}?prompt=${encodeURIComponent(text)}`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.API_KEY || "",
          Accept: "image/png", // Expecting an image in response
        },
      }
    );

    // Check for errors
    if (!response.ok) {
      console.error("Modal API error:", response.statusText);
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    // Get the image as a Buffer and convert to Base64
    const imageBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    // Return the image URL
    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image from Modal API" },
      { status: 500 }
    );
  }
}
