const axios = require('axios');
const fs = require('fs');
const path = require('path');
const log = require('./logger.js');
require("dotenv").config();

const webhook = process.env.SHOP_WEBHOOK; 
const fnapi = "https://fortnite-api.com/v2/cosmetics/br";
const catalogpath = path.join(__dirname, "..", 'cfg', 'catalog_config.json');

const season = process.env.SEASON; 
const dailycount = 6;
const featuredcount = 2;

async function getcosmetics() {
    try {
        const response = await axios.get(fnapi);
        const cosmetics = response.data.data || [];

        return cosmetics.filter(item => {
            const { chapter, season } = item.introduction || {};
            return chapter === '1' && season && parseInt(season, 10) <= season;
        });
    } catch (error) {
        log.error('Error fetching cosmetics:', error.message || error);
        return [];
    }
}

function randomitemsgen(items, count) {    
    const unocards = items.sort(() => 0.5 - Math.random());
    return unocards.slice(0, count);
}

function yappyyap(item) {
    const { id, backendValue, type } = item;
    let itemType;

    switch (type.value.toLowerCase()) {
        case "outfit":
            itemType = "AthenaCharacter";  
            break;
        case "emote":
            itemType = "AthenaDance";  
            break;
        default:
            itemType = backendValue || `Athena${capitalize1stletter(type.value)}`;
            break;
    }

    return [`${itemType}:${id}`];
}

function capitalize1stletter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function properpricegen(item) {
    const properrarity = {
        legendary: {
            outfit: 2000,
            pickaxe: 1500,
            backpack: 900,
            glider: 2000
        },
        epic: {
            outfit: 1500,
            pet: 1000,
            pickaxe: [1500, 1200],
            glider: 1200,
            backpack: 700,
            petcarrier: 400,
            emote: 800
        },
        rare: {
            outfit: 1200,
            pickaxe: 800,
            glider: 800,
            emote: 500,
            backpack: 400,
            contrail: 300,
            wrap: 600,
            petcarrier: 300,
            emoji: 300
        },
        uncommon: {
            outfit: 800,
            backpack: 200,
            pickaxe: 500,
            glider: 500,
            emote: 200,
            wrap: 300,
            spray: 200,
            contrail: 200,
            loadingscreen: 200,
            petcarrier: 200,
            emoji: 200
        },
        // i never even knew a dark series sm existed
        dark: {
            outfit: 1200,
            pickaxe: 800,
            glider: 800,
            emote: 500,
            backpack: 400,
            wrap: 600
        },
    };

    const rarity = item.rarity.value.toLowerCase();
    const type = item.type.value.toLowerCase();

    if (!properrarity[rarity]) {
        log.warning(`Warning: Unknown rarity "${rarity}" for item "${item.name}". Defaulting to 200 V-Bucks.`);
        return 200;
    }
    if (!properrarity[rarity][type]) {
        log.warning(`Warning: Unknown type "${type}" for rarity "${rarity}" on item "${item.name}". Defaulting to 200 V-Bucks.`);
        return 200;
    }

    const prices = properrarity[rarity][type];

    return Array.isArray(prices) ? prices[Math.floor(Math.random() * prices.length)] : prices;
}
function udpatecatalog(dailyItems, featuredItems) {
    const catalogConfig = { "//": "BR Item Shop Config" };

    dailyItems.forEach((item, index) => {
        catalogConfig[`daily${index + 1}`] = {
            itemGrants: yappyyap(item),
            price: properpricegen(item)
        };
    });

    featuredItems.forEach((item, index) => {
        catalogConfig[`featured${index + 1}`] = {
            itemGrants: yappyyap(item),
            price: properpricegen(item)
        };
    });

    fs.writeFileSync(catalogpath, JSON.stringify(catalogConfig, null, 2), 'utf-8');
    log.shop("Item Shop updated!");
}

