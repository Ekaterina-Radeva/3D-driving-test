//import * as THREE from "./node_modules/three/build/three.module.js";
import * as THREE from "./libs/three.module.js";
import * as YUKA from "./libs/yuka.module.js";
import gsap from "./libs/gsap.min.js";
import {GLTFLoader} from './libs/GLTFLoader.js';
import {DRACOLoader} from './libs/DRACOLoader.js';
import * as SkeletonUtils from './libs/SkeletonUtils.js';
import {  
    WHITEVEHICLEPATH, 
    GREENVEHICLESPATHS,
    YELLOWVEHICLESPATHS,
    REDVEHICLESPATHS,
    BLUEVEHICLESPATHS,
    ANSWERSTEXT,
    WHEELS,
    BLINKINGLIGHTS,
    EXPLANATIONS
} from './constants.js';
  

//cars lists for following the car number
const whiteCar=[];
const yellowCars = [];
const redCars = [];
const blueCars = [];
const greenCars = [];

const arrows = [];//car direction arrows

let carToAnimate = 0;//car number to animate

let scoreVal = 0;//score counter

let mixer;//animation mixer

let clicked = false;//next button clicked

let questionNum = 1;//number of questions

//turn signals mesh
const blinkGeo = new THREE.SphereGeometry(0.1);
const blinkMat = new THREE.MeshBasicMaterial({color: 0xFF8300});
const blinkMesh = new THREE.Mesh(blinkGeo, blinkMat);

//entity manager for managing the entities in the scene
const entityManager = new YUKA.EntityManager();

//progress bar elements
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');

//loading manager for loading assets 
const loadingManager = new THREE.LoadingManager();

//start button
const startButton = document.querySelector('.header button');

//title element
const title = document.querySelector('.header h1');


//view image question 1
const image1Question = document.querySelector('.image img');
console.log(image1Question);
gsap.to(image1Question, {
    visibility: 'hidden', // Hide the image
    opacity: 0, // Fade out the image
    duration: 0.5 // Duration of the fade-out effect
});


//explanation and next button element
const explanation = document.querySelector('.explanation');
const nextQuestionBtn = document.querySelector('.explanation button');
const question = document.querySelector('.questions p');
const explanationText = document.querySelector('.explanation p');


//options elements
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const option3 = document.getElementById('option3');
const option4 = document.getElementById('option4');

//symbols elements
const option1Symbol = document.getElementById('a1-symbol');
const option2Symbol = document.getElementById('a2-symbol');
const option3Symbol = document.getElementById('a3-symbol');
const option4Symbol = document.getElementById('a4-symbol');

//text elements
const option1Text = document.getElementById('a1-text');
const option2Text = document.getElementById('a2-text');
const option3Text = document.getElementById('a3-text');
const option4Text = document.getElementById('a4-text');

//sound element
const sound = document.getElementById("sound");
const soundBtn = document.getElementById("soundBtn");
 
// Toggle play/pause music when the button is clicked
soundBtn.addEventListener("click", () => {
    if (sound.paused) {
        sound.play();
    } else {
        sound.pause();
    }
});


//score element
const score = document.querySelector('.score span');


//scene renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x6fd4fa);


//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

//camera beggining position setup
camera.position.set(40, 10, 2 );
camera.lookAt(-2,0,-15);


//adding lights to the scene
const ambientLight = new THREE.AmbientLight(0xE1E1E1, 0.3);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0x94D8FB, 0x9CFF2E, 0.3);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7);
scene.add(directionalLight);


//scene color management
renderer.outputEncoding = THREE.sRGBEncoding;



//screen loading
loadingManager.onProgress = function(url, loaded, total) {
    progressBar.value = (loaded/total) * 100;
}

loadingManager.onLoad = function() {
    progressBarContainer.style.display = 'none';
}


//loading models(.glb and .gltf)
const loader=new GLTFLoader(loadingManager);

//lowering the models' size
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
dracoLoader.setDecoderConfig({type:'js'});
loader.setDRACOLoader(dracoLoader);


//loading terrain
loader.load('./assets/terrain (3) (2).glb', function(glb) {
    const model = glb.scene;
    scene.add(model);
    model.position.set(0,0,0);
});

