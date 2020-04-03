const cheerio = require('cheerio');
const axios = require('axios');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ch = html => {
    const data = {};
    const $ = cheerio.load(html);
    const score = $('.review-score-container .Aq14fc').text();
    data.score = score;
    const reviewsCount = $('.review-score-container .z5jxId.yVc3Hc').text();
    data.reviewsCount = reviewsCount;
    const reviews = $('.gws-localreviews__google-review');
    let reviewsArr = [];
    reviews.each((index, item) => {
        let name = $(item).find('.jxjCjc .TSUbDb a').text();
        let hisReviewsCount = $(item).find('.FGlxyd .Msppse .A503be').text();
        let hisStars = $(item).find('.PuaHbe .fTKmHE99XE4__star').attr('aria-label');
        let hisAv = $(item).find('a.fl img').attr('src');
        
        let snippet = $(item).find('.Jtu6Td .review-snippet').text();
        let fullText = $(item).find('.Jtu6Td .review-full-text').text();
        if (!fullText.length) {
            fullText = $(item).find('.Jtu6Td span').text();
        }
        
        let review = { name, hisReviewsCount, hisStars, hisAv, snippet, fullText };
        reviewsArr.push(review);
    });
    data.reviews = reviewsArr;
    return data;
}

fs.readFile('getcredit.htm', 'utf8', (err, data) => {
    if (err) console.log('Error parsing file');
    else {
        const resData = ch(data);
        fs.writeFile('reviews.json', JSON.stringify(resData), (err) => {
            if (err) console.log('json not created');
            else console.log('success');
        });
    }
});