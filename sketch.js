"use strict"

////////////////////////////////////////////////
//   Create an account on PythonAnywhere      //
//   and put your username in this variable   //
//   for eg.                                  //
//   my PythonAnywhere site URL is            //
//   tusharsadhwani.pythonanywhere.com        //
//   so my username is 'tusharsadhwani'       //
//                                            //
let PA_USERNAME = 'tusharsadhwani'            //
////////////////////////////////////////////////


// Placeholder values for use in various functions
let ROCK = 'r', PAPER = 'p', SCISSORS = 's'

// Status is a collection of all the possible states
// the game can be in. It is used to check game status
// and display stuff accordingly
let Status = {
    WELCOME: 'home screen',
    HOSTING: 'host a new game',
    JOINING: 'waiting for players to join game',
    WAITING: 'waiting for moves',
    ANIMATING: 'animating rock paper scissors text',
    DISPLAYING: 'displaying moves',
    GAMEOVER: 'game over'
}

// status will hold a value from the Status object,
// signifying the current state of the game
let status

let logo_portrait, logo_landscape        // hold both logo Image objects
let rock_text, paper_text, scissors_text // hold images for the texts
let rock, paper, scissors                // right handed images
let rocki, paperi, scissorsi             // left handed (inverted) images
let container_top                        // Height of game logo
let container_height                     // Height of game's play area
let btn_width                            // width of a button in-game
let btn_height                           // height of a button in-game
let user_name = ""                       // The name the user enters during joining
let hands                                // TODO: remove this variable

function preload() {
    // Load the image assets before starting the draw loop
    rock = loadImage('./assets/rock.png')
    paper = loadImage('./assets/paper.png')
    scissors = loadImage('./assets/scissors.png')

    rocki = loadImage('./assets/rock-inverted.png')
    paperi = loadImage('./assets/paper-inverted.png')
    scissorsi = loadImage('./assets/scissors-inverted.png')

    logo_portrait = loadImage('./assets/logo-portrait.png')
    logo_landscape = loadImage('./assets/logo-landscape.png')

    rock_text = loadImage('./assets/text1.png')
    paper_text = loadImage('./assets/text2.png')
    scissors_text = loadImage('./assets/text3.png')
}

function setup() {
    createCanvas(innerWidth, innerHeight)

    noStroke()

    // Setup random hands
    let people = 3
    hands = []
    for (let i = 0; i < people; i++) {
        hands.push(randomHand())
    }

    container_top = height * 0.1
    container_height = height * 0.8
    btn_width = min(300, width/2)
    btn_height = btn_width/4
    setup_logo()
    status = Status.WELCOME
}

function draw() {
    background('#FCD319')
    show_logo()
    switch(status) {
        case Status.WELCOME:
            show_welcome_screen()
            break
        case Status.HOSTING:
            break
        case Status.JOINING:
            show_joining_screen()
            break
        case Status.WAITING:
            break
        case Status.ANIMATING:
            break
        case Status.DISPLAYING:
            show_hands()
            show_buttons()
            break
        case Status.GAMEOVER:
            break
    }
}

function keyPressed() {
    if (status == Status.JOINING) {
        if (key == 'Backspace' && user_name.length > 0) {
            user_name = user_name.slice(0, -1)
        }
        else if (key.length == 1 && user_name.length < 15)
            user_name = user_name + key
    }
}

function windowResized() {
    createCanvas(innerWidth, innerHeight)
    setup_logo()
}

function setup_logo() {
    if (width > height)  {
        if (Math.abs(container_top - logo_landscape.height) > 1)
            logo_landscape.resize(0, container_top)
        if (logo_landscape.width > width)
            logo_landscape.resize(width, 0)
    } else {
        if (Math.abs(container_top - logo_landscape.height) > 1)
            logo_portrait.resize(0, container_top)
    }
}

function show_logo() {
    if (width > height) {
        imageMode(CENTER)
        image(logo_landscape, width/2, height*0.05)
    } else {
        imageMode(CENTER)
        image(logo_portrait, width/2, height*0.05)
    }
}

