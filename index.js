// For more information, see https://crawlee.dev/
import { CheerioCrawler, Configuration } from '@crawlee/cheerio';
import express from 'express';

const app = express();
app.use(express.json());

const startUrls = ['https://www.thecollector.com/'];

app.get('/test', async (req, res) => {
  /////////////////////////////////////////////
  const crawler = new CheerioCrawler({
    // maxRequestsPerCrawl: 5,
    async requestHandler({ $, request, enqueueLinks, pushData }) {
      const title = $('title').text();
      console.log(`The title of "${request.url}" is: ${title}.`);
      const Content = await $('body').text();
      await pushData({ title, url: request.loadedUrl, Content });
      await enqueueLinks();

      // await enqueueLinks({
      //     strategy: 'same-domain'
      // }); // this to add subdomains
    }
  }, new Configuration({
    persistStorage: false,
  }));

  await crawler.run(startUrls);

  const data = await crawler.getData();

  return res.send(JSON.stringify(data));
  // res.send("HI");
  /////////////////////
  // return {
  //   statusCode: 200,
  // body: await crawler.getData(),
  // }
});

app.listen(5001, () => console.log("listening on 5001"));