//loading policeman(регулировчик)
loader.load('./assets/regulirovchik.glb', function(glb) {
    const model = glb.scene;
    scene.add(model);
    model.scale.set(0.03,0.03,0.03);
    model.position.set(98,0.5,170.3);
});


// Synchronizes the renderer component's matrix with the entity's world matrix
function sync(entity, rendererComponent){
    rendererComponent.matrix.copy(entity.worldMatrix);
}


//creating copy for the turn signals for each car
function createBlinkingLight(group, positions) {
    const bClone1 = blinkMesh.clone();
    bClone1.position.copy(positions.front);
    group.add(bClone1);

    const bClone2 = blinkMesh.clone();
    bClone2.position.copy(positions.back);
    group.add(bClone2);
}


//loading cars and path behaviors
function createCarV(model, path, entityManager, yRotation, blinkingLight){
     // Create a new group to hold the car model
     const group = new THREE.Group();
     scene.add(group);
     group.matrixAutoUpdate = false; // Disable automatic matrix updates to manually control transformations
 
     // Clone the provided model to create a new car instance
     const car = new SkeletonUtils.clone(model);
     group.add(car); // Add the car model to the group
 
     // Create a new YUKA vehicle instance
     const vehicle = new YUKA.Vehicle();
     vehicle.setRenderComponent(group, sync); // Synchronize render component with vehicle transformations
 
     // Add the vehicle to the entity manager for simulation
     entityManager.add(vehicle);
 
     // Define behaviors for the vehicle to follow a path
     const followPathBehaviour = new YUKA.FollowPathBehavior(path, 2); // Follow path with speed factor of 2
     const onPathBehaviour = new YUKA.OnPathBehavior(path);
     onPathBehaviour.radius = 0.1; // Set tolerance for how strictly the vehicle follows the path
 
     // Set initial vehicle position to the start of the path
     vehicle.position.copy(path.current());
     vehicle.maxSpeed = 5; // Set the vehicle's maximum speed
 
     // Add path-following behaviors to the vehicle's steering system
     vehicle.steering.add(onPathBehaviour);
     vehicle.steering.add(followPathBehaviour);
 
     followPathBehaviour.active = false; // Initially disable path following
 
     // Apply initial rotation to the vehicle
     vehicle.rotation.fromEuler(0, yRotation, 0);
 
     // If the vehicle has blinking lights, create them
     if (blinkingLight)
         createBlinkingLight(group, blinkingLight);
 
     // Return an object containing the vehicle and its 3D model group
     const allVehicle = { vehicle: vehicle, modelGroup: car };
     return allVehicle;

}


//loading white car(question 1)
loader.load('./assets/white.glb', function(glb) {
    const model = glb.scene;
    model.scale.set(130,130,130);
    const v1 = createCarV(model, WHITEVEHICLEPATH[0], entityManager, -Math.PI/2);
    whiteCar.push(v1);
});


//loading green cars(question 2 and 5)
loader.load('./assets/green.glb', function(glb) {
    const model = glb.scene;
    const v2 = createCarV(model, GREENVEHICLESPATHS[0], entityManager, Math.PI/2,BLINKINGLIGHTS.green.left);
    const v5 = createCarV(model, GREENVEHICLESPATHS[1], entityManager, 0);
    greenCars.push(v2, v5);
});


//loading yellow cars(question 2,5 and 7)
loader.load('./assets/SUV.glb', function(glb) {
    const model = glb.scene;
    console.log('Green model loaded:', glb);
    //const v1 = createCarV(model, YELLOWVEHICLESPATHS[0], entityManager, -Math.PI/2);
    const v2 = createCarV(model, YELLOWVEHICLESPATHS[0], entityManager, Math.PI, BLINKINGLIGHTS.yellow.right);
    const v5 = createCarV(model, YELLOWVEHICLESPATHS[1], entityManager, Math.PI / 2);
    const v7= createCarV(model, YELLOWVEHICLESPATHS[2], entityManager, 0);
    yellowCars.push(v2, v5,v7);
});


