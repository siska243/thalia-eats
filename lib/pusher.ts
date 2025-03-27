import Pusher from 'pusher-js';

const pusherClient = new Pusher("65c66ca307ccb316791b", {
    cluster: "eu"
});

export default pusherClient;