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

let url = `https://${PA_USERNAME}.pythonanywhere.com`
// let url = 'http://localhost:5000'

// Placeholder values for use in various functions
let ROCK = 'r', PAPER = 'p', SCISSORS = 's'

// Status is a collection of all the possible states
// the game can be in. It is used to check game status
// and display stuff accordingly
let Status = {
    WELCOME: 'home screen',
    NEWGAME: 'setup to host a new game',
    GENERATING: 'generating new room',
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
let text_box_width                       // width of an input text box
let text_box_height                      // height of an input text box
let btn_width                            // width of a button in-game
let btn_height                           // height of a button in-game
let btn_text_size                        // textSize for button in-game
let user_id                              // player_id of the user
let user_name = ""                       // The name the user enters during joining
let user_name_selected = false           // Unselected by default
let room_code = ""                       // Code of the room created by the host
let room_code_selected = true            // Selected by default
let fetching_data = false                // Set to true whenever HTTP req. in place
let players = []                         // List of players
let chosen_hand = null                   // The hand chosen by user for next round
let timer_started = false                // Flag to refresh page after displaying hands

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

    container_top = height * 0.1
    container_height = height * 0.8

    setup_logo()
    status = Status.WELCOME
}

function draw() {
    background('#FCD319')

    text_box_width = min(width * 0.8, 500)
    text_box_height = text_box_width * 0.12
    btn_width = min(300, width/2)
    btn_height = btn_width/4
    btn_text_size = btn_height*0.7

    show_logo()
    switch(status) {
        case Status.WELCOME:
            show_welcome_screen()
            break
        case Status.NEWGAME:
            show_newgame_screen()
            break
        case Status.GENERATING:
            show_generating_screen()
            break
        case Status.HOSTING:
            show_hosting_screen()
            break
        case Status.JOINING:
            show_joining_screen()
            break
        case Status.WAITING:
            show_waiting_screen()
            show_buttons()
            break
        case Status.ANIMATING:
            show_buttons()
            break
        case Status.DISPLAYING:
            if (!timer_started) {
                setTimeout(() => {
                    chosen_hand = null
                    status = Status.WAITING
                    timer_started = false
                }, 6000)
                timer_started = true
            }
            show_hands()
            show_buttons()
            break
        case Status.GAMEOVER:
            show_gameover_screen()
            break
    }
}

function mousePressed() {
    switch (status) {
        case Status.WELCOME:
            if (mouseY >= container_top + container_height*0.4 - btn_height/2 &&
                mouseY <= container_top + container_height*0.4 + btn_height/2 &&
                mouseX >= (width - btn_width) / 2 &&
                mouseX <= (width + btn_width) / 2) {
                    status = Status.NEWGAME
                    user_name_selected = true
                    room_code_selected = false
            }
            else if (mouseY >= container_top + container_height*0.6 - btn_height/2 &&
                mouseY <= container_top + container_height*0.6 + btn_height/2 &&
                mouseX >= (width - btn_width) / 2 &&
                mouseX <= (width + btn_width) / 2) {
                    status = Status.JOINING
            }
            break
        case Status.NEWGAME:
            if (mouseY >= container_top + container_height*0.8 - btn_height/2 &&
                mouseY <= container_top + container_height*0.8 + btn_height/2 &&
                mouseX >= (width - btn_width) / 2 &&
                mouseX <= (width + btn_width) / 2) {
                    status = Status.GENERATING
            }
            break
        case Status.HOSTING:
            if (mouseY >= container_top + container_height - btn_height/2 &&
                mouseY <= container_top + container_height + btn_height/2 &&
                mouseX >= (width - btn_width) / 2 &&
                mouseX <= (width + btn_width) / 2) {
                    fetch(`${url}/start?room=${room_code}`)
                        .then(res => res.json())
                        .then(data => {
                            status = Status.WAITING
                        })
            }
            break
        case Status.JOINING:
            if (mouseY >= container_top + container_height*0.8 - btn_height/2 &&
                mouseY <= container_top + container_height*0.8 + btn_height/2 &&
                mouseX >= (width - btn_width) / 2 &&
                mouseX <= (width + btn_width) / 2) {
                    fetch(`${url}/join?room=${room_code}&name=${user_name}`)
                        .then(res => res.json())
                        .then(data => {
                            user_id = data.id
                            status = Status.WAITING
                        })
            } else if (mouseY <= container_top + container_height*0.8 - btn_height/2 &&
                mouseY > container_top + container_height*0.4) {
                    user_name_selected = true
                    room_code_selected = false
            } else if (mouseY <= container_top + container_height*0.4) {
                user_name_selected = false
                room_code_selected = true
            }
            break
        case Status.WAITING:
            async function play_hand(hand) {
                const res = await fetch(`${url}/play?room=${room_code}&id=${user_id}&hand=${hand}`)
                const data = await res.json()
                if (data.success === true) {
                    return true
                }
                return false
            }
            if (mouseY >= container_height) {
                let button_width = min(width * 0.3, height*0.3)
                for (let i = 0; i < 3; i++) {
                    let offset = width/6 + i*(width/3)
                    if (mouseX >= offset - button_width/2 &&
                        mouseX <= offset + button_width/2) {
                            let success
                            switch(i) {
                                case 0:
                                    success = play_hand(ROCK)
                                    if (success) {
                                        chosen_hand = ROCK
                                    }
                                    break
                                case 1:
                                    success = play_hand(PAPER)
                                    if (success) chosen_hand = PAPER
                                    break
                                case 2:
                                    success = play_hand(SCISSORS)
                                    if (success) chosen_hand = SCISSORS
                                    break
                            }
                    }
                }
            }
            break
    }
}

