import { Router } from 'express';
import { groupsData, gamesData, usersData } from '../data/index.js';
import * as helpers from '../helpers.js';

const router = Router();

router
    .route('/')
    .get(async (req, res) => {

        let errors = [];
        let users = [];
        let groups = [];
        let games = [];

        try{
            users = await usersData.getAllUsers();
        }
        catch(err){
            errors.push(err);
        }
        try{
            groups = await groupsData.getAll();
        }
        catch(err){
            errors.push(err);
        }
        try{
            games = await gamesData.getAll();
        }
        catch(err){
            errors.push(err);
        }

        res.render('searchForm', {title:"Search", players: users, groups: groups, games: games});
    })
    .post(async (req, res) => {
        const query = req.body['search-form'];
        let errors = [];
        let users = [];
        let groups = [];
        let games = [];

        try {
            users = await usersData.findUsersThatStartWith(query);
        } catch (err) {
            errors.push(err);
        }

        try {
            groups = await groupsData.findGroupsThatStartWith(query);
        } catch (err) {
            errors.push(err);
        }

        try {
            games = await gamesData.findGamesThatStartWith(query);
        } catch (err) {
            errors.push(err);
        }

        res.render('searchResults', { title: "Search Results", users, groups, games, errors });
    });

export default router;
