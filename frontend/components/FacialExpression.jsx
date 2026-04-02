import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./facialExpression.css";
import axios from "axios";
export default function FaceExpression({ setSongs }) {
  const videoRef = useRef();

  useEffect(() => {
    startVideo();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  };

  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

    detectmood();
  };

  async function detectmood() {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    if (!detections || detections.length === 0) {
      console.log("No face detected");
      return;
    }
    /*if (detections.length > 0) {
        const expressions = detections[0].expressions;
        console.log(expressions);
      }*/
    let mostProbableExpression = 0;
    let _expression = "";

    for (const expression of Object.keys(detections[0].expressions)) {
      if (detections[0].expressions[expression] > mostProbableExpression) {
        mostProbableExpression = detections[0].expressions[expression];
        _expression = expression;
      }
    }

    //console.log(_expression);
    // get http://localhost:3000/songs?mood=happy
    axios
      .get(`http://localhost:3000/songs?mood=${_expression}`)
      .then((response) => {
        console.log(response.data);
        setSongs(response.data.songs);
      })
      .catch((error) => {
        console.log("Axios error: ", error);
      });
  }

  return (
    <div className="mood-element">
      <video ref={videoRef} autoPlay muted className="user-video-feed" />
      <button onClick={detectmood}>Detect Mood</button>
    </div>
  );
}