//loading red cars(question 2, 5 and 6)
loader.load('./assets/red.glb', function(glb) {
    const model = glb.scene;
    //const v1 = createCarV(model, REDVEHICLESPATHS[0], entityManager, 0, BLINKINGLIGHTS.red.left);
    const v2 = createCarV(model, REDVEHICLESPATHS[0], entityManager, 0, BLINKINGLIGHTS.red.left);
    const v5 = createCarV(model, REDVEHICLESPATHS[1], entityManager, -Math.PI / 2);
    const v6 = createCarV(model, REDVEHICLESPATHS[2], entityManager, 0,BLINKINGLIGHTS.red.right);
    redCars.push(v2,v5,v6);  // Ensure the model group is actually added to the scene

});


//loading blue cars(question 2 and 5)
loader.load('./assets/blue.glb', function(glb) {
    const model = glb.scene;
    //const v1 = createCarV(model, BLUEVEHICLESPATHS[0], entityManager, Math.PI / 2);
    const v2 = createCarV(model, BLUEVEHICLESPATHS[0], entityManager, -Math.PI/2);
    const v5 = createCarV(model, BLUEVEHICLESPATHS[1], entityManager, Math.PI);
    blueCars.push( v2, v5);
});

//loading arrows
loader.load('./assets/arrow.glb', function(glb) {
    const model = glb.scene;

    function createArrow(position, yRotation = 0) {
        const arrow = SkeletonUtils.clone(model);// Clone the arrow model to create a new instance
        arrow.position.copy(position);
        arrow.rotation.y = yRotation;
        scene.add(arrow);
        arrows.push(arrow);
    }
    // Arrows for green cars
    createArrow(new THREE.Vector3(-158, 2, -5.5), Math.PI);
    createArrow(new THREE.Vector3(98.3, 2, 162), 0);

    //Arrows for yellow cars
    createArrow(new THREE.Vector3(-150, 2, 1),0.5*Math.PI);
    createArrow(new THREE.Vector3(90, 2, 171.8), 0.5 * Math.PI);

    //Arrows for red cars
    createArrow(new THREE.Vector3(-152, 2, -15), 0.5 * Math.PI);
    createArrow(new THREE.Vector3(108, 2, 169), -0.5 * Math.PI);
    
    //Arrows for blue cars
    createArrow(new THREE.Vector3(-143, 2, -8.5), -0.5 * Math.PI);
    createArrow(new THREE.Vector3(101, 2,178), Math.PI);
});


