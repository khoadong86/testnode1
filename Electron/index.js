const {app} = require('electron')
const {BrowserWindow} = require('electron')
const {remote, dialog, shell, Menu} = require('electron')

const fs = require('fs')
const Module = require('module')
const path = require('path')
const url = require('url')

// Or use `remote` from the renderer process.
// const {BrowserWindow} = require('electron').remote

///*
app.on('ready', function() {
	let win = new BrowserWindow({width: 800, height: 600})
	win.on('closed', () => {
	  win = null
	})
	// Or load a local HTML file
        //win.loadURL('file://' + __dirname +'/default_app/index.html')
	win.loadURL('file://' + __dirname +'/level_creator/index.html')
        ////var app = require('app')
	//var WindowApp = require("browser-window")

})
//*/