export const truncateHTML = (html: string, maxLength: number): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Extract first image
    const firstImg = tempDiv.querySelector("img");
    let imgTag = "";
    if (firstImg) {
        imgTag = `<img src="${firstImg.getAttribute("src")}" alt="${firstImg.getAttribute("alt") || ""}" style= 'border-radius:8px;height:11rem;margin:auto'>`;
        imgTag += '<br>'
    }

    // Extract and truncate text
    const text = tempDiv.innerText || tempDiv.textContent || "";
    const truncatedText = text.length > maxLength ? text.substring(0, imgTag == ""?3.5*maxLength:maxLength) + "..." : text;

    return imgTag + truncatedText;
};