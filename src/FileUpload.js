import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import RestoreIcon from "@mui/icons-material/Restore";
import logodfki from "./logodfki.jpg";
import { styled } from "@mui/material/styles";

const ImageUploadContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 20,
  gap: "1rem",
});

const FileUpload = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [endPoint, setEndPoint] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [boundaryData, setBoundaryData] = useState({});

  let canvas = document.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }

  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";

  const ctx = canvas.getContext("2d");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log("selectedFile: ", selectedFile);
    // Check if the selected file is an image
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setUploadedImageUrl(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select an image file.");
    }
  };

  const handleUploadButtonClick = async () => {
    try {
      if (!file) {
        console.log("No image selected.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(`${endPoint}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setBoundaryData(response.data)
          console.log('response: ', response);
          callCreateCanvas(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });

      // Handle the response as needed
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  const img = new Image();
  img.src = uploadedImageUrl;

  function drawBoundingBoxes(boxes, label, confidence) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log('boxes.length: ', boxes.length);
    for (let i = 0; i < boxes.length; i++) {
      
      console.log('i: ', i);
      const [x, y, width, height] = boxes[i];

      // Set the box color and stroke style
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      // Draw the bounding box
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();

      // Display the label and confidence
      const boxLabel = label[i]
      const boxConfidence = confidence[i];
      const text = `${boxLabel} (${boxConfidence}%)`;

      // Set the highlight style
      const highlightColor = 'white';
      const highlightBorderWidth = 2;
      const highlightBorderColor = 'black';


      
      ctx.font = "14px Arial";
      ctx.shadowBlur = 4;
      // Draw the highlight background
      const labelWidth = ctx.measureText(text).width;

      ctx.fillStyle = highlightColor;
      ctx.fillRect(x+2, y+height-16, labelWidth, parseInt(ctx.font, 0));
      ctx.fillStyle = "red";
      ctx.fillText(text, x+2, y+height-5);
    }
  }

  //to clear the page
  const handleClearButtonClick = () => {
    setFile();
    setEndPoint("");
    setUploadedImageUrl();
    setBoundaryData({});
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fileInputRef.current.value='';
  };

  //fetching meta data for canvas
  const callCreateCanvas =(data) => {
    const imageWidth = data["detection results"]["image width"];
    const imageHeight = data["detection results"]["image height"];
    const boxes = data["detection results"]["detected objects"]["boxes"];
    const label = data["detection results"]["detected objects"]["label"];
    const confidence = data["detection results"]["detected objects"]["confidence"];
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    drawBoundingBoxes(boxes, label, confidence);

  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={8}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 100,
            }}
            variant="elevation0"
          >
            <img src={logodfki} alt={"dfki"} loading="lazy" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              height: 150,
              justifyContent: "center",
            }}
            elevation={4}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <ImageUploadContainer>
                  <Button variant="outlined" component="label">
                    Select File
                    <input
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="body1" overflow="auto">
                    {file ? file.name : "No file selected"}
                  </Typography>
                </ImageUploadContainer>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Enter End Point"
                  value={endPoint}
                  onChange={(e) => {
                    setEndPoint(e.target.value);
                  }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                spacing={2}
                p={2}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleUploadButtonClick}
                    endIcon={<UploadIcon />}
                    disabled={!file || !endPoint}
                  >
                    Upload
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleClearButtonClick}
                    endIcon={<RestoreIcon />}
                    disabled={!file}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FileUpload;
