async function fetchAndProcessData(url, sellerIds) {
  const results = [];

  for (const sellerId of sellerIds) {
    if (!sellerId) {
      continue;
    }
    const requestUrl = `${url}?sellerId=${sellerId}&noEncrypt=true`;
    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        redirect: "follow",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // 提取所需的字段
      const processedData = {
...data.data || {}
      };

      results.push(processedData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // console.log(processedData);
    } catch (error) {
      console.error("Error fetching data for sellerId:", sellerId, error);
    }
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(JSON.stringify(results))
      .then(() => {
        console.log("Data copied to clipboard");
      })
      .catch((err) => {
        console.error("Could not copy data to clipboard", err);
      });
  } else {
    console.log("Clipboard API not available");
  }
  return results;
}

const baseRequestUrl = "";

const sellerIds = `34862017861
10284210671
`.split(/[ \n]+/);

fetchAndProcessData(baseRequestUrl, sellerIds).then((processedResults) => {
  console.log("Processed Results:", processedResults);
});
