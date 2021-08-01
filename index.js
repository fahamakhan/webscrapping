const puppeteer = require("puppeteer");
const fs = require('fs');
const https = require('https');
const xlsx = require('xlsx')

async function getPageData(link,page){
  try {
    

    //Category Page
    
    
    // Sub Category Page
    // await page.goto(link)
    // await page.waitForSelector(".image");

    //Products fetch
    // const linksProducts = await page.$$eval(".product-thumb .image a", (AllAs) =>
    //   AllAs.map((a) => a.href)
    // );
    // const newList = linksProducts.filter((e)=>{
    //     return e !== ''
    // })

    //Product Page

    
    await page.goto(link)
    
    await page.waitForSelector(".swiper-container");
    const titleElement = await page.$$eval('.breadcrumb a', (AllAs) =>
    AllAs.map((a) => a.textContent))
    const titleNumber = [2]
    const title = titleElement.filter((e,index)=>{
      if(titleNumber.includes(index)){
        return e
      }
  })

  const categoryElement = await page.$$eval('.breadcrumb a', (AllAs) =>
    AllAs.map((a) => a.textContent))
    const categoryNumber = [1]
    const category = categoryElement.filter((e,index)=>{
      if(categoryNumber.includes(index)){
        return e
      }
  })
  
  
     const block = await page.$eval('.block-content', span => span.textContent)
    const desTocorrect = block.toString().replace(title,' ')

    // console.log(desTocorrect);
  //   const block = await page.$$eval('.block-content p', (AllAs) =>
  //   AllAs.map((a) => a.textContent)).catch((e)=>{
  //     console.log("error");
  //   })

  //   const des = [1]
  //   const description = block.filter((e,index)=>{
  //     if(des.includes(index)){
  //       return e
  //     }
  // })

    const tableHeaders = await page.$$eval(".table.table-bordered.table-hover tr td", (tds)=>tds.map((td) => {
      return td.innerText;})
    );
    const odd = [6,10,14,18,22,26,30,34,38,42]
    const Variation = tableHeaders.filter((e,index)=>{
      if(odd.includes(index)){
        return e
      }
  })

  const pricevalue = [7,11,15,19,23,27,31,35,39,43]
    const price = tableHeaders.filter((e,index)=>{
      if(pricevalue.includes(index)){
        return e
      }
  })

    
    const Brand = await page.$eval('.product-manufacturer', span => span.innerText)
  //   const subcategoryElement = await page.$$eval('.breadcrumb a', (AllAs) =>
  //   AllAs.map((a) => a.textContent))
  //   const subcategoryNumber = [2]
  //   const subcategory = subcategoryElement.filter((e,index)=>{
  //     if(subcategoryNumber.includes(index)){
  //       return e
  //     }
  // })
    const Tags = await page.$$eval('.tags a', (AllAs) =>
    AllAs.map((a) => a.textContent))

    let result;
    const images = await page.$eval('.product-image img', img => img.src)
    console.log(images);
    
      await page.evaluate('debugger;')
      const titleToCorrect = title.toString().replace('/','-')
      result = await download(images, `${titleToCorrect}.png`);      
     

    console.log({
      title : titleToCorrect.toString(),
      description: desTocorrect.toString(),
      Brand,
      imageName: `${titleToCorrect}.png`,
      Tags:Tags.toString(),
      price: price.toString(),
      Variation:Variation.toString(),
      //subcategory:subcategory.toString(),
      category: category.toString()
    })

    return{
        title : titleToCorrect.toString(),
        description: desTocorrect.toString(),
        Brand,
        imageName: `${titleToCorrect}.png`,
        Tags:Tags.toString(),
        price: price.toString(),
        Variation:Variation.toString(),
        //subcategory:subcategory.toString(),
        category: category.toString()

      }
      
  } catch (err) {
    console.log(err);
  }
};



const download =(url, destination) => new Promise((resolve, reject) => {
  // const file =  fs.createWriteStream(destination).then(()=>{}).catch((e)=>{
    // console.log("No image",e);
  // });
  if(destination == 'mkmkmRAW MASTERPIECE CLASSIC 1 1-4 W/PREROLLED TIPS.png'){
    console.log("broken image");
    return "error in image"
  }else{
    const file =  fs.createWriteStream(destination)
  

  https.get(url, response => {
    response.pipe(file);

    file.on('finish', () => {
      file.close(resolve(true));
    });
  }).on('error', error => {
    fs.unlink(destination);
  });
}});

async function getLinks (page){

 await page.goto(
    "https://www.sunshinenovelty.com/index.php?route=product/category&path=170",
    { waitUntil: "networkidle2", }
  );
  await autoScroll(page)
  await page.waitForSelector(".product-thumb");
  //Sub category fetch
  // const links = await page.$$eval(".category-thumb .image a", (AllAs) =>
  //   AllAs.map((a) => a.href)
  // );
  const linksProducts = await page.$$eval(".product-thumb .image a", (AllAs) =>
          AllAs.map((a) => a.href)
        );
        const links = linksProducts.filter((e)=>{
            return e !== ''
        })
      

  return links
}



async function main(){

  const browser = await puppeteer.launch({
    headless: true,
     //defaultViewport: null,
    slowMo:30
  });
  const page = await browser.newPage();
  let scrapedData = []
  //Login Page
  await page.goto(
    "https://www.sunshinenovelty.com/index.php?route=account/login",
    { waitUntil: "networkidle2" }
  );
  
  //Pop up click
  await page.click(".btn-popup-1");

  //Email and password click
  await page.waitForSelector("#input-email");

  await page.type("#input-email", "mntcstore@gmail.com");
  await page.type("#input-password", "ventura1");

  await page.click('[type="submit"]');

  const allLinks = await getLinks(page)
  console.log(allLinks);
  
  for (let number of allLinks){
    
    const notrun = ['https://www.sunshinenovelty.com/index.php?route=product/product&path=2155&product_id=1905','https://www.sunshinenovelty.com/index.php?route=product/product&path=1011&product_id=1533','https://www.sunshinenovelty.com/index.php?route=product/product&path=1011&product_id=1451']
      if(!notrun.includes(number)){
      const data = await getPageData(number,page)
      scrapedData.push(data)}
      // const data = await getPageData(number,page)
      // scrapedData.push(data)
  
    
  }
  const newScrapedData = scrapedData.filter((data)=>{
    return data !== undefined
  })

    console.log(newScrapedData.length);
    const wb = xlsx.utils.book_new()
    const ws = xlsx.utils.json_to_sheet(newScrapedData)
    xlsx.utils.book_append_sheet(wb,ws)
    xlsx.writeFile(wb,'9.5.xlsx')
    await browser.close()
}

main()


async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 500);
      });
  });
}