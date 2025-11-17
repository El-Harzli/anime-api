import axios from "axios";
import https from "https";
import { URL } from "url";

const insecureAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const getVideoByProxy = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).send("Missing URL");

    const baseUrl = new URL(url);
    const isPlaylist = url.endsWith(".m3u8");

    const response = await axios.get(url, {
      responseType: isPlaylist ? "text" : "arraybuffer",

      httpsAgent: insecureAgent,

      // ⭐ VERY IMPORTANT — keep agent during redirects
      maxRedirects: 5,
      beforeRedirect: (options) => {
        options.httpsAgent = insecureAgent;
      },

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
    });

    let data = response.data;

    // rewrite m3u8 urls
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
    }

    // video chunks
    res.setHeader("Content-Type", "video/mp2t");
    return res.send(Buffer.from(data));
  } catch (error) {
    console.error("[Proxy error]", error.message);
    res.status(500).send("Proxy error: " + error.message);
  }
};
