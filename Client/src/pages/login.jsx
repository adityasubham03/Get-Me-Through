import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Link } from "react-router-dom";

const LoginForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	// const [cpassword, setcPassword] = useState("");
	const [image, setImage] = useState(null);
	const [captured, setCaptured] = useState(false); // Track whether an image is captured
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [usernameErrors, setUsernameErrors] = useState(false);
	const streamRef = useRef(null);
	const [isLive, setIsLive] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
  	const timeoutRef = useRef(null);

	useEffect(() => {
		loadModels();
	}, []);
	  

	// Load face-api.js models and start the video stream
	const loadModels = async () => {
		await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
		await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
		await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
		await faceapi.nets.faceExpressionNet.loadFromUri("/models");

		startVideo();
		faceMyDetect();
	};

	const calculateEyeAspectRatio = (eye) => {
		// Implement your eye aspect ratio calculation here
		// Return the calculated eye aspect ratio
		const verticalDist1 = Math.sqrt(
			Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2)
		);
		const verticalDist2 = Math.sqrt(
			Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2)
		);
		const horizontalDist = Math.sqrt(
			Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2)
		);

		const eyeAspectRatio =
			(verticalDist1 + verticalDist2) / (2 * horizontalDist);

		return eyeAspectRatio;
	};

	const performLivenessDetection = async () => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		const detections = await faceapi
			.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceExpressions();

		//   console.log(detections);

		if (detections.length === 0) {
			setIsLive(false); // No face detected, consider it not live
			return;
		}

		if (detections.length > 1) {
			alert("Multiple faces detected!!");
			setIsLive(false);
			return
		}

		// Check for eye blinks
		const landmarks = detections[0].landmarks;

		const motionDetected = analyzeMotion(landmarks);
		const eyeDetected = eyeDetection(landmarks);

		// Analyze facial expressions
		const dynamicExpressionsDetected = analyzeFacialExpressions(detections);

		// Determine liveness based on motion, expressions, and texture
		// console.log(motionDetected, dynamicExpressionsDetected, eyeDetected);
		if (motionDetected || (eyeDetected && dynamicExpressionsDetected)) {
			setIsLive(true); // Liveness detection successful
		} else {
			setIsLive(false); // Not live
		}
	};

	// Initialize the previous landmarks data to null
	let prevLandmarks = null;

	function eyeDetection(landmarks) {
		if (landmarks) {
			const leftEye = landmarks.getLeftEye();
			const rightEye = landmarks.getRightEye();

			const leftEyeAspectRatio = calculateEyeAspectRatio(leftEye);
			const rightEyeAspectRatio = calculateEyeAspectRatio(rightEye);

			const eyeAspectRatioThreshold = 0.2; // Adjust this threshold as needed
			// console.log(leftEyeAspectRatio, rightEyeAspectRatio);

			if (
				leftEyeAspectRatio < eyeAspectRatioThreshold &&
				rightEyeAspectRatio < eyeAspectRatioThreshold
			) {
				return false;
			}
			return true;
		}
		return false;
	}

	// Define a function to analyze motion
	function analyzeMotion(currentLandmarks) {
		// Check if there are previous landmarks to compare with
		if (prevLandmarks) {
			// Calculate the motion by comparing current and previous landmarks
			const motionDetected = isMotionDetected(prevLandmarks, currentLandmarks);

			// Update the previous landmarks with the current ones for the next frame
			prevLandmarks = currentLandmarks;

			// Return true if motion is detected, false otherwise
			return motionDetected;
		}

		// If there are no previous landmarks, set the current landmarks as the previous ones
		prevLandmarks = currentLandmarks;

		// Return false as there's no previous frame to compare with
		return false;
	}

	// Function to check if motion is detected
	function isMotionDetected(prevLandmarks, currentLandmarks) {
		// Calculate the motion by comparing current and previous landmarks
		const motion = currentLandmarks._positions.map((currentPos, index) => {
			const prevPos = prevLandmarks._positions[index];
			const deltaX = currentPos._x - prevPos._x;
			const deltaY = currentPos._y - prevPos._y;
			return { x: deltaX, y: deltaY };
		});

		// Define a threshold for motion detection
		const motionThreshold = 1.0; // Adjust this threshold as needed

		// Check if any of the motion values exceed the threshold
		const isMotionDetected = motion.some((movement) => {
			return (
				Math.abs(movement.x) > motionThreshold ||
				Math.abs(movement.y) > motionThreshold
			);
		});

		// Return true if motion is detected, false otherwise
		return isMotionDetected;
	}

	// Define a function to check for dynamic facial expressions
	function analyzeFacialExpressions(detections) {
		if (detections.length === 0) {
			// No face detected, return false
			// console.log(here);
			return false;
		}

		// Get the first detected face
		const face = detections[0];
		// console.log(face);

		// Check for specific facial expressions
		const expressions = face.expressions;

		// You can adjust the threshold values as needed
		const expressionThreshold = 0.5;

		// Check for a smiling or angry expression
		const isNeutral = expressions["neutral"] > expressionThreshold;
		const isHappy = expressions["happy"] > expressionThreshold;
		const isSad = expressions["sad"] > expressionThreshold;
		const isAngry = expressions["Angry"] > expressionThreshold;
		const isFearful = expressions["fearful"] > expressionThreshold;
		const isdisgusted = expressions["disgusted"] > expressionThreshold;
		const issurprised = expressions["surprised"] > expressionThreshold;

		// Return true if either a smiling or angry expression is detected
		return (
			isNeutral ||
			isHappy ||
			isSad ||
			isAngry ||
			isFearful ||
			isdisgusted ||
			issurprised
		);
	}

	const faceMyDetect = () => {
		setInterval(async () => {
			if (!captured && videoRef.current) {
				performLivenessDetection();

				const detections = await faceapi
					.detectAllFaces(
						videoRef.current,
						new faceapi.TinyFaceDetectorOptions()
					)
					.withFaceLandmarks()
					.withFaceExpressions();

				const canvas = canvasRef.current;

				if (canvas) {
					canvas.innerHTML = ""; // Clear the canvas

					faceapi.matchDimensions(canvas, {
						width: 300,
						height: 300,
					});

					const resizedDetections = faceapi.resizeResults(detections, {
						width: 300,
						height: 300,
					});

					// Draw face detection boxes
					faceapi.draw.drawDetections(canvas, resizedDetections);

					// Draw landmarks on top of the detected faces
					resizedDetections.forEach((detection) => {
						const landmarks = detection.landmarks;
						faceapi.draw.drawFaceLandmarks(canvas, landmarks);
					});

					// Draw facial expressions on top of the detected faces
					faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
				}
			}
		}, 1000);
	};

	// Start the video stream and handle errors
	const startVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				const video = videoRef.current;
				if (video) {
					video.srcObject = stream;
				}
				streamRef.current = stream; // Store the stream reference
			})
			.catch((error) => {
				console.error("Error accessing webcam:", error);
			});
	};

	const handleCapture = async () => {
		const video = videoRef.current;

		if (video) {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");

			// Set canvas dimensions to match video stream
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			// Draw video frame onto the canvas
			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			// Convert canvas image to data URL
			const dataURL = canvas.toDataURL("image/jpeg");

			// Create an HTMLImageElement from the data URL
			const capturedImage = new Image();

			// Set an onload callback to ensure the image is fully loaded
			capturedImage.onload = async () => {
				// Set the captured image as the selected image
				setImage(dataURL);

				// Update the captured state
				setCaptured(true);

				// Stop the video stream
				const stream = streamRef.current;
				if (stream) {
					const tracks = stream.getTracks();
					tracks.forEach((track) => track.stop());
				}

				// Perform liveness detection on the captured image
				await performLivenessDetection(capturedImage);

				if (isLive) {
					// Proceed with user registration
					// You can add your registration logic here
				} else {
					handleRecapture();
					alert("Liveness detection failed. Please try again.");
				}
			};

			// Set the src attribute after setting the onload callback
			capturedImage.src = dataURL;
		}
	};

	const handleRecapture = () => {
		setImage(null); // Clear the captured image
		setCaptured(false); // Reset the captured state
		startVideo();
	};

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
		clearTimeout(timeoutRef.current);

		timeoutRef.current = setTimeout(() => {
			setUsernameErrors( Math.random() < 0.5);
		  setIsTyping(false);
		}, 1000); 
	};
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};
	// const handlecPasswordChange = (e) => {
	// 	setcPassword(e.target.value);
	// };

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("clicked");
		// Handle form submission
		// You can add your registration logic here
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Facial Recognition Registration
				</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label htmlFor="username" className="block mb-2">
							Username:
						</label>
						<input
							type="text"
							id="username"
							value={username}
							onChange={handleUsernameChange}
							className="border border-gray-300 rounded px-2 py-1"
							required
						/>

						{usernameErrors ? (
							<div>
								<div className="p-1 mb-4 text-sm text-red-800 " role="alert">
									<span className="font-medium">Username Taken!!</span> Choose a
									new username!!
								</div>
							</div>
						) : (
							<div></div>
						)}
					</div>

					<div className="mb-4">
						<label htmlFor="password" className="block mb-2">
							Password:
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={handlePasswordChange}
							className="border border-gray-300 rounded px-2 py-1"
							required
						/>
					</div>

					{/* <div className="mb-4">
						<label htmlFor="cpassword" className="block mb-2">
							Confirm Password:
						</label>
						<input
							type="password"
							id="cpassword"
							value={cpassword}
							onChange={handlecPasswordChange}
							className="border border-gray-300 rounded px-2 py-1"
							required
						/>

{cpassword!="" && password!=cpassword ? (
							<div>
								<div className="p-1 mb-4 text-sm text-red-800 " role="alert">
									<span className="font-medium">Password Doesn't Match</span>
								</div>
							</div>
						) : (
							<div></div>
						)}
					</div> */}


					{!captured ? (
						<div className="mb-4 relative">
							<div className="relative">
								<video
									ref={videoRef}
									autoPlay
									muted
									className="w-full max-w-full max-h-full "
								/>
							</div>
							<canvas ref={canvasRef} className="absolute top-0 left-0 " />
							<div
								className="mt-1 py-1 leading-normal text-center text-white bg-black rounded-lg"
								role="alert">
								<p>
									Liveness:{" "}
									{isLive ? "Live" : "Not Live - Unable to Detect Face"}
								</p>
							</div>
							<button
								type="button"
								onClick={handleCapture}
								className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
								Capture Image
							</button>
						</div>
					) : (
						<div className="mb-4">
							<div>
								{image && (
									<img src={image} alt="Captured" className="max-w-full" />
								)}
							</div>
							<div className="mt-2">
								<button
									type="button"
									onClick={handleRecapture}
									className="bg-red-500 text-white px-4 py-2 rounded">
									Recapture
								</button>
							</div>
						</div>
					)}
					{ captured && !usernameErrors ? (<button
						type="submit"
						className="bg-green-500 text-white px-4 py-2 rounded">
						Register
					</button>) : (<button
						type="submit"
						className="bg-green-500 text-white px-4 py-2 rounded" disabled>
						Register
					</button>)  }
					
                </form>
                <p className="mt-3 text-center text-red">Don't have an account yet? <Link to="/register">Register Here</Link></p>
			</div>
		</div>
	);
};

export default LoginForm;