function keyPressed() {
    if (status == Status.JOINING || Status.NEWGAME) {
        if (key == 'Backspace') {
            if (user_name_selected && user_name.length > 0)
                user_name = user_name.slice(0, -1)
            else if (room_code_selected && room_code.length > 0)
                room_code = room_code.slice(0, -1)
        }
        else if (key.length == 1) {
            if (user_name_selected && user_name.length < 12)
                user_name = user_name + key
            else if (room_code_selected && room_code.length < 12)
                room_code = room_code + key
        }
    }
}

function windowResized() {
    createCanvas(innerWidth, innerHeight)
    container_top = height * 0.1
    container_height = height * 0.8
    setup_logo()
}

function setup_logo() {
    if (width > height)  {
        if (Math.abs(container_top - logo_landscape.height) > 1)
            logo_landscape.resize(0, container_top)
        if (logo_landscape.width > width)
            logo_landscape.resize(width, 0)
    } else {
        if (Math.abs(container_top - logo_portrait.height) > 1)
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

function add_text_field(text_field_var, x, field_name) {
    textAlign(LEFT, BOTTOM)
    textSize(text_box_height * 0.5)
    text(field_name, width * 0.1, container_top + container_height * (x-0.005))

    rectMode(CORNER)
    noFill()
    stroke(0)
    strokeWeight(4)

    if (x == 0.2 && room_code_selected ||
        x == 0.5 && user_name_selected) {
            fill(255, 108, 23, 200)
    }
    rect(width * 0.1, container_top + container_height * x, text_box_width, text_box_height)

    fill(0)
    noStroke()
    textSize(text_box_height * 0.8)
    text(text_field_var, width * 0.11, container_top + container_height * (x-0.005), text_box_width, text_box_height)
}

function show_welcome_screen() {
    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    fill('red')
    rect(width/2, container_top + container_height * 0.4, btn_width, btn_height)
    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text("New Game", width/2, container_top + container_height * 0.4)

    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    fill('green')
    rect(width/2, container_top + container_height * 0.6, btn_width, btn_height)
    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text("Join Game", width/2, container_top + container_height * 0.6)
}

function show_newgame_screen() {
    add_text_field(user_name, 0.5, 'Enter your name: ')

    fill('green')
    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    rect(width/2, container_top + container_height * 0.8, btn_width, btn_height)

    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text("Create", width/2, container_top + container_height * 0.8)
}

function show_generating_screen() {
    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text("Generating room...", width/2, container_top + container_height*0.4)

    if (!fetching_data) {
        fetching_data = true
        fetch(`${url}/new?name=${user_name}`)
            .then(res => res.json())
            .then(data => {
                room_code = data.code
                user_id = data.id
                fetching_data = false
                status = Status.HOSTING
            })
    }
}

function show_hosting_screen() {
    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text(`Room Code: ${room_code}`, width/2, container_top + container_height * 0.1)

    if (!fetching_data) {
        fetching_data = true
        fetch(`${url}/players?room=${room_code}`)
            .then(res => res.json())
            .then(data => {
                players = data.players
                fetching_data = false
            })
    }

    let players_text = "Players:"
    for (let player of players) {
        players_text += `\n${player.name}`
    }

    fill(0)
    noStroke()
    textSize(btn_text_size/2)
    textAlign(CENTER, TOP)
    text(players_text, width/2, container_top + container_height*0.15)

    fill('green')
    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    rect(width/2, container_top + container_height, btn_width, btn_height)

    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text("Start Game", width/2, container_top + container_height)
}

function show_joining_screen() {
    
    add_text_field(room_code, 0.2, "Enter Room Code: ")
    add_text_field(user_name, 0.5, "Enter Your Name: ")

    fill('green')
    stroke(0)
    strokeWeight(4)
    rectMode(CENTER)
    rect(width/2, container_top + container_height * 0.8, btn_width, btn_height)

    fill(0)
    noStroke()
    textSize(btn_text_size)
    textAlign(CENTER, CENTER)
    text("Join", width/2, container_top + container_height * 0.8)
}

function show_waiting_screen() {
    if (!fetching_data) {
        fetching_data = true
        fetch(`${url}/players?room=${room_code}`)
            .then(res => res.json())
            .then(data => {
                players = data.players
                fetching_data = false
                if (data.ready === true) {
                    status = Status.DISPLAYING
                }
            })
    }

    let players_text = "Players:"
    for (let player of players) {
        players_text += `\n${player.name}`
    }
    
    fill(0)
    noStroke()
    imageMode(CENTER)
    if (height/width < 1.3) {
        textAlign(LEFT, CENTER)
        textSize(btn_text_size/2)
        text(players_text, width/50, container_top + container_height*0.5)

        let max_image_width = width/2
        let max_image_height = container_height/2
        let image_width
        let image_height

        if (max_image_width <= max_image_height * 1.5) {
            image_width = max_image_width
            image_height = image_width / 1.5
        } else {
            image_height = max_image_height
            image_width = image_height * 1.5
        }

        textSize(btn_text_size)
        textAlign(RIGHT, BOTTOM)
        text('Chosen Hand:', width - width/50, height/2 - image_height*0.6)
        if (chosen_hand !== null) {
            let hand_img = get_left_img(chosen_hand)
            image(hand_img, width - image_width/2, height/2, image_width*0.8, image_height*0.8)
        }
    } else {
        textAlign(CENTER, TOP)
        textSize(btn_text_size/2)
        text(players_text, width/2, container_top + container_height * 0.05)

        let max_image_width = width
        let max_image_height = container_height * 0.4

        let image_width
        let image_height
        if (max_image_width <= max_image_height * 1.5) {
            image_width = max_image_width
            image_height = image_width / 1.5
        } else {
            image_height = max_image_height
            image_width = image_height * 1.5
        }
        textSize(btn_text_size)
        textAlign(CENTER, BOTTOM)
        text('Chosen Hand:', width/2, container_top + container_height - image_height)
        if (chosen_hand !== null) {
            let hand_img = get_left_img(chosen_hand)
            image(
                hand_img,
                width/2, container_top + container_height - image_height/2,
                image_width*0.8, image_height*0.8
            )
        }
    }

}

function show_hands() {
    let people = players.length

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

    let y_offset = image_height * 0.1

    image_width *= 0.8
    image_height *= 0.8

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
    textSize(image_width/8)
    textAlign(CENTER, CENTER)
    fill(0)
    noStroke()
    for (let i = 0; i < left_y.length; i++) {
        let y = left_y[i]
        let hand = get_left_img(players[i].hand)
        image(hand, 0, y - image_height/2 - y_offset, image_width, image_height)
        text(players[i].name, image_width/2, y + image_height/2)
    }

    for (let i = 0; i < right_y.length; i++) {
        let y = right_y[i]
        let hand = get_right_img(players[people_left+i].hand)
        image(hand, width, y - image_height/2 - y_offset, -image_width, image_height)
        text(players[people_left+i].name, width - image_width/2, y + image_height/2)
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

function show_gameover_screen() {
    fill(0)
    textAlign(CENTER, CENTER)
    textSize(width*0.15)
    text("Game Over", width/2, height/2)
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