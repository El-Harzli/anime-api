import axios from "axios";
import https from "https";
import { URL } from "url";

const insecureAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const getVideoByProxy = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      console.log("[Proxy] Missing URL in request");
      return res.status(400).send("Missing URL");
    }
    console.log("[Proxy] Target URL:", url);

    const baseUrl = new URL(url);
    const isPlaylist = url.endsWith(".m3u8");

    // **Put your Proxy6 credentials here**
    const proxyHost = process.env.PROXY6_HOST;   // e.g. "123.45.67.89"
    const proxyPort = Number(process.env.PROXY6_PORT); // e.g. 3128
    const proxyUser = process.env.PROXY6_USER;
    const proxyPass = process.env.PROXY6_PASS;

    const axiosOptions = {
      responseType: isPlaylist ? "text" : "arraybuffer",
      maxRedirects: 5,
      beforeRedirect: (options) => {
        options.httpsAgent = insecureAgent;
      },
      httpsAgent: insecureAgent,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
        accept: "*/*",
        "accept-language": "en,en-US;q=0.9",
        referer: "https://megacloud.blog/",
        origin: "https://megacloud.blog",
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
    };

    if (proxyHost && proxyPort) {
      axiosOptions.proxy = {
        protocol: "http",  // or "https" depending on what Proxy6 supports
        host: proxyHost,
        port: proxyPort,
        auth: proxyUser
          ? { username: proxyUser, password: proxyPass }
          : undefined,
      };
      console.log("[Proxy] Using Proxy6 proxy:", proxyHost, proxyPort);
    } else {
      console.log("[Proxy] No proxy configured, direct request");
    }

    const response = await axios.get(url, axiosOptions);
    console.log("[Proxy] Response status from upstream:", response.status);

    let data = response.data;
    if (isPlaylist) {
      console.log("[Proxy] Rewriting playlist URLs");
      const rewritten = data.replace(/^(?!#)(.+)$/gm, (match) => {
        const absolute = match.startsWith("http")
          ? match
          : new URL(match, baseUrl).href;
        return `/api/${process.env.API_VERSION}/proxy?url=${encodeURIComponent(
          absolute
        )}`;
      });
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      return res.send(rewritten);
    }

    res.setHeader("Content-Type", "video/mp2t");
    return res.send(Buffer.from(data));
  } catch (error) {
    console.error("[Proxy error]", error.message, error.response?.status, error.response?.headers);
    res.status(500).send("Proxy error: " + error.message);
  }
};
