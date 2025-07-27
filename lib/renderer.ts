export interface RenderOptions {
  canvas: HTMLCanvasElement;
  imageData: string;
  padding: number;
  borderRadius: number;
  background: string;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowOpacity: number;
}

export function renderScreenshot(options: RenderOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const {
      canvas,
      imageData,
      padding,
      borderRadius,
      background,
      shadowOffsetY,
      shadowBlur,
      shadowOpacity,
    } = options;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        // Calculate canvas dimensions based on image and padding
        const paddingValue = padding;
        const canvasWidth = img.width + paddingValue * 2;
        const canvasHeight = img.height + paddingValue * 2;

        // Set canvas size to actual output dimensions
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw background first
        if (background.startsWith("linear-gradient")) {
          // Parse gradient
          const gradientMatch = background.match(
            /linear-gradient\((\d+)deg,\s*(.+)\)/,
          );
          if (gradientMatch) {
            const angle = Number.parseInt(gradientMatch[1]);
            const colorStops = gradientMatch[2].split(",").map((s) => s.trim());

            // Convert angle to canvas coordinates
            const angleRad = ((angle - 90) * Math.PI) / 180;
            const diagonal = Math.sqrt(
              canvasWidth * canvasWidth + canvasHeight * canvasHeight,
            );
            const x1 = canvasWidth / 2 - (Math.cos(angleRad) * diagonal) / 2;
            const y1 = canvasHeight / 2 - (Math.sin(angleRad) * diagonal) / 2;
            const x2 = canvasWidth / 2 + (Math.cos(angleRad) * diagonal) / 2;
            const y2 = canvasHeight / 2 + (Math.sin(angleRad) * diagonal) / 2;

            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);

            // Parse and add color stops
            colorStops.forEach((colorStop, index) => {
              const match = colorStop.match(/(.+?)\s+(\d+)%/);
              if (match) {
                const color = match[1].trim();
                const percentage = Number.parseInt(match[2]) / 100;
                gradient.addColorStop(percentage, color);
              } else {
                const position =
                  colorStops.length === 1 ? 0 : index / (colorStops.length - 1);
                gradient.addColorStop(position, colorStop.trim());
              }
            });

            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = "#667eea";
          }
        } else {
          ctx.fillStyle = background;
        }

        // Fill the entire canvas with background
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const imageX = paddingValue;
        const imageY = paddingValue;
        const imageWidth = img.width;
        const imageHeight = img.height;
        const radius = borderRadius;

        // Create shadow
        if (shadowBlur > 0 && shadowOpacity > 0) {
          ctx.save();

          // Set shadow properties
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = shadowOffsetY;
          ctx.shadowBlur = shadowBlur;
          ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity / 100})`;

          // Check if image has transparency by drawing it to a temporary canvas
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;

          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0);
            const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            // Check if any pixel has alpha < 255 (transparent)
            let hasTransparency = false;
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] < 255) {
                hasTransparency = true;
                break;
              }
            }

            if (hasTransparency) {
              // For transparent images, draw the image itself to create shadow
              ctx.beginPath();
              ctx.moveTo(imageX + radius, imageY);
              ctx.lineTo(imageX + imageWidth - radius, imageY);
              ctx.quadraticCurveTo(
                imageX + imageWidth,
                imageY,
                imageX + imageWidth,
                imageY + radius,
              );
              ctx.lineTo(imageX + imageWidth, imageY + imageHeight - radius);
              ctx.quadraticCurveTo(
                imageX + imageWidth,
                imageY + imageHeight,
                imageX + imageWidth - radius,
                imageY + imageHeight,
              );
              ctx.lineTo(imageX + radius, imageY + imageHeight);
              ctx.quadraticCurveTo(
                imageX,
                imageY + imageHeight,
                imageX,
                imageY + imageHeight - radius,
              );
              ctx.lineTo(imageX, imageY + radius);
              ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY);
              ctx.closePath();
              ctx.clip();

              // Draw the image to create shape-aware shadow
              ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
            } else {
              // For opaque images, draw a rounded rectangle shadow
              ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
              ctx.beginPath();
              ctx.moveTo(imageX + radius, imageY);
              ctx.lineTo(imageX + imageWidth - radius, imageY);
              ctx.quadraticCurveTo(
                imageX + imageWidth,
                imageY,
                imageX + imageWidth,
                imageY + radius,
              );
              ctx.lineTo(imageX + imageWidth, imageY + imageHeight - radius);
              ctx.quadraticCurveTo(
                imageX + imageWidth,
                imageY + imageHeight,
                imageX + imageWidth - radius,
                imageY + imageHeight,
              );
              ctx.lineTo(imageX + radius, imageY + imageHeight);
              ctx.quadraticCurveTo(
                imageX,
                imageY + imageHeight,
                imageX,
                imageY + imageHeight - radius,
              );
              ctx.lineTo(imageX, imageY + radius);
              ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY);
              ctx.closePath();
              ctx.fill();
            }
          }

          ctx.restore();
        }

        // Now draw the image with clipping
        ctx.save();

        // Create rounded rectangle clipping path
        ctx.beginPath();
        ctx.moveTo(imageX + radius, imageY);
        ctx.lineTo(imageX + imageWidth - radius, imageY);
        ctx.quadraticCurveTo(
          imageX + imageWidth,
          imageY,
          imageX + imageWidth,
          imageY + radius,
        );
        ctx.lineTo(imageX + imageWidth, imageY + imageHeight - radius);
        ctx.quadraticCurveTo(
          imageX + imageWidth,
          imageY + imageHeight,
          imageX + imageWidth - radius,
          imageY + imageHeight,
        );
        ctx.lineTo(imageX + radius, imageY + imageHeight);
        ctx.quadraticCurveTo(
          imageX,
          imageY + imageHeight,
          imageX,
          imageY + imageHeight - radius,
        );
        ctx.lineTo(imageX, imageY + radius);
        ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY);
        ctx.closePath();
        ctx.clip();

        // Draw the image
        ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);
        ctx.restore();

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageData;
  });
}
