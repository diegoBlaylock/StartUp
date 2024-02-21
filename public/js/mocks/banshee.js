/**
 * The mythical name of a female spirit that forewarns the death of a loved
 * one through wails and shrieks will here be used to denote a machine of evil design meant to 
 * ping a chat wall with annoying things.
 */

async function fetch_quotes() {
    const response = await fetch("/js/mocks/wails.txt");
    const text = await response.text();

    return text.split("\n");
}

export class Banshee {
    constructor(callback) {
        this.callback = callback;
        this.#start()

    }

    message() {
        return {
            message_id: crypto.randomUUID(),
            owner: {
                user_id: crypto.randomUUID(),
                username: crypto.randomUUID(),
                profile: "https://picsum.photos/256/256",
                description: "None"
            },
            content: this.quotes[Math.trunc(Math.random()*this.quotes.length)],
            time_stamp: Date.now(),
        }
    }

    rando() {
        return Math.random() * 1000 + 8000
    }

    run() {
        
        this.callback(this.message());
        setTimeout(()=>this.run(), this.rando());
    }

    async #start() {
        this.quotes = await fetch_quotes()
        setTimeout(()=>this.run(), this.rando());
    }
}