'use strict';

var passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var path = require('path'),
    db = require(path.resolve('./config/lib/sequelize')).models,
    policy = require('../policies/mago.server.policy'),
    vods = require(path.resolve('./modules/mago/server/controllers/vod.server.controller'));


module.exports = function(app) {

    /* ===== vods ===== */
    app.route('/api/vods')
        .get(vods.list);

    app.route('/api/vods')
        .all(policy.isAllowed)
        .post(vods.create);

    app.route('/api/vods/:vodId')
        .all(policy.isAllowed)
        .get(vods.read)
        .put(vods.update)
        .delete(vods.delete);

    app.param('vodId', vods.dataByID);

    /* ===== VodEpisode ===== */
    app.route('/api/VodEpisode')
        .get(vods.list);

    app.route('/api/VodEpisode')
        .all(policy.isAllowed)
        .post(vods.create);

    app.route('/api/VodEpisode/:VodEpisodeId')
        .all(policy.isAllowed)
        .get(vods.read)
        .put(vods.update)
        .delete(vods.delete);

    app.param('VodEpisodeId', vods.dataByID);


    app.route('/api/update_film')
        .all(policy.isAllowed)
        .put(vods.update_film);


};