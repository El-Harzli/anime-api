import axios from "axios";
import https from "https";
import { URL } from "url";

const insecureAgent = new https.Agent({
  rejectUnauthorized: false, // ⛔ allow self-signed or invalid SSL
});

export const getVideoByProxy = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("Missing URL");

    const baseUrl = new URL(url);
    const isPlaylist = url.endsWith(".m3u8");

    const response = await axios.get(url, {
      responseType: isPlaylist ? "text" : "arraybuffer",
      decompress: true,
      httpsAgent: insecureAgent, // ⭐ FIX HERE
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
        accept: "*/*",
        "accept-language": "en,en-US;q=0.9,ar;q=0.8",
        origin: "https://megacloud.blog",
        referer: "https://megacloud.blog/",
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
    });

    let data = response.data;

    if (isPlaylist) {
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
    } else {
      res.setHeader("Content-Type", "video/mp2t");
      return res.send(Buffer.from(data));
    }
  } catch (error) {
    if (error.response) {
      console.error(
        "[Proxy] Upstream error:",
        error.response.status,
        error.response.statusText
      );
    }

    res.status(500).send("Proxy error: " + error.message);
  }
};
