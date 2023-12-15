const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();


const PORT = process.env.PORT || 8080;
const indexPath = path.resolve(__dirname, "..", "build", "index.html");

// static resources should just be served as they are
app.use(express.static(
  path.resolve(__dirname, "..", "build"),
  { maxAge: "30d" },
));

const defaultPortalDetails = {
  title: "Bullitt Satilite Messenger",
  thumbnail: "/home_illustration.jpg",
  description: "Bullit satelite tracking"
}

const getPostData = async (sessionId, baseUrl, req) => {
    const imgs =[
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
        "https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s",
        "https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0"
    ]
  try{
    const randImgNumber = Math.round((Math.random() * imgs.length));
    const sessionInfo = {
      title: `Sai's - Tracking Session #${sessionId?.id} `,
      description: "",
      thumbnail: imgs[randImgNumber]
    }

    return sessionInfo
  }
  catch(err){
    return defaultPortalDetails;
  }
}

// Middleware to extract the full URL from the request
app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.headers.host}`;
  req.fullUrl = fullUrl;
  next();
});

const replaceMetaTags = (htmlData, data, baseUrl, originalUrl) => {
  return htmlData
    .replace("__META_OG_TITLE__", data.title)
    .replace("__META_OG_DESCRIPTION__", data.description)
    .replace("__META_OG_IMAGE__", data.thumbnail)
    .replace("__META_OG_URL__", baseUrl + originalUrl)
    .replace("__META_TWITTER_TITLE__", data.title)
    .replace("__META_TWITTER_DESCRIPTION__", data.description)
    .replace("__META_TWITTER_IMAGE__", baseUrl + data.thumbnail);
}

// here we serve the index.html page
app.get("/livetracking", async (req, res) => {
  const baseUrl = req.fullUrl;
  const originalUrl = req.originalUrl;

  fs.readFile(indexPath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end()
    }
    // get post info
    const postId = req.query;
    getPostData(postId, baseUrl, req).then((sessionData => {
      // inject meta updated tags
      htmlData = replaceMetaTags(htmlData, sessionData, baseUrl, originalUrl);
      return res.send(htmlData);

    })).catch((err) => {
      // inject meta tags
      htmlData = replaceMetaTags(htmlData, defaultPortalDetails, baseUrl, originalUrl);
      return res.send(htmlData);
    })
  });
});


app.get("/*", (req, res) => {
  const baseUrl = req.fullUrl;
  fs.readFile(indexPath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }
    // inject meta tags
    htmlData = replaceMetaTags(htmlData, defaultPortalDetails, baseUrl, "");

    return res.send(htmlData);
  });
});


// listening...
app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});