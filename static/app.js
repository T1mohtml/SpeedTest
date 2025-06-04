const fileUrl = "https://speed.cloudflare.com/__down?bytes=100000000";
const startBTN = document.getElementById("startBTN");
const resultDiv = document.getElementById("Results");
const loadingDiv = document.getElementById("Loading...");

async function testDownloadSpeed() {
    // Disable button and reset display
    startBTN.disabled = true;
    resultDiv.textContent = "";
    loadingDiv.textContent = "Testing download speed... Please wait.";

    try {
        const startTime = performance.now();

        // Fetch the file and read its stream
        const response = await fetch(fileUrl);
        const reader = response.body.getReader();
        let bytesReceived = 0;
        const contentLength = parseInt(response.headers.get("Content-Length"), 10) || 100 * 1024 * 1024;

        // Read the file in chunks and calculate progress
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            bytesReceived += value.length;
            loadingDiv.textContent = `Downloading: ${(bytesReceived / (1024 * 1024)).toFixed(2)} MB / ${(contentLength / (1024 * 1024)).toFixed(2)} MB`;
        }

        // Calculate download speed
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // duration in seconds
        const bitsLoaded = bytesReceived * 8; // convert bytes to bits
        const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);

        // Display the download speed
        loadingDiv.textContent = "";
        resultDiv.textContent = `Download Speed: ${speedMbps} Mbps`;
    } catch (error) {
        // Handle errors and reset the UI
        loadingDiv.textContent = "";
        resultDiv.textContent = "Error measuring speed, Check your  internet connection.";
        console.error(error);
    } finally {
        // Re-enable the button
        startBTN.disabled = false;
    }
}

// Attach event listener to the button
startBTN.addEventListener("click", testDownloadSpeed);