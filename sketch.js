"use strict"

let ROCK = 'r', PAPER = 'p', SCISSORS = 's'
let STATUS

let logo_portrait, logo_landscape
let rock_text, paper_text, scissors_text
let rock, paper, scissors
let rocki, paperi, scissorsi
let hands

function preload() {
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

    setup_logo()
}

function draw() {
    background('#FCD319')
    show_logo()
    show_hands()
    show_buttons()
}

function windowResized() {
    createCanvas(innerWidth, innerHeight)
    setup_logo()
}

function setup_logo() {
    if (width > height)  {
        if (Math.abs(height*0.1 - logo_landscape.height) > 1)
            logo_landscape.resize(0, height*0.1)
        if (logo_landscape.width > width)
            logo_landscape.resize(width, 0)
    } else {
        if (Math.abs(height*0.1 - logo_landscape.height) > 1)
            logo_portrait.resize(0, height*0.1)
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

function show_hands() {
    let people = hands.length;

    let people_right = Math.floor(people/2)
    let people_left = people - people_right
    
    let top = height * 0.1
    let container_height = height * 0.8

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
        left_y.push(top + (i+0.5)/people_left * container_height)
    }

    for (let i = 0; i < people_right; i++) {
        let offset = people_left - people_right + 1
        right_y.push(top + (i + 0.5*offset)/people_left * container_height)
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
    let top = height * 0.9
    
    let button_logos = [ROCK, PAPER, SCISSORS]
    for (let x = 0; x < 3; x++) {
        let button_x = x * width / 3
        
        stroke(0)
        strokeWeight(3)
        fill(255, 0, 0)
        rectMode(CENTER)
        let button_width = min(width * 0.3, height*0.3)
        rect(button_x + width/6, top + height*0.05, button_width, height*0.085)
        
        imageMode(CENTER)
        let button_img = get_left_img(button_logos[x])
        image(button_img, button_x + width/6, top + height*0.05, height/10, height/10 * 2/3)
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