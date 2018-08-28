//const Player = require('../models/player');
const Player = require('../models/index')['player'];
const Arena = require('../models/index')['arena'];
const request = require('request-promise');
const config = require('../config/config');
const median = require('./helpers');

async function requestJson(url, method='GET') {
    let options = {
        method: method,
        url: url,
        headers: { auth: config["developerKey"] }
    };
    try{
        let data = await request(options);
    } catch(err) {
        console.log(err);
        return null;
    }
    return JSON.parse(data);
}

function getAllLevels(player_json) {
    let total = {'friendly': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []},
        'opponent': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []}};
    for(var match of player_json){
        if(match['type'] == 'PvP'){
            for(var card of match['team'][0]['deck']){
                let rarity = card['rarity'];
                total['friendly'][rarity].push(card['level']);
            }
            for(var card of match['opponent'][0]['deck']){
                let rarity = card['rarity'];
                total['opponent'][rarity].push(card['level']);
            }
        }
    }
    return total;
}

function getAllLevelsWithTrophies(player_json) {
    let total = {'opponent': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []}};
    let trophies = [];
    let iters = 0;
    for(var match of player_json){
        if(match['type'] == 'PvP'){
            iters++;
            trophies.push(match['opponent'][0]['startTrophies']);
            for(var card of match['opponent'][0]['deck']){
                let rarity = card['rarity'];
                total['opponent'][rarity].push(card['level']);
            }
        }
    }
    if(iters == 0){
        return [null, null];
    }
    // there may be cases where in matches observed there was no card of certain rarity
    // if that's the case, then push 0
    for(const rarity in total['opponent']){
        if(total['opponent'][rarity].length == 0){
            total['opponent'][rarity].push(0);
        }
    }
    let trophies_average = trophies.reduce((acc, el) => {return acc+el}, 0) / trophies.length;
    return [total, trophies_average];
}

// takes: total_average format of data
// returns: same format, with average levels instead of lists
function getAverageLevels(data) {
    let total_average = {'friendly': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []},
    'opponent': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []}};
    for([side, rarities] of Object.entries(data)){
        for([rarity, levels] of Object.entries(rarities)){
            let sum = 0;
            for(level of levels){
                sum += level;
            }
            total_average[side][rarity] = sum/levels.length;
        }
    }
    return total_average;
}

// takes: total_median format of data
// returns: same format, with median levels instead of lists
function getMedianLevels(data) {
    let total_median = {'friendly': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []},
    'opponent': {'Common': [], 'Rare': [], 'Epic': [], 'Legendary': []}};
    for([side, rarities] of Object.entries(data)){
        for([rarity, levels] of Object.entries(rarities)){
            total_median[side][rarity] = median(levels);
        }
    }
    return total_median;
}

module.exports = {
    async getOne(req, res) {
        // get total player's levels and opponents' levels
        let tag = req.query.tag;
        let data = await requestJson(config['royaleApi']+`player/${tag}/battles`);

        let total = getAllLevels(data);
        let total_average = getAverageLevels(total);
        let total_median = getMedianLevels(total);

        // get additional player data to display
        let data2 = await requestJson(config['royaleApi']+`player/${tag}`);

        all_data = {avg_levels: total_average,
            median_levels: total_median,
            username: data2['name'],
            tag: data2['tag'],
            maxTrophies: data2['stats']['maxTrophies'],
            king_level: data2['stats']['level'],
            trophies: data2['trophies']};
        return all_data;
    },

    async update(req, res) {
        arenas = await Arena.findAll();
        for(let points=16000; points<=30000; points+=4000) {
            console.log('processing for '+points);
            let search_results = await requestJson(config['royaleApi']+`clan/search?score=${points}&minMembers=30`);
            if(search_results == null){
                console.log(`Error for ${points} at clan search`);
                continue;
            }
            let clan = await requestJson(config['royaleApi']+`clan/${search_results[0]['tag']}`);
            if(clan == null){
                console.log(`Error for ${points} at clan requesting`);
                continue;
            }
            for(const member of clan['members']) {
                console.log(member['name']);
                let member_battles = await requestJson(config['royaleApi']+`player/${member['tag']}/battles`);
                if(member_battles == null){
                    console.log(`Error for ${member['tag']}`);
                    continue;
                }
                let result = getAllLevelsWithTrophies(member_battles);
                if(result[0] == null) { console.log("no pvp matches"); continue; }
                let median_levels = getMedianLevels(result[0]);
                let trophies_average = result[1];
                let player = await Player
                    .create({
                    commons_median: median_levels['opponent']['Common'],
                    rares_median: median_levels['opponent']['Rare'],
                    epics_median: median_levels['opponent']['Epic'],
                    legendaries_median: median_levels['opponent']['Legendary'],
                    trophies: trophies_average
                })
                for(const arena of arenas) {
                    const arenaData = arena['dataValues'];
                    if(trophies_average < arenaData.trophy_high && trophies_average > arenaData.trophy_low){
                        arena.addPlayer(player);
                    }
                }
            }
        }
        return "Success";
    }
};