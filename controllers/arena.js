const Arena = require('../models/index')['arena'];
const median = require('./helpers');

module.exports = {
    createArenas(req, res) {
        // the awkward part
        var a1 = Arena
            .create({
                arena_name: "Goblin Stadium",
                trophy_low: 0,
                trophy_high: 399
            });
        var a2 = Arena
            .create({
                arena_name: "Barbarian Bowl",
                trophy_low: 800,
                trophy_high: 1099
            });
        var a3 = Arena
            .create({
                arena_name: "P.E.K.K.As Playhouse",
                trophy_low: 1100,
                trophy_high: 1399
            });
        var a4 = Arena
            .create({
                arena_name: "Spell Valley",
                trophy_low: 1400,
                trophy_high: 1699
            });
        var a5 = Arena
            .create({
                arena_name: "Builders Workshop",
                trophy_low: 1700,
                trophy_high: 1999
            });
        var a6 = Arena
            .create({
                arena_name: "Royal Arena",
                trophy_low: 2000,
                trophy_high: 2299
            });
        var a7 = Arena
            .create({
                arena_name: "Frozen Peak",
                trophy_low: 2300,
                trophy_high: 2599
            });
        var a8 = Arena
            .create({
                arena_name: "Jungle Arena",
                trophy_low: 2600,
                trophy_high: 2999
            });
        var a9 = Arena
            .create({
                arena_name: "Hog Mountain",
                trophy_low: 3000,
                trophy_high: 3399
            });
        var a10 = Arena
            .create({
                arena_name: "Electro Valley",
                trophy_low: 3400,
                trophy_high: 3799
            });
        var a11 = Arena
            .create({
                arena_name: "Legendary Arena",
                trophy_low: 3800,
                trophy_high: 3999
            });
        var a12 = Arena
            .create({
                arena_name: "Challenger I",
                trophy_low: 4000,
                trophy_high: 4299
            });
        var a13 = Arena
            .create({
                arena_name: "Challenger II",
                trophy_low: 4300,
                trophy_high: 4599
            });
        var a14 = Arena
            .create({
                arena_name: "Challenger III",
                trophy_low: 4600,
                trophy_high: 4899
            });
        var a15 = Arena
            .create({
                arena_name: "Master I",
                trophy_low: 4900,
                trophy_high: 5199
            });
        var a16 = Arena
            .create({
                arena_name: "Master II",
                trophy_low: 5200,
                trophy_high: 5499
            });
        var a17 = Arena
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