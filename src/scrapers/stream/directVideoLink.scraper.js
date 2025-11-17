import axiosInstance from '../../config/axios.config.js';
import axios from 'axios';
import extractToken from '../../services/extractToken.js';

export const scrapeDirectVideoLink = async (endpoint) => {
  try {
    // Build base URL (external metadata endpoint)
    const requestUrl = process.env.EXTRACTED_URL + endpoint;

    // Fetch metadata (contains `link`)
    const { data } = await axiosInstance.get(requestUrl);

    // Extract video ID from the link
    const videoId = data.link.split('/').pop().split('?')[0];

    // Construct token page URL
    const tokenPageUrl = `https://megacloud.blog/embed-2/v3/e-1/${videoId}?k=1&autoPlay=1&oa=0&asi=1`;

    // Extract token from the token page
    const token = await extractToken(tokenPageUrl);


    // Construct sources URL
    const sourcesUrl = `https://megacloud.blog/embed-2/v3/e-1/getSources?id=${videoId}&_k=${token}`;

    // Fetch the actual video sources
    const videoLink = await axios.get(sourcesUrl, {
      headers: {
        Referer: `https://megacloud.blog/embed-2/v3/e-1/${videoId}?`,
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json, text/plain, */*',
      },
      timeout: 15000,
    });

    // Work with the returned data
    const result = videoLink.data;
    // console.log("result : ", result)



    return result;
  } catch (error) {
    console.log('Error when scraping sources:', error);
    return undefined;
  }
};
