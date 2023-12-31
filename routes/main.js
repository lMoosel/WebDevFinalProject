import { Router } from 'express';

import { usersData, gamesData, groupsData } from "../data/index.js";
import * as helpers from '../helpers.js';

const router = Router();

router
    .route("/")
    .get(async (req, res) => {
        return res.render("index", {title: "Home"});
    });

router  
    .route("/login")
    .get(async (req, res) => {
        return res.render("login", {title: "Login"});
    })
    .post(async (req, res) => {
        try {

            let emailAddress = req.body["login-emailAddress"];
            let password = req.body["login-password"];

            helpers.isValidEmail(emailAddress.toLowerCase());
            helpers.validatePassword(password);
            
            let userInfo = await usersData.loginUser(emailAddress, password);
            req.session.user = userInfo;

            return res.redirect("/");

        } catch (e) {
            return res.status(400).render('error', {title: "Error", error: e});
        }
    });

router  
    .route("/register")
    .get(async (req, res) => {
        return res.render("register", {title: "Register"});
    })
    .post(async (req, res) => {
        try {

            let emailAddress = req.body.emailAddress;
            let password = req.body.password;
            let username = req.body.username;

            helpers.isValidEmail(emailAddress.toLowerCase());
            helpers.validatePassword(password);
            helpers.stringHelper(username, "Username", 3, 10);

            let createUserRes = await usersData.createUser(username, emailAddress, password);

            return res.redirect("/login");

        } catch (e) {
            return res.status(400).render('error', {title: "Error", error: e});
        }
    });

router  
    .route("/logout")
    .get(async (req, res) => {
        try {
            req.session.user = null;
            // Overwrites currentUser bc middleware sets it to user and we don't want that
            return res.render("logout", {title: "Logged out", currentUser: null});
        } catch (e) {
            return res.status(400).render('error', {title: "Error", error: e});
        }
    });

router
    .route("/create-group")
    .get(async (req, res) => {
        try {
            let allGroupObjs = await groupsData.getAll();
            return res.render('createGroup', {title:"Create group", groups: allGroupObjs});
        } catch (e) {
            return res.status(400).render('error', {title: "Error", error: e});
        }
    })

router
    .route("/create-game")
    .get(async (req, res) => {
        try {
            let allGamesData = await gamesData.getAll();
            let allGroupsData = await groupsData.getAll();
            if(!req.session.user){
                allGroupsData = {};
            }else{
                let userId = req.session.user._id;
                allGroupsData = await groupsData.getAllGroupsbyUserID(userId);
            }
            return res.render('createGame', {title:"Create game", groups: allGroupsData, states: helpers.states});
        } catch (e) {
            return res.status(400).render('error', {title: "Error", error: e});
        }
    })

export default router;