async function senddcmsg(itemShop) {
    const now = new Date();
    const nextRotation = new Date(now);
    nextRotation.setUTCHours(6, 0, 0, 0); 

    if (now.getUTCHours() >= 6) {
        nextRotation.setUTCDate(now.getUTCDate() + 1);
    }
    const timestamp = Math.floor(nextRotation.getTime() / 1000);

    const catalogConfig = JSON.parse(fs.readFileSync(catalogpath, 'utf-8'));

    function getFeaturedItemPrice(index) {
        const featuredKey = `featured${index + 1}`;
        return catalogConfig[featuredKey] ? catalogConfig[featuredKey].price : 'Unknown Price';
    }

    const embed = {
        title: "Ice Item Shop",
        description: `Item shop rotates every day at <t:${timestamp}:t>!`,
        fields: [
            {
                name: "Featured Items",
                value: itemShop.featured
                    .map((item, index) => {
                        const price = getFeaturedItemPrice(index);
                        return `• ${item.name} (${item.type.displayValue}, ${item.rarity.displayValue}) - ${properpricegenText(price)}`;
                    })
                    .join('\n') || "No featured items today."
            },
            {
                name: "Daily Items",
                value: itemShop.daily
                    .map(item => `• ${item.name} (${item.type.displayValue}, ${item.rarity.displayValue}) - ${properpricegenText(item.price)}`)
                    .join('\n') || "No daily items today."
            }
        ],
        color: 0x00D7FF,
    };
    
    try {
        await axios.post(webhook, { embeds: [embed] });
        log.shop("Item shop sent to Discord!");
    } catch (error) {
        log.error("Error sending item shop to Discord:", error.message || error);
    }
}

function properpricegenText(price) {
    return price === 0 ? "Free" : `${price} V-Bucks`;
}

async function rotateshop() {
    try {
        const cosmetics = await getcosmetics();
        if (cosmetics.length === 0) {
            log.error('No cosmetics found!');
            return;
        }

        const nonCommonItems = cosmetics.filter(item => item.rarity.value.toLowerCase() !== 'common');

        const nonOutfitItems = nonCommonItems.filter(item => item.type.value.toLowerCase() !== 'outfit');
        const dailyItems = randomitemsgen(nonOutfitItems, dailycount);

        const freeItemIndex = Math.floor(Math.random() * dailyItems.length);
        dailyItems.forEach((item, index) => {
            item.price = index === freeItemIndex ? 0 : properpricegen(item);
        });

        const outfitItems = nonCommonItems.filter(item => item.type.value.toLowerCase() === 'outfit');
        const featuredItems = randomitemsgen(outfitItems, featuredcount);

        featuredItems.forEach(item => {
            item.price = properpricegen(item); 
        });

        udpatecatalog(dailyItems, featuredItems);
        await senddcmsg({ daily: dailyItems, featured: featuredItems });
    } catch (error) {
        log.error('Error in rotateshop:', error.message || error);
    }
}


function udpatecatalog(dailyItems, featuredItems) {
    const catalogConfig = { "//": "BR Item Shop Config" };

    dailyItems.forEach((item, index) => {
        catalogConfig[`daily${index + 1}`] = {
            itemGrants: yappyyap(item),
            price: item.price || properpricegen(item)  
        };
    });

    featuredItems.forEach((item, index) => {
        catalogConfig[`featured${index + 1}`] = {
            itemGrants: yappyyap(item),
            price: properpricegen(item)
        };
    });

    fs.writeFileSync(catalogpath, JSON.stringify(catalogConfig, null, 2), 'utf-8');
    log.shop("Item Shop updated!");
}

function ighsdohgsidghiosdh() {
    const now = new Date();
    const nextRotation = new Date(now);
    nextRotation.setUTCHours(process.env.ROTATE_HOUR, 0, 0, 0);

    if (now.getUTCHours() >= process.env.ROTATE_HOUR) {
        nextRotation.setUTCDate(now.getUTCDate() + 1);
    }

    return nextRotation.getTime() - now.getTime();
}


setTimeout(function scheduleNextRotation() {
    rotateshop();
    setInterval(rotateshop, 24 * 60 * 60 * 1000); 
}, ighsdohgsidghiosdh());
