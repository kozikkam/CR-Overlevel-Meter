const Arena = require('../models/index')['arena'];
const median = require('./helpers');

module.exports = {
    createArenas(req, res) {
        let a1 = Arena
            .create({
                arena_name: "Goblin Stadium",
                trophy_low: 0,
                trophy_high: 399
            });
        let a2 = Arena
            .create({
                arena_name: "Barbarian Bowl",
                trophy_low: 800,
                trophy_high: 1099
            });
        let a3 = Arena
            .create({
                arena_name: "P.E.K.K.As Playhouse",
                trophy_low: 1100,
                trophy_high: 1399
            });
        let a4 = Arena
            .create({
                arena_name: "Spell Valley",
                trophy_low: 1400,
                trophy_high: 1699
            });
        let a5 = Arena
            .create({
                arena_name: "Builders Workshop",
                trophy_low: 1700,
                trophy_high: 1999
            });
        let a6 = Arena
            .create({
                arena_name: "Royal Arena",
                trophy_low: 2000,
                trophy_high: 2299
            });
        let a7 = Arena
            .create({
                arena_name: "Frozen Peak",
                trophy_low: 2300,
                trophy_high: 2599
            });
        let a8 = Arena
            .create({
                arena_name: "Jungle Arena",
                trophy_low: 2600,
                trophy_high: 2999
            });
        let a9 = Arena
            .create({
                arena_name: "Hog Mountain",
                trophy_low: 3000,
                trophy_high: 3399
            });
        let a10 = Arena
            .create({
                arena_name: "Electro Valley",
                trophy_low: 3400,
                trophy_high: 3799
            });
        let a11 = Arena
            .create({
                arena_name: "Legendary Arena",
                trophy_low: 3800,
                trophy_high: 3999
            });
        let a12 = Arena
            .create({
                arena_name: "Challenger I",
                trophy_low: 4000,
                trophy_high: 4299
            });
        let a13 = Arena
            .create({
                arena_name: "Challenger II",
                trophy_low: 4300,
                trophy_high: 4599
            });
        let a14 = Arena
            .create({
                arena_name: "Challenger III",
                trophy_low: 4600,
                trophy_high: 4899
            });
        let a15 = Arena
            .create({
                arena_name: "Master I",
                trophy_low: 4900,
                trophy_high: 5199
            });
        let a16 = Arena
            .create({
                arena_name: "Master II",
                trophy_low: 5200,
                trophy_high: 5499
            });
        let a17 = Arena
            .create({
                arena_name: "Master III",
                trophy_low: 5500,
                trophy_high: 9999
            });

        Promise.all([a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17])
            .then(() => res.status(200).send("OK"));
    },

    async viewArenas(req, res) {
        let arenas = await Arena.findAll();
        let data = [];

        for(const arena of arenas) {
            let commons = [];
            let rares = [];
            let epics = [];
            let legendaries = [];
            
            for(const player of await arena.getPlayers()) {
                commons.push(player.commons_median);
                rares.push(player.rares_median);
                epics.push(player.epics_median);
                legendaries.push(player.legendaries_median);
            }
            
            data.push({
                arena_name: arena.arena_name,
                levels: {
                    commons: median(commons),
                    rares: median(rares),
                    epics: median(epics),
                    legendaries: median(legendaries)
                }
            });
        }
        
        return {data: data};
    }
};