//actions after the start button has been clicked
startButton.addEventListener('mousedown', function() {
    const tl = gsap.timeline();
    tl.to(startButton, {
        autoAlpha: 0,
        y: '-=20',
        duration: 0.5
    })
    .to(title, {
        autoAlpha: 0,
        y: '-=20',
        duration: 1
    }, 0)
    .to(camera.position, {
        z:-14.2,
        x: 2.2,
        y:1.6,  
        duration: 4
    }, 0)
    .to(camera.rotation, {
        x: -0.5,
        y: 1.6,
        duration: 4
    }, 0)
    .to(question, {
        autoAlpha:1,
        duration: 0.2
    },'+=0.7')
    .to(image1Question, {
        visibility: 'visible', 
        opacity: 1, 
        duration: 0.5 
    }, '+=0.7')
    .to(option1, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.4')
    .to(option2, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.4')
    .to(option3, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.4')
    .to(option4, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.4')
});

//load answer simbols(true or false)
function showAnswerSymbol(opt1, opt2, opt3,opt4) {
    option1Symbol.style.backgroundImage = `url('./assets/symbols/${opt1}.png')`;
    option2Symbol.style.backgroundImage = `url('./assets/symbols/${opt2}.png')`;
    option3Symbol.style.backgroundImage = `url('./assets/symbols/${opt3}.png')`;
    option4Symbol.style.backgroundImage = `url('./assets/symbols/${opt4}.png')`;
}

//to get the elements and animations of the next question affter one has been answered
function nextQuestion(last){
    if(last)
        carToAnimate++;
}

//after the user has chosen an answer the cars get animated, the score changes and the simols of the answer appear
function chooseAnswer(option) {
    if(!clicked) {
        switch (carToAnimate) {
            case 0:
                showAnswerSymbol('correct', 'incorrect', 'incorrect','incorrect');//answers simbols
                nextQuestion(true);//the question has been answered

                //score change
                if(option.id === 'option1') {
                    scoreVal++;
                    score.innerText = scoreVal;
                }
                break;
                
            case 1:
                showAnswerSymbol('incorrect', 'incorrect', 'correct','incorrect');//answers simbols

                arrows.forEach(arrow => scene.remove(arrow));//remove arrows before animation starts
                
                //animate cars so that they don't colide
                setTimeout(() => {     
                        WHEELS.yellowCar;
                        yellowCars[0].vehicle.steering.behaviors[1].active = true;
                }, 5000);//after 5 secons
                setTimeout(() => {
                        WHEELS.redCar;
                        redCars[0].vehicle.steering.behaviors[1].active = true;
                }, 6500);// after 6.5 secons
                setTimeout(() => {
                        WHEELS.blueCar;
                        blueCars[0].vehicle.steering.behaviors[1].active = true;
                }, 0);//first(immediately)
                setTimeout(() => {
                        WHEELS.greenCar;
                        greenCars[0].vehicle.steering.behaviors[1].active = true;
                }, 3000);//ater 3 secons

                nextQuestion(true); //next question

                //score
                if(option.id === 'option3') {
                    scoreVal++;
                    score.innerText = scoreVal;
                }
                break;
            case 2:
                showAnswerSymbol('incorrect', 'correct', 'incorrect','incorrect');//answer symbols

                nextQuestion(true); //next question

                //score
                if(option.id === 'option2') {
                    scoreVal++;
                    score.innerText = scoreVal;
                } 
                break;
               
            case 3:
                showAnswerSymbol('correct', 'incorrect', 'incorrect','incorrect');//answer symbols

                arrows.forEach(arrow => scene.add(arrow));//adding arrows so that they appear for the next question

                nextQuestion(true); //next question

                //score
                if(option.id === 'option1') {
                    scoreVal++;
                    score.innerText = scoreVal;
                }
                break; 
                
            case 4:

                showAnswerSymbol('incorrect', 'incorrect', 'incorrect','correct');//answer symbols

                arrows.forEach(arrow => scene.remove(arrow));//remove arrows before the animation

                //animate only yellow car
                setTimeout(() => {
                        WHEELS.yellowCar;
                        yellowCars[1].vehicle.steering.behaviors[1].active = true;     
                }, 0);

                nextQuestion(true); //next question

                //score
                if(option.id === 'option4') {
                    scoreVal++;
                    score.innerText = scoreVal;
                }
                break;
            case 5:
                showAnswerSymbol('incorrect', 'correct', 'incorrect','incorrect');//answer symbols

                nextQuestion(true);  //next question

                //score
                if(option.id === 'option2') {
                    scoreVal++;
                    score.innerText = scoreVal;
                }

                //load pedestrian
                loader.load('./assets/walkingPerson.glb', function(glb) {
                    console.log('PersonWalking model loaded successfully:', glb);
                    const model = glb.scene;
                    scene.add(model);
                    mixer = new THREE.AnimationMixer(model);
                    const clips = glb.animations;
                    const clip=THREE.AnimationClip.findByName(clips, 'walking');
                    const action = mixer.clipAction(clip);
                    action.play();
                    model.position.set(94, 0.5, 251);
                    model.scale.set(0.7,0.7,0.7);
                    model.rotateY(Math.PI/2);

                    gsap.to(model.position, {
                        x: 105,  // Target X position
                        z: 251,  // Target Z position
                        duration: 5,  // Time in seconds
                        ease: "power1.inOut",
                        onComplete: function() {
                               // Rotate smoothly before moving to the second target
                             gsap.to(model.rotation, {
                                 y: Math.PI, // Rotate 180 degrees
                                  duration: 0.2, // Rotate in 1 second
                                 ease: "power1.inOut",
                              onComplete: function() {
                                   gsap.to(model.position, {
                                  x: 105,
                                  z: 180,
                                  duration: 15,
                                 ease: "power1.inOut"
                                   });
                                }
                            });
                        }
                    });

                    //animate red car
                    setTimeout(() => {
                        WHEELS.redCar;
                        redCars[2].vehicle.steering.behaviors[1].active = true;  
                }, 0);
                });
                break;
                
            case 6:

                showAnswerSymbol('incorrect', 'incorrect', 'correct','incorrect');//answer symbol

                nextQuestion(true); //next question
                
                //animate yellow car
                setTimeout(() => {
                    WHEELS.yellowCar;
                    yellowCars[2].vehicle.steering.behaviors[1].active = true;
            }, 0);

                //score
                if(option.id === 'option3') {
                    scoreVal++;
                    score.innerText = scoreVal;
                } 
                break;
                
            default:
                break;
        }
        
        //options and explanation style
        option.style.backgroundColor = 'white';
        option.style.color = 'black';
        explanationText.textContent = EXPLANATIONS[questionNum-1]
        gsap.to(explanation, {
            autoAlpha: 1,
            y: '-=10',
            duration: 0.5
        })
        clicked = true;
    }
}

//event listener for the answer buttons
option1.addEventListener('click', chooseAnswer.bind(null, option1));
option2.addEventListener('click', chooseAnswer.bind(null, option2));
option3.addEventListener('click', chooseAnswer.bind(null, option3));
option4.addEventListener('click', chooseAnswer.bind(null, option4));

//answers style
function changeColors() {
    option1.style.backgroundColor = 'black';
    option1.style.color = 'white';
    option2.style.backgroundColor = 'black';
    option2.style.color = 'white';
    option3.style.backgroundColor = 'black';
    option3.style.color = 'white';
    option4.style.backgroundColor = 'black';
    option4.style.color = 'white';

    option1Symbol.style.backgroundImage = '';
    option2Symbol.style.backgroundImage = '';
    option3Symbol.style.backgroundImage = '';
    option4Symbol.style.backgroundImage = '';
}

//ansers text options
function changeOptionsText(qtion, opt1, opt2, opt3,opt4) {
    question.textContent = qtion;
    option1Text.textContent = opt1;
    option2Text.textContent = opt2;
    option3Text.textContent = opt3;
    option4Text.textContent = opt4;
}

//camera movement function
function moveCamera(x,y,z){
    gsap.to(camera.position,{
        x,
        y,
        z,
        duration:5
    });
}

//camera rotation function
function rotateCamera(x,y,z,duration){
    gsap.to(camera.rotation,{
        x,
        y,
        z,
        duration
    });   
}

//anfter the next button has beenn clicked, the camera moves and rotates acordingly
nextQuestionBtn.addEventListener('click', function() {
    questionNum++;
    clicked = false; 

    //hide the image of the first question
    gsap.to(image1Question, {
        visibility: 'hidden', 
        opacity: 0, 
        duration: 2
    });

    switch (questionNum) {
        
        case 2:
            moveCamera(-120,10,-7);//only one movement
            rotateCamera(-Math.PI/2,Math.PI/2-0.3,Math.PI/2,5);//only one rotation
            break;
        case 3: 
            gsap.to(camera.rotation, {
                keyframes: [   
                    { x: 0, y: 0, z: 0, duration: 6,ease: "power2.out" },// First movement
                    { x: -Math.PI / 2, y: -Math.PI / 2 + 0.3, z: -Math.PI / 2, duration: 4}//Second movement 
                ],
                ease: "power2.inOut" ,// Smooth easing   
            });
            gsap.to(camera.position, {
                keyframes: [
                   { x: -150, y: 10, z: -7, duration: 4  },// First rotation
                   { x: -150, y: 10, z: 95, duration: 6 } //Second rotation
                    
                ],
                ease: "power2.inOut"
            });
            break;
        case 4:
            gsap.to(camera.position, {
                keyframes: [
                    { x: -63, y: 10, z: 94, duration: 6,ease: "power2.out"  },  
                    { x: -52, y: 10, z: 169, duration: 6}
                ],
                ease: "power2.inOut"
            });
            gsap.to(camera.rotation, {
                keyframes: [
                    { x: -Math.PI / 2, y: -Math.PI / 2 + 0.3, z: -Math.PI / 2, duration: 3,ease: "power2.out"},
                    { x: -Math.PI +0.3, y: -0.1, z: -Math.PI , duration: 6 }
                ],
                ease: "power2.inOut" 
            });
            break;
        case 5: 
            moveCamera(73,10,170);
            rotateCamera(-Math.PI/2,-Math.PI/2+0.3,-Math.PI/2,3);
            break;
        case 6:
            moveCamera(100,10,205);
            gsap.to(camera.position, {
                keyframes: [
                    { x: 100, y: 10, z: 170, duration: 5 , ease: "power2.out" },  
                    { x: 100, y: 10, z: 205, duration: 5, ease: "power2.out" }  
                ],
                ease: "power2.inOut"
            });
            gsap.to(camera.rotation, {
                keyframes: [    
                    { x: -Math.PI/2, y: -Math.PI/2+0.3, z: -Math.PI/2, duration: 3, ease: "power2.out" },
                    { x: -Math.PI+0.3, y: 0, z: -Math.PI, duration: 2 } 
                ],
                ease: "power2.inOut" ,
                stagger: 1
            });
            break;
        case 7:
            moveCamera(101,10,371);
            nextQuestionBtn.disabled = true;//after the seventh question dissable the next button
            break;
        default:
            break;
        }

    //elements apearing(only for the first question)
    const tl = gsap.timeline();//activate animatiom of the elements
    tl.to(question, {
        autoAlpha: 0,
        duration: 0.2
    }, 0)
    .to(explanation, {
        autoAlpha: 0,
        y: '+=6',
        duration: 0.5
    }, 0)
    .to(option1, {
        rotateX: 90,
        duration: 0.2
    },0)
    .to(option2, {
        rotateX: 90,
        duration: 0.2
    }, 0)
    .to(option3, {
        rotateX: 90,
        duration: 0.2
    }, 0)
    .to(option4, {
        rotateX: 90,
        duration: 0.2,
        onComplete: function() {
            changeColors();
            changeOptionsText(
                ANSWERSTEXT[questionNum - 1].question,
                ANSWERSTEXT[questionNum - 1].answer1,
                ANSWERSTEXT[questionNum - 1].answer2,
                ANSWERSTEXT[questionNum - 1].answer3,
                ANSWERSTEXT[questionNum - 1].answer4
            );            
        }
    },0)

    //elements apearing(for every question number)
    const tl2 = gsap.timeline({ delay: 5});//activate animation of the elements
    tl2.to(question, {
        autoAlpha: 1,
        duration: 0.2,
    }, '-=0.5')
    .to(option1, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.5')
    .to(option2, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.4')
    .to(option3, {
        rotateX: 0,
        duration: 0.2,
    }, '+=0.4')
    .to(option4, {
        rotateX: 0,
        duration: 0.2,
        onComplete: function() {
        }
    }, '+=0.4')
});

// Create a YUKA time instance to manage time updates for the simulation
const time = new YUKA.Time();

// Create a THREE.js clock to track time for animations
const clock = new THREE.Clock();

// Animation loop function
function animate(t) {
    
    // Update the animation mixer if it exists (used for character or object animations)
    if (mixer) {
        mixer.update(clock.getDelta()); // Updates the animation based on elapsed time
    }

    // Toggle the blinking light effect by changing its color
    if (Math.sin(t / 130) > 0) {
        blinkMesh.material.color.setHex(0xDC2F02); // Red color
    } else {
        blinkMesh.material.color.setHex(0xFF8300); // Orange color
    }

    // Update YUKA time and get the delta time (elapsed time since last frame)
    const delta = time.update().getDelta();

    // Update all entities in the entity manager with the new delta time
    entityManager.update(delta);

    // Render the scene from the camera's perspective
    renderer.render(scene, camera);
}

// Set the animation loop to continuously call the animate function
renderer.setAnimationLoop(animate);

// Adjust camera and renderer size when the window is resized
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight; // Update aspect ratio
    camera.updateProjectionMatrix(); // Update camera projection
    renderer.setSize(window.innerWidth, window.innerHeight); // Adjust renderer size
});