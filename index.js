// API : Gelen istekleri izler ve isteklere cevap gönderir

// gerekli modülleri çağırdık
const http = require("http");
const fs = require("fs");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

// html şablon verilerine erişelim
let tempOverview = fs.readFileSync("./templates/overview.html", "utf-8");
let tempProduct = fs.readFileSync("./templates/product.html", "utf-8");
let tempCard = fs.readFileSync("./templates/card.html", "utf-8");

// json dosyasındaki verilere erişelim
let jsonData = fs.readFileSync("./dev-data/data.json", "utf-8");

// json verisini js formatına çevirelim
const data = JSON.parse(jsonData);

const server = http.createServer((request, response) => {
  console.log("API'a istek geldi");

  // istek url'ini parçalara ayırdık
  const { query, pathname } = url.parse(request.url, true);

  // gelen isteğin url'ine göre farklı cevap gönder
  switch (pathname) {
    case "/overview":
      // meyveler dizisindeki eleman sayısı kadar kart oluştur
      const cards = data.map((el) => replaceTemplate(tempCard, el));

      // anasayfa html'indeki kartlar alanına kart html kodlarına ekle
      tempOverview = tempOverview.replace("{%PRODUCT_CARDS%}", cards);
      return response.end(tempOverview);

    case "/product":
      // 1) dizideki doğru elemanı bul
      const item = data.find((item) => item.id == query.id);

      // 2) detay sayfasının html'ini bulunan elemanın verilerine göre güncelle
      const output = replaceTemplate(tempProduct, item);

      // 3) güncel html'i client'a gönder
      return response.end(output);

    default:
      return response.end("<h1>Tanimlanmayan Yol</h1>");
  }
});

// Bir dinleyici oluşturup hangi porta gelen isteklerin dinleneceğini ayarlama
server.listen(2020, "127.0.0.1", () => {
  console.log("IP adresinin 2020 portuna gelen istekler dinlemey alındı");
});
