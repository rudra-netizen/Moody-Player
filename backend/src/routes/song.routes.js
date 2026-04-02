//import songModel from "../models/song.model";
const songModel = require("../models/song.model");
const express = require("express");
const multer = require("multer"); // form-data se jo bhi data aara usko padhne ke liye chahiye middleware so we use multer.
const uploadFile = require("../storage/storage.service");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }); // temporarily stores data iin primary memory i.e., Ram
/*
title
artist
audioFile
*/
router.post("/songs", upload.single("audio"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const fileData = await uploadFile(req.file);
  const song = await songModel.create({
    title: req.body.title,
    artist: req.body.artist,
    audio: fileData.url,
    mood: req.body.mood,
  });
  console.log(fileData);
  res.status(201).json({
    message: "Song Created Successfully",
    song: song,
  });
});

router.get("/songs", async (req, res) => {
  const { mood } = req.query; /*mood = sad */

  const songs = await songModel.find({
    mood: mood,
  });

  res.status(200).json({
    message: "Songs fetched Successfully",
    songs,
  });

  
});

module.exports = router;