function show_welcome_screen() {
    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    fill('red')
    rect(width/2, container_top + container_height * 0.4, btn_width, btn_height)
    fill(0)
    noStroke()
    textSize(btn_height*0.7)
    textAlign(CENTER, CENTER)
    text("New Game", width/2, container_top + container_height * 0.4)

    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    fill('green')
    rect(width/2, container_top + container_height * 0.6, btn_width, btn_height)
    fill(0)
    noStroke()
    textSize(btn_height*0.7)
    textAlign(CENTER, CENTER)
    text("Join Game", width/2, container_top + container_height * 0.6)
}

function show_joining_screen() {
    fill(0)
    noStroke()
    textSize(height * 0.05)
    textAlign(LEFT, BOTTOM)
    
    let text_box_width = min(width * 0.8, 500)
    let text_box_height = text_box_width * 0.12
    
    textSize(text_box_height * 0.5)
    text("Enter your Name: ", width * 0.1, container_top + height * 0.28)

    rectMode(CORNER)
    noFill()
    stroke(0)
    strokeWeight(4)
    rect(width * 0.1, container_top + container_height * 0.4, text_box_width, text_box_height)

    fill(0)
    noStroke()
    textSize(text_box_height * 0.8)
    textAlign(LEFT, BOTTOM)
    text(user_name, width * 0.11, container_top + container_height * 0.395, text_box_width, text_box_height)

    fill('green')
    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    rect(width/2, container_top + container_height * 0.8, text_box_width/3, text_box_height)

    fill(0)
    noStroke()
    textSize(text_box_height * 0.8)
    textAlign(CENTER, CENTER)
    text("Join", width/2, container_top + container_height * 0.8)
}

function show_hands() {
    let people = hands.length

    let people_right = Math.floor(people/2)
    let people_left = people - people_right

    let max_image_height = container_height / people_left

    let image_width, image_height
    if (max_image_height * 1.5 > width / 2) {
        image_width = width / 2
        image_height = image_width * 2 / 3
    } else {
        image_height = max_image_height
        image_width = image_height * 1.5
    }

    image_width *= 0.95
    image_height *= 0.95

    let left_y = []
    let right_y = []

    for (let i = 0; i < people_left; i++) {
        left_y.push(container_top + (i+0.5)/people_left * container_height)
    }

    for (let i = 0; i < people_right; i++) {
        let offset = people_left - people_right + 1
        right_y.push(container_top + (i + 0.5*offset)/people_left * container_height)
    }

    imageMode(CORNER)
    for (let i = 0; i < left_y.length; i++) {
        let y = left_y[i]
        let hand = get_left_img(hands[i])
        image(hand, 0, y - image_height/2, image_width, image_height)
    }

    for (let i = 0; i < right_y.length; i++) {
        let y = right_y[i]
        let hand = get_right_img(hands[people_left+i])
        image(hand, width, y - image_height/2, -image_width, image_height)
    }
}

function show_buttons() {
    let btn_top = height * 0.9
    
    let button_logos = [ROCK, PAPER, SCISSORS]
    for (let x = 0; x < 3; x++) {
        let button_x = x * width / 3
        
        stroke(0)
        strokeWeight(3)
        fill(255, 0, 0)
        rectMode(CENTER)
        let button_width = min(width * 0.3, height*0.3)
        rect(button_x + width/6, btn_top + height*0.05, button_width, height*0.085)
        
        imageMode(CENTER)
        let button_img = get_left_img(button_logos[x])
        image(button_img, button_x + width/6, btn_top + height*0.05, height/10, height/10 * 2/3)
    }
}

function randomHand() {
    let tmp = Math.random()

    if (tmp < 1/3)
        return ROCK
    else if (tmp < 2/3)
        return PAPER
    else
        return SCISSORS
}

function get_left_img(hand) {
    switch(hand) {
        case ROCK:
            return rock
        case PAPER:
            return paper
        case SCISSORS:
            return scissors
    }
}

function get_right_img(hand) {
    switch(hand) {
        case ROCK:
            return rocki
        case PAPER:
            return paperi
        case SCISSORS:
            return scissorsi
    }
}