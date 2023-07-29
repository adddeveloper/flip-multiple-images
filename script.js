function flipImages() {
    const flipDirection = document.getElementById("flipDirection").value;
    const images = document.getElementById("imageInput").files;

    if (images.length === 0) {
        alert("Please select one or more images.");
        return;
    }

    const zip = new JSZip();

    const promises = Array.from(images).map((imageFile) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    if (flipDirection === "horizontal") {
                        ctx.translate(canvas.width, 0);
                        ctx.scale(-1, 1);
                    } else if (flipDirection === "vertical") {
                        ctx.translate(0, canvas.height);
                        ctx.scale(1, -1);
                    }
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        const originalFilename = imageFile.name;
                        zip.file(originalFilename, blob);

                        resolve();
                    });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(imageFile);
        });
    });

    Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "flipped_images.zip");
        });
    });
}
