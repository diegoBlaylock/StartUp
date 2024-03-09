/**
 * The mythical name of a female spirit that forewarns the death of a loved
 * one through wails and shrieks will here be used to denote a machine of evil design meant to 
 * ping a chat wall with annoying things.
 */

const usernames = [
    {
        userID: crypto.randomUUID(),
        username: "John",
        profile: "https://lh3.googleusercontent.com/ci/AE9Axz-pMf9ZlgceQu6eT-CF1J6P1nApbSYLfaC3J1RbvqP6k0Qyz6K5ig_w7-0qh3XhLk57EgacZCU=s1200",
        description: "Hello"
    },
    {
        userID: crypto.randomUUID(),
        username: "Eagle",
        profile: "https://images.saatchiart.com/saatchi/1837436/art/8658316/7721942-HSC00001-7.jpg",
        description: "Hello"
    },
    {
        userID: crypto.randomUUID(),
        username: "Word",
        profile: "https://artmuseum.arizona.edu/wp-content/uploads/2012/12/flack_marilyn.jpg",
        description: "Hello"
    },
    {
        userID: crypto.randomUUID(),
        username: "Chipmunk",
        profile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5_kC3eIp_dplQ78v3UYUZ03T-uX2CvjytJA&usqp=CAU",
        description: "Hello"
    },
    {
        userID: crypto.randomUUID(),
        username: "Marx",
        profile:  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqV8SHTlK5rqrfDCTBy7mrz6xMWNeG_0W6EQ&usqp=CAU",
        description: "Hello"
    },
    {
        userID: crypto.randomUUID(),
        username: "Louis",
        profile: "https://d7hftxdivxxvm.cloudfront.net/?quality=80&resize_to=width&src=https%3A%2F%2Fartsy-media-uploads.s3.amazonaws.com%2FdCp-pZElUT4wZH0iD6VywA%252FPieter_Claesz._-_Vanitas_with_Violin_and_Glass_Ball_-_WGA04974.jpg&width=910",
        description: "Hello"
    },
]

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
            owner: usernames[Math.trunc(Math.random()*usernames.length)],
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