"use strict"

let COLORS = ['red', 'blue', 'green', 'yellow', 'orange', 'pink', 'purple']
let LANDSCAPE = "landscape"
let PORTRAIT = "portrait"
let ROCK = 'r', PAPER = 'p', SCISSORS = 's'

let orientation
let size
let image_width, image_height
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
}

function setup() {
    setupCanvas()

    noStroke()

    // Setup random hands
    let people = 7
    hands = []
    for (let i = 0; i < people; i++) {
        hands.push(randomHand())
    }
}

function setupCanvas() {
    orientation = innerWidth > innerHeight
                  ? LANDSCAPE
                  : PORTRAIT

    createCanvas(innerWidth, innerHeight)
    size = orientation == LANDSCAPE ? width : height
}

function draw() {
    background('#FCD319')
    show_hands(hands)
}

function windowResized() {
    setupCanvas()
}

function show_hands(hands) {
    // CHANGE THIS
    let people = hands.length;

    let people_right = Math.floor(people/2)
    let people_left = people - people_right

    // let max_image_height = (
        //     orientation == LANDSCAPE
        //     ? height / people_left
        //     : height / people
        // )
        
    let max_image_height = height / people_left
    
    // if (orientation == LANDSCAPE) {
        if (max_image_height * 1.5 > width / 2) {
            image_width = width / 2
            image_height = image_width * 2 / 3
        } else {
            image_height = max_image_height
            image_width = image_height * 1.5
        }
    // } else {
    //     if (max_image_height * 1.5 > width) {
    //         image_width = width
    //         image_height = image_width * 2 / 3
    //     } else {
    //         image_height = max_image_height
    //         image_width = image_height * 1.5
    //     }
    // }

    image_width *= 0.95
    image_height *= 0.95

    let left_y = []
    let right_y = []

    // if (orientation == LANDSCAPE) {
        for (let i = 0; i < people_left; i++) {
            left_y.push((i+0.5)/people_left * height)
        }

        for (let i = 0; i < people_right; i++) {
            let offset = people_left - people_right + 1
            right_y.push((i + 0.5*offset)/people_left * height)
        }
    // } else {
    //     for (let i = 0; i < people; i++) {
    //         i % 2
    //         ? right_y.push((i+0.5)/people * height)
    //         : left_y.push((i+0.5)/people * height)
    //     }
    // }

    for (let i = 0; i < left_y.length; i++) {
        let y = left_y[i]
        // fill(0, 0, 255)
        // rect(0, y - image_height/2, image_width, image_height)
        let hand = get_left_img(hands[i])
        image(hand, 0, y - image_height/2, image_width, image_height)
        // fill(255)
        // ellipse(0, y, 10)
    }
    for (let i = 0; i < right_y.length; i++) {
        let y = right_y[i]
        // fill(0, 0, 255)
        // rect(width - image_width, y - image_height/2, image_width, image_height)
        let hand = get_right_img(hands[people_left+i])
        image(hand, width, y - image_height/2, -image_width, image_height)
        // fill(255)
        // ellipse(width, y, 10)
    }
}

function randomColor() {
    return COLORS[Math.floor(Math.random()*COLORS.length)]
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