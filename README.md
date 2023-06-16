# Object Detection GUI
This is a simple GUI based on React, which can act as a Front-End for an Object Detector Service. 

With a given `Endpoint`, the GUI can send `POST` requests to an Object Detection Service and then visualize the results.

This Front-End is compactable with this [Object-Detection-Counter-API](https://github.com/jbantony/Object-Detection-Counter-API) and both can be deployed as container images. 

## Getting started

The app can be run on Docker using the `docker compose` file as `docker compose up -d`

This will build and run the GUI in [http://localhost:3000](http://localhost:3000)

User can then browse an image and enter the Endpoint of the Detection API `http://localhost:5000/detect/` and by clicking the `send` button, the image will be sent to the given Endpoint and the results are feteched based on the response.


### References
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

